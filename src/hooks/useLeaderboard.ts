"use client";

import { useState, useEffect } from "react";

// Define types for the leaderboard
export interface LeaderboardEntry {
  id: string;
  userName: string;
  userAvatar: string;
  wpm: number;
  accuracy: number;
  testType: "time" | "words";
  duration: string;
  createdAt: string;
}

export interface LeaderboardOptions {
  testType: "time" | "words";
  duration: string;
  sortBy: "wpm" | "accuracy" | "recent";
}

interface UseLeaderboardReturn {
  entries: LeaderboardEntry[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
}

/**
 * Mock data for the leaderboard
 */
const MOCK_ENTRIES: LeaderboardEntry[] = [
  {
    id: "1",
    userName: "TypeMaster",
    userAvatar: "",
    wpm: 145,
    accuracy: 98.5,
    testType: "time",
    duration: "30",
    createdAt: new Date(2023, 7, 15).toISOString(),
  },
  {
    id: "2",
    userName: "SpeedTyper",
    userAvatar: "",
    wpm: 132,
    accuracy: 97.2,
    testType: "time",
    duration: "30",
    createdAt: new Date(2023, 8, 2).toISOString(),
  },
  {
    id: "3",
    userName: "QuickFingers",
    userAvatar: "",
    wpm: 128,
    accuracy: 96.8,
    testType: "time",
    duration: "30",
    createdAt: new Date(2023, 8, 10).toISOString(),
  },
  {
    id: "4",
    userName: "KeyboardNinja",
    userAvatar: "",
    wpm: 125,
    accuracy: 95.5,
    testType: "time",
    duration: "30",
    createdAt: new Date(2023, 8, 15).toISOString(),
  },
  {
    id: "5",
    userName: "SwiftKeys",
    userAvatar: "",
    wpm: 118,
    accuracy: 94.7,
    testType: "time",
    duration: "30",
    createdAt: new Date(2023, 8, 18).toISOString(),
  },
  {
    id: "6",
    userName: "RapidTypist",
    userAvatar: "",
    wpm: 115,
    accuracy: 93.8,
    testType: "time",
    duration: "30",
    createdAt: new Date(2023, 8, 20).toISOString(),
  },
  {
    id: "7",
    userName: "FlashWriter",
    userAvatar: "",
    wpm: 112,
    accuracy: 92.9,
    testType: "time",
    duration: "30",
    createdAt: new Date(2023, 8, 25).toISOString(),
  },
  {
    id: "8",
    userName: "TypePro",
    userAvatar: "",
    wpm: 108,
    accuracy: 91.5,
    testType: "time",
    duration: "30",
    createdAt: new Date(2023, 9, 1).toISOString(),
  },
  {
    id: "9",
    userName: "KeyMaster",
    userAvatar: "",
    wpm: 105,
    accuracy: 90.8,
    testType: "time",
    duration: "30",
    createdAt: new Date(2023, 9, 5).toISOString(),
  },
  {
    id: "10",
    userName: "SpeedyFingers",
    userAvatar: "",
    wpm: 102,
    accuracy: 89.5,
    testType: "time",
    duration: "30",
    createdAt: new Date(2023, 9, 10).toISOString(),
  },
];

/**
 * Hook to fetch and manage leaderboard data
 */
export function useLeaderboard({
  testType,
  duration,
  sortBy,
}: LeaderboardOptions): UseLeaderboardReturn {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Function to trigger a refresh
  const refresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    // Simulate API fetch with a delay
    const fetchData = async () => {
      try {
        // Simulate network request
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Filter by test type and duration
        let filtered = MOCK_ENTRIES.filter(
          (entry) => entry.testType === testType && entry.duration === duration
        );

        // Sort by the selected criterion
        if (sortBy === "wpm") {
          filtered = filtered.sort((a, b) => b.wpm - a.wpm);
        } else if (sortBy === "accuracy") {
          filtered = filtered.sort((a, b) => b.accuracy - a.accuracy);
        } else if (sortBy === "recent") {
          filtered = filtered.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }

        if (isMounted) {
          setEntries(filtered);
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
  }, [testType, duration, sortBy, refreshKey]);

  return { entries, isLoading, error, refresh };
} 