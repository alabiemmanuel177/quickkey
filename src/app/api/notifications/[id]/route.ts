import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// Mark a notification as read
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check authentication status
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find the notification
    const notification = await prisma.notification.findUnique({
      where: { id },
      select: { id: true, userId: true, read: true },
    });

    // Check if notification exists and belongs to the user
    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    if (notification.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to update this notification' },
        { status: 403 }
      );
    }

    // If already read, return early
    if (notification.read) {
      return NextResponse.json({ message: 'Notification already marked as read' });
    }

    // Update the notification
    const updated = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    return NextResponse.json({
      message: 'Notification marked as read',
      notification: updated,
    });

  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'Something went wrong while updating the notification' },
      { status: 500 }
    );
  }
}

// Delete a notification
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check authentication status
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find the notification
    const notification = await prisma.notification.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });

    // Check if notification exists and belongs to the user
    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    if (notification.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this notification' },
        { status: 403 }
      );
    }

    // Delete the notification
    await prisma.notification.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Notification deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { error: 'Something went wrong while deleting the notification' },
      { status: 500 }
    );
  }
}
