"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { useToast } from "@/components/ui/use-toast";
import { TestOptions } from "@/components/TestOptionsHeader";

const TestConfigSettings = () => {
  const { toast } = useToast();
  const [testOptions, setTestOptions] = useState<TestOptions>({
    punctuation: false,
    numbers: false,
    time: 60,
    mode: "words"
  });

  const handleTogglePunctuation = (checked: boolean) => {
    setTestOptions(prev => ({ ...prev, punctuation: checked }));
  };

  const handleToggleNumbers = (checked: boolean) => {
    setTestOptions(prev => ({ ...prev, numbers: checked }));
  };

  const handleTimeChange = (value: string) => {
    setTestOptions(prev => ({ ...prev, time: parseInt(value, 10) }));
  };

  const handleModeChange = (mode: "words" | "quote") => {
    setTestOptions(prev => ({ ...prev, mode }));
  };

  const saveSettings = () => {
    // In a real app, you would save these settings to a database or localStorage
    localStorage.setItem('quickkey-test-options', JSON.stringify(testOptions));
    
    toast({
      title: "Settings saved",
      description: "Your test configuration has been updated.",
    });
    
    // Dispatch custom event to update test options globally
    window.dispatchEvent(
      new CustomEvent("update-test-options", { detail: testOptions })
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Test Content</h3>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="punctuation">Include Punctuation</Label>
            <p className="text-sm text-muted-foreground">
              Add punctuation marks to test texts
            </p>
          </div>
          <Switch
            id="punctuation"
            checked={testOptions.punctuation}
            onCheckedChange={handleTogglePunctuation}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="numbers">Include Numbers</Label>
            <p className="text-sm text-muted-foreground">
              Add numeric characters to test texts
            </p>
          </div>
          <Switch
            id="numbers"
            checked={testOptions.numbers}
            onCheckedChange={handleToggleNumbers}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Test Duration</h3>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="test-duration">Time Limit</Label>
          <Select value={testOptions.time.toString()} onValueChange={handleTimeChange}>
            <SelectTrigger id="test-duration">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 seconds</SelectItem>
              <SelectItem value="30">30 seconds</SelectItem>
              <SelectItem value="60">60 seconds</SelectItem>
              <SelectItem value="120">120 seconds</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Test Mode</h3>
        <div className="flex space-x-2">
          <Toggle
            pressed={testOptions.mode === "words"}
            onPressedChange={() => handleModeChange("words")}
            variant="outline"
            className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            Words
          </Toggle>
          <Toggle
            pressed={testOptions.mode === "quote"}
            onPressedChange={() => handleModeChange("quote")}
            variant="outline"
            className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            Quotes
          </Toggle>
        </div>
        <p className="text-sm text-muted-foreground">
          Choose between random words or famous quotes for your typing tests
        </p>
      </div>
      
      <Button onClick={saveSettings} className="w-full mt-6">
        Save Test Configuration
      </Button>
    </div>
  );
};

export default TestConfigSettings; 