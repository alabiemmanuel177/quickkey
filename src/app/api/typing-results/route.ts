import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendLeaderboardEmail } from '@/lib/email';

// Helper function to get or create user from Clerk ID
async function getOrCreateUser(clerkId: string) {
  let user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    // Get user details from Clerk
    const clerkUser = await currentUser();

    user = await prisma.user.create({
      data: {
        clerkId,
        email: clerkUser?.primaryEmailAddress?.emailAddress,
        name: clerkUser?.fullName || clerkUser?.firstName,
        image: clerkUser?.imageUrl,
      },
    });
  }

  return user;
}

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
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create user in our database
    const user = await getOrCreateUser(clerkId);

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
        userId: user.id,
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
      if (user.email) {
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
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ typingResults: [], totalCount: 0 });
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get typing results for the user
    const typingResults = await prisma.typingResult.findMany({
      where: {
        userId: user.id,
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
        userId: user.id,
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
