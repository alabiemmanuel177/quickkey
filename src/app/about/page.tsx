"use client";

import { Keyboard, Layout, Clock, LineChart, Award, ArrowUpRight, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeDropdown } from "@/components/ThemeDropdown";
import { ThemePreview } from "@/components/ThemePreview";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const features = [
  {
    title: "Interactive Typing Tests",
    description: "Improve your typing speed and accuracy with our interactive typing tests.",
    icon: <Keyboard className="h-8 w-8" />,
  },
  {
    title: "Real-time Analysis",
    description: "Get instant feedback on your typing performance with WPM, accuracy, and error tracking.",
    icon: <Clock className="h-8 w-8" />,
  },
  {
    title: "Progress Tracking",
    description: "Track your improvement over time with detailed statistics and charts.",
    icon: <LineChart className="h-8 w-8" />,
  },
  {
    title: "Leaderboards",
    description: "Compete with other typists and see how you rank on our global leaderboards.",
    icon: <Award className="h-8 w-8" />,
  },
  {
    title: "Customizable Experience",
    description: "Personalize your typing experience with themes, sound effects, and more.",
    icon: <Layout className="h-8 w-8" />,
  },
  {
    title: "Advanced Algorithms",
    description: "Our smart word selection algorithm adapts to your skill level for optimal practice.",
    icon: <BrainCircuit className="h-8 w-8" />,
  }
];

export default function AboutPage() {
  return (
    <div className="flex justify-center w-full">
      <div className="container max-w-5xl py-10 space-y-12 px-4 sm:px-6">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">About QuickKey</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A modern, feature-rich typing practice app designed to help you improve your typing speed and accuracy.
          </p>
        </div>

        {/* Introduction */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                At QuickKey, we believe that typing is a fundamental skill in today's digital world. Our mission is to provide an engaging, effective, and enjoyable platform for users to improve their typing speed and accuracy.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Whether you're a student, professional, or simply looking to enhance your typing skills, QuickKey offers a range of features designed to make your practice sessions both productive and fun.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight">Key Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <Card key={index} className="overflow-hidden border">
                    <CardHeader className="p-4 pb-2 flex flex-row items-center gap-4">
                      <div className="text-primary">{feature.icon}</div>
                      <CardTitle className="text-base font-medium">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight">Technology</h2>
              <p className="text-muted-foreground leading-relaxed">
                QuickKey is built with modern web technologies, including Next.js, React, TypeScript, and Tailwind CSS. We leverage the latest features of these technologies to provide a fast, responsive, and accessible experience.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our typing tests use intelligent algorithms to analyze your typing patterns and provide personalized feedback. We also employ custom sound effects and visual cues to make the typing experience more engaging.
              </p>
            </div>
          </div>

          {/* Theme Section */}
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
        </div>
        
        {/* Call to Action */}
        <div className="text-center border rounded-lg p-8 space-y-4 bg-muted/30">
          <h2 className="text-2xl font-semibold">Ready to improve your typing?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Start practicing now and see how fast and accurate you can type. Track your progress and compete with others!
          </p>
          <Button size="lg" asChild>
            <Link href="/">Start Typing Test</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 