import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100); // Cap at 100 results
    const offset = parseInt(searchParams.get('offset') || '0');
    const timeFilter = searchParams.get('timeFilter') || 'all'; // all, daily, weekly, monthly
    const testType = searchParams.get('testType') || undefined; // words, quote
    const minTestDuration = parseInt(searchParams.get('minTestDuration') || '0');
    
    // Build date filter
    let dateFilter = {};
    const now = new Date();
    
    if (timeFilter === 'daily') {
      // Last 24 hours
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { gte: oneDayAgo } };
    } else if (timeFilter === 'weekly') {
      // Last 7 days
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { gte: oneWeekAgo } };
    } else if (timeFilter === 'monthly') {
      // Last 30 days
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { gte: oneMonthAgo } };
    }
    
    // Build test type filter
    const testTypeFilter = testType ? { testType } : {};
    
    // Filter for minimum test duration (to ensure fair competition)
    const testDurationFilter = minTestDuration ? { testDuration: { gte: minTestDuration } } : {};
    
    // Get leaderboard data - ordered by WPM and with accuracy as a tiebreaker
    const leaderboard = await prisma.typingResult.findMany({
      where: {
        ...dateFilter,
        ...testTypeFilter,
        ...testDurationFilter,
        // Ensure reasonable accuracy (at least 70%)
        accuracy: { gte: 70 },
      },
      orderBy: [
        { wpm: 'desc' },
        { accuracy: 'desc' },
      ],
      take: limit,
      skip: offset,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
    
    // Get total count for pagination
    const totalCount = await prisma.typingResult.count({
      where: {
        ...dateFilter,
        ...testTypeFilter,
        ...testDurationFilter,
        accuracy: { gte: 70 },
      },
    });
    
    return NextResponse.json({
      leaderboard,
      totalCount,
      filters: {
        timeFilter,
        testType: testType || 'all',
        minTestDuration,
      },
    });
    
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Something went wrong while fetching the leaderboard' },
      { status: 500 }
    );
  }
} 