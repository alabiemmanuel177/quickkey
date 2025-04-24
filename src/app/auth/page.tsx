import { Metadata } from "next";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "QuickKey - Authentication",
  description:
    "Login or register for QuickKey to track your typing progress and compete on the leaderboard.",
};

export default function AuthPage() {
  return (
    <div className="container flex flex-col items-center justify-center py-8 gap-6 mx-auto min-h-screen">
      <div className="max-w-md sm:max-w-lg lg:max-w-xl w-full mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome to QuickKey
          </h1>
          <p className="mt-2 text-muted-foreground">
            Login or create an account to track your progress
          </p>
        </div>

        <AuthForm />
      </div>
    </div>
  );
}
