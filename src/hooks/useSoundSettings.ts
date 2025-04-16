"use client";

import { useState, useEffect } from 'react';
import { 
  SoundSettings, 
  loadSoundSettings, 
  saveSoundSettings,
  playKeyPressSound,
  playErrorSound,
  initAudioContext,
  DEFAULT_SOUND_SETTINGS,
  KeyPressSound,
  ErrorSound
} from '@/lib/sound-utils';

export const useSoundSettings = () => {
  const [settings, setSettings] = useState<SoundSettings>(DEFAULT_SOUND_SETTINGS);
  const [initialized, setInitialized] = useState<boolean>(false);

  // Initialize settings from localStorage on component mount
  useEffect(() => {
    const loadedSettings = loadSoundSettings();
    setSettings(loadedSettings);
    setInitialized(true);
  }, []);

  // Listen for sound settings updates from other components
  useEffect(() => {
    const handleSettingsUpdate = (event: CustomEvent<SoundSettings>) => {
      setSettings(event.detail);
    };

    window.addEventListener(
      'update-sound-settings',
      handleSettingsUpdate as EventListener
    );

    return () => {
      window.removeEventListener(
        'update-sound-settings',
        handleSettingsUpdate as EventListener
      );
    };
  }, []);

  // Handle settings changes
  const updateSettings = (newSettings: Partial<SoundSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    saveSoundSettings(updatedSettings);
    
    // Initialize audio context on first interaction
    if (updatedSettings.enabled) {
      initAudioContext();
    }
  };

  // Set specific sound types
  const setKeyPressSound = (sound: KeyPressSound) => {
    updateSettings({ keyPressSound: sound });
  };

  const setErrorSound = (sound: ErrorSound) => {
    updateSettings({ errorSound: sound });
  };

  const setVolume = (volume: number) => {
    updateSettings({ volume });
  };

  const toggleSounds = (enabled: boolean) => {
    updateSettings({ enabled });
  };

  // Play sound samples for testing
  const playKeyPressSample = (specificSound?: KeyPressSound) => {
    initAudioContext();
    if (specificSound) {
      // Create temporary settings with the specific sound
      const tempSettings: SoundSettings = {
        ...settings,
        keyPressSound: specificSound,
        enabled: true // Ensure enabled
      };
      playKeyPressSound(tempSettings);
    } else {
      playKeyPressSound(settings);
    }
  };

  const playErrorSample = (specificSound?: ErrorSound) => {
    initAudioContext();
    if (specificSound) {
      // Create temporary settings with the specific sound
      const tempSettings: SoundSettings = {
        ...settings,
        errorSound: specificSound,
        enabled: true // Ensure enabled
      };
      playErrorSound(tempSettings);
    } else {
      playErrorSound(settings);
    }
  };

  return {
    settings,
    initialized,
    updateSettings,
    setKeyPressSound,
    setErrorSound,
    setVolume,
    toggleSounds,
    playKeyPressSample,
    playErrorSample,
    playKeyPressSound: () => playKeyPressSound(settings),
    playErrorSound: () => playErrorSound(settings)
  };
};

export default useSoundSettings; 