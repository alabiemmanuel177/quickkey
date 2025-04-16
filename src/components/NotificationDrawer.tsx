"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { BellIcon, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Sample notifications data
const notifications = [
  {
    id: 1,
    title: "New personal best!",
    message: "You achieved 85 WPM on your last typing test. Great job!",
    date: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    title: "Daily Challenge Available",
    message: "A new daily typing challenge is now available.",
    date: "Yesterday",
    read: true,
  },
  {
    id: 3,
    title: "Welcome to QuickKey!",
    message: "Thanks for joining. Practice daily to improve your typing speed.",
    date: "3 days ago",
    read: true,
  },
];

const NotificationDrawer = () => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Sheet>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label="Notifications"
              >
                <BellIcon className="h-[1.2rem] w-[1.2rem]" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Notifications</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <SheetContent className="w-[320px] sm:w-[400px]">
        <SheetHeader className="relative">
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            Stay updated with your typing progress and new features.
          </SheetDescription>
          <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-4">
          {notifications.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No notifications yet.
            </p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-lg border p-4 transition-colors ${
                  !notification.read
                    ? "border-primary/50 bg-primary/5"
                    : "border-border"
                }`}
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-medium">{notification.title}</h4>
                  <span className="text-xs text-muted-foreground">
                    {notification.date}
                  </span>
                </div>
                <p className="mt-1 text-sm">{notification.message}</p>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationDrawer; 