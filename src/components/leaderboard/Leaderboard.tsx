"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useLeaderboard, LeaderboardEntry } from "@/hooks/useLeaderboard";
import { LeaderboardFilters } from "./LeaderboardFilters";
import { LeaderboardTable } from "./LeaderboardTable";
import { LeaderboardCardList } from "./LeaderboardCardList";

export function Leaderboard() {
  const [filters, setFilters] = useState({
    testType: "time" as "time" | "words",
    duration: "30",
    sortBy: "wpm" as "wpm" | "accuracy" | "recent"
  });

  const { entries, isLoading, error, refresh } = useLeaderboard(filters);
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="space-y-6">
      <LeaderboardFilters
        filters={filters}
        onFiltersChange={setFilters}
        isLoading={isLoading}
        onRefresh={refresh}
      />

      {isMobile ? (
        <LeaderboardCardList entries={entries} isLoading={isLoading} />
      ) : (
        <LeaderboardTable entries={entries} isLoading={isLoading} />
      )}
    </div>
  );
} 