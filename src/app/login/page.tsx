import { redirect } from "next/navigation";

// Redirect to Clerk-powered auth page
export default function LoginPage() {
  redirect("/auth");
}
