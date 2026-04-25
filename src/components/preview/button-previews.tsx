"use client";

import { useState } from "react";

export function ButtonScalePreview() {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      className="px-9 py-3.5 rounded-full bg-neutral-900 text-white font-semibold text-base border-none cursor-pointer select-none"
      style={{
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
  );
}

export function ButtonHighlightPreview() {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      className="px-9 py-3.5 rounded-full text-white font-semibold text-base border-none cursor-pointer select-none"
      style={{
        background: pressed ? "#0051D5" : "#007AFF",
        transition: "background 0.08s ease-out",
      }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
    >
      Tap Me
    </button>
  );
}

export function ButtonDepthPreview() {
  const [pressed, setPressed] = useState(false);
  const DEPTH = 5;
  return (
    <button
      className="px-9 py-3.5 rounded-full text-white font-semibold text-base border-none cursor-pointer select-none"
      style={{
        background: "#007AFF",
        transform: pressed ? `translateY(${DEPTH}px)` : "translateY(0)",
        boxShadow: pressed
          ? `0 0 0 #0060C8`
          : `0 ${DEPTH}px 0 #0060C8`,
        transition: "transform 0.1s cubic-bezier(0.32, 0.72, 0, 1), box-shadow 0.1s cubic-bezier(0.32, 0.72, 0, 1)",
        marginBottom: DEPTH,
      }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
    >
      Press
    </button>
  );
}
