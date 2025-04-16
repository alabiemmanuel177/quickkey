"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Trophy, InfoIcon, Settings, UserIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import NotificationDrawer from "./NotificationDrawer";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-center mx-auto px-4">
        <div className="flex w-full max-w-3xl items-center justify-between">
          <div className="flex">
            <Link 
              href="/" 
              className="flex items-center space-x-2 font-bold"
            >
              <span className="text-xl">⌨️</span>
              <span className="hidden sm:inline">QuickKey</span>
            </Link>
          </div>
          <div className="flex items-center">
            <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto sm:overflow-x-visible flex-nowrap">
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" asChild>
                      <Link href="/leaderboard" aria-label="Leaderboard">
                        <Trophy className="h-4 w-4 sm:h-[1.2rem] sm:w-[1.2rem]" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="hidden sm:block">
                    <p>Leaderboard</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" asChild>
                      <Link href="/about" aria-label="About QuickKey">
                        <InfoIcon className="h-4 w-4 sm:h-[1.2rem] sm:w-[1.2rem]" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="hidden sm:block">
                    <p>About</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" asChild>
                      <Link href="/settings" aria-label="Settings">
                        <Settings className="h-4 w-4 sm:h-[1.2rem] sm:w-[1.2rem]" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="hidden sm:block">
                    <p>Settings</p>
                  </TooltipContent>
                </Tooltip>

                <NotificationDrawer />

                <ThemeToggle />
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" asChild>
                      <Link href="/auth" aria-label="Login or Register">
                        <UserIcon className="h-4 w-4 sm:h-[1.2rem] sm:w-[1.2rem]" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="hidden sm:block">
                    <p>Login / Register</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 