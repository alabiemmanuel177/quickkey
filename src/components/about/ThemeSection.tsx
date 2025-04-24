"use client";

import { ThemeDropdown } from "@/components/ThemeDropdown";
import { ThemePreview } from "@/components/ThemePreview";
import { Separator } from "@/components/ui/separator";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function ThemeSection() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Customize Theme</h2>
        <p className="text-muted-foreground">
          QuickKey offers a wide range of themes to personalize your typing experience. Choose from our built-in themes or select from the Monkeytype collection.
        </p>
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Theme</label>
          <ThemeDropdown />
        </div>
      </div>
      
      <Separator />
      
      <ThemePreview />
      
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-base">About These Themes</CardTitle>
          <CardDescription>
            Themes are sourced from the Monkeytype project
          </CardDescription>
        </CardHeader>
        <CardFooter className="pt-0 pb-4">
          <Button variant="outline" asChild className="w-full gap-1">
            <Link href="https://github.com/monkeytypegame/monkeytype" target="_blank" rel="noopener noreferrer">
              View on GitHub
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 