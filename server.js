const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server: SocketIOServer } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Room tracking
const rooms = new Map();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Initialize Socket.io
  const io = new SocketIOServer(httpServer, {
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

    socket.on("join-room", (roomId) => {
      socket.join(roomId);

      // Track room members
      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
      }
      const room = rooms.get(roomId);
      room.add(socket.id);

      console.log(`Socket ${socket.id} joined room ${roomId}. Room size: ${room.size}`);

      // Notify others in the room that someone joined
      socket.to(roomId).emit("opponent-joined");
    });

    socket.on("player-ready", (roomId) => {
      console.log(`Player ${socket.id} is ready in room ${roomId}`);
      socket.to(roomId).emit("opponent-ready");
    });

    socket.on("game-starting", (data) => {
      console.log(`Game starting in room ${data.roomId}, countdown: ${data.countdown}`);
      socket.to(data.roomId).emit("game-starting", data.countdown);
    });

    socket.on("progress-update", (data) => {
      socket.to(data.roomId).emit("opponent-progress", { progress: data.progress, wpm: data.wpm });
    });

    socket.on("finish", (data) => {
      console.log(`Player ${socket.id} finished in room ${data.roomId}`);
      socket.to(data.roomId).emit("opponent-finish", {
        wpm: data.wpm,
        accuracy: data.accuracy,
        finishedAt: data.finishedAt,
      });
    });

    socket.on("rematch-request", (roomId) => {
      console.log(`Rematch requested in room ${roomId}`);
      socket.to(roomId).emit("rematch-offer");
    });

    socket.on("rematch-accepted", (roomId) => {
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

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> Socket.io server running on /api/socketio`);
  });
});
