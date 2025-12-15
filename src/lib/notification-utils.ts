import { prisma } from "@/lib/prisma";

/**
 * Creates a welcome notification for a new user
 */
export async function createWelcomeNotification(userId: string) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        title: "Welcome to QuickKey!",
        message: "Thank you for joining QuickKey. Start taking typing tests to improve your speed and accuracy!",
        type: "welcome",
        read: false,
      },
    });
  } catch (error) {
    console.error("Error creating welcome notification:", error);
  }
}

/**
 * Creates a leaderboard achievement notification
 */
export async function createLeaderboardNotification(
  userId: string,
  position: number,
  wpm: number,
  testType: "words" | "quote" | "custom"
) {
  let title = "";
  let message = "";

  if (position === 1) {
    title = "🏆 First Place Achievement!";
    message = `Congratulations! You've reached #1 on the ${testType} leaderboard with ${wpm} WPM!`;
  } else if (position === 2) {
    title = "🥈 Second Place Achievement!";
    message = `Great job! You've reached #2 on the ${testType} leaderboard with ${wpm} WPM!`;
  } else if (position === 3) {
    title = "🥉 Third Place Achievement!";
    message = `Amazing! You've reached #3 on the ${testType} leaderboard with ${wpm} WPM!`;
  } else if (position <= 10) {
    title = "🌟 Top 10 Achievement!";
    message = `Impressive! You've made it to the top 10 on the ${testType} leaderboard with ${wpm} WPM!`;
  } else {
    return; // Don't create notifications for positions outside the top 10
  }

  try {
    await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type: "achievement",
        read: false,
      },
    });
  } catch (error) {
    console.error("Error creating leaderboard notification:", error);
  }
}

/**
 * Creates a personal best notification when a user beats their previous record
 */
export async function createPersonalBestNotification(
  userId: string,
  wpm: number,
  improvement: number,
  testType: "words" | "quote" | "custom"
) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        title: "🎯 New Personal Best!",
        message: `You just set a new personal best on a ${testType} test with ${wpm} WPM! That's ${improvement.toFixed(2)} WPM faster than your previous record.`,
        type: "achievement",
        read: false,
      },
    });
  } catch (error) {
    console.error("Error creating personal best notification:", error);
  }
}

/**
 * Creates a milestone notification when a user reaches a WPM milestone
 */
export async function createMilestoneNotification(userId: string, wpm: number) {
  // Define milestones
  const milestones = [50, 75, 100, 125, 150];
  
  // Find the highest milestone reached
  const milestone = milestones.filter(m => wpm >= m).pop();
  
  if (!milestone) {
    return; // No milestone reached
  }
  
  try {
    await prisma.notification.create({
      data: {
        userId,
        title: `🚀 ${milestone} WPM Club!`,
        message: `Congratulations on reaching ${milestone}+ WPM! Your dedication to improving is paying off.`,
        type: "achievement",
        read: false,
      },
    });
  } catch (error) {
    console.error("Error creating milestone notification:", error);
  }
} 