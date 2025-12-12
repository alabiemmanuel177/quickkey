"use client";

import React, { useEffect, useState } from "react";
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
import { BellIcon, X, CheckCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

// Define notification type
interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

const NotificationDrawer = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = isLoaded && isSignedIn;

  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      const response = await axios.get('/api/notifications');
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await axios.patch(`/api/notifications/${id}`, { read: true });
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true } 
            : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await axios.delete(`/api/notifications/${id}`);
      
      // Update local state
      const updatedNotifications = notifications.filter(
        notification => notification.id !== id
      );
      setNotifications(updatedNotifications);
      
      // Update unread count if necessary
      const removedNotification = notifications.find(n => n.id === id);
      if (removedNotification && !removedNotification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Fetch notifications when drawer opens or auth state changes
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchNotifications();
    }
  }, [isOpen, isAuthenticated]);

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'info':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'achievement':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Unknown time';
    }
  };

  return (
    <Sheet onOpenChange={setIsOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label="Notifications"
                onClick={() => isAuthenticated && fetchNotifications()}
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

      <SheetContent className="w-80 sm:w-[400px] p-6 sm:p-8">
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

        <div className="mt-6 flex flex-col space-y-4">
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">
              Loading notifications...
            </p>
          ) : !isAuthenticated ? (
            <p className="text-center text-muted-foreground py-8">
              Sign in to view your notifications.
            </p>
          ) : notifications.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No notifications yet.
            </p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`relative rounded-lg border px-6 py-4 transition-colors ${
                  !notification.read
                    ? "border-primary/50 bg-primary/5"
                    : "border-border"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-1 items-center">
                  <h4 className="font-medium">{notification.title}</h4>
                    <Badge 
                      variant="secondary" 
                      className={`ml-2 text-[10px] ${getNotificationTypeColor(notification.type)}`}
                    >
                      {notification.type}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(notification.createdAt)}
                  </span>
                </div>
                <p className="mt-1 text-sm mb-6">{notification.message}</p>

                <div className="absolute bottom-3 right-4 flex space-x-2">
                  {!notification.read && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2 text-xs"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Mark read
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                    onClick={() => deleteNotification(notification.id)}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationDrawer; 