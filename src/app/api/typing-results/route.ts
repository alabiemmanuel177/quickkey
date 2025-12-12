import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { sendLeaderboardEmail } from '@/lib/email';

// Helper function to check leaderboard position
async function checkLeaderboardPosition(resultId: string): Promise<number | null> {
  try {
    // Get the result that was just created
    const result = await prisma.typingResult.findUnique({
      where: { id: resultId },
    });

    if (!result) return null;

    // Count how many results have higher WPM (with accuracy as tiebreaker)
    const higherResults = await prisma.typingResult.count({
      where: {
        OR: [
          { wpm: { gt: result.wpm } },
          {
            wpm: result.wpm,
            accuracy: { gt: result.accuracy },
          },
        ],
        accuracy: { gte: 70 }, // Only count results with 70%+ accuracy
      },
    });

    // Position is 1 + count of higher results
    return higherResults + 1;
  } catch (error) {
    console.error('Error checking leaderboard position:', error);
    return null;
  }
}

// Schema for validating typing result input
const typingResultSchema = z.object({
  wpm: z.number().positive(),
  accuracy: z.number().min(0).max(100),
  charsTyped: z.number().int().positive(),
  errors: z.number().int().nonnegative(),
  testDuration: z.number().int().positive(),
  testType: z.string().min(1),
  text: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Check authentication status
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate input data
    const body = await req.json();
    const result = typingResultSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.format() },
        { status: 400 }
      );
    }
    
    const data = result.data;
    
    // Create typing result record
    const typingResult = await prisma.typingResult.create({
      data: {
        userId: session.user.id,
        wpm: data.wpm,
        accuracy: data.accuracy,
        charsTyped: data.charsTyped,
        errors: data.errors,
        testDuration: data.testDuration,
        testType: data.testType,
      },
    });
    
    // Check if this result qualifies for leaderboard (top 10)
    const leaderboardPosition = await checkLeaderboardPosition(typingResult.id);

    // If in top 10, send leaderboard achievement email
    if (leaderboardPosition !== null && leaderboardPosition <= 10) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { email: true, name: true },
      });

      if (user?.email) {
        sendLeaderboardEmail(
          user.email,
          user.name || 'Typist',
          leaderboardPosition,
          data.wpm
        ).catch((err) => {
          console.error('Failed to send leaderboard email:', err);
        });
      }
    }

    return NextResponse.json({
      message: 'Typing result saved successfully',
      typingResult,
      leaderboardPosition,
    }, { status: 201 });

  } catch (error) {
    console.error('Error saving typing result:', error);
    return NextResponse.json(
      { error: 'Something went wrong while saving the result' },
      { status: 500 }
    );
  }
}

// Get the user's typing results
export async function GET(req: NextRequest) {
  try {
    // Check authentication status
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Get typing results for the user
    const typingResults = await prisma.typingResult.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });
    
    // Get total count
    const totalCount = await prisma.typingResult.count({
      where: {
        userId: session.user.id,
      },
    });
    
    return NextResponse.json({ 
      typingResults,
      totalCount,
    });
    
  } catch (error) {
    console.error('Error fetching typing results:', error);
    return NextResponse.json(
      { error: 'Something went wrong while fetching the results' },
      { status: 500 }
    );
  }
} 