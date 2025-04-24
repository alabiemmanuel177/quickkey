"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Github, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OAuthSignIn() {
  const [isLoading, setIsLoading] = useState<{
    github: boolean;
    google: boolean;
  }>({ github: false, google: false });

  const handleOAuthSignIn = async (provider: "github" | "google") => {
    setIsLoading((prev) => ({ ...prev, [provider]: true }));
    try {
      await signIn(provider, { callbackUrl: "/" });
    } catch (error) {
      console.error(`${provider} sign-in error:`, error);
    } finally {
      setIsLoading((prev) => ({ ...prev, [provider]: false }));
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant="outline"
        onClick={() => handleOAuthSignIn("github")}
        disabled={isLoading.github || isLoading.google}
        className="flex items-center gap-2"
      >
        {isLoading.github ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Github className="h-4 w-4" />
        )}
        GitHub
      </Button>
      
      <Button
        variant="outline"
        onClick={() => handleOAuthSignIn("google")}
        disabled={isLoading.github || isLoading.google}
        className="flex items-center gap-2"
      >
        {isLoading.google ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Mail className="h-4 w-4" />
        )}
        Google
      </Button>
    </div>
  );
} 