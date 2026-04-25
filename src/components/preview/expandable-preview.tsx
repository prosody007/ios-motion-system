"use client";

import { useState } from "react";

const sections = [
  { title: "General", items: ["About", "Software Update"] },
  { title: "Display", items: ["Brightness", "Text Size", "Night Shift"] },
  { title: "Sound", items: ["Ringtone", "Vibration"] },
];

export function ExpandablePreview() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div className="w-full max-w-[240px] flex flex-col gap-1 select-none">
      {sections.map((sec, i) => {
        const isOpen = openIdx === i;
        return (
          <div key={sec.title} className="rounded-xl overflow-hidden" style={{ background: "#ffffff", boxShadow: "0 1px 0 rgba(0,0,0,0.04)" }}>
            <div
              className="flex items-center justify-between px-3 py-2.5 cursor-pointer"
              onClick={() => setOpenIdx(isOpen ? -1 : i)}
            >
              <span className="text-sm font-medium text-neutral-900">{sec.title}</span>
              <svg
                width="12" height="12" viewBox="0 0 12 12" fill="none"
                style={{
                  transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 0.25s cubic-bezier(0.32, 0.72, 0, 1)",
                  stroke: "rgba(60,60,67,0.55)",
                  strokeWidth: 1.5,
                  strokeLinecap: "round",
                }}
              >
                <path d="M4.5 2.5L7.5 6L4.5 9.5" />
              </svg>
            </div>

            <div
              style={{
                maxHeight: isOpen ? sec.items.length * 36 : 0,
                opacity: isOpen ? 1 : 0,
                overflow: "hidden",
                transition: "max-height 0.3s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.2s ease",
              }}
            >
              {sec.items.map((item) => (
                <div
                  key={item}
                  className="px-3 py-2 text-sm text-neutral-700 flex items-center justify-between"
                  style={{ borderTop: "1px solid rgba(60,60,67,0.12)" }}
                >
                  {item}
                  <span className="text-neutral-300 text-xs">›</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
