"use client";

import { useRef, useCallback } from "react";

export function ScrollHeaderPreview() {
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);

  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollY = e.currentTarget.scrollTop;
    const progress = Math.min(scrollY / 60, 1);
    if (headerRef.current) {
      headerRef.current.style.background = `rgba(250,250,252,${progress * 0.85})`;
      headerRef.current.style.backdropFilter = `blur(${progress * 12}px)`;
      headerRef.current.style.borderBottom = progress > 0.5 ? "1px solid rgba(60,60,67,0.12)" : "1px solid transparent";
    }
    if (titleRef.current) {
      titleRef.current.style.opacity = String(progress);
      titleRef.current.style.transform = `translateY(${(1 - progress) * 8}px)`;
    }
  }, []);

  return (
    <div className="relative w-full max-w-[260px] h-[180px] rounded-2xl overflow-hidden select-none" style={{ background: "#ffffff", boxShadow: "0 1px 0 rgba(0,0,0,0.04)" }}>
      {/* Sticky header */}
      <div ref={headerRef} className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center h-10 px-3" style={{ background: "transparent" }}>
        <span ref={titleRef} className="text-sm font-bold text-neutral-900" style={{ opacity: 0 }}>Settings</span>
      </div>

      {/* Scrollable content */}
      <div className="h-full overflow-y-auto" style={{ scrollbarWidth: "none" }} onScroll={onScroll}>
        <div className="pt-4 px-3 pb-2">
          <span className="text-lg font-bold text-neutral-900">Settings</span>
        </div>
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="px-3 py-2.5 text-sm text-neutral-700" style={{ borderBottom: "1px solid rgba(60,60,67,0.12)" }}>
            Option {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ScrollParallaxPreview() {
  const imgRef = useRef<HTMLDivElement>(null);

  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollY = e.currentTarget.scrollTop;
    if (imgRef.current) {
      imgRef.current.style.transform = `translateY(${scrollY * 0.4}px)`;
    }
  }, []);

  return (
    <div className="relative w-full max-w-[260px] h-[180px] rounded-2xl overflow-hidden select-none" style={{ background: "#ffffff", boxShadow: "0 1px 0 rgba(0,0,0,0.04)" }}>
      <div className="h-full overflow-y-auto" style={{ scrollbarWidth: "none" }} onScroll={onScroll}>
        {/* Parallax image */}
        <div className="relative h-24 overflow-hidden">
          <div ref={imgRef} className="absolute inset-0 bg-gradient-to-br from-[#007AFF] to-[#5856D6] will-change-transform" style={{ height: "140%" }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-sm font-bold">Hero Image</span>
          </div>
        </div>
        {/* Content */}
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="px-3 py-2.5 text-sm text-neutral-700" style={{ borderBottom: "1px solid rgba(60,60,67,0.12)" }}>
            Content row {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
