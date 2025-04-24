"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Trophy, InfoIcon, Settings, UserIcon, LogOut } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NotificationDrawer from "./NotificationDrawer";

const Header = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const getUserInitials = () => {
    if (!session?.user?.name) return "U";
    return session.user.name
      .split(" ")
      .map(name => name[0])
      .join("")
      .toUpperCase();
  };

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

                {!isAuthenticated && (
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
                )}

                <NotificationDrawer />

                <ThemeToggle />
                
                {isAuthenticated ? (
                  // User Menu for authenticated users
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage 
                            src={session?.user?.image || ""} 
                            alt={session?.user?.name || "User"} 
                          />
                          <AvatarFallback>{getUserInitials()}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>
                        {session?.user?.name || "User"}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings">Settings</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  // Login/Register button for unauthenticated users
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
                )}
              </TooltipProvider>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 