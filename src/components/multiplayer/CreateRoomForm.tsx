"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function CreateRoomForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    testType: "words",
    duration: "60",
  });

  const handleCreateRoom = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/multiplayer/create", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to create room");
      }

      const data = await response.json();
      router.push(`/multiplayer/room/${data.roomId}?settings=${JSON.stringify(settings)}`);
    } catch {
      toast.error("Failed to create room. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="testType">Test Type</Label>
        <Select
          value={settings.testType}
          onValueChange={(value) => setSettings({ ...settings, testType: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select test type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="words">Words</SelectItem>
            <SelectItem value="quotes">Quotes</SelectItem>
            <SelectItem value="punctuation">Punctuation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Duration (seconds)</Label>
        <Select
          value={settings.duration}
          onValueChange={(value) => setSettings({ ...settings, duration: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">30 seconds</SelectItem>
            <SelectItem value="60">60 seconds</SelectItem>
            <SelectItem value="120">120 seconds</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        className="w-full"
        onClick={handleCreateRoom}
        disabled={isLoading}
      >
        {isLoading ? "Creating..." : "Create Room"}
      </Button>
    </div>
  );
} 