import { Metadata } from "next";
import SettingsPage from "@/components/settings/SettingsPage";

export const metadata: Metadata = {
  title: "QuickKey - Settings",
  description: "Customize your QuickKey experience with personalized settings and preferences.",
};

export default function Settings() {
  return (
    <div className="container py-8 mx-auto">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="mt-2 text-muted-foreground">
            Customize your typing experience and preferences
          </p>
        </div>
        
        <SettingsPage />
      </div>
    </div>
  );
} 