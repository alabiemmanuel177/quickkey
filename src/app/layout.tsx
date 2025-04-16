import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import CommandLine from "@/components/CommandLine";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuickKey: Fast, Fun Typing Practice",
  description: "Improve your typing speed and accuracy with QuickKey's interactive typing tests.",
  keywords: "typing, practice, keyboard, speed typing, wpm, words per minute",
  authors: [{ name: "QuickKey Team" }],
  openGraph: {
    type: "website",
    title: "QuickKey: Fast, Fun Typing Practice",
    description: "Improve your typing speed and accuracy with interactive typing tests",
    siteName: "QuickKey",
  },
};

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
      </body>
    </html>
  );
}
