"use client";

import { useState } from "react";

export function DropdownPreview() {
  const [show, setShow] = useState(false);
  const items = ["Edit", "Duplicate", "Archive", "Delete"];

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      <div className="relative">
        <button
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border-none cursor-pointer"
          style={{ background: "rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.7)" }}
          onClick={(e) => { e.stopPropagation(); setShow((s) => !s); }}
        >
          Actions
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ stroke: "rgba(0,0,0,0.5)", strokeWidth: 1.5, strokeLinecap: "round" }}>
            <path d="M2.5 4L5 6.5L7.5 4" />
          </svg>
        </button>

        <div
          className="absolute top-full left-0 mt-1.5 rounded-2xl overflow-hidden"
          style={{
            minWidth: 140,
            background: "rgba(250,250,252,0.96)",
            backdropFilter: "blur(40px)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
            transform: show ? "scale(1) translateY(0)" : "scale(0.95) translateY(-4px)",
            opacity: show ? 1 : 0,
            transformOrigin: "top left",
            pointerEvents: show ? "auto" : "none",
            transition: show
              ? "all 0.2s cubic-bezier(0.32, 0.72, 0, 1)"
              : "all 0.12s ease-in",
          }}
        >
          {items.map((item, i) => (
            <button
              key={item}
              className="w-full px-4 py-2.5 text-sm font-medium text-left border-none cursor-pointer bg-transparent"
              style={{
                color: item === "Delete" ? "#ff3b30" : "#0a0a0a",
                borderTop: i > 0 ? "1px solid rgba(60,60,67,0.18)" : "none",
              }}
              onClick={(e) => { e.stopPropagation(); setShow(false); }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
