"use client";

import { useState } from "react";

export function ActionSheetPreview() {
  const [show, setShow] = useState(false);
  const actions = ["拍照", "从相册选择", "从文件选择"];

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden">
      <button
        className="px-5 py-2 rounded-xl text-sm font-medium border-none cursor-pointer"
        style={{ background: "rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.7)" }}
        onClick={(e) => { e.stopPropagation(); setShow(true); }}
      >
        Choose Photo
      </button>

      {/* Backdrop */}
      <div
        className="absolute inset-0 z-10"
        style={{ background: "rgba(0,0,0,0.25)", opacity: show ? 1 : 0, pointerEvents: show ? "auto" : "none", transition: "opacity 0.25s ease" }}
        onClick={() => setShow(false)}
      />

      {/* Action sheet (iOS light material) */}
      <div
        className="absolute bottom-2 left-2 right-2 z-20 flex flex-col gap-1.5"
        style={{
          transform: show ? "translateY(0)" : "translateY(110%)",
          transition: show ? "transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)" : "transform 0.25s cubic-bezier(0.4, 0, 1, 1)",
        }}
      >
        <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(250,250,252,0.96)", backdropFilter: "blur(40px)" }}>
          {actions.map((action, i) => (
            <button
              key={action}
              className="w-full py-3 text-sm font-medium border-none cursor-pointer bg-transparent"
              style={{ color: "#007aff", borderTop: i > 0 ? "1px solid rgba(60,60,67,0.18)" : "none" }}
              onClick={(e) => { e.stopPropagation(); setShow(false); }}
            >
              {action}
            </button>
          ))}
        </div>
        <button
          className="w-full py-3 rounded-2xl text-sm font-bold border-none cursor-pointer"
          style={{ background: "rgba(250,250,252,0.96)", backdropFilter: "blur(40px)", color: "#007aff" }}
          onClick={(e) => { e.stopPropagation(); setShow(false); }}
        >
          取消
        </button>
      </div>
    </div>
  );
}
