import TypingTest from "@/components/TypingTest";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "QuickKey - Practice Typing",
  description: "Improve your typing speed and accuracy with QuickKey's interactive typing tests",
};

export default function Home() {
  return (
    <div className="container max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center py-4 sm:py-6 md:py-8 gap-4 sm:gap-6">
      <div className="w-full text-center mb-2 sm:mb-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">QuickKey</h1>
        <p className="mt-1 sm:mt-2 text-base sm:text-lg md:text-xl text-muted-foreground">Improve your typing speed and accuracy</p>
      </div>
      
      <TypingTest />
    </div>
  );
}
