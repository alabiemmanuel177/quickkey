import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About QuickKey | Fast, Fun Typing Practice",
  description: "Learn about QuickKey's features, technology and customization options.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 