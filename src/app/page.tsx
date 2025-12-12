import TypingTest from "@/components/TypingTest";
import { Metadata } from "next";

// Generate dynamic metadata with specific OG parameters for the homepage
export async function generateMetadata(): Promise<Metadata> {
  const title = "QuickKey - Practice Typing";
  const description = "Improve your typing speed and accuracy with QuickKey's interactive typing tests";
  
  // Base URL from environment or default for local development
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                 process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                 'http://localhost:3000';
  
  // Generate the OG image URL with encoded parameters
  const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&theme=default&mode=light`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
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

export default function Home() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col items-center justify-center py-4 sm:py-6 md:py-8 gap-4 sm:gap-6">
      <div className="w-full text-center mb-2 sm:mb-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">QuickKey</h1>
        <p className="mt-1 sm:mt-2 text-base sm:text-lg md:text-xl text-muted-foreground">Improve your typing speed and accuracy</p>
      </div>

      <TypingTest />
    </div>
  );
}
