"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { Trophy } from "lucide-react";

interface LeaderboardUser {
  id: string;
  name: string | null;
  image: string | null;
}

interface LeaderboardEntry {
  id: string;
  wpm: number;
  accuracy: number;
  charsTyped: number;
  testDuration: number;
  testType: string;
  createdAt: string | Date;
  user: LeaderboardUser;
}

interface LeaderboardTableProps {
  data: LeaderboardEntry[];
}

const LeaderboardTable = ({ data }: LeaderboardTableProps) => {
  // Default sort by WPM descending
  const [sortBy, setSortBy] = useState<"wpm" | "accuracy">("wpm");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Sort the data based on current sort settings
  const sortedData = [...data].sort((a, b) => {
    const multiplier = sortDirection === "desc" ? -1 : 1;
    return (a[sortBy] - b[sortBy]) * multiplier;
  });

  // Toggle sorting
  const toggleSort = (column: "wpm" | "accuracy") => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "desc" ? "asc" : "desc");
    } else {
      setSortBy(column);
      setSortDirection("desc");
    }
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Rank</TableHead>
            <TableHead>User</TableHead>
            <TableHead 
              className="text-right cursor-pointer hover:text-primary"
              onClick={() => toggleSort("wpm")}
            >
              WPM {sortBy === "wpm" && (sortDirection === "desc" ? "↓" : "↑")}
            </TableHead>
            <TableHead 
              className="text-right cursor-pointer hover:text-primary"
              onClick={() => toggleSort("accuracy")}
            >
              Accuracy {sortBy === "accuracy" && (sortDirection === "desc" ? "↓" : "↑")}
            </TableHead>
            <TableHead className="text-right hidden md:table-cell">Test</TableHead>
            <TableHead className="text-right hidden md:table-cell">When</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((entry, index) => (
            <TableRow key={entry.id} className={index < 3 ? "font-medium" : ""}>
              <TableCell className="font-mono">
                {index === 0 ? (
                  <div className="flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                </div>
                ) : index === 1 ? (
                  <div className="flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-gray-400" />
                </div>
                ) : index === 2 ? (
                  <div className="flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-amber-700" />
    </div>
                ) : (
                  <span className="text-center block">{index + 1}</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {entry.user.image ? (
                    <Image
                      src={entry.user.image}
                      alt={entry.user.name || "User"}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-sm">
                        {entry.user.name?.charAt(0) || "U"}
                      </span>
                    </div>
                  )}
                  <span>{entry.user.name || "Anonymous"}</span>
                </div>
              </TableCell>
              <TableCell className="text-right font-mono">
                {entry.wpm}
              </TableCell>
              <TableCell className="text-right font-mono">
                {entry.accuracy.toFixed(1)}%
              </TableCell>
              <TableCell className="text-right hidden md:table-cell">
                <Badge variant="outline">
                  {entry.testType === "words" ? "Words" : "Quote"} ({entry.testDuration}s)
                </Badge>
              </TableCell>
              <TableCell className="text-right text-muted-foreground text-sm hidden md:table-cell">
                {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaderboardTable;
