import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Mark a notification as read
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Check authentication status
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    
    if (notification.userId !== session.user.id) {
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
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Check authentication status
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    
    if (notification.userId !== session.user.id) {
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