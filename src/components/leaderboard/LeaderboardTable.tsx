"use client";

import { format } from "date-fns";
import { Medal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { LeaderboardEntry } from "@/hooks/useLeaderboard";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  isLoading: boolean;
}

export function LeaderboardTable({
  entries,
  isLoading,
}: LeaderboardTableProps) {
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
    return <LeaderboardTableSkeleton />;
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No entries found. Be the first to set a record!
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">Rank</TableHead>
            <TableHead>User</TableHead>
            <TableHead>WPM</TableHead>
            <TableHead>Accuracy</TableHead>
            <TableHead>Test Type</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry, index) => (
            <TableRow key={entry.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-1">
                  {getRankIcon(index + 1)}
                  <span>{index + 1}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={entry.userAvatar} alt={entry.userName} />
                    <AvatarFallback>
                      {entry.userName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="font-medium">{entry.userName}</div>
                </div>
              </TableCell>
              <TableCell className="font-semibold">{entry.wpm}</TableCell>
              <TableCell>{entry.accuracy}%</TableCell>
              <TableCell>{getTestTypeString(entry)}</TableCell>
              <TableCell className="text-right">
                {format(new Date(entry.createdAt), "PP")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function LeaderboardTableSkeleton() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">Rank</TableHead>
            <TableHead>User</TableHead>
            <TableHead>WPM</TableHead>
            <TableHead>Accuracy</TableHead>
            <TableHead>Test Type</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-5 w-8" />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-12" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-4 w-20 ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
