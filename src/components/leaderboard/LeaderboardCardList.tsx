"use client";

import { format } from "date-fns";
import { Medal, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LeaderboardEntry } from "@/hooks/useLeaderboard";

interface LeaderboardCardListProps {
  entries: LeaderboardEntry[];
  isLoading: boolean;
}

export function LeaderboardCardList({ entries, isLoading }: LeaderboardCardListProps) {
  // Get appropriate icon based on rank
  const getRankIcon = (rank: number) => {
    if (rank === 1) {
      return <Medal className="h-5 w-5 text-yellow-500 fill-yellow-500" />;
    } else if (rank === 2) {
      return <Medal className="h-5 w-5 text-gray-400 fill-gray-400" />;
    } else if (rank === 3) {
      return <Medal className="h-5 w-5 text-amber-700 fill-amber-700" />;
    }
    return null;
  };

  // Format test type and duration
  const getTestTypeString = (entry: LeaderboardEntry) => {
    if (entry.testType === "time") {
      return `${entry.duration} seconds`;
    } else {
      return `${entry.duration} words`;
    }
  };

  if (isLoading) {
    return <LeaderboardCardListSkeleton />;
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No entries found. Be the first to set a record!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry, index) => (
        <Card key={entry.id}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1 min-w-[40px] font-medium">
                {getRankIcon(index + 1)}
                <span>{index + 1}</span>
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={entry.userAvatar} alt={entry.userName} />
                  <AvatarFallback>{entry.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="font-medium">{entry.userName}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="text-muted-foreground">WPM</div>
                <div className="font-semibold">{entry.wpm}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Accuracy</div>
                <div>{entry.accuracy}%</div>
              </div>
              <div>
                <div className="text-muted-foreground">Test Type</div>
                <div>{getTestTypeString(entry)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Date</div>
                <div>{format(new Date(entry.createdAt), "PP")}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function LeaderboardCardListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Skeleton className="h-5 w-8" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <Skeleton className="h-3 w-10 mb-1" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div>
                <Skeleton className="h-3 w-14 mb-1" />
                <Skeleton className="h-4 w-10" />
              </div>
              <div>
                <Skeleton className="h-3 w-16 mb-1" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div>
                <Skeleton className="h-3 w-8 mb-1" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 