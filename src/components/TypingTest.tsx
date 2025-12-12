"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { SimpleButton } from "@/components/ui/simple-button";
import { useToast } from "@/components/ui/use-toast";
import TestOptionsHeader, { TestOptions } from "./TestOptionsHeader";
import useSoundSettings from "@/hooks/useSoundSettings";
import { initAudioContext } from "@/lib/sound-utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle, AlertCircle, BarChart2, RefreshCcw, LogIn } from "lucide-react";
import Link from "next/link";

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

// Sample texts - modify word texts with different lengths for different time settings
const shortWordTexts = [
  "The quick brown fox jumps over the lazy dog.",
  "How vexingly quick daft zebras jump!",
  "Amazingly few discotheques provide jukeboxes.",
  "Sphinx of black quartz, judge my vow.",
  "Crazy Fredrick bought many very exquisite opal jewels."
];

const mediumWordTexts = [
  "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.",
  "How vexingly quick daft zebras jump! Sphinx of black quartz, judge my vow.",
  "Amazingly few discotheques provide jukeboxes. The five boxing wizards jump quickly.",
  "We promptly judged antique ivory buckles for the next prize. Crazy Fredrick bought many very exquisite opal jewels.",
  "The job requires extra pluck and zeal from every young wage earner. Waltz, bad nymph, for quick jigs vex."
];

const longWordTexts = [
  "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump! Sphinx of black quartz, judge my vow.",
  "Amazingly few discotheques provide jukeboxes. The five boxing wizards jump quickly. We promptly judged antique ivory buckles for the next prize.",
  "Crazy Fredrick bought many very exquisite opal jewels. The job requires extra pluck and zeal from every young wage earner. Waltz, bad nymph, for quick jigs vex.",
  "The five boxing wizards jump quickly over the lazy dog. How vexingly quick daft zebras jump! Sphinx of black quartz, judge my vow and pack my box with five dozen liquor jugs.",
  "A mad boxer shot a quick, gloved jab to the jaw of his dizzy opponent. Five or six big jet planes zoomed quickly by the new tower. My faxed joke won a pager in the cable TV quiz show."
];

// Short quotes
const shortQuotesTexts = [
  "Life is what happens when you're busy making other plans. - John Lennon",
  "The only way to do great work is to love what you do. - Steve Jobs",
  "In the end, it's the life in your years that count. - Abraham Lincoln",
  "The future belongs to those who believe in their dreams. - Eleanor Roosevelt",
  "Success is not final, failure is not fatal. - Winston Churchill"
];

// Medium quotes
const mediumQuotesTexts = quotesTexts;

// Long quotes
const longQuotesTexts = [
  "Life is what happens when you're busy making other plans. Yesterday is history, tomorrow is a mystery, but today is a gift. That is why it is called the present. - John Lennon",
  "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle. As with all matters of the heart, you'll know when you find it. - Steve Jobs",
  "In the end, it's not the years in your life that count. It's the life in your years. Nearly all men can stand adversity, but if you want to test a man's character, give him power. - Abraham Lincoln",
  "The future belongs to those who believe in the beauty of their dreams. No one can make you feel inferior without your consent. Do what you feel in your heart to be right. - Eleanor Roosevelt",
  "Success is not final, failure is not fatal: It is the courage to continue that counts. You have enemies? Good. That means you've stood up for something, sometime in your life. - Winston Churchill"
];

// Short punctuation texts
const shortPunctuationTexts = [
  "Every morning, I wake up and check my email.",
  "As always, she arrived exactly on time!",
  "We need the following items: milk, eggs, bread.",
  "The museum has three sections to explore.",
  "Well, that's a surprise! How have you been?"
];

// Medium punctuation texts
const mediumPunctuationTexts = textWithPunctuation;

// Long punctuation texts
const longPunctuationTexts = [
  "Every morning, I wake up and check my email; sometimes, there's nothing important, but other times, I find messages that need immediate attention!",
  "As always, she arrived exactly on time – not a minute early, not a minute late! Her punctuality was something everyone admired; it was almost legendary.",
  "We need the following items: milk, eggs, bread, and butter; don't forget the coffee, tea, sugar, and flour; also, remember to pick up some fresh fruit and vegetables.",
  "The museum has three sections: modern art, classical paintings, and sculptures; each section has its own unique atmosphere, lighting, and curatorial approach to the exhibits.",
  "Well, that's a surprise! I didn't expect to see you here; how have you been? It's been ages since our last meeting; you look great, by the way!"
];

