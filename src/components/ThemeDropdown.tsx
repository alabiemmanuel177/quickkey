"use client";

import { useState, useEffect } from "react";
import { Check, ChevronDown, Palette } from "lucide-react";
import { useMonkeyTheme, MonkeyTheme } from "@/hooks/useMonkeyTheme";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface ThemeDropdownProps {
  minimal?: boolean;
  showPreview?: boolean;
}

// Define interface for built-in themes
interface BuiltInTheme {
  id: string;
  name: string;
  isBuiltIn: boolean;
}

export function ThemeDropdown({ minimal = false, showPreview = false }: ThemeDropdownProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { monkeyThemes, activeTheme, loading, changeTheme, builtInTheme } = useMonkeyTheme();
  const { setTheme, theme, themes = [] } = useTheme();
  
  // Only show UI after mounting to avoid hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  // Function to get a human-readable name for the current theme
  const getCurrentThemeName = () => {
    if (!mounted) return "Loading...";
    
    if (activeTheme) {
      const monkeyTheme = monkeyThemes.find(t => t.id === activeTheme);
      return monkeyTheme ? monkeyTheme.name : "Unknown Theme";
    }
    
    // Display built-in theme name if no monkey theme is active
    if (!theme) return "System Theme";
    
    return theme === "system" 
      ? "System Theme" 
      : theme.charAt(0).toUpperCase() + theme.slice(1);
  };

  // Group themes into built-in and Monkeytype themes
  const builtInThemes: BuiltInTheme[] = Array.isArray(themes) 
    ? [...new Set(themes)].map(t => ({
        id: t,
        name: t === "system" ? "System Theme" : t.charAt(0).toUpperCase() + t.slice(1),
        isBuiltIn: true
      }))
    : [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a theme"
          className={cn(
            "w-full justify-between",
            minimal ? "h-9 px-3" : "h-10 px-4"
          )}
        >
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className={minimal ? "sr-only" : ""}>
              {loading ? "Loading themes..." : getCurrentThemeName()}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0">
        {!mounted ? (
          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <Command>
            <CommandInput placeholder="Search themes..." />
            <CommandList>
              <CommandEmpty>No themes found.</CommandEmpty>
              
              {/* Built-in Themes */}
              <CommandGroup heading="Built-in Themes">
                <ScrollArea className="h-[180px]">
                  {builtInThemes.map((builtInTheme) => (
                    <CommandItem
                      key={builtInTheme.id}
                      value={builtInTheme.id}
                      onSelect={() => {
                        setTheme(builtInTheme.id);
                        changeTheme(""); // Clear monkey theme
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <div
                          className="h-4 w-4 rounded-full border border-border"
                          style={{
                            backgroundColor: 
                              builtInTheme.id === "light" ? "white" : 
                              builtInTheme.id === "dark" ? "#1e293b" :
                              builtInTheme.id === "system" ? "#cbd5e1" :
                              "currentColor"
                          }}
                        />
                        {builtInTheme.name}
                        {theme === builtInTheme.id && !activeTheme && (
                          <Check className="ml-auto h-4 w-4" />
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>
              
              <CommandSeparator />
              
              {/* Monkeytype Themes */}
              <CommandGroup heading="Monkeytype Themes">
                {loading ? (
                  <div className="p-2 flex items-center justify-center">
                    <Skeleton className="h-8 w-full" />
                  </div>
                ) : (
                  <ScrollArea className="h-[300px]">
                    {monkeyThemes.map((monkeyTheme) => (
                      <CommandItem
                        key={monkeyTheme.id}
                        value={monkeyTheme.name}
                        onSelect={() => {
                          changeTheme(monkeyTheme.id);
                          setOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-2 w-full">
                          <Palette className="h-4 w-4" />
                          {monkeyTheme.name}
                          {activeTheme === monkeyTheme.id && (
                            <Check className="ml-auto h-4 w-4" />
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </ScrollArea>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  );
} 