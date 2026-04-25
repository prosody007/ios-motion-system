"use client";

import { useState } from "react";

export function SheetPreview() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="px-4 py-1.5 rounded-lg bg-neutral-900 text-white text-xs font-semibold border-none cursor-pointer relative z-10"
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
      >
        Show Sheet
      </button>
      <div
        className="absolute bottom-0 left-1/2 w-44 h-28 rounded-t-xl flex items-start justify-center pt-2.5"
        style={{
          background: "#ffffff",
          transform: open ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(100%)",
          transition: "transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)",
          boxShadow: "0 -8px 28px rgba(0,0,0,0.16)",
        }}
      >
        <div className="w-9 h-1 rounded-full" style={{ background: "rgba(60,60,67,0.3)" }} />
      </div>
    </>
  );
}
