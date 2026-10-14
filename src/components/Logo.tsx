"use client";

import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  theme?: "light" | "dark";
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  showTagline = true,
  theme = "dark",
  className = "",
}) => {
  const isLight = theme === "light";

  const sizeClasses = {
    sm: {
      icon: "w-7 h-7",
      text: "text-lg",
      tagline: "text-[9px]",
      gap: "gap-2",
    },
    md: {
      icon: "w-9 h-9",
      text: "text-xl sm:text-2xl",
      tagline: "text-[10px]",
      gap: "gap-2.5",
    },
    lg: {
      icon: "w-12 h-12",
      text: "text-2xl sm:text-3xl",
      tagline: "text-xs",
      gap: "gap-3",
    },
  }[size];

  return (
    <div className={`inline-flex items-center ${sizeClasses.gap} ${className}`}>
      {/* Geometric Flooring & Home Emblem */}
      <div
        className={`${sizeClasses.icon} shrink-0 rounded-xl flex items-center justify-center p-1.5 shadow-xs transition-transform group-hover:scale-105 ${
          isLight
            ? "bg-[#FAF7F0] border border-[#C5A66B]/50 text-[#172321]"
            : "bg-[#172321] border border-[#C5A66B]/40 text-[#C5A66B]"
        }`}
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Outer diamond tile outline (Precision Layout) */}
          <rect
            x="20"
            y="3"
            width="24"
            height="24"
            transform="rotate(45 20 3)"
            stroke={isLight ? "#245B50" : "#C5A66B"}
            strokeWidth="2"
            strokeLinejoin="round"
            className="transition-colors"
          />

          {/* Top Home Roof Gable / Apex Chevron */}
          <path
            d="M8 20L20 8L32 20"
            stroke={isLight ? "#172321" : "#FAF7F0"}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 4 Interlocking Symmetrical Floor Tiles */}
          {/* Tile 1: Top Center */}
          <polygon
            points="20,11 25,16 20,21 15,16"
            fill={isLight ? "#245B50" : "#C5A66B"}
            opacity="0.95"
          />
          {/* Tile 2: Left */}
          <polygon
            points="14,17 19,22 14,27 9,22"
            fill={isLight ? "#172321" : "#FAF7F0"}
            opacity="0.75"
          />
          {/* Tile 3: Right */}
          <polygon
            points="26,17 31,22 26,27 21,22"
            fill={isLight ? "#172321" : "#FAF7F0"}
            opacity="0.75"
          />
          {/* Tile 4: Bottom Center Base */}
          <polygon
            points="20,23 25,28 20,33 15,28"
            fill={isLight ? "#C5A66B" : "#245B50"}
            opacity="0.9"
          />

          {/* Artisan Center Datum / Precision Masonry Anchor Point */}
          <circle
            cx="20"
            cy="22"
            r="1.8"
            fill={isLight ? "#FAF7F0" : "#172321"}
            stroke={isLight ? "#172321" : "#C5A66B"}
            strokeWidth="1.2"
          />
        </svg>
      </div>

      {/* Wordmark and Tagline */}
      <div className="flex flex-col text-left leading-none">
        <span
          className={`${sizeClasses.text} font-bold font-serif tracking-tight flex items-center gap-1.5 ${
            isLight ? "text-white" : "text-[#172321]"
          }`}
        >
          MESTHIRI
        </span>

        {showTagline && (
          <span
            className={`${sizeClasses.tagline} font-sans font-medium tracking-wide mt-0.5 ${
              isLight ? "text-[#C5A66B]" : "text-[#6E6B65]"
            }`}
          >
            Skilled Hands. Beautiful Homes.
          </span>
        )}
      </div>
    </div>
  );
};
