import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import CommandLine from "@/components/CommandLine";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { SessionProvider } from "@/providers/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

// Generate dynamic metadata including OG image
export async function generateMetadata(): Promise<Metadata> {
  const title = "QuickKey: Fast, Fun Typing Practice";
  const description = "Improve your typing speed and accuracy with QuickKey's interactive typing tests.";
  
  // Base URL from environment or default for local development
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                 process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                 'http://localhost:3000';
  
  // Generate the OG image URL with encoded parameters
  const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`;
  
  return {
    title,
    description,
    keywords: "typing, practice, keyboard, speed typing, wpm, words per minute",
    authors: [{ name: "QuickKey Team" }],
    openGraph: {
      type: "website",
      title,
      description,
      siteName: "QuickKey",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: "QuickKey - Typing Practice",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <CommandLine />
            <Toaster />
            <Analytics />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