// Short number texts
const shortNumberTexts = [
  "The combination to the safe is 32 46 18.",
  "I need 5 apples, 3 oranges, 12 bananas.",
  "The race times were 10.31, 10.28, 10.54.",
  "My phone number is 555 123 4567.",
  "There are 24 hours in a day."
];

// Medium number texts
const mediumNumberTexts = textWithNumbers;

// Long number texts
const longNumberTexts = [
  "The combination to the safe is 32 46 18 and the backup code is 9462. In case of emergency, call extension 5543 or the security office at 555-8901.",
  "I need 5 apples, 3 oranges, 12 bananas, 8 strawberries, 2 pineapples, 4 kiwis, and 6 peaches for the recipe that serves 24 people.",
  "The race times were 10.31, 10.28, 10.54, 10.97, 10.42, 10.36, 10.85, and 10.63 seconds for the 100 meter dash, with an average time of 10.55 seconds.",
  "My phone number changed from 555 123 4567 to 555 987 6543 last month. The new area code will be 889 starting January 1, 2025.",
  "There are 24 hours in a day, 60 minutes in an hour, 60 seconds in a minute, 365 days in a year, and approximately 8,760 hours in a year."
];

// Short punctuation and numbers texts
const shortPunctuationNumbersTexts = [
  "User94 added $5,000 to their account!",
  "Meet me at 9:30 AM on June 7th, 2024.",
  "The year is 2025, and we've grown 300%!",
  "In 2023, 1,234 students scored 98.5%.",
  "Room 101 - Please arrive at 08:15."
];

// Medium punctuation and numbers texts
const mediumPunctuationNumbersTexts = textWithPunctuationAndNumbers;

// Long punctuation and numbers texts
const longPunctuationNumbersTexts = [
  "User94 added $5,000 to their account on 12/25/2023, bringing their total to $12,345.67! The transaction #XB45921 was processed at 14:32:45 GMT with a fee of $2.50.",
  "Meet me at 9:30 AM on June 7th, 2024; bring your ID #12345 and the $50.00 registration fee. We'll be in Conference Room B-12 on the 15th floor of Building 7.",
  "The year is 2025, and we've achieved 300% growth in 42 countries across 7 continents! Our Q1 revenue was $12.5M, Q2 reached $15.8M, and Q3 hit a record $18.2M!",
  "In 2023-2024, a total of 1,234 students scored 98.5% or higher on the exam #5678; that's an increase of 23.5% from last year's results, when only 999 students achieved this benchmark.",
  "Room 101, Building 3 - Please arrive at 08:15 with forms A-12 & B-34 completed. The meeting will last 75 minutes, and we'll need to review the 25 action items from our 05/15/2024 session."
];

