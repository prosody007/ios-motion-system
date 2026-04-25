"use client";

import { useState } from "react";

export function AlertPreview() {
  const [show, setShow] = useState(false);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden">
      <button
        className="px-5 py-2 rounded-xl text-sm font-medium border-none cursor-pointer"
        style={{ background: "rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.7)" }}
        onClick={(e) => { e.stopPropagation(); setShow(true); }}
      >
        Show Alert
      </button>

      {/* Backdrop */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: "rgba(0,0,0,0.25)",
          opacity: show ? 1 : 0,
          pointerEvents: show ? "auto" : "none",
          transition: "opacity 0.2s ease",
        }}
        onClick={() => setShow(false)}
      />

      {/* Alert dialog (iOS light material) */}
      <div
        className="absolute z-20 flex flex-col items-center rounded-2xl overflow-hidden"
        style={{
          width: 220,
          background: "rgba(250,250,252,0.96)",
          backdropFilter: "blur(40px)",
          transform: show ? "scale(1)" : "scale(1.1)",
          opacity: show ? 1 : 0,
          pointerEvents: show ? "auto" : "none",
          transition: show
            ? "all 0.25s cubic-bezier(0.32, 0.72, 0, 1)"
            : "all 0.15s ease-in",
          boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
        }}
      >
        <div className="px-5 pt-5 pb-3 text-center">
          <div className="text-sm font-bold text-neutral-900 mb-1">Delete Item?</div>
          <div className="text-xs text-neutral-500 leading-relaxed">This action cannot be undone.</div>
        </div>
        <div className="w-full" style={{ borderTop: "1px solid rgba(60,60,67,0.18)" }}>
          <button
            className="w-full py-3 text-sm font-medium border-none cursor-pointer bg-transparent"
            style={{ color: "#ff3b30", borderBottom: "1px solid rgba(60,60,67,0.18)" }}
            onClick={(e) => { e.stopPropagation(); setShow(false); }}
          >
            Delete
          </button>
          <button
            className="w-full py-3 text-sm font-semibold border-none cursor-pointer bg-transparent"
            style={{ color: "#007aff" }}
            onClick={(e) => { e.stopPropagation(); setShow(false); }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
