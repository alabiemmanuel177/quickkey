"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  HomeIcon,
  KeyboardIcon,
  LayoutDashboardIcon,
  TrophyIcon,
  UserIcon,
  SettingsIcon,
  InfoIcon,
  BookOpenIcon,
  LineChartIcon,
  ListOrderedIcon,
} from "lucide-react";

interface CommandOption {
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
}

const CommandLine = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Command options
  const commandOptions: CommandOption[] = [
    {
      label: "Home",
      icon: <HomeIcon className="mr-2 h-4 w-4" />,
      shortcut: "G H",
      action: () => {
        router.push("/");
        setOpen(false);
      },
    },
    {
      label: "Restart Typing Test",
      icon: <KeyboardIcon className="mr-2 h-4 w-4" />,
      shortcut: "R T",
      action: () => {
        // This will be handled separately since we need to interact with the TypingTest component
        window.dispatchEvent(new CustomEvent("restart-typing-test"));
        setOpen(false);
      },
    },
    {
      label: "Leaderboard",
      icon: <TrophyIcon className="mr-2 h-4 w-4" />,
      shortcut: "G L",
      action: () => {
        router.push("/leaderboard");
        setOpen(false);
      },
    },
    {
      label: "Settings",
      icon: <SettingsIcon className="mr-2 h-4 w-4" />,
      shortcut: "G S",
      action: () => {
        router.push("/settings");
        setOpen(false);
      },
    },
    {
      label: "Profile",
      icon: <UserIcon className="mr-2 h-4 w-4" />,
      shortcut: "G P",
      action: () => {
        router.push("/profile");
        setOpen(false);
      },
    },
    {
      label: "About",
      icon: <InfoIcon className="mr-2 h-4 w-4" />,
      shortcut: "G A",
      action: () => {
        router.push("/about");
        setOpen(false);
      },
    },
    {
      label: "Dashboard",
      icon: <LayoutDashboardIcon className="mr-2 h-4 w-4" />,
      shortcut: "G D",
      action: () => {
        router.push("/dashboard");
        setOpen(false);
      },
    },
    {
      label: "Statistics",
      icon: <LineChartIcon className="mr-2 h-4 w-4" />,
      action: () => {
        router.push("/statistics");
        setOpen(false);
      },
    },
    {
      label: "Help & Documentation",
      icon: <BookOpenIcon className="mr-2 h-4 w-4" />,
      action: () => {
        router.push("/help");
        setOpen(false);
      },
    },
    {
      label: "Practice Exercises",
      icon: <ListOrderedIcon className="mr-2 h-4 w-4" />,
      action: () => {
        router.push("/exercises");
        setOpen(false);
      },
    },
  ];

  // Handle keyboard shortcut to open command line
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key toggles the command line
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      
      // Cmd+Shift+P or Ctrl+Shift+P opens the command line
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "p") {
        e.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[550px] p-0" onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader className="px-4 pt-4 pb-0">
          <DialogTitle>Command Menu</DialogTitle>
        </DialogHeader>
        <Command className="rounded-lg border border-none">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Navigation & Actions">
              {commandOptions.slice(0, 7).map((option) => (
                <CommandItem
                  key={option.label}
                  onSelect={option.action}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    {option.icon}
                    <span>{option.label}</span>
                  </div>
                  {option.shortcut && (
                    <span className="text-xs text-muted-foreground">
                      {option.shortcut}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="More Options">
              {commandOptions.slice(7).map((option) => (
                <CommandItem
                  key={option.label}
                  onSelect={option.action}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    {option.icon}
                    <span>{option.label}</span>
                  </div>
                  {option.shortcut && (
                    <span className="text-xs text-muted-foreground">
                      {option.shortcut}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default CommandLine; 