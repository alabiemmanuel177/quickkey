"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface LeaderboardFiltersProps {
  filters: {
    testType: "time" | "words";
    duration: string;
    sortBy: "wpm" | "accuracy" | "recent";
  };
  onFiltersChange: (filters: {
    testType: "time" | "words";
    duration: string;
    sortBy: "wpm" | "accuracy" | "recent";
  }) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export function LeaderboardFilters({
  filters,
  onFiltersChange,
  onRefresh,
  isLoading,
}: LeaderboardFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    const newFilters = { ...localFilters, [key]: value };

    // If test type changes, reset duration to default for that type
    if (key === "testType") {
      if (value === "time") {
        newFilters.duration = "15";
      } else {
        newFilters.duration = "25";
      }
    }

    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end">
      <div className="space-y-2 flex-1">
        <Label htmlFor="test-type">Test Type</Label>
        <Select
          value={localFilters.testType}
          onValueChange={(value) => handleFilterChange("testType", value)}
        >
          <SelectTrigger id="test-type">
            <SelectValue placeholder="Select test type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="time">Time</SelectItem>
            <SelectItem value="words">Words</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 flex-1">
        <Label htmlFor="duration">
          {localFilters.testType === "time" ? "Seconds" : "Words"}
        </Label>
        <Select
          value={localFilters.duration}
          onValueChange={(value) => handleFilterChange("duration", value)}
        >
          <SelectTrigger id="duration">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            {localFilters.testType === "time" ? (
              <>
                <SelectItem value="15">15 seconds</SelectItem>
                <SelectItem value="30">30 seconds</SelectItem>
                <SelectItem value="60">60 seconds</SelectItem>
                <SelectItem value="120">120 seconds</SelectItem>
              </>
            ) : (
              <>
                <SelectItem value="10">10 words</SelectItem>
                <SelectItem value="25">25 words</SelectItem>
                <SelectItem value="50">50 words</SelectItem>
                <SelectItem value="100">100 words</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 flex-1">
        <Label htmlFor="sort">Sort By</Label>
        <Select
          value={localFilters.sortBy}
          onValueChange={(value) => handleFilterChange("sortBy", value)}
        >
          <SelectTrigger id="sort">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="wpm">WPM (High to Low)</SelectItem>
            <SelectItem value="accuracy">Accuracy (High to Low)</SelectItem>
            <SelectItem value="recent">Recent First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={onRefresh}
        disabled={isLoading}
        className="h-10 w-10 mt-6 md:mt-0"
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        <span className="sr-only">Refresh</span>
      </Button>
    </div>
  );
}
