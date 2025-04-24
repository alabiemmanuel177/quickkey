// @jsxImportSource react
import React from "react";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

// Define font loading
const interRegular = fetch(
  new URL("../../../assets/fonts/Inter-Regular.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

const interBold = fetch(
  new URL("../../../assets/fonts/Inter-Bold.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

// Image metadata (not exported)
const size = {
  width: 1200,
  height: 630,
};

export async function GET(request: NextRequest) {
  try {
    // Parse URL and extract query parameters
    const { searchParams } = new URL(request.url);

    // Get parameters with fallbacks
    const mode = searchParams.get("mode") || "light";
    const theme = searchParams.get("theme") || "default";

    // Load the fonts
    const [interRegularData, interBoldData] = await Promise.all([
      interRegular,
      interBold,
    ]);

    // Define theme colors
    const themes = {
      default: {
        bg: mode === "dark" ? "#121212" : "#ffffff",
        text: mode === "dark" ? "#ffffff" : "#121212",
        accent: "#3182ce", // Blue accent
      },
      green: {
        bg: mode === "dark" ? "#064e3b" : "#ecfdf5",
        text: mode === "dark" ? "#ffffff" : "#065f46",
        accent: "#10b981",
      },
      red: {
        bg: mode === "dark" ? "#7f1d1d" : "#fef2f2",
        text: mode === "dark" ? "#ffffff" : "#991b1b",
        accent: "#ef4444",
      },
    };

    // Get the selected theme or fallback to default
    const selectedTheme =
      themes[theme as keyof typeof themes] || themes.default;

    // Generate the OpenGraph image
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 128,
            background: selectedTheme.bg,
            color: selectedTheme.text,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Inter",
            gap: "24px",
          }}
        >
          <div style={{ fontSize: "120px" }}>⌨️</div>
          <div
            style={{
              fontWeight: "bold",
              background: `linear-gradient(90deg, ${selectedTheme.accent}, ${selectedTheme.text})`,
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            QuickKey
          </div>
        </div>
      ),
      {
        width: size.width,
        height: size.height,
        emoji: "twemoji",
        fonts: [
          {
            name: "Inter",
            data: interRegularData,
            style: "normal",
            weight: 400,
          },
          {
            name: "Inter",
            data: interBoldData,
            style: "normal",
            weight: 700,
          },
        ],
      }
    );
  } catch (error) {
    console.error("Error generating OG image:", error);
    return new Response("Failed to generate OpenGraph image", { status: 500 });
  }
}

// Set cache headers for edge performance
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control":
        "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
