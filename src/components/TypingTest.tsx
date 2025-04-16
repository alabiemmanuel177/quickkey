"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import TestOptionsHeader, { TestOptions } from "./TestOptionsHeader";
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

// Text with punctuation and numbers
const textWithPunctuationAndNumbers = [
  "User94 added $5,000 to their account on 12/25/2023, bringing their total to $12,345.67!",
  "Meet me at 9:30 AM on June 7th, 2024; bring your ID #12345 and the $50.00 registration fee.",
  "The year is 2025, and we've achieved 300% growth in 42 countries across 7 continents!",
  "In 2023-2024, a total of 1,234 students scored 98.5% or higher on the exam #5678.",
  "Room 101, Building 3 - Please arrive at 08:15 with forms A-12 & B-34 completed."
];

// Text with just punctuation 
const textWithPunctuation = [
  "Every morning, I wake up and check my email; sometimes, there's nothing important.",
  "As always, she arrived exactly on time – not a minute early, not a minute late!",
  "We need the following items: milk, eggs, bread, and butter; don't forget the coffee.",
  "The museum has three sections: modern art, classical paintings, and sculptures.",
  "Well, that's a surprise! I didn't expect to see you here; how have you been?"
];

// Text with just numbers
const textWithNumbers = [
  "The combination to the safe is 32 46 18 and the backup code is 9462.",
  "I need 5 apples, 3 oranges, 12 bananas, and 8 strawberries for the recipe.",
  "The race times were 10.31, 10.28, 10.54, and 10.97 seconds for the 100 meter dash.",
  "My phone number changed from 555 123 4567 to 555 987 6543 last month.",
  "There are 24 hours in a day, 60 minutes in an hour, and 60 seconds in a minute."
];

