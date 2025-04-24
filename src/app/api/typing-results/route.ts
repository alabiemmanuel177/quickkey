import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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
    
    return NextResponse.json({ 
      message: 'Typing result saved successfully',
      typingResult,
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