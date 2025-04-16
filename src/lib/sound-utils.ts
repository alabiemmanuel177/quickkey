"use client";

// Type definitions for sound options
export type KeyPressSound = 
  | "off" 
  | "click" 
  | "beep" 
  | "pop" 
  | "nk creams" 
  | "typewriter" 
  | "osu" 
  | "hitmaker" 
  | "pentatonic";

export type ErrorSound = 
  | "off" 
  | "damage" 
  | "triangle" 
  | "square" 
  | "missed punch";

export interface SoundSettings {
  keyPressSound: KeyPressSound;
  errorSound: ErrorSound;
  volume: number;
  enabled: boolean;
}

// Default sound settings
export const DEFAULT_SOUND_SETTINGS: SoundSettings = {
  keyPressSound: "click",
  errorSound: "damage",
  volume: 50,
  enabled: true
};

// Map of sounds to their file paths - updated to match Monkeytype structure
const SOUND_FILES: Record<string, string> = {
  // KeyPress sounds
  "click": "/sounds/keypress/click.mp3",
  "beep": "/sounds/keypress/beep.mp3",
  "pop": "/sounds/keypress/pop.mp3",
  "nk creams": "/sounds/keypress/nk-creams.mp3",
  "typewriter": "/sounds/keypress/typewriter.mp3",
  "osu": "/sounds/keypress/osu.mp3",
  "hitmaker": "/sounds/keypress/hitmaker.mp3",
  "pentatonic": "/sounds/keypress/pentatonic.mp3",
  
  // Error sounds
  "damage": "/sounds/error/damage.mp3",
  "triangle": "/sounds/error/triangle.mp3",
  "square": "/sounds/error/square.mp3",
  "missed punch": "/sounds/error/missed-punch.mp3",
};

// Lists of synthesized sounds - modified to remove synth sounds that are now file-based
export const SYNTH_KEY_SOUNDS: KeyPressSound[] = [];
export const SYNTH_ERROR_SOUNDS: ErrorSound[] = [];

// WebAudio context for synthesized sounds
let audioContext: AudioContext | null = null;

// Cache for loaded audio
const audioCache: Record<string, HTMLAudioElement> = {};

/**
 * Initialize the Audio Context
 * This needs to be called after a user interaction due to browser policies
 */
export const initAudioContext = () => {
  if (!audioContext && typeof window !== 'undefined') {
    // Use proper type for WebAudioAPI
    audioContext = new (window.AudioContext || 
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
};

/**
 * Play a key press sound based on the current settings
 */
export const playKeyPressSound = (settings: SoundSettings) => {
  if (!settings.enabled || settings.keyPressSound === "off" || settings.volume === 0) {
    return;
  }

  // All sounds are now file-based
  const soundPath = SOUND_FILES[settings.keyPressSound];
  if (soundPath) {
    playSound(soundPath, settings.volume);
  }
};

/**
 * Play an error sound based on the current settings
 */
export const playErrorSound = (settings: SoundSettings) => {
  if (!settings.enabled || settings.errorSound === "off" || settings.volume === 0) {
    return;
  }

  // All sounds are now file-based
  const soundPath = SOUND_FILES[settings.errorSound];
  if (soundPath) {
    playSound(soundPath, settings.volume);
  }
};

/**
 * Load and play a sound file
 */
const playSound = (soundPath: string, volume: number) => {
  try {
    // Try to use cached audio element if available
    let audio = audioCache[soundPath];
    
    if (!audio) {
      audio = new Audio(soundPath);
      // Store in cache to avoid creating too many Audio objects
      audioCache[soundPath] = audio;
    }
    
    // Reset audio to start
    audio.currentTime = 0;
    audio.volume = volume / 100;
    
    // Play the sound
    const playPromise = audio.play();
    if (playPromise) {
      playPromise.catch(error => {
        console.error("Error playing sound:", error);
      });
    }
  } catch (error) {
    console.error("Error with audio playback:", error);
  }
};

/**
 * Load sound settings from localStorage or use defaults
 */
export const loadSoundSettings = (): SoundSettings => {
  if (typeof window === 'undefined') {
    return DEFAULT_SOUND_SETTINGS;
  }
  
  try {
    const stored = localStorage.getItem('quickkey-sound-settings');
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        keyPressSound: parsed.keyPressSound || DEFAULT_SOUND_SETTINGS.keyPressSound,
        errorSound: parsed.errorSound || DEFAULT_SOUND_SETTINGS.errorSound,
        volume: parsed.volume !== undefined ? parsed.volume : DEFAULT_SOUND_SETTINGS.volume,
        enabled: parsed.enabled !== undefined ? parsed.enabled : DEFAULT_SOUND_SETTINGS.enabled
      };
    }
  } catch (error) {
    console.error("Error loading sound settings:", error);
  }
  
  return DEFAULT_SOUND_SETTINGS;
};

/**
 * Save sound settings to localStorage
 */
export const saveSoundSettings = (settings: SoundSettings): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('quickkey-sound-settings', JSON.stringify(settings));
    
    // Dispatch an event to notify other components
    window.dispatchEvent(
      new CustomEvent("update-sound-settings", { detail: settings })
    );
  } catch (error) {
    console.error("Error saving sound settings:", error);
  }
}; 