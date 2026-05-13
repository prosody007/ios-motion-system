"use client";

import { useState, type CSSProperties } from "react";

// 公共容器：把按钮贴在 iOS Home Indicator 顶部（底部 34px 是 home indicator 区域，必须流出），
// 宽度充满 + 左右各 24px 外边距
function FullWidthButtonShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 34,
        paddingLeft: 24,
        paddingRight: 24,
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
}

const BASE_BUTTON_STYLE: CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export function ButtonScalePreview() {
  const [pressed, setPressed] = useState(false);
  return (
    <FullWidthButtonShell>
      <button
        className="py-3.5 rounded-full bg-neutral-900 text-white font-semibold text-base border-none cursor-pointer select-none"
        style={{
          ...BASE_BUTTON_STYLE,
          transform: pressed ? "scale(0.95)" : "scale(1)",
          opacity: pressed ? 0.85 : 1,
          transition: "transform 0.1s ease-in-out, opacity 0.1s ease-in-out",
        }}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
      >
        Button
      </button>
    </FullWidthButtonShell>
  );
}

export function ButtonHighlightPreview() {
  const [pressed, setPressed] = useState(false);
  return (
    <FullWidthButtonShell>
      <button
        className="py-3.5 rounded-full text-white font-semibold text-base border-none cursor-pointer select-none"
        style={{
          ...BASE_BUTTON_STYLE,
          background: pressed ? "#0051D5" : "#007AFF",
          transition: "background 0.08s ease-out",
        }}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
      >
        Tap Me
      </button>
    </FullWidthButtonShell>
  );
}

export function ButtonDepthPreview() {
  const [pressed, setPressed] = useState(false);
  const DEPTH = 5;
  return (
    <FullWidthButtonShell>
      <button
        className="py-3.5 rounded-full text-white font-semibold text-base border-none cursor-pointer select-none"
        style={{
          ...BASE_BUTTON_STYLE,
          background: "#007AFF",
          transform: pressed ? `translateY(${DEPTH}px)` : "translateY(0)",
          boxShadow: pressed
            ? `0 0 0 #0060C8`
            : `0 ${DEPTH}px 0 #0060C8`,
          transition:
            "transform 0.1s cubic-bezier(0.32, 0.72, 0, 1), box-shadow 0.1s cubic-bezier(0.32, 0.72, 0, 1)",
          marginBottom: DEPTH,
        }}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
      >
        Press
      </button>
    </FullWidthButtonShell>
  );
}
