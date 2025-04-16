"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Volume2, Volume1, VolumeX, Volume } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import useSoundSettings from "@/hooks/useSoundSettings";
import { KeyPressSound, ErrorSound } from "@/lib/sound-utils";
import { MouseEvent } from "react";

const SoundSettings = () => {
  const { toast } = useToast();
  const { 
    settings, 
    initialized,
    updateSettings, 
    playKeyPressSample, 
    playErrorSample 
  } = useSoundSettings();

  // Skip rendering until initialized to prevent hydration issues
  if (!initialized) {
    return <div className="p-8 text-center">Loading sound settings...</div>;
  }

  const handleVolumeChange = (value: number[]) => {
    updateSettings({ volume: value[0] });
  };

  const saveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your sound settings have been updated.",
    });
  };

  const getVolumeIcon = () => {
    if (settings.volume === 0 || !settings.enabled) {
      return <VolumeX className="h-4 w-4" />;
    } else if (settings.volume < 50) {
      return <Volume1 className="h-4 w-4" />;
    } else {
      return <Volume2 className="h-4 w-4" />;
    }
  };

  // Play a specific key press sound
  const playSpecificKeyPressSound = (sound: KeyPressSound) => {
    if (sound === "off") return;
    playKeyPressSample(sound);
  };

  // Play a specific error sound
  const playSpecificErrorSound = (sound: ErrorSound) => {
    if (sound === "off") return;
    playErrorSample(sound);
  };

  // Handler for button click in dropdown
  const handleKeyPressSoundClick = (
    e: MouseEvent<HTMLButtonElement>, 
    sound: KeyPressSound
  ) => {
    e.stopPropagation();
    playSpecificKeyPressSound(sound);
  };

  // Handler for button click in dropdown
  const handleErrorSoundClick = (
    e: MouseEvent<HTMLButtonElement>, 
    sound: ErrorSound
  ) => {
    e.stopPropagation();
    playSpecificErrorSound(sound);
  };

  // Sound options
  const keyPressSoundOptions: { value: KeyPressSound; label: string }[] = [
    { value: "off", label: "Off" },
    { value: "click", label: "Click" },
    { value: "beep", label: "Beep" },
    { value: "pop", label: "Pop" },
    { value: "nk creams", label: "NK Creams" },
    { value: "typewriter", label: "Typewriter" },
    { value: "osu", label: "Osu" },
    { value: "hitmaker", label: "Hitmaker" },
    { value: "pentatonic", label: "Pentatonic" }
  ];

  const errorSoundOptions: { value: ErrorSound; label: string }[] = [
    { value: "off", label: "Off" },
    { value: "damage", label: "Damage" },
    { value: "triangle", label: "Triangle" },
    { value: "square", label: "Square" },
    { value: "missed punch", label: "Missed Punch" }
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Sound System</h3>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="sound-toggle">Enable Sounds</Label>
            <p className="text-sm text-muted-foreground">
              Master switch for all sound effects
            </p>
          </div>
          <Switch
            id="sound-toggle"
            checked={settings.enabled}
            onCheckedChange={(checked) => updateSettings({ enabled: checked })}
          />
        </div>
        
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getVolumeIcon()}
              <Label htmlFor="volume-slider">Volume</Label>
            </div>
            <span className="text-sm">{settings.volume}%</span>
          </div>
          <Slider
            id="volume-slider"
            disabled={!settings.enabled}
            value={[settings.volume]}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
          />
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Key Press Sound</h3>
        <p className="text-sm text-muted-foreground">
          Sound played when you press a key correctly
        </p>
        
        <div className="flex flex-col space-y-4">
          <div className="flex flex-row items-center space-x-4">
            <div className="w-64">
              <Select
                disabled={!settings.enabled}
                value={settings.keyPressSound}
                onValueChange={(value) => updateSettings({ keyPressSound: value as KeyPressSound })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a sound" />
                </SelectTrigger>
                <SelectContent>
                  {keyPressSoundOptions.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center justify-between w-full pr-2">
                        <span>{option.label}</span>
                        {option.value !== "off" && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full"
                            onClick={(e) => handleKeyPressSoundClick(e, option.value)}
                          >
                            <Volume className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              disabled={!settings.enabled || settings.keyPressSound === "off"}
              onClick={() => playKeyPressSample()}
            >
              Test Sound
            </Button>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Error Sound</h3>
        <p className="text-sm text-muted-foreground">
          Sound played when you make a typing error
        </p>
        
        <div className="flex flex-col space-y-4">
          <div className="flex flex-row items-center space-x-4">
            <div className="w-64">
              <Select
                disabled={!settings.enabled}
                value={settings.errorSound}
                onValueChange={(value) => updateSettings({ errorSound: value as ErrorSound })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a sound" />
                </SelectTrigger>
                <SelectContent>
                  {errorSoundOptions.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center justify-between w-full pr-2">
                        <span>{option.label}</span>
                        {option.value !== "off" && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full"
                            onClick={(e) => handleErrorSoundClick(e, option.value)}
                          >
                            <Volume className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              disabled={!settings.enabled || settings.errorSound === "off"}
              onClick={() => playErrorSample()}
            >
              Test Sound
            </Button>
          </div>
        </div>
      </div>
      
      <Button onClick={saveSettings} className="w-full mt-6">
        Save Sound Settings
      </Button>
    </div>
  );
};

export default SoundSettings; 