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

// Image metadata
const size = {
  width: 1200,
  height: 630,
};

export async function GET(request: NextRequest) {
  try {
    // Parse URL and extract query parameters
    const { searchParams } = new URL(request.url);

    // Get parameters with fallbacks
    const title = searchParams.get("title") || "QuickKey";
    const description = searchParams.get("description") || "Test and improve your typing speed";
    const mode = searchParams.get("mode") || "light";
    const theme = searchParams.get("theme") || "default";
    const wpm = searchParams.get("wpm");
    const accuracy = searchParams.get("accuracy");
    const type = searchParams.get("type") || "default"; // default, result, leaderboard

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
        accent: "#3182ce",
        muted: mode === "dark" ? "#a0aec0" : "#718096",
        success: "#38a169",
        cardBg: mode === "dark" ? "#1a1a2e" : "#f7fafc",
      },
      green: {
        bg: mode === "dark" ? "#064e3b" : "#ecfdf5",
        text: mode === "dark" ? "#ffffff" : "#065f46",
        accent: "#10b981",
        muted: mode === "dark" ? "#6ee7b7" : "#047857",
        success: "#10b981",
        cardBg: mode === "dark" ? "#065f46" : "#d1fae5",
      },
      red: {
        bg: mode === "dark" ? "#7f1d1d" : "#fef2f2",
        text: mode === "dark" ? "#ffffff" : "#991b1b",
        accent: "#ef4444",
        muted: mode === "dark" ? "#fca5a5" : "#b91c1c",
        success: "#f87171",
        cardBg: mode === "dark" ? "#991b1b" : "#fee2e2",
      },
      purple: {
        bg: mode === "dark" ? "#2d1b69" : "#faf5ff",
        text: mode === "dark" ? "#ffffff" : "#553c9a",
        accent: "#805ad5",
        muted: mode === "dark" ? "#b794f4" : "#6b46c1",
        success: "#9f7aea",
        cardBg: mode === "dark" ? "#44337a" : "#e9d8fd",
      },
    };

    // Get the selected theme or fallback to default
    const selectedTheme =
      themes[theme as keyof typeof themes] || themes.default;

    // Render typing result card
    if (type === "result" && wpm && accuracy) {
      return new ImageResponse(
        (
          <div
            style={{
              background: selectedTheme.bg,
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Inter",
              padding: "40px",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "40px",
              }}
            >
              <div style={{ fontSize: "48px" }}>⌨️</div>
              <div
                style={{
                  fontSize: "48px",
                  fontWeight: "bold",
                  background: `linear-gradient(90deg, ${selectedTheme.accent}, ${selectedTheme.text})`,
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                QuickKey
              </div>
            </div>

            {/* Results Card */}
            <div
              style={{
                display: "flex",
                background: selectedTheme.cardBg,
                borderRadius: "24px",
                padding: "48px 80px",
                gap: "80px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* WPM */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "96px",
                    fontWeight: "bold",
                    color: selectedTheme.accent,
                  }}
                >
                  {wpm}
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    color: selectedTheme.muted,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                  }}
                >
                  WPM
                </div>
              </div>

              {/* Divider */}
              <div
                style={{
                  width: "2px",
                  background: selectedTheme.muted,
                  opacity: 0.3,
                }}
              />

              {/* Accuracy */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "96px",
                    fontWeight: "bold",
                    color: selectedTheme.success,
                  }}
                >
                  {accuracy}%
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    color: selectedTheme.muted,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                  }}
                >
                  Accuracy
                </div>
              </div>
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: "32px",
                color: selectedTheme.text,
                marginTop: "40px",
                fontWeight: "600",
              }}
            >
              {title}
            </div>

            {/* Description */}
            {description && (
              <div
                style={{
                  fontSize: "20px",
                  color: selectedTheme.muted,
                  marginTop: "12px",
                }}
              >
                {description}
              </div>
            )}
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
    }

    // Render leaderboard preview
    if (type === "leaderboard") {
      return new ImageResponse(
        (
          <div
            style={{
              background: selectedTheme.bg,
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Inter",
              padding: "40px",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              <div style={{ fontSize: "56px" }}>🏆</div>
              <div
                style={{
                  fontSize: "56px",
                  fontWeight: "bold",
                  color: selectedTheme.text,
                }}
              >
                Leaderboard
              </div>
            </div>

            {/* QuickKey branding */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "32px",
              }}
            >
              <div style={{ fontSize: "32px" }}>⌨️</div>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  background: `linear-gradient(90deg, ${selectedTheme.accent}, ${selectedTheme.text})`,
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                QuickKey
              </div>
            </div>

            {/* Description */}
            <div
              style={{
                fontSize: "28px",
                color: selectedTheme.muted,
                textAlign: "center",
                maxWidth: "800px",
              }}
            >
              {description || "Compete with typists worldwide and climb the ranks!"}
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
    }

    // Default OG image with title and description
    return new ImageResponse(
      (
        <div
          style={{
            background: selectedTheme.bg,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Inter",
            padding: "60px",
          }}
        >
          {/* Logo and brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              marginBottom: "48px",
            }}
          >
            <div style={{ fontSize: "120px" }}>⌨️</div>
            <div
              style={{
                fontSize: "96px",
                fontWeight: "bold",
                background: `linear-gradient(90deg, ${selectedTheme.accent}, ${selectedTheme.text})`,
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {title === "QuickKey" ? title : "QuickKey"}
            </div>
          </div>

          {/* Custom title if different from brand */}
          {title !== "QuickKey" && (
            <div
              style={{
                fontSize: "56px",
                fontWeight: "bold",
                color: selectedTheme.text,
                marginBottom: "24px",
                textAlign: "center",
              }}
            >
              {title}
            </div>
          )}

          {/* Description */}
          <div
            style={{
              fontSize: "32px",
              color: selectedTheme.muted,
              textAlign: "center",
              maxWidth: "900px",
              lineHeight: 1.4,
            }}
          >
            {description}
          </div>

          {/* Features */}
          <div
            style={{
              display: "flex",
              gap: "48px",
              marginTop: "48px",
            }}
          >
            {["Fast", "Accurate", "Fun"].map((feature) => (
              <div
                key={feature}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontSize: "24px",
                  color: selectedTheme.accent,
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: selectedTheme.accent,
                  }}
                />
                {feature}
              </div>
            ))}
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
