"use client";

import { useState } from "react";

const TRACK_W = 52;
const TRACK_H = 32;
const KNOB_SIZE = 28;
const PAD = 2;
const TRAVEL = TRACK_W - KNOB_SIZE - PAD * 2;
const SPRING_EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

// 1. Standard iOS toggle
export function TogglePreview() {
  const [on, setOn] = useState(false);
  return (
    <div
      className="relative cursor-pointer"
      style={{
        width: TRACK_W,
        height: TRACK_H,
        borderRadius: TRACK_H / 2,
        background: on ? "#34c759" : "rgba(120,120,128,0.18)",
        transition: `background 0.25s ${SPRING_EASE}`,
      }}
      onClick={(e) => { e.stopPropagation(); setOn((o) => !o); }}
    >
      <div
        className="absolute"
        style={{
          width: KNOB_SIZE,
          height: KNOB_SIZE,
          top: (TRACK_H - KNOB_SIZE) / 2,
          left: PAD,
          borderRadius: KNOB_SIZE / 2,
          background: "#ffffff",
          transform: `translateX(${on ? TRAVEL : 0}px)`,
          transition: `transform 0.3s ${SPRING_EASE}`,
          boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
        }}
      />
    </div>
  );
}

// 2. Icon in knob — sun/moon, rotates + fades on toggle (dark mode toggle)
export function ToggleIconPreview() {
  const [on, setOn] = useState(false);
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative cursor-pointer"
        style={{
          width: TRACK_W,
          height: TRACK_H,
          borderRadius: TRACK_H / 2,
          background: on ? "#1e293b" : "#fde68a",
          transition: `background 0.3s ${SPRING_EASE}`,
        }}
        onClick={(e) => { e.stopPropagation(); setOn((o) => !o); }}
      >
        <div
          className="absolute flex items-center justify-center overflow-hidden"
          style={{
            width: KNOB_SIZE,
            height: KNOB_SIZE,
            top: (TRACK_H - KNOB_SIZE) / 2,
            left: PAD,
            borderRadius: KNOB_SIZE / 2,
            background: "#ffffff",
            transform: `translateX(${on ? TRAVEL : 0}px)`,
            transition: `transform 0.35s ${SPRING_EASE}`,
            boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              position: "absolute",
              opacity: on ? 0 : 1,
              transform: on ? "rotate(90deg) scale(0.5)" : "rotate(0) scale(1)",
              transition: `all 0.3s ${SPRING_EASE}`,
            }}
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="#1e293b"
            style={{
              position: "absolute",
              opacity: on ? 1 : 0,
              transform: on ? "rotate(0) scale(1)" : "rotate(-90deg) scale(0.5)",
              transition: `all 0.3s ${SPRING_EASE}`,
            }}
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </div>
      </div>
      <span className="text-xs text-neutral-400">{on ? "Dark mode" : "Light mode"}</span>
    </div>
  );
}

// 3. Segmented toggle — 2-option pill with sliding indicator
export function ToggleSegmentedPreview() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const options = [
    {
      key: "light" as const,
      label: "Light",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ),
    },
    {
      key: "dark" as const,
      label: "Dark",
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ),
    },
  ];
  const idx = options.findIndex((o) => o.key === mode);

  return (
    <div
      className="relative flex p-1 rounded-full"
      style={{ background: "rgba(120,120,128,0.16)", width: 160 }}
    >
      <div
        className="absolute top-1 bottom-1 rounded-full"
        style={{
          left: 4,
          width: "calc(50% - 4px)",
          background: "#ffffff",
          boxShadow: "0 2px 6px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)",
          transform: `translateX(${idx * 100}%)`,
          transition: `transform 0.4s ${SPRING_EASE}`,
        }}
      />
      {options.map((o) => (
        <button
          key={o.key}
          className="relative z-[1] flex-1 h-7 flex items-center justify-center gap-1.5 text-xs font-medium cursor-pointer"
          style={{
            color: mode === o.key ? "#0a0a0a" : "rgba(60,60,67,0.6)",
            transition: "color 0.25s",
            background: "transparent",
            border: "none",
          }}
          onClick={(e) => { e.stopPropagation(); setMode(o.key); }}
        >
          {o.icon}
          <span>{o.label}</span>
        </button>
      ))}
    </div>
  );
}
