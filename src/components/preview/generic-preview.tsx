"use client";

import { useState } from "react";

export function GenericPreview({ label }: { label: string }) {
  const [active, setActive] = useState(false);
  return (
    <div
      className="w-14 h-14 rounded-xl bg-[#007AFF] cursor-pointer flex items-center justify-center"
      style={{
        transform: active ? "scale(1.15)" : "scale(1)",
        transition: "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
        boxShadow: "0 4px 12px rgba(0,122,255,0.25)",
      }}
      onClick={() => setActive((a) => !a)}
      title={label}
    >
      <span className="text-white text-lg">▶</span>
    </div>
  );
}
