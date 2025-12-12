import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function POST() {
  try {
    const roomId = nanoid(6); // Generate a 6-character room ID
    
    // Create a new room in the database
    await prisma.multiplayerRoom.create({
      data: {
        id: roomId,
        status: "waiting",
        createdAt: new Date(),
      },
    });

    return NextResponse.json({ roomId });
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 }
    );
  }
} 