"use client";

import { memo } from "react";
import { Hash, Clock, Type, Quote, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TestOptions {
  punctuation: boolean;
  numbers: boolean;
  time: number;
  mode: "words" | "quote";
}

interface TestOptionsHeaderProps {
  options: TestOptions;
  onChange: (options: TestOptions) => void;
}

const TestOptionsHeader: React.FC<TestOptionsHeaderProps> = memo(({
  options,
  onChange,
}) => {
  const handleTogglePunctuation = () => {
    onChange({ ...options, punctuation: !options.punctuation });
  };

  const handleToggleNumbers = () => {
    onChange({ ...options, numbers: !options.numbers });
  };

  const handleTimeChange = (time: number) => {
    onChange({ ...options, time });
  };

  const handleModeChange = (mode: "words" | "quote") => {
    onChange({ ...options, mode });
  };

  const activeClass = "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20 font-semibold";
  const baseClass = "inline-flex items-center justify-center gap-1 rounded-md text-xs sm:text-sm font-medium h-7 sm:h-8 px-2 sm:px-3 transition-all duration-200 hover:bg-muted cursor-pointer select-none";

  return (
    <div className="w-full mb-2 sm:mb-4 flex flex-wrap justify-between gap-1 sm:gap-2 p-1 sm:p-2 rounded-lg border border-border bg-background overflow-x-auto">
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          type="button"
          onClick={handleTogglePunctuation}
          title="Include punctuation in the test"
          className={cn(baseClass, options.punctuation && activeClass)}
        >
          <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Punctuation</span>
        </button>

        <button
          type="button"
          onClick={handleToggleNumbers}
          title="Include numbers in the test"
          className={cn(baseClass, options.numbers && activeClass)}
        >
          <Hash className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Numbers</span>
        </button>

        <select
          value={options.time}
          onChange={(e) => handleTimeChange(Number(e.target.value))}
          title="Set test duration"
          className={cn(
            "h-7 sm:h-8 px-2 sm:px-3 rounded-md border border-input bg-background text-xs sm:text-sm cursor-pointer",
            "focus:outline-none focus:ring-2 focus:ring-ring"
          )}
        >
          <option value={15}>15s</option>
          <option value={30}>30s</option>
          <option value={60}>60s</option>
          <option value={120}>120s</option>
        </select>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <button
          type="button"
          onClick={() => handleModeChange("words")}
          title="Test with random words"
          className={cn(baseClass, options.mode === "words" && activeClass)}
        >
          <Type className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Words</span>
        </button>

        <button
          type="button"
          onClick={() => handleModeChange("quote")}
          title="Test with quotes"
          className={cn(baseClass, options.mode === "quote" && activeClass)}
        >
          <Quote className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Quote</span>
        </button>
      </div>
    </div>
  );
});

TestOptionsHeader.displayName = "TestOptionsHeader";

export default TestOptionsHeader;
