"use client";

import { useState, useEffect, useRef } from "react";

const rows = [
  { icon: "🔔", title: "Notifications", value: "On" },
  { icon: "🎨", title: "Appearance", value: "Auto" },
  { icon: "🔒", title: "Privacy", value: ">" },
  { icon: "📦", title: "Storage", value: "12.4 GB" },
  { icon: "ℹ️", title: "About", value: ">" },
];

const STAGGER = 70;
const ITEM_DURATION = 520;

export function StaggerPreview() {
  const [playKey, setPlayKey] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setVisibleCount(0);

    rows.forEach((_, i) => {
      const t = setTimeout(() => {
        setVisibleCount((c) => Math.max(c, i + 1));
      }, 60 + i * STAGGER);
      timersRef.current.push(t);
    });

    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, [playKey]);

  const replay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlayKey((k) => k + 1);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 select-none">
      <div className="w-[220px] flex flex-col gap-1.5">
        {rows.map((row, i) => {
          const isVisible = i < visibleCount;
          return (
            <div
              key={`${playKey}-${i}`}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl"
              style={{
                background: "#ffffff",
                boxShadow: "0 1px 0 rgba(0,0,0,0.04)",
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                  ? "translateY(0) scale(1)"
                  : "translateY(14px) scale(0.96)",
                transition: `opacity ${ITEM_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1), transform ${ITEM_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1)`,
                willChange: "transform, opacity",
              }}
            >
              <span className="text-base leading-none">{row.icon}</span>
              <span className="text-sm text-neutral-900 flex-1">{row.title}</span>
              <span className="text-xs text-neutral-400">{row.value}</span>
            </div>
          );
        })}
      </div>
      <button
        className="px-3.5 py-1.5 rounded-full text-xs font-medium border-none cursor-pointer transition-colors"
        style={{
          background: "rgba(0,0,0,0.06)",
          color: "rgba(0,0,0,0.7)",
        }}
        onClick={replay}
      >
        Replay
      </button>
    </div>
  );
}
