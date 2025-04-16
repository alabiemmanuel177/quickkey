"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Sun, Moon, Laptop } from "lucide-react";

const UIPreferencesSettings = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  // Only show UI after mounting to avoid hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const saveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your UI preferences have been updated.",
    });
  };
  
  if (!mounted) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Theme</h3>
        
        <RadioGroup 
          value={theme} 
          onValueChange={setTheme}
          className="grid grid-cols-3 gap-4"
        >
          <div>
            <RadioGroupItem 
              value="light" 
              id="light" 
              className="sr-only" 
            />
            <Label
              htmlFor="light"
              className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                theme === "light" ? "border-primary" : ""
              }`}
            >
              <Sun className="mb-3 h-6 w-6" />
              <span>Light</span>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem 
              value="dark" 
              id="dark" 
              className="sr-only" 
            />
            <Label
              htmlFor="dark"
              className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                theme === "dark" ? "border-primary" : ""
              }`}
            >
              <Moon className="mb-3 h-6 w-6" />
              <span>Dark</span>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem 
              value="system" 
              id="system" 
              className="sr-only" 
            />
            <Label
              htmlFor="system"
              className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                theme === "system" ? "border-primary" : ""
              }`}
            >
              <Laptop className="mb-3 h-6 w-6" />
              <span>System</span>
            </Label>
          </div>
        </RadioGroup>
        
        <p className="text-sm text-muted-foreground">
          Choose between light, dark, or system theme preference.
        </p>
      </div>
      
      <Button onClick={saveSettings} className="w-full mt-6">
        Save UI Preferences
      </Button>
    </div>
  );
};

export default UIPreferencesSettings; 