import PusherClient from "pusher-js";

let pusherClient: PusherClient | null = null;

export const getPusherClient = (): PusherClient => {
  if (!pusherClient) {
    pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });
  }
  return pusherClient;
};

export const disconnectPusher = (): void => {
  if (pusherClient) {
    pusherClient.disconnect();
    pusherClient = null;
  }
};

// Event types for type safety
export interface PusherEvents {
  "player-joined": { odisplayId: string };
  "player-left": { odisplayId: string };
  "player-ready": { playerId: string };
  "game-starting": { countdown: number };
  "progress-update": { playerId: string; progress: number; wpm: number };
  "player-finished": { playerId: string; wpm: number; accuracy: number; finishedAt: number };
  "rematch-request": { playerId: string };
  "rematch-accepted": { playerId: string };
}
