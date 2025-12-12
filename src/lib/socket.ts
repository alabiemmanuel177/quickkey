import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || (typeof window !== 'undefined' ? window.location.origin : '');
    socket = io(socketUrl, {
      path: "/api/socketio",
      transports: ["polling", "websocket"],
      autoConnect: false,
    });
  }
  return socket;
};

export const connectSocket = (): Socket => {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
  return s;
};

export const disconnectSocket = (): void => {
  if (socket?.connected) {
    socket.disconnect();
  }
};

// Socket event types for type safety
export interface SocketEvents {
  // Client to server
  "join-room": (roomId: string) => void;
  "player-ready": (roomId: string) => void;
  "game-starting": (data: { roomId: string; countdown: number }) => void;
  "progress-update": (data: { roomId: string; progress: number; wpm: number }) => void;
  "finish": (data: { roomId: string; wpm: number; accuracy: number; finishedAt: number }) => void;
  "rematch-request": (roomId: string) => void;
  "rematch-accepted": (roomId: string) => void;

  // Server to client
  "opponent-joined": () => void;
  "opponent-left": () => void;
  "opponent-ready": () => void;
  "opponent-progress": (data: { progress: number; wpm: number }) => void;
  "opponent-finish": (data: { wpm: number; accuracy: number; finishedAt: number }) => void;
  "rematch-offer": () => void;
}
