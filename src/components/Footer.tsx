"use client";

import Link from "next/link";
import { Github } from "lucide-react";
import { cn } from "@/lib/utils";

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("border-t", className)}>
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between text-sm">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <Link href="/" className="font-medium">
            QuickKey
          </Link>
          <span className="text-muted-foreground text-xs">
            v{process.env.NEXT_PUBLIC_APP_VERSION || "development"}
          </span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6">
          <div className="flex space-x-4 items-center">
            <Link 
              href="/privacy-policy" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms-of-service"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>
          
          <Link 
            href="https://github.com/your-username/quickkey" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
          </Link>
        </div>
      </div>
    </footer>
  );
} 