"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import useSoundSettings from "@/hooks/useSoundSettings";
import { initAudioContext } from "@/lib/sound-utils";

// Sample texts for different test modes
const wordTexts = [
  "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.",
  "How vexingly quick daft zebras jump! Sphinx of black quartz, judge my vow.",
  "Amazingly few discotheques provide jukeboxes. The five boxing wizards jump quickly.",
  "We promptly judged antique ivory buckles for the next prize. Crazy Fredrick bought many very exquisite opal jewels.",
  "The job requires extra pluck and zeal from every young wage earner. Waltz, bad nymph, for quick jigs vex."
];

const quotesTexts = [
  "Life is what happens when you're busy making other plans. - John Lennon",
  "The only way to do great work is to love what you do. - Steve Jobs",
  "In the end, it's not the years in your life that count. It's the life in your years. - Abraham Lincoln",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill"
];

const punctuationTexts = [
  "Every morning, I wake up and check my email; sometimes, there's nothing important.",
  "As always, she arrived exactly on time - not a minute early, not a minute late!",
  "We need the following items: milk, eggs, bread, and butter; don't forget the coffee.",
  "The museum has three sections: modern art, classical paintings, and sculptures.",
  "Well, that's a surprise! I didn't expect to see you here; how have you been?"
];

interface MultiplayerTypingTestProps {
  testType: string;
  duration: number;
  onProgressUpdate: (idx: number, wpm: number) => void;
  onFinish: (wpm: number, accuracy: number) => void;
  disabled?: boolean;
}

