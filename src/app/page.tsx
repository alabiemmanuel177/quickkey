import TypingTest from "@/components/TypingTest";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "QuickKey - Practice Typing",
  description: "Improve your typing speed and accuracy with QuickKey's interactive typing tests",
};

export default function Home() {
  return (
    <div className="container flex flex-col items-center justify-center py-8 gap-6 mx-auto">
      <div className="max-w-3xl w-full text-center mb-4">
        <h1 className="text-4xl font-bold tracking-tight">QuickKey</h1>
        <p className="mt-2 text-xl text-muted-foreground">Improve your typing speed and accuracy</p>
      </div>
      
      <TypingTest />
    </div>
  );
}
