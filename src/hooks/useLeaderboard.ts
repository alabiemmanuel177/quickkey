"use client";

import { useState, useEffect } from "react";

// Define types for the leaderboard
export interface LeaderboardEntry {
  id: string;
  userName: string;
  userAvatar: string;
  wpm: number;
  accuracy: number;
  testType: string;
  duration: string;
  createdAt: string;
}

export interface LeaderboardOptions {
  testType: "time" | "words" | "quote";
  duration: string;
  sortBy: "wpm" | "accuracy" | "recent";
  timeFilter?: "all" | "daily" | "weekly" | "monthly";
}

interface UseLeaderboardReturn {
  entries: LeaderboardEntry[];
  isLoading: boolean;
  error: Error | null;
  totalCount: number;
  refresh: () => void;
}

// API response types
interface ApiLeaderboardEntry {
  id: string;
  wpm: number;
  accuracy: number;
  testType: string;
  testDuration: number;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface ApiResponse {
  leaderboard: ApiLeaderboardEntry[];
  totalCount: number;
  filters: {
    timeFilter: string;
    testType: string;
    minTestDuration: number;
  };
}

/**
 * Hook to fetch and manage leaderboard data from the API
 */
export function useLeaderboard({
  testType,
  duration,
  sortBy,
  timeFilter = "all",
}: LeaderboardOptions): UseLeaderboardReturn {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  // Function to trigger a refresh
  const refresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        // Build query parameters
        const params = new URLSearchParams({
          timeFilter,
          limit: "50",
        });

        // Add test type filter (map "time" to "words" for API compatibility)
        if (testType && testType !== "time") {
          params.append("testType", testType);
        } else if (testType === "time") {
          params.append("testType", "words");
        }

        // Add minimum test duration filter
        if (duration) {
          params.append("minTestDuration", duration);
        }

        const response = await fetch(`/api/leaderboard?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }

        const data: ApiResponse = await response.json();

        // Transform API response to LeaderboardEntry format
        let transformedEntries: LeaderboardEntry[] = data.leaderboard.map((entry) => ({
          id: entry.id,
          userName: entry.user.name || "Anonymous",
          userAvatar: entry.user.image || "",
          wpm: entry.wpm,
          accuracy: entry.accuracy,
          testType: entry.testType,
          duration: entry.testDuration.toString(),
          createdAt: entry.createdAt,
        }));

        // Sort by the selected criterion (API already sorts by WPM)
        if (sortBy === "accuracy") {
          transformedEntries = transformedEntries.sort((a, b) => b.accuracy - a.accuracy);
        } else if (sortBy === "recent") {
          transformedEntries = transformedEntries.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }

        if (isMounted) {
          setEntries(transformedEntries);
          setTotalCount(data.totalCount);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Unknown error occurred"));
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [testType, duration, sortBy, timeFilter, refreshKey]);

  return { entries, isLoading, error, totalCount, refresh };
} 