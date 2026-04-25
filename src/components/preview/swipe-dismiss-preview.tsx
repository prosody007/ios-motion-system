"use client";

import { useState, useRef, useCallback } from "react";

export function SwipeDismissPreview() {
  const [dismissed, setDismissed] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const state = useRef({ sy: 0, dy: 0, dragging: false });

  const onDown = useCallback((e: React.PointerEvent) => {
    if (!cardRef.current || dismissed) return;
    state.current = { sy: e.clientY, dy: 0, dragging: true };
    cardRef.current.style.transition = "none";
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [dismissed]);

  const onMove = useCallback((e: React.PointerEvent) => {
    if (!state.current.dragging || !cardRef.current) return;
    const dy = Math.max(0, e.clientY - state.current.sy);
    state.current.dy = dy;
    const progress = Math.min(dy / 150, 1);
    cardRef.current.style.transform = `translateY(${dy}px) scale(${1 - progress * 0.08})`;
    cardRef.current.style.opacity = String(1 - progress * 0.5);
  }, []);

  const onUp = useCallback(() => {
    if (!state.current.dragging || !cardRef.current) return;
    state.current.dragging = false;
    cardRef.current.style.transition = "all 0.35s cubic-bezier(0.32, 0.72, 0, 1)";
    if (state.current.dy > 80) {
      cardRef.current.style.transform = "translateY(300px) scale(0.8)";
      cardRef.current.style.opacity = "0";
      setTimeout(() => setDismissed(true), 350);
    } else {
      cardRef.current.style.transform = "translateY(0) scale(1)";
      cardRef.current.style.opacity = "1";
    }
  }, []);

  const reset = () => {
    setDismissed(false);
    if (cardRef.current) {
      cardRef.current.style.transition = "none";
      cardRef.current.style.transform = "translateY(0) scale(1)";
      cardRef.current.style.opacity = "1";
    }
  };

  if (dismissed) {
    return (
      <div className="flex flex-col items-center gap-3 select-none">
        <span className="text-sm text-neutral-500">Dismissed</span>
        <button
          className="px-4 py-1.5 rounded-xl text-xs font-medium border-none cursor-pointer"
          style={{ background: "rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.7)" }}
          onClick={(e) => { e.stopPropagation(); reset(); }}
        >Reset</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <div
        ref={cardRef}
        className="w-36 h-24 rounded-2xl bg-gradient-to-br from-[#007AFF] to-[#5856D6] flex flex-col items-center justify-center text-white touch-none cursor-grab active:cursor-grabbing"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <span className="text-sm font-bold">Photo</span>
        <span className="text-xs text-white/40 mt-0.5">↓ swipe down</span>
      </div>
    </div>
  );
}
