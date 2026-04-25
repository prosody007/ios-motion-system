"use client";

import { useState } from "react";

export function SkeletonPreview() {
  const [loaded, setLoaded] = useState(false);

  const toggle = () => {
    if (loaded) {
      setLoaded(false);
    } else {
      setLoaded(true);
    }
  };

  return (
    <div className="w-full max-w-[240px] flex flex-col items-center gap-3 select-none">
      <div className="w-full flex gap-3">
        {/* Avatar */}
        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          {!loaded && <div className="absolute inset-0 shimmerBg" />}
          <div
            className="absolute inset-0 rounded-full bg-[#007AFF] flex items-center justify-center text-white text-sm font-bold"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "scale(1)" : "scale(0.8)",
              transition: "all 0.35s cubic-bezier(0.32, 0.72, 0, 1)",
            }}
          >
            A
          </div>
        </div>

        {/* Text lines */}
        <div className="flex-1 flex flex-col gap-2 justify-center">
          <div className="relative h-3 rounded-full overflow-hidden">
            {!loaded && <div className="absolute inset-0 shimmerBg" style={{ width: "75%" }} />}
            <div
              className="h-full rounded-full"
              style={{
                background: "rgba(0,0,0,0.55)",
                width: loaded ? "75%" : "0%",
                transition: "width 0.4s cubic-bezier(0.32, 0.72, 0, 1) 0.1s",
              }}
            />
          </div>
          <div className="relative h-2.5 rounded-full overflow-hidden">
            {!loaded && <div className="absolute inset-0 shimmerBg" style={{ width: "50%" }} />}
            <div
              className="h-full rounded-full"
              style={{
                background: "rgba(0,0,0,0.3)",
                width: loaded ? "50%" : "0%",
                transition: "width 0.4s cubic-bezier(0.32, 0.72, 0, 1) 0.2s",
              }}
            />
          </div>
        </div>
      </div>

      {/* Content block */}
      <div className="w-full relative h-16 rounded-xl overflow-hidden">
        {!loaded && <div className="absolute inset-0 shimmerBg" />}
        <div
          className="absolute inset-0 rounded-xl flex items-center justify-center"
          style={{
            background: "#ffffff",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.3s ease 0.3s",
          }}
        >
          <span className="text-sm text-neutral-600">Content loaded</span>
        </div>
      </div>

      <button
        className="px-4 py-1.5 rounded-xl text-xs font-medium border-none cursor-pointer"
        style={{ background: "rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.7)" }}
        onClick={(e) => { e.stopPropagation(); toggle(); }}
      >
        {loaded ? "Reset" : "Load"}
      </button>

      <style>{`
        .shimmerBg {
          background: linear-gradient(90deg, rgba(0,0,0,0.05) 25%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0.05) 75%);
          background-size: 200% 100%;
          animation: shimmerAnim 1.5s linear infinite;
          border-radius: inherit;
        }
        @keyframes shimmerAnim { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
      `}</style>
    </div>
  );
}
