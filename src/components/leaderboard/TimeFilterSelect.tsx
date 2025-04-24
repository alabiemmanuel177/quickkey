"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeFilterSelectProps {
  activeFilter: string;
}

const timeFilters = [
  { value: "all", label: "All Time" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const TimeFilterSelect = ({ activeFilter }: TimeFilterSelectProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Handle changing the time filter
  const handleTimeFilterChange = (value: string) => {
    // Create a new URLSearchParams object from the current one
    const params = new URLSearchParams(searchParams);
    
    // Set the time parameter
    params.set("time", value);
    
    // Push the new URL with updated params
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="text-sm font-medium">Time Period:</div>
      <Select
        value={activeFilter}
        onValueChange={handleTimeFilterChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select time period" />
        </SelectTrigger>
        <SelectContent>
          {timeFilters.map((filter) => (
            <SelectItem key={filter.value} value={filter.value}>
              {filter.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeFilterSelect; 