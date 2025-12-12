import { NextRequest, NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher-server";

type EventType =
  | "player-joined"
  | "player-left"
  | "player-ready"
  | "game-starting"
  | "progress-update"
  | "player-finished"
  | "rematch-request"
  | "rematch-accepted";

interface EventPayload {
  roomId: string;
  event: EventType;
  data: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  try {
    const body: EventPayload = await request.json();
    const { roomId, event, data } = body;

    if (!roomId || !event) {
      return NextResponse.json(
        { error: "Missing roomId or event" },
        { status: 400 }
      );
    }

    // Trigger the event to all subscribers in the room channel
    await pusherServer.trigger(`room-${roomId}`, event, data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Pusher event error:", error);
    return NextResponse.json(
      { error: "Failed to trigger event" },
      { status: 500 }
    );
  }
}
