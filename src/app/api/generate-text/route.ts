import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface GenerateTextRequest {
  mode: "words" | "quote" | "numbers" | "punctuation" | "mixed";
  time: number; // Duration in seconds
  punctuation?: boolean;
  numbers?: boolean;
}

// Calculate character requirements based on time
// Assuming ~50 WPM average, ~5 chars per word = ~250 chars per minute
const getCharCountForTime = (seconds: number): { minChars: number; targetChars: number; maxTokens: number } => {
  const charsPerMinute = 250; // 50 WPM * 5 chars/word
  const charsPerSecond = charsPerMinute / 60;

  // Calculate target with 2x buffer so text doesn't run out
  const targetChars = Math.ceil(seconds * charsPerSecond * 2);
  const minChars = Math.ceil(seconds * charsPerSecond * 1.2); // At least 1.2x for safety

  // Tokens are roughly 4 chars each, add generous buffer
  const maxTokens = Math.max(500, Math.ceil(targetChars / 3));

  return {
    minChars: Math.max(50, minChars),
    targetChars: Math.max(100, targetChars),
    maxTokens: Math.min(2000, maxTokens)
  };
};

const getModePrompt = (mode: string, includeNumbers: boolean, includePunctuation: boolean): string => {
  let basePrompt = "";

  if (mode === "quote") {
    basePrompt = "Generate an inspirational or thought-provoking quote. It can be fictional or in the style of famous thinkers. Include attribution like '- Author Name' at the end.";
  } else if (mode === "numbers" || (mode === "words" && includeNumbers && !includePunctuation)) {
    basePrompt = "Generate a paragraph that naturally includes many numbers (dates, measurements, statistics, phone numbers, prices). Mix numbers with regular text.";
  } else if (mode === "punctuation" || (mode === "words" && includePunctuation && !includeNumbers)) {
    basePrompt = "Generate a paragraph with varied punctuation marks including commas, semicolons, colons, dashes, exclamation marks, question marks, and quotation marks.";
  } else if (mode === "mixed" || (mode === "words" && includeNumbers && includePunctuation)) {
    basePrompt = "Generate a paragraph that includes numbers, varied punctuation, and some technical or business terminology.";
  } else {
    basePrompt = "Generate a random paragraph of common English words. Use simple, everyday vocabulary. No special characters or numbers.";
  }

  // Add modifiers for quote mode
  if (mode === "quote") {
    if (includeNumbers && includePunctuation) {
      basePrompt += " Include statistics, dates, or numbers in the quote. Use varied punctuation.";
    } else if (includeNumbers) {
      basePrompt += " Include statistics, dates, or numbers in the quote.";
    } else if (includePunctuation) {
      basePrompt += " Use varied punctuation including semicolons, colons, and dashes.";
    }
  }

  return basePrompt;
};

async function generateText(
  modePrompt: string,
  targetChars: number,
  maxTokens: number,
  time: number
): Promise<string | null> {
  const prompt = `${modePrompt}

CRITICAL LENGTH REQUIREMENT:
- You MUST generate AT LEAST ${targetChars} characters of text
- This is for a ${time} second typing test - the text must be long enough
- Keep writing until you reach ${targetChars} characters minimum
- No line breaks or special formatting
- Output ONLY the text, nothing else`;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a typing test content generator. You MUST generate text that is AT LEAST ${targetChars} characters long. This is critical - if you generate less, the typing test will not work. Output ONLY the text with no commentary.`,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama-3.1-8b-instant",
    temperature: 0.8,
    max_tokens: maxTokens,
  });

  return completion.choices[0]?.message?.content?.trim() || null;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateTextRequest = await request.json();
    const { mode = "words", time = 60, punctuation = false, numbers = false } = body;

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY not configured" },
        { status: 500 }
      );
    }

    const { minChars, targetChars, maxTokens } = getCharCountForTime(time);
    const modePrompt = getModePrompt(mode, numbers, punctuation);

    // First attempt
    let generatedText = await generateText(modePrompt, targetChars, maxTokens, time);

    // If text is too short, retry with a more aggressive prompt
    if (generatedText && generatedText.length < minChars) {
      console.log(`First attempt too short: ${generatedText.length} chars, need ${minChars}. Retrying...`);

      // Retry with doubled target
      generatedText = await generateText(modePrompt, targetChars * 2, maxTokens, time);
    }

    // If still too short or failed, concatenate multiple generations
    if (!generatedText || generatedText.length < minChars) {
      console.log(`Second attempt failed or too short. Building text from multiple generations...`);

      const textParts: string[] = [];
      let totalChars = 0;
      const maxAttempts = 5;

      for (let i = 0; i < maxAttempts && totalChars < minChars; i++) {
        const part = await generateText(modePrompt, 300, 500, time);
        if (part) {
          textParts.push(part);
          totalChars += part.length;
        }
      }

      if (textParts.length > 0) {
        generatedText = textParts.join(" ");
      }
    }

    if (!generatedText) {
      return NextResponse.json(
        { error: "Failed to generate text" },
        { status: 500 }
      );
    }

    // Clean up any potential issues
    generatedText = generatedText
      .replace(/\n+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return NextResponse.json({
      text: generatedText,
      chars: generatedText.length,
      targetChars,
      minChars
    });
  } catch (error) {
    console.error("Text generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate text" },
      { status: 500 }
    );
  }
}
