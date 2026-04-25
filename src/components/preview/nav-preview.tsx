"use client";

import { useState } from "react";

export function NavPushPreview() {
  const [pushed, setPushed] = useState(false);
  return (
    <div
      className="flex w-48 h-24 overflow-hidden rounded-lg cursor-pointer"
      style={{ border: "1px solid rgba(0,0,0,0.08)" }}
      onClick={() => setPushed((p) => !p)}
    >
      <div
        className="min-w-full h-full flex items-center justify-center font-semibold text-xs"
        style={{
          background: "#ffffff",
          color: "rgba(0,0,0,0.75)",
          transform: pushed ? "translateX(-100%)" : "translateX(0)",
          transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        Page 1 →
      </div>
      <div
        className="min-w-full h-full flex items-center justify-center font-semibold text-xs"
        style={{
          background: "#f5f5f7",
          color: "rgba(0,0,0,0.75)",
          transform: pushed ? "translateX(-100%)" : "translateX(0)",
          transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        ← Page 2
      </div>
    </div>
  );
}
