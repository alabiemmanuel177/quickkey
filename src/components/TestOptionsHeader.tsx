"use client";

import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

const TestOptionsHeader: React.FC<TestOptionsHeaderProps> = ({
  options,
  onChange,
}) => {
  const handleTogglePunctuation = () => {
    onChange({
      ...options,
      punctuation: !options.punctuation,
    });
  };

  const handleToggleNumbers = () => {
    onChange({
      ...options,
      numbers: !options.numbers,
    });
  };

  const handleTimeChange = (time: number) => {
    onChange({
      ...options,
      time,
    });
  };

  const handleModeChange = (mode: "words" | "quote") => {
    onChange({
      ...options,
      mode,
    });
  };

  // Enhanced active state styling
  const activeToggleClass = "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20 font-semibold";
  const activeTimeClass = "bg-primary text-primary-foreground shadow-md font-semibold";

  return (
    <div className="w-full max-w-3xl mb-4 flex flex-wrap items-center justify-between gap-2 p-2 rounded-lg border border-border bg-background">
      <TooltipProvider>
        <div className="flex flex-wrap items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={options.punctuation}
                onPressedChange={handleTogglePunctuation}
                aria-label="Toggle punctuation"
                size="sm"
                className={cn(
                  "transition-all duration-200",
                  options.punctuation ? activeToggleClass : ""
                )}
              >
                <FileText className={cn("h-4 w-4 mr-1", options.punctuation && "animate-pulse duration-300")} />
                <span className="hidden sm:inline">Punctuation</span>
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Include punctuation in the test</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={options.numbers}
                onPressedChange={handleToggleNumbers}
                aria-label="Toggle numbers"
                size="sm"
                className={cn(
                  "transition-all duration-200",
                  options.numbers ? activeToggleClass : ""
                )}
              >
                <Hash className={cn("h-4 w-4 mr-1", options.numbers && "animate-pulse duration-300")} />
                <span className="hidden sm:inline">Numbers</span>
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Include numbers in the test</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant={options.time !== 60 ? "default" : "outline"} 
                    size="sm" 
                    className={cn(
                      "h-8 transition-all duration-200", 
                      options.time !== 60 ? activeTimeClass : ""
                    )}
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Time:</span> {options.time}s
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {[15, 30, 60, 120].map((time) => (
                    <DropdownMenuItem
                      key={time}
                      onClick={() => handleTimeChange(time)}
                      className={cn(
                        "transition-all",
                        options.time === time ? "bg-primary/10 font-semibold" : ""
                      )}
                    >
                      {time} seconds
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <TooltipContent>
              <p>Set test duration</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={options.mode === "words"}
                onPressedChange={() => handleModeChange("words")}
                aria-label="Words mode"
                size="sm"
                className={cn(
                  "transition-all duration-200",
                  options.mode === "words" ? activeToggleClass : ""
                )}
              >
                <Type className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Words</span>
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Test with random words</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={options.mode === "quote"}
                onPressedChange={() => handleModeChange("quote")}
                aria-label="Quote mode"
                size="sm"
                className={cn(
                  "transition-all duration-200",
                  options.mode === "quote" ? activeToggleClass : ""
                )}
              >
                <Quote className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Quote</span>
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Test with famous quotes</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default TestOptionsHeader; 