const MultiplayerTypingTest: React.FC<MultiplayerTypingTestProps> = ({
  testType,
  duration,
  onProgressUpdate,
  onFinish,
  disabled = false,
}) => {
  const {
    settings: soundSettings,
    playKeyPressSound,
    playErrorSound,
    initialized: soundInitialized
  } = useSoundSettings();

  // Get text based on test type
  const getTextPool = useCallback(() => {
    switch (testType) {
      case "quotes":
        return quotesTexts;
      case "punctuation":
        return punctuationTexts;
      default:
        return wordTexts;
    }
  }, [testType]);

  const getRandomText = useCallback(() => {
    const textPool = getTextPool();
    return textPool[Math.floor(Math.random() * textPool.length)];
  }, [getTextPool]);

  const [text, setText] = useState<string>("");
  const [typedText, setTypedText] = useState<string>("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [timeRemaining, setTimeRemaining] = useState<number>(duration);
  const [testComplete, setTestComplete] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check if device is mobile
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        const isMobileDevice = window.innerWidth <= 768;
        setIsMobile(isMobileDevice);
      };

      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  // Initialize audio context
  useEffect(() => {
    if (soundInitialized && soundSettings.enabled) {
      const handleFirstInteraction = () => {
        initAudioContext();
        window.removeEventListener("keydown", handleFirstInteraction);
        window.removeEventListener("click", handleFirstInteraction);
        window.removeEventListener("touchstart", handleFirstInteraction);
      };

      window.addEventListener("keydown", handleFirstInteraction);
      window.addEventListener("click", handleFirstInteraction);
      window.addEventListener("touchstart", handleFirstInteraction);

      return () => {
        window.removeEventListener("keydown", handleFirstInteraction);
        window.removeEventListener("click", handleFirstInteraction);
        window.removeEventListener("touchstart", handleFirstInteraction);
      };
    }
  }, [soundInitialized, soundSettings.enabled]);

  // Initialize on mount
  useEffect(() => {
    setIsClient(true);
    setText(getRandomText());
    setTimeRemaining(duration);

    const focusTimer = setTimeout(() => {
      if (!disabled) {
        if (isMobile && inputRef.current) {
          inputRef.current.focus();
        } else if (containerRef.current) {
          containerRef.current.focus();
        }
        setIsFocused(true);
      }
    }, 100);

    return () => clearTimeout(focusTimer);
  }, [getRandomText, duration, isMobile, disabled]);

  // Timer for countdown
  useEffect(() => {
    if (startTime && !testComplete && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = duration - elapsed;

        if (remaining <= 0) {
          setTimeRemaining(0);
          setTestComplete(true);
          onFinish(wpm, accuracy);
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
        } else {
          setTimeRemaining(remaining);
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [startTime, testComplete, duration, timeRemaining, wpm, accuracy, onFinish]);

  // Calculate WPM and accuracy, send progress updates
  useEffect(() => {
    if (typedText.length > 0 && !startTime) {
      setStartTime(Date.now());
    }

    if (typedText.length > 0 && startTime) {
      // Calculate accuracy
      let correctCount = 0;
      for (let i = 0; i < typedText.length; i++) {
        if (i < text.length && typedText[i] === text[i]) {
          correctCount++;
        }
      }
      const newAccuracy = Math.round((correctCount / typedText.length) * 100);
      setAccuracy(newAccuracy);

      // Calculate WPM
      const elapsedMinutes = (Date.now() - startTime) / 60000;
      if (elapsedMinutes > 0) {
        const wordsTyped = correctCount / 5;
        const newWpm = Math.round(wordsTyped / elapsedMinutes);
        setWpm(newWpm);

        // Calculate progress percentage (based on characters typed)
        const progress = Math.round((typedText.length / text.length) * 100);
        onProgressUpdate(progress, newWpm);
      }
    }

    // Check for completion
    if (typedText.length === text.length && !testComplete) {
      setTestComplete(true);
      onFinish(wpm, accuracy);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [typedText, text, startTime, testComplete, wpm, accuracy, onProgressUpdate, onFinish]);

  // Handle keydown events
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (testComplete || disabled) return;

    // Prevent default browser behavior
    e.preventDefault();

    // Handle backspace
    if (e.key === "Backspace") {
      setTypedText(prev => {
        if (prev.length > 0 && soundSettings.enabled) {
          playErrorSound();
        }
        return prev.slice(0, -1);
      });
      return;
    }

    // Only add the character if it's a single printable character
    if (e.key.length === 1) {
      setTypedText(prev => {
        if (prev.length < text.length) {
          const nextIndex = prev.length;
          const isCorrect = nextIndex < text.length && e.key === text[nextIndex];

          if (soundSettings.enabled) {
            if (isCorrect) {
              playKeyPressSound();
            } else {
              playErrorSound();
            }
          }

          return prev + e.key;
        }
        return prev;
      });
    }
  }, [text, testComplete, disabled, soundSettings, playKeyPressSound, playErrorSound]);

  // Handle input change for mobile
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (testComplete || disabled) return;

    const lastChar = e.target.value.slice(-1);
    if (lastChar) {
      setTypedText(prev => {
        if (prev.length < text.length) {
          const nextIndex = prev.length;
          const isCorrect = nextIndex < text.length && lastChar === text[nextIndex];

          if (soundSettings.enabled) {
            if (isCorrect) {
              playKeyPressSound();
            } else {
              playErrorSound();
            }
          }

          return prev + lastChar;
        }
        return prev;
      });
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [text, testComplete, disabled, soundSettings, playKeyPressSound, playErrorSound]);

  // Set up event listeners
  useEffect(() => {
    if (!isClient || disabled) return;

    if (isMobile && inputRef.current) {
      inputRef.current.focus();
    } else if (containerRef.current) {
      containerRef.current.focus();
    }

    if (!isMobile) {
      const handleKeyDownWrapper = (e: KeyboardEvent) => {
        if (isFocused) {
          handleKeyDown(e);
        }
      };

      window.addEventListener("keydown", handleKeyDownWrapper);

      return () => {
        window.removeEventListener("keydown", handleKeyDownWrapper);
      };
    }
  }, [handleKeyDown, isFocused, isClient, isMobile, disabled]);

  // Render text with styling
  const renderText = () => {
    return text.split("").map((char, index) => {
      const isCurrent = index === typedText.length;

      if (index >= typedText.length) {
        return (
          <span
            key={index}
            className={cn(
              "text-muted-foreground",
              isCurrent && isClient && !disabled && "bg-primary/20 border-b-2 border-primary animate-pulse"
            )}
          >
            {char}
          </span>
        );
      }

      if (char === typedText[index]) {
        return (
          <span key={index} className="text-green-500 dark:text-green-400">
            {char}
          </span>
        );
      }

      return (
        <span key={index} className="text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-950/30">
          {char}
        </span>
      );
    });
  };

  return (
    <>
      {/* Hidden input for mobile */}
      <input
        ref={inputRef}
        type="text"
        className={cn(
          "sr-only opacity-0 h-0",
          isMobile && !disabled ? "absolute pointer-events-auto" : "hidden pointer-events-none"
        )}
        aria-label="Typing input"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
      />

      <div
        ref={containerRef}
        className={cn(
          "w-full p-4 sm:p-6 rounded-lg border border-border",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "transition-all duration-200 ease-in-out",
          "bg-background shadow-sm",
          testComplete ? "border-yellow-500" : "",
          disabled ? "opacity-50 cursor-not-allowed" : "",
          isClient && isFocused && !disabled ? "ring-2 ring-ring ring-offset-2" : "",
          "min-h-[12rem]"
        )}
        tabIndex={disabled || isMobile ? -1 : 0}
        onFocus={() => {
          if (!disabled) {
            setIsFocused(true);
            if (isMobile && inputRef.current) {
              inputRef.current.focus();
            }
          }
        }}
        onBlur={() => setIsFocused(false)}
      >
        <div className="text-base sm:text-lg leading-relaxed tracking-wide">{renderText()}</div>

        <div className="mt-4 flex flex-wrap items-center justify-between text-xs sm:text-sm text-muted-foreground gap-y-2">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <span>{typedText.length}/{text.length} chars</span>
            <span>{wpm} WPM</span>
            <span>{accuracy}% accuracy</span>
            <span className={timeRemaining < 10 ? "text-red-500 font-bold" : ""}>
              {timeRemaining}s
            </span>
          </div>

          {testComplete && (
            <span className="text-yellow-500 font-medium">Test Complete!</span>
          )}
        </div>
      </div>
    </>
  );
};

export default MultiplayerTypingTest;
