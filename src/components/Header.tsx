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
      <div className="container flex h-14 max-w-screen-2xl items-center justify-center mx-auto">
        <div className="flex w-full max-w-3xl items-center justify-between">
          <div className="flex">
            <Link 
              href="/" 
              className="flex items-center space-x-2 font-bold"
            >
              <span className="text-xl">⌨️</span>
              <span>QuickKey</span>
            </Link>
          </div>
          <div className="flex items-center">
            <nav className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href="/leaderboard" aria-label="Leaderboard">
                        <Trophy className="h-[1.2rem] w-[1.2rem]" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Leaderboard</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href="/about" aria-label="About QuickKey">
                        <InfoIcon className="h-[1.2rem] w-[1.2rem]" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>About</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href="/settings" aria-label="Settings">
                        <Settings className="h-[1.2rem] w-[1.2rem]" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Settings</p>
                  </TooltipContent>
                </Tooltip>

                <NotificationDrawer />

                <ThemeToggle />
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href="/auth" aria-label="Login or Register">
                        <UserIcon className="h-[1.2rem] w-[1.2rem]" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
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