const TypingTest: React.FC = () => {
  const { user, isSignedIn } = useUser();
  const { toast } = useToast();
  const [testOptions, setTestOptions] = useState<TestOptions>({
    punctuation: false,
    numbers: false,
    time: 60,
    mode: "words"
  });
  const [isLoadingAI, setIsLoadingAI] = useState(true); // Start loading AI content
  
  // Get sound settings hook
  const { 
    settings: soundSettings, 
    playKeyPressSound, 
    playErrorSound,
    initialized: soundInitialized 
  } = useSoundSettings();
  
  // Get text based on current options
  const getTextPool = useCallback(() => {
    // Determine text length based on time limit
    const getTextsByLength = (shortTexts: string[], mediumTexts: string[], longTexts: string[]) => {
      if (testOptions.time <= 15) {
        return shortTexts;
      } else if (testOptions.time <= 60) {
        return mediumTexts;
      } else {
        return longTexts;
      }
    };
    
    if (testOptions.mode === "quote") {
      return getTextsByLength(shortQuotesTexts, mediumQuotesTexts, longQuotesTexts);
    }
    
    if (testOptions.punctuation && testOptions.numbers) {
      return getTextsByLength(shortPunctuationNumbersTexts, mediumPunctuationNumbersTexts, longPunctuationNumbersTexts);
    }
    
    if (testOptions.punctuation) {
      return getTextsByLength(shortPunctuationTexts, mediumPunctuationTexts, longPunctuationTexts);
    }
    
    if (testOptions.numbers) {
      return getTextsByLength(shortNumberTexts, mediumNumberTexts, longNumberTexts);
    }
    
    // Default words mode
    return getTextsByLength(shortWordTexts, mediumWordTexts, longWordTexts);
  }, [testOptions.mode, testOptions.punctuation, testOptions.numbers, testOptions.time]);

  // Get a random text from the pool
  const getRandomText = useCallback(() => {
    const textPool = getTextPool();
    return textPool[Math.floor(Math.random() * textPool.length)];
  }, [getTextPool]);

  // Fetch AI-generated text - accepts options directly to avoid stale closure issues
  const fetchAIText = useCallback(async (options?: TestOptions): Promise<string | null> => {
    const opts = options || testOptions;
    try {
      const response = await fetch("/api/generate-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: opts.mode,
          time: opts.time,
          punctuation: opts.punctuation,
          numbers: opts.numbers
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate text");
      }

      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error("AI text generation error:", error);
      return null;
    }
  }, [testOptions]);
  
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
  const [tabPressed, setTabPressed] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [typingData, setTypingData] = useState<any[]>([]);
  const [incorrectChars, setIncorrectChars] = useState<number>(0);
  const [correctChars, setCorrectChars] = useState<number>(0);
  const [peakWpm, setPeakWpm] = useState<number>(0);
  const [consistencyScore, setConsistencyScore] = useState<number>(0);
  const [errorsPerMinute, setErrorsPerMinute] = useState<number>(0);

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

  // Focus input or container based on device type and load AI content
  useEffect(() => {
    setIsClient(true);

    // Load AI content on mount
    const loadInitialContent = async () => {
      setIsLoadingAI(true);
      const aiText = await fetchAIText();
      if (aiText) {
        setText(aiText);
      } else {
        setText(getRandomText());
      }
      setIsLoadingAI(false);
    };

    loadInitialContent();

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Add this new function to save test results
  const saveTestResult = useCallback(async () => {
    if (!isSignedIn || !user || !wpm || !accuracy) return;
    
    try {
      const correctChars = typedText.split('').filter((char, i) => text[i] === char).length;
      const errorCount = typedText.length - correctChars;
      
      const response = await fetch('/api/typing-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wpm,
          accuracy,
          charsTyped: typedText.length,
          errors: errorCount,
          testDuration: testOptions.time,
          testType: testOptions.mode,
        }),
      });
      
      if (!response.ok) {
        console.error('Failed to save test result');
      } else {
        toast({
          title: "Result saved",
          description: "Your typing test result has been saved to your profile!",
        });
      }
    } catch (error) {
      console.error('Error saving test result:', error);
    }
  }, [isSignedIn, user, wpm, accuracy, typedText, text, testOptions, toast]);

  // Modify the useEffect that monitors test completion to also calculate new metrics
  useEffect(() => {
    if (typedText.length > 0 && !startTime) {
      setStartTime(Date.now());
      setTimeRemaining(testOptions.time);
    }

    if (typedText.length > 0 && startTime) {
      // Calculate accuracy
      let correctCount = 0;
      for (let i = 0; i < typedText.length; i++) {
        if (i < text.length && typedText[i] === text[i]) {
          correctCount++;
        }
      }
      setCorrectChars(correctCount);
      setIncorrectChars(typedText.length - correctCount);
      const newAccuracy = Math.round((correctCount / typedText.length) * 100);
      setAccuracy(newAccuracy);

      // Calculate WPM - standard is 5 characters per word
      const elapsedMinutes = (Date.now() - startTime) / 60000;
      if (elapsedMinutes > 0) {
        const wordsTyped = correctCount / 5;
        const newWpm = Math.round(wordsTyped / elapsedMinutes);
        setWpm(newWpm);
        
        // Update peak WPM if current WPM is higher
        if (newWpm > peakWpm) {
          setPeakWpm(newWpm);
        }
        
        // Calculate errors per minute
        const errPerMin = Math.round((typedText.length - correctCount) / elapsedMinutes);
        setErrorsPerMinute(errPerMin);
        
        // Record data for the chart every second or so
        if (Math.floor(elapsedMinutes * 60) > typingData.length) {
          setTypingData(prev => [
            ...prev, 
            { 
              time: Math.floor(elapsedMinutes * 60), 
              wpm: newWpm,
              accuracy: newAccuracy
            }
          ]);
        }
      }
    }

    // Test completion and save results
    if ((typedText.length === text.length || timeRemaining === 0) && !testComplete) {
      setTestComplete(true);
      setShowResults(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Calculate consistency score when test is complete
      if (typingData.length > 1) {
        // Calculate standard deviation of WPM
        const wpmValues = typingData.map(data => data.wpm);
        const avgWpm = wpmValues.reduce((sum, val) => sum + val, 0) / wpmValues.length;
        const squaredDiffs = wpmValues.map(val => Math.pow(val - avgWpm, 2));
        const avgSquaredDiff = squaredDiffs.reduce((sum, val) => sum + val, 0) / squaredDiffs.length;
        const stdDev = Math.sqrt(avgSquaredDiff);
        
        // Convert standard deviation to a 0-100 consistency score (lower std dev = higher consistency)
        // Using a simple formula: 100 - (stdDev / avgWpm * 100), capped between 0-100
        const rawScore = 100 - (stdDev / avgWpm * 100);
        setConsistencyScore(Math.min(100, Math.max(0, Math.round(rawScore))));
      }
      
      // Save test results if user is logged in
      if (isSignedIn) {
        saveTestResult();
      }
    }
  }, [typedText, text, startTime, testComplete, testOptions.time, timeRemaining, isSignedIn, saveTestResult, typingData, peakWpm]);

  // Restart the test and show visual feedback
  // Accepts optional options to use for fetching (avoids stale closure issues)
  const restartTest = useCallback(async (options?: TestOptions) => {
    setTypedText("");
    setStartTime(null);
    setWpm(null);
    setAccuracy(null);
    setTimeRemaining(null);
    setTestComplete(false);
    setShowResults(false);
    setTypingData([]);
    setCorrectChars(0);
    setIncorrectChars(0);
    setPeakWpm(0);

    // Show restart feedback animation
    setRestartFeedback(true);
    setTimeout(() => setRestartFeedback(false), 300);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Try to fetch AI-generated content, fallback to local text
    // Pass options directly to avoid stale state issues
    setIsLoadingAI(true);
    const aiText = await fetchAIText(options);
    if (aiText) {
      setText(aiText);
    } else {
      setText(getRandomText());
    }
    setIsLoadingAI(false);

    // Focus the appropriate element based on device
    setTimeout(() => {
      if (isMobile && inputRef.current) {
        inputRef.current.focus();
      } else if (containerRef.current) {
        containerRef.current.focus();
      }
    }, 100);
  }, [getRandomText, isMobile, fetchAIText]);

  // Handle option changes - pass new options directly to avoid stale closure
  const handleOptionsChange = useCallback((newOptions: TestOptions) => {
    setTestOptions(newOptions);
    restartTest(newOptions); // Pass options directly
  }, [restartTest]);

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
    // Allow keyboard shortcuts even when test is complete
    if (testComplete && e.key !== "Tab" && !(e.key === "Enter" && tabPressed)) return;
    
    // Handle Tab key for the Tab+Enter shortcut
    if (e.key === "Tab") {
      e.preventDefault(); // Prevent tab from changing focus
      setTabPressed(true);
      return;
    }

    // Handle Enter key when Tab is already pressed
    if (e.key === "Enter" && tabPressed) {
      e.preventDefault();
      setTabPressed(false);
      
      // Reset test if it's completed
      if (testComplete) {
        setShowResults(false);
    }

      restartTest();
      return;
    }

    // Only process other keys if the test is not complete
    if (testComplete) return;
    
    // Reset Tab state for other keys
    if (tabPressed && e.key !== "Tab" && e.key !== "Enter") {
      setTabPressed(false);
    }

    // Prevent default browser behavior for most keystrokes
    e.preventDefault();

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
  }, [text, restartTest, testComplete, soundSettings, playKeyPressSound, playErrorSound, tabPressed]);

  // Add a keyup handler to reset the tab state
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key === "Tab") {
      // Add a small delay before resetting to allow for Tab+Enter combination
      setTimeout(() => {
        setTabPressed(false);
      }, 1500);
    }
  }, []);

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

      const handleKeyUpWrapper = (e: KeyboardEvent) => {
        if (isFocused) {
          handleKeyUp(e);
        }
      };

      window.addEventListener("keydown", handleKeyDownWrapper);
      window.addEventListener("keyup", handleKeyUpWrapper);
      
      return () => {
        window.removeEventListener("keydown", handleKeyDownWrapper);
        window.removeEventListener("keyup", handleKeyUpWrapper);
      };
    }
  }, [handleKeyDown, handleKeyUp, isFocused, isClient, isMobile]);

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

  // Render the detailed results screen
  const renderResultsScreen = () => {
    if (!wpm || !accuracy) return null;

    // Calculate keystroke efficiency (ratio of correct keystrokes to total)
    const keystrokeEfficiency = Math.round((correctChars / (correctChars + incorrectChars)) * 100);
    
    return (
      <Card className="w-full max-w-5xl mx-auto mt-6">
        <CardHeader>
          <CardTitle className="text-2xl">Your Typing Results</CardTitle>
          <CardDescription>
            Here's how you performed in your {testOptions.time} second {testOptions.mode} test
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Primary metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted rounded-md p-4 text-center">
              <div className="text-xs sm:text-sm text-muted-foreground mb-1">Speed</div>
              <div className="text-xl sm:text-2xl font-bold">{wpm} WPM</div>
            </div>
            <div className="bg-muted rounded-md p-4 text-center">
              <div className="text-xs sm:text-sm text-muted-foreground mb-1">Accuracy</div>
              <div className="text-xl sm:text-2xl font-bold">{accuracy}%</div>
            </div>
            <div className="bg-muted rounded-md p-4 text-center">
              <div className="text-xs sm:text-sm text-muted-foreground mb-1">Consistency</div>
              <div className="text-xl sm:text-2xl font-bold">{consistencyScore}%</div>
              <div className="text-xs text-muted-foreground mt-1">
                {consistencyScore >= 90 ? "Very stable" : 
                 consistencyScore >= 75 ? "Steady" : 
                 consistencyScore >= 60 ? "Somewhat varied" : "Fluctuating"}
              </div>
            </div>
            <div className="bg-muted rounded-md p-4 text-center">
              <div className="text-xs sm:text-sm text-muted-foreground mb-1">Peak WPM</div>
              <div className="text-xl sm:text-2xl font-bold text-blue-500">{peakWpm}</div>
            </div>
          </div>
          
          {/* Secondary metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted/50 rounded-md p-4 text-center">
              <div className="text-xs sm:text-sm text-muted-foreground mb-1">Keystroke Efficiency</div>
              <div className="text-lg sm:text-xl font-medium">{keystrokeEfficiency}%</div>
            </div>
            <div className="bg-muted/50 rounded-md p-4 text-center">
              <div className="text-xs sm:text-sm text-muted-foreground mb-1">Errors/Min</div>
              <div className="text-lg sm:text-xl font-medium text-red-500">{errorsPerMinute}</div>
            </div>
            <div className="bg-muted/50 rounded-md p-4 text-center">
              <div className="text-xs sm:text-sm text-muted-foreground mb-1">Correct Chars</div>
              <div className="text-lg sm:text-xl font-medium text-green-500">{correctChars}</div>
            </div>
            <div className="bg-muted/50 rounded-md p-4 text-center">
              <div className="text-xs sm:text-sm text-muted-foreground mb-1">Errors</div>
              <div className="text-lg sm:text-xl font-medium text-red-500">{incorrectChars}</div>
            </div>
          </div>
          
          <div className="h-px w-full bg-border" />
          
          {/* Performance graph */}
          <div className="pt-2">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <BarChart2 className="mr-2 h-5 w-5" />
              Performance Graph
            </h3>
            <div className="h-[250px] w-full">
              {typingData.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={typingData}
                    margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="time" 
                      label={{ value: 'Seconds', position: 'insideBottom', offset: 0 }} 
                    />
                    <YAxis 
                      label={{ value: 'WPM', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value, name) => [
                        `${value} ${name === 'wpm' ? 'WPM' : '%'}`, 
                        name === 'wpm' ? 'Speed' : 'Accuracy'
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="wpm" 
                      name="wpm"
                      stroke="#3b82f6" 
                      strokeWidth={2} 
                      dot={{ r: 1 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="accuracy" 
                      name="accuracy"
                      stroke="#10b981" 
                      strokeWidth={2} 
                      dot={{ r: 0 }}
                      activeDot={{ r: 4 }}
                      strokeDasharray="3 3"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Not enough data to display chart
                </div>
              )}
            </div>
          </div>
          
          {/* Performance insights */}
          <div className="bg-muted/20 p-4 rounded-md">
            <h3 className="text-md font-semibold mb-2">Performance Insights</h3>
            <ul className="text-sm space-y-2">
              {peakWpm > wpm * 1.2 && (
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  Your peak speed ({peakWpm} WPM) is significantly higher than your average. With more practice, you could maintain this speed longer.
                </li>
              )}
              {consistencyScore < 70 && (
                <li className="flex items-start">
                  <span className="mr-2 text-amber-500">•</span>
                  Your typing speed fluctuated during the test. Focus on maintaining a steady rhythm to improve consistency.
                </li>
              )}
              {errorsPerMinute > 5 && (
                <li className="flex items-start">
                  <span className="mr-2 text-red-500">•</span>
                  You're making {errorsPerMinute} errors per minute. Slowing down slightly might help improve accuracy.
                </li>
              )}
              {accuracy > 95 && wpm < 40 && (
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  Your accuracy is excellent! You might try increasing your speed a bit without sacrificing precision.
                </li>
              )}
              {wpm > 60 && consistencyScore >= 80 && (
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  Great job! Your typing is both fast and consistent.
                </li>
              )}
            </ul>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between">
          <SimpleButton
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => restartTest()}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Take Another Test
          </SimpleButton>

          {!isSignedIn ? (
            <Link href="/auth" className="w-full sm:w-auto">
              <SimpleButton size="lg" className="w-full">
                <LogIn className="mr-2 h-4 w-4" />
                Sign in to Save Results
              </SimpleButton>
            </Link>
          ) : (
            <div className="flex items-center text-sm text-muted-foreground">
              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
              Your results have been saved to your profile
            </div>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <>
      <TestOptionsHeader options={testOptions} onChange={handleOptionsChange} />
      
      {/* Show either the typing test or the results screen */}
      {!showResults ? (
        <>
      {/* Hidden input for mobile keyboards - only render after hydration to avoid mismatch */}
      {isClient && (
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
      )}
      
      <div 
        ref={containerRef}
        className={cn(
          "w-full p-6 sm:p-8 md:p-10 lg:p-12 rounded-xl border border-border",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "transition-all duration-200 ease-in-out",
          "bg-background shadow-sm min-h-[22rem] md:min-h-[28rem]",
          testComplete && "border-yellow-500",
          restartFeedback && "bg-secondary/30 scale-[0.98]",
          isClient && isFocused && "ring-2 ring-ring ring-offset-2",
          isClient && isMobile && "h-[calc(70vh-6rem)]"
        )}
        tabIndex={isClient && isMobile ? -1 : 0}
        onFocus={() => {
          setIsFocused(true);
          if (isMobile && inputRef.current) {
            inputRef.current.focus();
          }
        }}
        onBlur={() => setIsFocused(false)}
      >
        {isLoadingAI ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <span className="text-muted-foreground text-sm">Generating text with AI...</span>
            </div>
          </div>
        ) : (
          <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed md:leading-loose tracking-wide font-mono">{renderText()}</div>
        )}
        
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
              <SimpleButton size="sm" onClick={() => setShowResults(true)}>
                See Results
              </SimpleButton>
            ) : (
              <div className="text-xs sm:text-sm italic hidden sm:block">
                Press <kbd className="px-1 sm:px-2 py-0.5 sm:py-1 bg-muted rounded text-xs">Tab</kbd> + <kbd className="px-1 sm:px-2 py-0.5 sm:py-1 bg-muted rounded text-xs">Enter</kbd> to restart
              </div>
            )}
          </div>
        </div>
      </div>

          {/* Add a small message for logged-in users */}
          {isSignedIn && (
            <div className="mt-2 text-xs text-center text-muted-foreground">
              Your results will be saved to your profile and may appear on the leaderboard.
            </div>
          )}
        </>
      ) : (
        renderResultsScreen()
      )}
    </>
  );
};

export default TypingTest; 