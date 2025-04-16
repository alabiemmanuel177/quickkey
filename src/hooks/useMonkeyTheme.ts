"use client";

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export interface MonkeyTheme {
  id: string;
  name: string;
  path: string;
}

export function useMonkeyTheme() {
  const { setTheme, theme } = useTheme();
  const [monkeyThemes, setMonkeyThemes] = useState<MonkeyTheme[]>([]);
  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [externalStylesheet, setExternalStylesheet] = useState<HTMLLinkElement | null>(null);

  // Load theme manifest on initial render
  useEffect(() => {
    async function loadThemeManifest() {
      try {
        const response = await fetch('/themes/theme-manifest.json');
        if (!response.ok) {
          throw new Error('Failed to load theme manifest');
        }
        const data = await response.json();
        setMonkeyThemes(data.themes);
      } catch (error) {
        console.error('Error loading theme manifest:', error);
      } finally {
        setLoading(false);
      }
    }

    loadThemeManifest();
  }, []);

  // Initialize from localStorage or set default theme
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('monkey-theme');
      if (savedTheme) {
        setActiveTheme(savedTheme);
      }
    }
  }, []);

  // Apply external theme when activeTheme changes
  useEffect(() => {
    if (!activeTheme) return;

    // First, make sure we're using the system theme from next-themes
    // This will ensure good base styles
    setTheme('system');

    // Find the theme from our list
    const themeToApply = monkeyThemes.find(t => t.id === activeTheme);
    if (!themeToApply) return;

    // Create or update the external stylesheet link
    if (!externalStylesheet) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.id = 'monkey-theme-stylesheet';
      document.head.appendChild(link);
      setExternalStylesheet(link);
    }

    if (externalStylesheet) {
      externalStylesheet.href = themeToApply.path;
    }

    // Save the selected theme in localStorage
    localStorage.setItem('monkey-theme', activeTheme);
  }, [activeTheme, externalStylesheet, monkeyThemes, setTheme]);

  // Clean up the stylesheet on unmount
  useEffect(() => {
    return () => {
      if (externalStylesheet) {
        document.head.removeChild(externalStylesheet);
      }
    };
  }, [externalStylesheet]);

  // Function to change the active theme
  const changeTheme = (themeId: string) => {
    setActiveTheme(themeId);
  };

  // Function to remove external theme and revert to next-themes
  const removeExternalTheme = () => {
    if (externalStylesheet) {
      document.head.removeChild(externalStylesheet);
      setExternalStylesheet(null);
    }
    localStorage.removeItem('monkey-theme');
    setActiveTheme(null);
    setTheme('system'); // Or any default theme you want
  };

  return {
    monkeyThemes,
    activeTheme,
    loading,
    changeTheme,
    removeExternalTheme,
    builtInTheme: theme
  };
} 