"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getPusherClient, disconnectPusher } from "@/lib/pusher-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MultiplayerTypingTest from "@/components/multiplayer/MultiplayerTypingTest";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Copy, Crown, Trophy, Users, Clock, RefreshCw } from "lucide-react";

interface GameSettings {
  testType: string;
  duration: string;
}

interface OpponentProgress {
  progress: number;
  wpm: number;
}

interface PlayerResult {
  wpm: number;
  accuracy: number;
  finishedAt: number;
}

// Generate a unique player ID for this session
const generatePlayerId = () => Math.random().toString(36).substring(2, 15);

export default function RoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [playerId] = useState(() => generatePlayerId());
  const [isHost, setIsHost] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [opponentReady, setOpponentReady] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [myProgress, setMyProgress] = useState<OpponentProgress>({ progress: 0, wpm: 0 });
  const [opponentProgress, setOpponentProgress] = useState<OpponentProgress>({ progress: 0, wpm: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<"you" | "opponent" | "draw" | null>(null);
  const [myResult, setMyResult] = useState<PlayerResult | null>(null);
  const [opponentResult, setOpponentResult] = useState<PlayerResult | null>(null);
  const [opponentConnected, setOpponentConnected] = useState(false);
  const [rematchRequested, setRematchRequested] = useState(false);
  const [opponentRequestedRematch, setOpponentRequestedRematch] = useState(false);

  const roomId = params.roomId as string;
  const settings: GameSettings = JSON.parse(searchParams.get("settings") || '{"testType":"words","duration":"60"}');
  const finishTimeRef = useRef<number | null>(null);

  // Helper function to trigger events through API
  const triggerEvent = useCallback(async (event: string, data: Record<string, unknown>) => {
    try {
      await fetch("/api/pusher/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, event, data }),
      });
    } catch (error) {
      console.error("Failed to trigger event:", error);
    }
  }, [roomId]);

  // Copy room code to clipboard
  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomId);
    toast.success("Room code copied to clipboard!");
  };

  // Initialize Pusher connection
  useEffect(() => {
    const pusher = getPusherClient();
    const roomChannel = pusher.subscribe(`room-${roomId}`);

    // Check if this is the host
    if (searchParams.get("settings")) {
      setIsHost(true);
    }

    // Notify others that we joined
    triggerEvent("player-joined", { playerId });

    // Event handlers
    roomChannel.bind("player-joined", (data: { playerId: string }) => {
      if (data.playerId !== playerId) {
        setOpponentConnected(true);
        toast.success("An opponent has joined the room!");
      }
    });

    roomChannel.bind("player-left", (data: { playerId: string }) => {
      if (data.playerId !== playerId) {
        setOpponentConnected(false);
        setOpponentReady(false);
        toast.error("Your opponent has left the room");
      }
    });

    roomChannel.bind("player-ready", (data: { playerId: string }) => {
      if (data.playerId !== playerId) {
        setOpponentReady(true);
        toast.success("Opponent is ready!");
      }
    });

    roomChannel.bind("game-starting", (data: { countdown: number }) => {
      setCountdown(data.countdown);
      if (data.countdown === 0) {
        setGameStarted(true);
        setCountdown(null);
      }
    });

    roomChannel.bind("progress-update", (data: { playerId: string; progress: number; wpm: number }) => {
      if (data.playerId !== playerId) {
        setOpponentProgress({ progress: data.progress, wpm: data.wpm });
      }
    });

    roomChannel.bind("player-finished", (data: { playerId: string; wpm: number; accuracy: number; finishedAt: number }) => {
      if (data.playerId !== playerId) {
        setOpponentResult({ wpm: data.wpm, accuracy: data.accuracy, finishedAt: data.finishedAt });
      }
    });

    roomChannel.bind("rematch-request", (data: { playerId: string }) => {
      if (data.playerId !== playerId) {
        setOpponentRequestedRematch(true);
        toast.info("Opponent wants a rematch!");
      }
    });

    roomChannel.bind("rematch-accepted", (data: { playerId: string }) => {
      if (data.playerId !== playerId) {
        resetGame();
      }
    });

    return () => {
      triggerEvent("player-left", { playerId });
      roomChannel.unbind_all();
      pusher.unsubscribe(`room-${roomId}`);
      disconnectPusher();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, playerId]);

  // Determine winner based on results
  const determineWinner = useCallback((my: PlayerResult, opponent: PlayerResult) => {
    setGameOver(true);

    // Primary comparison: WPM (higher is better)
    if (my.wpm > opponent.wpm) {
      setWinner("you");
    } else if (opponent.wpm > my.wpm) {
      setWinner("opponent");
    } else {
      // Tiebreaker: accuracy
      if (my.accuracy > opponent.accuracy) {
        setWinner("you");
      } else if (opponent.accuracy > my.accuracy) {
        setWinner("opponent");
      } else {
        // Still tied: whoever finished first
        if (my.finishedAt < opponent.finishedAt) {
          setWinner("you");
        } else if (opponent.finishedAt < my.finishedAt) {
          setWinner("opponent");
        } else {
          setWinner("draw");
        }
      }
    }
  }, []);

  // Check for winner when both results are available
  useEffect(() => {
    if (myResult && opponentResult && !gameOver) {
      determineWinner(myResult, opponentResult);
    }
  }, [myResult, opponentResult, gameOver, determineWinner]);

  // Handle ready button
  const handleReady = () => {
    setIsReady(true);
    triggerEvent("player-ready", { playerId });

    // If both players are ready, start the countdown
    if (opponentReady && isHost) {
      startCountdown();
    }
  };

  // Start game countdown (host only)
  const startCountdown = useCallback(() => {
    if (!isHost) return;

    let count = 3;
    triggerEvent("game-starting", { countdown: count });
    setCountdown(count);

    const countdownInterval = setInterval(() => {
      count--;
      triggerEvent("game-starting", { countdown: count });
      setCountdown(count);

      if (count === 0) {
        clearInterval(countdownInterval);
        setGameStarted(true);
        setCountdown(null);
      }
    }, 1000);
  }, [isHost, triggerEvent]);

  // Check if both players are ready to start
  useEffect(() => {
    if (isReady && opponentReady && isHost && !gameStarted && countdown === null) {
      startCountdown();
    }
  }, [isReady, opponentReady, isHost, gameStarted, countdown, startCountdown]);

  // Handle progress update
  const handleProgressUpdate = (progress: number, wpm: number) => {
    setMyProgress({ progress, wpm });
    triggerEvent("progress-update", { playerId, progress, wpm });
  };

  // Handle test completion
  const handleFinish = (wpm: number, accuracy: number) => {
    const finishedAt = Date.now();
    finishTimeRef.current = finishedAt;

    const result: PlayerResult = { wpm, accuracy, finishedAt };
    setMyResult(result);

    triggerEvent("player-finished", { playerId, ...result });

    // If opponent already finished, determine winner
    if (opponentResult) {
      determineWinner(result, opponentResult);
    }
  };

  // Reset game for rematch
  const resetGame = () => {
    setIsReady(false);
    setOpponentReady(false);
    setGameStarted(false);
    setCountdown(null);
    setMyProgress({ progress: 0, wpm: 0 });
    setOpponentProgress({ progress: 0, wpm: 0 });
    setGameOver(false);
    setWinner(null);
    setMyResult(null);
    setOpponentResult(null);
    setRematchRequested(false);
    setOpponentRequestedRematch(false);
    finishTimeRef.current = null;
  };

  // Handle rematch request
  const handleRematch = () => {
    if (opponentRequestedRematch) {
      // Accept rematch
      triggerEvent("rematch-accepted", { playerId });
      resetGame();
    } else {
      // Request rematch
      setRematchRequested(true);
      triggerEvent("rematch-request", { playerId });
      toast.info("Rematch request sent!");
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Multiplayer Race</h1>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-muted-foreground">Room Code:</span>
          <code className="bg-muted px-3 py-1 rounded-md font-mono text-lg">{roomId}</code>
          <Button variant="ghost" size="icon" onClick={copyRoomCode}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-muted-foreground flex items-center justify-center gap-2">
          {isHost ? (
            <>
              <Crown className="h-4 w-4 text-yellow-500" />
              You are the host
            </>
          ) : (
            <>
              <Users className="h-4 w-4" />
              Waiting for host to start
            </>
          )}
        </p>
      </div>

      {/* Countdown overlay */}
      {countdown !== null && countdown > 0 && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="text-8xl font-bold animate-pulse">{countdown}</div>
            <p className="text-xl text-muted-foreground mt-4">Get Ready!</p>
          </div>
        </div>
      )}

      {/* Pre-game lobby */}
      {!gameStarted && !gameOver && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Game Settings
            </CardTitle>
            <CardDescription>
              {isHost ? "Configure the game and wait for your opponent" : "Waiting for host to start the game"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-md p-4">
                  <p className="text-sm text-muted-foreground">Test Type</p>
                  <p className="font-medium capitalize">{settings.testType}</p>
                </div>
                <div className="bg-muted rounded-md p-4">
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{settings.duration} seconds</p>
                </div>
              </div>

              <div className="border rounded-md p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium">Players</span>
                  <span className="text-sm text-muted-foreground">
                    {opponentConnected ? "2/2" : "1/2"} joined
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm">
                        You
                      </div>
                      <span>You {isHost && "(Host)"}</span>
                    </div>
                    <span className={isReady ? "text-green-500" : "text-muted-foreground"}>
                      {isReady ? "Ready" : "Not Ready"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${opponentConnected ? "bg-secondary" : "bg-muted"}`}>
                        {opponentConnected ? "2" : "?"}
                      </div>
                      <span className={opponentConnected ? "" : "text-muted-foreground"}>
                        {opponentConnected ? "Opponent" : "Waiting for opponent..."}
                      </span>
                    </div>
                    {opponentConnected && (
                      <span className={opponentReady ? "text-green-500" : "text-muted-foreground"}>
                        {opponentReady ? "Ready" : "Not Ready"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <Button
                onClick={handleReady}
                className="w-full"
                disabled={isReady || !opponentConnected}
              >
                {!opponentConnected
                  ? "Waiting for opponent..."
                  : isReady
                  ? "Waiting for opponent to be ready..."
                  : "Ready"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Game in progress */}
      {gameStarted && !gameOver && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={myProgress.progress} className="h-3 mb-2" />
                <div className="flex justify-between text-sm">
                  <span>{myProgress.progress}%</span>
                  <span className="font-medium">{myProgress.wpm} WPM</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Opponent&apos;s Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={opponentProgress.progress} className="h-3 mb-2" />
                <div className="flex justify-between text-sm">
                  <span>{opponentProgress.progress}%</span>
                  <span className="font-medium">{opponentProgress.wpm} WPM</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <MultiplayerTypingTest
            testType={settings.testType}
            duration={parseInt(settings.duration)}
            onProgressUpdate={handleProgressUpdate}
            onFinish={handleFinish}
            disabled={myResult !== null}
          />

          {myResult && !opponentResult && (
            <Card>
              <CardContent className="py-4 text-center">
                <p className="text-muted-foreground">
                  You finished! Waiting for opponent...
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Game over results */}
      {gameOver && (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              {winner === "you" && (
                <>
                  <Trophy className="h-8 w-8 text-yellow-500" />
                  You Won!
                </>
              )}
              {winner === "opponent" && "Opponent Won"}
              {winner === "draw" && "It's a Draw!"}
            </CardTitle>
            <CardDescription>
              {winner === "you" && "Congratulations on your victory!"}
              {winner === "opponent" && "Better luck next time!"}
              {winner === "draw" && "What an evenly matched race!"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className={`p-4 rounded-lg border-2 ${winner === "you" ? "border-yellow-500 bg-yellow-500/10" : "border-border"}`}>
                <h3 className="font-semibold text-center mb-3">You</h3>
                <div className="space-y-2 text-center">
                  <div>
                    <span className="text-3xl font-bold">{myResult?.wpm || 0}</span>
                    <span className="text-muted-foreground ml-1">WPM</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {myResult?.accuracy || 0}% accuracy
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg border-2 ${winner === "opponent" ? "border-yellow-500 bg-yellow-500/10" : "border-border"}`}>
                <h3 className="font-semibold text-center mb-3">Opponent</h3>
                <div className="space-y-2 text-center">
                  <div>
                    <span className="text-3xl font-bold">{opponentResult?.wpm || 0}</span>
                    <span className="text-muted-foreground ml-1">WPM</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {opponentResult?.accuracy || 0}% accuracy
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleRematch}
                className="flex-1"
                disabled={rematchRequested && !opponentRequestedRematch}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {opponentRequestedRematch
                  ? "Accept Rematch"
                  : rematchRequested
                  ? "Waiting for opponent..."
                  : "Rematch"}
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <a href="/multiplayer">Leave Room</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
