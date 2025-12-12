"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function JoinRoomForm() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinRoom = async () => {
    if (!roomId) {
      toast.error("Please enter a room code");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/multiplayer/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to join room");
      }

      router.push(`/multiplayer/room/${roomId}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to join room");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="roomId">Room Code</Label>
        <Input
          id="roomId"
          placeholder="Enter room code"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value.toUpperCase())}
          maxLength={6}
          className="text-center text-lg tracking-widest"
        />
      </div>

      <Button
        className="w-full"
        onClick={handleJoinRoom}
        disabled={isLoading}
      >
        {isLoading ? "Joining..." : "Join Room"}
      </Button>
    </div>
  );
} 