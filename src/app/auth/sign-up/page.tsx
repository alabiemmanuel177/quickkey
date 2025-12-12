import { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "QuickKey - Sign Up",
  description:
    "Create a QuickKey account to track your typing progress and compete on the leaderboard.",
};

export default function SignUpPage() {
  return (
    <div className="container flex flex-col items-center justify-center py-8 gap-6 mx-auto min-h-[calc(100vh-200px)]">
      <div className="text-center mb-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Join QuickKey
        </h1>
        <p className="mt-2 text-muted-foreground">
          Create an account to track your progress
        </p>
      </div>

      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg",
          },
        }}
      />
    </div>
  );
}