const TypingTest: React.FC = () => {
  const [testOptions, setTestOptions] = useState<TestOptions>({
    punctuation: false,
    numbers: false,
    time: 60,
    mode: "words"
  });
  
  // Get sound settings hook
  const { 
    settings: soundSettings, 
    playKeyPressSound, 
    playErrorSound,
    initialized: soundInitialized 
  } = useSoundSettings();
  
  // Get text based on current options
  const getTextPool = useCallback(() => {
    if (testOptions.mode === "quote") {
      return quotesTexts;
    }
    
    if (testOptions.punctuation && testOptions.numbers) {
      return textWithPunctuationAndNumbers;
    }
    
    if (testOptions.punctuation) {
      return textWithPunctuation;
    }
    
    if (testOptions.numbers) {
      return textWithNumbers;
    }
    
    return wordTexts;
  }, [testOptions.mode, testOptions.punctuation, testOptions.numbers]);

  // Get a random text from the pool
  const getRandomText = useCallback(() => {
    const textPool = getTextPool();
    return textPool[Math.floor(Math.random() * textPool.length)];
  }, [getTextPool]);
  
  // Start with a fixed initial text to avoid hydration mismatch
  const [text, setText] = useState<string>(wordTexts[0]);
  const [typedText, setTypedText] = useState<string>("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [testComplete, setTestComplete] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [restartFeedback, setRestartFeedback] = useState<boolean>(false);

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

  // Initialize audio context when the component mounts
  useEffect(() => {
    if (soundInitialized && soundSettings.enabled) {
      // Initialize audio context on first user interaction
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

  // Handle option changes
  const handleOptionsChange = (newOptions: TestOptions) => {
    setTestOptions(newOptions);
    restartTest();
  };

  // Focus input or container based on device type
  useEffect(() => {
    setIsClient(true);
    setText(getRandomText());
    
    // Short delay to ensure focus works after hydration
    const focusTimer = setTimeout(() => {
      if (isMobile && inputRef.current) {
        inputRef.current.focus();
      } else if (containerRef.current) {
        containerRef.current.focus();
      }
      setIsFocused(true);
    }, 100);
    
    return () => clearTimeout(focusTimer);
  }, [getRandomText, isMobile]);

  // Timer for countdown
  useEffect(() => {
    if (startTime && !testComplete && timeRemaining !== null) {
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = testOptions.time - elapsed;
        
        if (remaining <= 0) {
          setTimeRemaining(0);
          setTestComplete(true);
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
  }, [startTime, testComplete, testOptions.time, timeRemaining]);

  // Calculate WPM and accuracy
  useEffect(() => {
    if (typedText.length > 0 && !startTime) {
      setStartTime(Date.now());
      setTimeRemaining(testOptions.time);
    }

    if (typedText.length > 0 && startTime) {
      // Calculate accuracy
      let correctChars = 0;
      for (let i = 0; i < typedText.length; i++) {
        if (i < text.length && typedText[i] === text[i]) {
          correctChars++;
        }
      }
      const newAccuracy = Math.round((correctChars / typedText.length) * 100);
      setAccuracy(newAccuracy);

      // Calculate WPM - standard is 5 characters per word
      const elapsedMinutes = (Date.now() - startTime) / 60000;
      if (elapsedMinutes > 0) {
        const wordsTyped = correctChars / 5;
        const newWpm = Math.round(wordsTyped / elapsedMinutes);
        setWpm(newWpm);
      }
    }

    // Test completion
    if (typedText.length === text.length && !testComplete) {
      setTestComplete(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [typedText, text, startTime, testComplete, testOptions.time]);

  // Restart the test and show visual feedback
  const restartTest = useCallback(() => {
    setTypedText("");
    setText(getRandomText());
    setStartTime(null);
    setWpm(null);
    setAccuracy(null);
    setTimeRemaining(null);
    setTestComplete(false);
    
    // Show restart feedback animation
    setRestartFeedback(true);
    setTimeout(() => setRestartFeedback(false), 300);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Focus the appropriate element based on device
    setTimeout(() => {
      if (isMobile && inputRef.current) {
        inputRef.current.focus();
      } else if (containerRef.current) {
        containerRef.current.focus();
      }
    }, 100);
  }, [getRandomText, isMobile]);

  // Listen for custom restart event from Command Line
  useEffect(() => {
    const handleRestartEvent = () => {
      restartTest();
    };

    window.addEventListener("restart-typing-test", handleRestartEvent);
    return () => {
      window.removeEventListener("restart-typing-test", handleRestartEvent);
    };
  }, [restartTest]);

  // Handle keydown events
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (testComplete) return;
    
    // Prevent default browser behavior for most keystrokes
    if (e.key !== "Tab") {
      e.preventDefault();
    }

    // Handle restart shortcut (Tab + Enter)
    if (e.key === "Enter" && e.getModifierState("Tab")) {
      e.preventDefault(); // Prevent default for this combination
      restartTest();
      return;
    }

    if (e.key === "Tab") {
      // We don't prevent default here to allow Tab to be a part of our shortcut
      return;
    }

    // Handle backspace
    if (e.key === "Backspace") {
      setTypedText(prev => {
        // Only play error sound if there's text to delete
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
        // Only allow typing up to the length of the test text
        if (prev.length < text.length) {
          const nextIndex = prev.length;
          const isCorrect = nextIndex < text.length && e.key === text[nextIndex];
          
          // Play appropriate sound based on correctness
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
  }, [text, restartTest, testComplete, soundSettings, playKeyPressSound, playErrorSound]);

  // Handle input change for mobile
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (testComplete) return;
    
    const lastChar = e.target.value.slice(-1);
    if (lastChar) {
      setTypedText(prev => {
        // Only allow typing up to the length of the test text
        if (prev.length < text.length) {
          const nextIndex = prev.length;
          const isCorrect = nextIndex < text.length && lastChar === text[nextIndex];
          
          // Play appropriate sound based on correctness
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
    
    // Always clear the input field to only capture the latest character
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [text, testComplete, soundSettings, playKeyPressSound, playErrorSound]);

  // Set up and clean up event listeners
  useEffect(() => {
    if (!isClient) return;
    
    // Try to focus the right element
    if (isMobile && inputRef.current) {
      inputRef.current.focus();
    } else if (containerRef.current) {
      containerRef.current.focus();
    }

    // Only use keyboard event listener for non-mobile
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
  }, [handleKeyDown, isFocused, isClient, isMobile]);

  // Generate character spans with appropriate styling based on typing status
  const renderText = () => {
    return text.split("").map((char, index) => {
      // Current position (next character to type)
      const isCurrent = index === typedText.length;
      
      // Not typed yet
      if (index >= typedText.length) {
        return (
          <span 
            key={index} 
            className={cn(
              "text-muted-foreground",
              isCurrent && isClient && "bg-primary/20 border-b-2 border-primary animate-pulse"
            )}
          >
            {char}
          </span>
        );
      }
      
      // Correctly typed
      if (char === typedText[index]) {
        return (
          <span key={index} className="text-green-500 dark:text-green-400">
            {char}
          </span>
        );
      }
      
      // Incorrectly typed
      return (
        <span key={index} className="text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-950/30">
          {char}
        </span>
      );
    });
  };

  return (
    <>
      <TestOptionsHeader options={testOptions} onChange={handleOptionsChange} />
      
      {/* Hidden input for mobile keyboards */}
      <input
        ref={inputRef}
        type="text"
        className={cn(
          "sr-only opacity-0 h-0",
          isMobile ? "absolute pointer-events-auto" : "hidden pointer-events-none"
        )}
        aria-label="Typing input"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      
      <div 
        ref={containerRef}
        className={cn(
          "w-full max-w-full p-4 sm:p-6 md:p-8 rounded-lg border border-border",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "transition-all duration-200 ease-in-out",
          "bg-background shadow-sm",
          testComplete ? "border-yellow-500" : "",
          restartFeedback ? "bg-secondary/30 scale-[0.98]" : "",
          isClient && isFocused ? "ring-2 ring-ring ring-offset-2" : "",
          isMobile ? "h-[calc(60vh-6rem)]" : "min-h-[16rem]"
        )}
        tabIndex={isMobile ? -1 : 0}
        onFocus={() => {
          setIsFocused(true);
          if (isMobile && inputRef.current) {
            inputRef.current.focus();
          }
        }}
        onBlur={() => setIsFocused(false)}
      >
        <div className="text-base sm:text-lg md:text-xl leading-relaxed tracking-wide">{renderText()}</div>
        
        <div className="mt-4 sm:mt-6 md:mt-8 flex flex-wrap items-center justify-between text-xs sm:text-sm text-muted-foreground gap-y-2">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <span>
              {typedText.length}/{text.length} characters
            </span>
            {wpm !== null && (
              <span>
                {wpm} WPM
              </span>
            )}
            {accuracy !== null && (
              <span>
                {accuracy}% accuracy
              </span>
            )}
            {timeRemaining !== null && (
              <span className={timeRemaining < 10 ? "text-red-500 font-bold" : ""}>
                {timeRemaining}s remaining
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {testComplete ? (
              <Button size="sm" onClick={() => restartTest()}>
                Try Again
              </Button>
            ) : (
              <div className="text-xs sm:text-sm italic hidden sm:block">
                Press <kbd className="px-1 sm:px-2 py-0.5 sm:py-1 bg-muted rounded text-xs">Tab</kbd> + <kbd className="px-1 sm:px-2 py-0.5 sm:py-1 bg-muted rounded text-xs">Enter</kbd> to restart
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TypingTest; 