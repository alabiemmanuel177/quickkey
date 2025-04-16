"use client";

import * as React from "react";
import { Moon, Sun, Laptop, Palette, Contrast, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ThemeOption = {
  value: string;
  label: string;
  icon: React.ReactNode;
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // After mounting, we can show the theme-specific content
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const themes: ThemeOption[] = [
    {
      value: "system",
      label: "System",
      icon: <Laptop className="mr-2 h-4 w-4" />,
    },
    {
      value: "light",
      label: "Light",
      icon: <Sun className="mr-2 h-4 w-4" />,
    },
    {
      value: "dark",
      label: "Dark",
      icon: <Moon className="mr-2 h-4 w-4" />,
    },
    {
      value: "dimmed",
      label: "Dimmed",
      icon: <Monitor className="mr-2 h-4 w-4" />,
    },
    {
      value: "dracula",
      label: "Dracula",
      icon: <Palette className="mr-2 h-4 w-4" />,
    },
    {
      value: "nord",
      label: "Nord",
      icon: <Palette className="mr-2 h-4 w-4" />,
    },
    {
      value: "tokyo-night",
      label: "Tokyo Night",
      icon: <Palette className="mr-2 h-4 w-4" />,
    },
    {
      value: "gruvbox",
      label: "Gruvbox",
      icon: <Palette className="mr-2 h-4 w-4" />,
    },
    {
      value: "high-contrast",
      label: "High Contrast",
      icon: <Contrast className="mr-2 h-4 w-4" />,
    },
  ];

  // Get current theme icon
  const getCurrentThemeIcon = () => {
    if (!mounted) {
      // Return a static icon for server-side rendering
      return <Sun className="h-[1.2rem] w-[1.2rem]" />;
    }
    const currentTheme = themes.find((t) => t.value === theme) || themes[0];
    
    // Use a more specific type that includes className
    return React.cloneElement(currentTheme.icon as React.ReactElement<React.ComponentPropsWithRef<'svg'>>, {
      className: "h-[1.2rem] w-[1.2rem]",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {getCurrentThemeIcon()}
          <span className="sr-only">Select theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Select Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.value}
            onClick={() => setTheme(themeOption.value)}
            className="flex items-center cursor-pointer"
          >
            {themeOption.icon}
            {themeOption.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 