import { Metadata } from "next";
import { Leaderboard } from "@/components/leaderboard/Leaderboard";

export const metadata: Metadata = {
  title: "Leaderboard | QuickKey",
  description: "View the top typing speeds and compete with other users",
};

export default function LeaderboardPage() {
  return (
    <div className="container py-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-muted-foreground">
          View the top typing speeds and compete with other users
        </p>
      </div>
      
      <Leaderboard />
    </div>
  );
} 