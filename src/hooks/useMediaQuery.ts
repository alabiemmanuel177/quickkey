"use client";

import { useEffect, useState } from "react";

/**
 * Custom hook to check if a media query matches
 * @param query The media query to check (e.g., "(max-width: 768px)")
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    // Set initial value on mount
    const media = window.matchMedia(query);
    setMatches(media.matches);

    // Create event listener
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add event listener
    media.addEventListener("change", listener);
    
    // Remove event listener on cleanup
    return () => {
      media.removeEventListener("change", listener);
    };
  }, [query]);
  
  return matches;
} 