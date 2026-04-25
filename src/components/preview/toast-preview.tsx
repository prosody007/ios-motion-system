"use client";

import { useState, useEffect, useCallback } from "react";

export function ToastPreview() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setVisible(false), 2500);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden">
      {/* Toast from top */}
      <div
        className="absolute top-3 left-1/2 flex items-center gap-2 px-4 py-2.5 rounded-full z-10"
        style={{
          transform: visible ? "translate(-50%, 0)" : "translate(-50%, -60px)",
          opacity: visible ? 1 : 0,
          background: "rgba(50, 50, 55, 0.95)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          transition: visible
            ? "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)"
            : "all 0.3s cubic-bezier(0.4, 0, 1, 1)",
        }}
      >
        <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1.5 4.5L3 6L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="text-sm text-white whitespace-nowrap">已保存</span>
      </div>

      <button
        className="px-5 py-2 rounded-xl text-sm font-medium border-none cursor-pointer"
        style={{ background: "rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.7)" }}
        onClick={(e) => { e.stopPropagation(); setVisible(true); }}
      >
        Show Toast
      </button>
    </div>
  );
}

export function SnackbarPreview() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden">
      {/* Snackbar from bottom */}
      <div
        className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-4 py-3 rounded-2xl z-10"
        style={{
          transform: visible ? "translateY(0)" : "translateY(80px)",
          opacity: visible ? 1 : 0,
          background: "rgba(55, 55, 60, 0.97)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 -2px 20px rgba(0,0,0,0.25)",
          transition: visible
            ? "all 0.35s cubic-bezier(0.25, 1, 0.5, 1)"
            : "all 0.25s cubic-bezier(0.4, 0, 1, 1)",
        }}
      >
        <span className="text-sm text-white/80">Item deleted</span>
        <button
          className="text-sm font-semibold border-none bg-transparent cursor-pointer"
          style={{ color: "#3395FF" }}
          onClick={(e) => { e.stopPropagation(); setVisible(false); }}
        >
          Undo
        </button>
      </div>

      <button
        className="px-5 py-2 rounded-xl text-sm font-medium border-none cursor-pointer"
        style={{ background: "rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.7)" }}
        onClick={(e) => { e.stopPropagation(); setVisible(true); }}
      >
        Delete Item
      </button>
    </div>
  );
}
