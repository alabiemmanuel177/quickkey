import { Server as SocketIOServer } from "socket.io";
import { NextResponse } from "next/server";

// Store for the socket.io server instance
let io: SocketIOServer | null = null;

// Room tracking
const rooms = new Map<string, Set<string>>();

export async function GET() {
  return NextResponse.json({ message: "Socket.io server endpoint" });
}

export async function POST() {
  return NextResponse.json({ message: "Socket.io server endpoint" });
}

// Initialize Socket.io server (called from custom server)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function initSocketIO(httpServer: any) {
  if (io) return io;

  io = new SocketIOServer(httpServer, {
    path: "/api/socketio",
    addTrailingSlash: false,
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "*",
      methods: ["GET", "POST"],
    },
    transports: ["polling", "websocket"],
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join-room", (roomId: string) => {
      socket.join(roomId);

      // Track room members
      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
      }
      const room = rooms.get(roomId)!;
      room.add(socket.id);

      console.log(`Socket ${socket.id} joined room ${roomId}. Room size: ${room.size}`);

      // Notify others in the room that someone joined
      socket.to(roomId).emit("opponent-joined");
    });

    socket.on("player-ready", (roomId: string) => {
      console.log(`Player ${socket.id} is ready in room ${roomId}`);
      socket.to(roomId).emit("opponent-ready");
    });

    socket.on("game-starting", (data: { roomId: string; countdown: number }) => {
      console.log(`Game starting in room ${data.roomId}, countdown: ${data.countdown}`);
      socket.to(data.roomId).emit("game-starting", data.countdown);
    });

    socket.on("progress-update", (data: { roomId: string; progress: number; wpm: number }) => {
      socket.to(data.roomId).emit("opponent-progress", { progress: data.progress, wpm: data.wpm });
    });

    socket.on("finish", (data: { roomId: string; wpm: number; accuracy: number; finishedAt: number }) => {
      console.log(`Player ${socket.id} finished in room ${data.roomId}`);
      socket.to(data.roomId).emit("opponent-finish", {
        wpm: data.wpm,
        accuracy: data.accuracy,
        finishedAt: data.finishedAt,
      });
    });

    socket.on("rematch-request", (roomId: string) => {
      console.log(`Rematch requested in room ${roomId}`);
      socket.to(roomId).emit("rematch-offer");
    });

    socket.on("rematch-accepted", (roomId: string) => {
      console.log(`Rematch accepted in room ${roomId}`);
      socket.to(roomId).emit("rematch-accepted");
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);

      // Remove from all rooms and notify opponents
      rooms.forEach((members, roomId) => {
        if (members.has(socket.id)) {
          members.delete(socket.id);
          socket.to(roomId).emit("opponent-left");

          // Clean up empty rooms
          if (members.size === 0) {
            rooms.delete(roomId);
          }
        }
      });
    });
  });

  return io;
}

export { io };
