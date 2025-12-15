import { Metadata } from "next";
import { auth, currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

export const metadata: Metadata = {
  title: "QuickKey - Profile",
  description: "View and manage your QuickKey profile and typing statistics",
};

export default async function ProfilePage() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    redirect("/auth");
  }

  // Get Clerk user info
  const clerkUser = await currentUser();

  // Get user with typing results from our database
  let user = await prisma.user.findUnique({
    where: {
      clerkId,
    },
    include: {
      typingResults: {
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      },
    },
  });

  // Create user if doesn't exist
  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId,
        email: clerkUser?.primaryEmailAddress?.emailAddress,
        name: clerkUser?.fullName || clerkUser?.firstName,
        image: clerkUser?.imageUrl,
      },
      include: {
        typingResults: {
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
      },
    });
  }

  // Calculate average metrics
  const averageWpm = user.typingResults.length
    ? user.typingResults.reduce((sum, result) => sum + result.wpm, 0) / user.typingResults.length
    : 0;

  const averageAccuracy = user.typingResults.length
    ? user.typingResults.reduce((sum, result) => sum + result.accuracy, 0) / user.typingResults.length
    : 0;

  const displayName = clerkUser?.fullName || clerkUser?.firstName || user.name || "User";
  const displayEmail = clerkUser?.primaryEmailAddress?.emailAddress || user.email;
  const displayImage = clerkUser?.imageUrl || user.image;

  return (
    <div className="container py-10 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full">
        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-4">
              {displayImage ? (
                <Image
                  src={displayImage}
                  alt={displayName}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-2xl font-bold">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="text-center">
                <h2 className="text-xl font-semibold">{displayName}</h2>
                <p className="text-sm text-muted-foreground">{displayEmail}</p>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-sm text-muted-foreground">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>

            <SignOutButton>
              <Button className="w-full" variant="outline">
                Sign Out
              </Button>
            </SignOutButton>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Typing Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <p className="text-sm font-medium text-muted-foreground">Average WPM</p>
                <p className="text-3xl font-bold">{averageWpm.toFixed(1)}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <p className="text-sm font-medium text-muted-foreground">Average Accuracy</p>
                <p className="text-3xl font-bold">{averageAccuracy.toFixed(1)}%</p>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-4">Recent Tests</h3>
            {user.typingResults.length > 0 ? (
              <div className="space-y-4">
                {user.typingResults.map((result) => (
                  <div
                    key={result.id}
                    className="flex justify-between items-center p-3 border rounded-md"
                  >
                    <div>
                      <p className="font-medium">{result.testType} Test</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(result.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">WPM</p>
                        <p className="font-medium">{result.wpm.toFixed(1)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Accuracy</p>
                        <p className="font-medium">{result.accuracy.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No typing tests completed yet.</p>
                <Button className="mt-4" asChild>
                  <Link href="/">Take a Test</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
