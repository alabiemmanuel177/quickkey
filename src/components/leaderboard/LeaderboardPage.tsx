"use client";

import { useState, useEffect } from "react";
import { LeaderboardFilters } from "./LeaderboardFilters";
import { LeaderboardTable } from "./LeaderboardTable";
import { LeaderboardCardList } from "./LeaderboardCardList";
import { useLeaderboard, LeaderboardOptions } from "@/hooks/useLeaderboard";

export function LeaderboardPage() {
  const [filters, setFilters] = useState<LeaderboardOptions>({
    testType: "time",
    duration: "30",
    sortBy: "wpm"
  });

  const { entries, isLoading, error, refresh } = useLeaderboard(filters);
  const [isMobileView, setIsMobileView] = useState(false);

  // Check viewport width on component mount and window resize
  useEffect(() => {
    const checkViewport = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    // Initial check
    checkViewport();

    // Setup listener
    window.addEventListener("resize", checkViewport);
    
    // Cleanup
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-screen-xl space-y-6">
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-muted-foreground">
          See how you stack up against other typists
        </p>
      </div>

      <LeaderboardFilters
        filters={filters}
        onFiltersChange={setFilters}
        isLoading={isLoading}
        onRefresh={refresh}
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-destructive">Failed to load leaderboard data</p>
          <button 
            className="text-primary mt-2 underline"
            onClick={refresh}
          >
            Try again
          </button>
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No results found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or take a test to appear on the leaderboard!
          </p>
        </div>
      ) : (
        <>
          {isMobileView ? (
            <LeaderboardCardList entries={entries} isLoading={isLoading} />
          ) : (
            <LeaderboardTable entries={entries} isLoading={isLoading} />
          )}
        </>
      )}
    </div>
  );
} 