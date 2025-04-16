import { Metadata } from "next";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "QuickKey - Authentication",
  description: "Login or register for QuickKey to track your typing progress and compete on the leaderboard.",
};

export default function AuthPage() {
  return (
    <div className="container flex flex-col items-center justify-center py-8 gap-6 mx-auto min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to QuickKey</h1>
          <p className="mt-2 text-muted-foreground">
            Login or create an account to track your progress
          </p>
        </div>
        
        <AuthForm />
      </div>
    </div>
  );
} 