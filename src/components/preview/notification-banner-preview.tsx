"use client";

import { useState, useEffect } from "react";

export function NotificationBannerPreview() {
  const [visible, setVisible] = useState(false);

  const show = () => {
    setVisible(true);
  };

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden">
      {/* Banner (iOS light material) */}
      <div
        className="absolute top-2 left-3 right-3 z-10 flex items-center gap-3 px-4 py-3 rounded-2xl"
        style={{
          background: "rgba(250,250,252,0.92)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 6px 22px rgba(0,0,0,0.14)",
          transform: visible ? "translateY(0)" : "translateY(calc(-100% - 16px))",
          opacity: visible ? 1 : 0,
          transition: visible
            ? "all 0.4s cubic-bezier(0.32, 0.72, 0, 1)"
            : "all 0.3s cubic-bezier(0.4, 0, 1, 1)",
        }}
      >
        <div className="w-8 h-8 rounded-lg bg-[#007AFF] flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
            <path d="M7 2V7L10 9" />
            <circle cx="7" cy="7" r="5.5" />
          </svg>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-neutral-900 truncate">Reminder</span>
          <span className="text-xs text-neutral-500 truncate">Meeting in 15 minutes</span>
        </div>
      </div>

      <button
        className="px-5 py-2 rounded-xl text-sm font-medium border-none cursor-pointer"
        style={{ background: "rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.7)" }}
        onClick={(e) => { e.stopPropagation(); show(); }}
      >
        Send Notification
      </button>
    </div>
  );
}
