import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prisma } from "@/lib/prisma";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";
import TimeFilterSelect from "@/components/leaderboard/TimeFilterSelect";

export const metadata: Metadata = {
  title: "QuickKey - Leaderboard",
  description: "Check out the fastest typers in the QuickKey community",
};

// Function to get leaderboard data with filters
async function getLeaderboardData(
  timeFilter: string = "all",
  testType: string = "words"
) {
  // Build date filter
  let dateFilter = {};
  const now = new Date();
  
  if (timeFilter === "daily") {
    // Last 24 hours
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    dateFilter = { createdAt: { gte: oneDayAgo } };
  } else if (timeFilter === "weekly") {
    // Last 7 days
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    dateFilter = { createdAt: { gte: oneWeekAgo } };
  } else if (timeFilter === "monthly") {
    // Last 30 days
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    dateFilter = { createdAt: { gte: oneMonthAgo } };
  }
  
  // Build test type filter and minimum test duration
  const testTypeFilter = testType !== "all" ? { testType } : {};
  const minTestDuration = testType === "words" ? 15 : 30; // Minimum test duration for fairness
  
  // Get leaderboard data
  const leaderboard = await prisma.typingResult.findMany({
    where: {
      ...dateFilter,
      ...testTypeFilter,
      testDuration: { gte: minTestDuration },
      accuracy: { gte: 70 }, // Minimum accuracy threshold
    },
    orderBy: [
      { wpm: "desc" },
      { accuracy: "desc" },
    ],
    take: 50,
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
  
  return leaderboard;
}

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Get filter parameters from URL or use defaults - use nullish coalescing for safety
  const timeFilterParam = searchParams.time;
  const testTypeParam = searchParams.type;
  
  const timeFilter = typeof timeFilterParam === "string" ? timeFilterParam : "all";
  const testType = typeof testTypeParam === "string" ? testTypeParam : "words";
  
  // Get leaderboard data for words and quotes
  const wordsLeaderboard = await getLeaderboardData(timeFilter, "words");
  const quotesLeaderboard = await getLeaderboardData(timeFilter, "quote");
  
  // Determine active tab based on test type
  const activeTab = testType === "quote" ? "quotes" : "words";
  
  return (
    <div className="container py-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold tracking-tight mb-4">Leaderboard</h1>
      <p className="text-muted-foreground mb-8">
        See how you stack up against other typists. The leaderboard shows the top results for typing speed (WPM) and accuracy.
      </p>
      
      <div className="max-w-4xl w-full">
        <TimeFilterSelect activeFilter={timeFilter} />
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Top Typers</CardTitle>
            <CardDescription>
              Showing results for {timeFilter === "all" ? "all time" : `the last ${timeFilter} period`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={activeTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="words">Words</TabsTrigger>
                <TabsTrigger value="quotes">Quotes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="words">
                {wordsLeaderboard.length > 0 ? (
                  <LeaderboardTable data={wordsLeaderboard} />
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No results found for this time period.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="quotes">
                {quotesLeaderboard.length > 0 ? (
                  <LeaderboardTable data={quotesLeaderboard} />
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No results found for this time period.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 