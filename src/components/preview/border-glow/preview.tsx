"use client";

import { useBorderGlow } from "./context";

export function BorderGlowPreview() {
  const {
    duration,
    borderWidth,
    glowSize,
    glowOpacity,
    borderRadius,
    activeColors,
    direction,
    paused,
  } = useBorderGlow();

  const gradient = `conic-gradient(from var(--bg-angle), ${activeColors.join(", ")})`;
  const animationCss = `border-glow-spin ${duration}s linear ${direction} infinite`;
  const playState = paused ? "paused" : "running";

  return (
    <div className="flex h-full w-full items-center justify-center select-none">
      <div className="relative" style={{ width: 280, height: 132 }}>
        {/* Glow halo (blurred) */}
        <div
          aria-hidden
          className="absolute will-change-transform"
          style={{
            inset: -borderWidth,
            borderRadius: borderRadius + borderWidth,
            background: gradient,
            filter: `blur(${glowSize}px)`,
            opacity: glowOpacity,
            animation: animationCss,
            animationPlayState: playState,
            zIndex: 0,
          }}
        />
        {/* Sharp border ring */}
        <div
          aria-hidden
          className="absolute will-change-transform"
          style={{
            inset: -borderWidth,
            borderRadius: borderRadius + borderWidth,
            background: gradient,
            animation: animationCss,
            animationPlayState: playState,
            zIndex: 1,
          }}
        />
        {/* Content (covers center, leaves ring visible at edges) */}
        <div
          className="relative h-full w-full flex flex-col items-center justify-center"
          style={{
            borderRadius,
            background: "#FFFFFF",
            zIndex: 2,
            padding: "16px 24px",
            gap: 6,
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#0f172a",
              letterSpacing: -0.4,
            }}
          >
            Border Glow
          </span>
          <span
            style={{
              fontSize: 12,
              color: "rgba(0,0,0,0.5)",
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
            }}
          >
            conic-gradient · @property
          </span>
        </div>
      </div>
    </div>
  );
}
