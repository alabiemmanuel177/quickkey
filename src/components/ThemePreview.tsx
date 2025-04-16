"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMonkeyTheme } from "@/hooks/useMonkeyTheme";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function ThemePreview() {
  const { activeTheme, monkeyThemes, loading } = useMonkeyTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentTheme = activeTheme 
    ? monkeyThemes.find(t => t.id === activeTheme)?.name 
    : "Default Theme";

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Theme Preview</h3>
            <p className="text-sm text-muted-foreground">
              {loading ? "Loading theme..." : `Current Theme: ${currentTheme}`}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button>Primary Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">UI Elements</h4>
              <div className="flex flex-wrap gap-2">
                <Badge>Badge</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Text Colors</h4>
              <div className="space-y-1">
                <p className="text-sm">Default Text</p>
                <p className="text-sm text-muted-foreground">Muted Text</p>
                <p className="text-sm text-primary">Primary Text</p>
                <p className="text-sm text-destructive">Destructive Text</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Background Colors</h4>
            <div className="grid grid-cols-4 gap-2">
              <div className="h-10 rounded-md bg-background border"></div>
              <div className="h-10 rounded-md bg-card border"></div>
              <div className="h-10 rounded-md bg-primary"></div>
              <div className="h-10 rounded-md bg-secondary"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 