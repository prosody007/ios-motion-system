"use client";

import { useState, useRef, useCallback } from "react";

const COLORS = [
  "from-[#3395FF] to-[#0051D5]",
  "from-[#C88BE8] to-[#8E2CC4]",
  "from-[#FF5A7A] to-[#E01E45]",
  "from-[#FFB84D] to-[#E67E00]",
  "from-emerald-400 to-emerald-600",
  "from-[#6DC8EF] to-[#2395CA]",
  "from-rose-400 to-rose-600",
];

export function SwipeCardsPreview() {
  const [stack, setStack] = useState([0, 1, 2, 3, 4]);
  const topRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ sx: 0, sy: 0, active: false });
  const THRESHOLD = 80;

  const onDown = useCallback((e: React.PointerEvent) => {
    if (!topRef.current) return;
    drag.current = { sx: e.clientX, sy: e.clientY, active: true };
    topRef.current.style.transition = "none";
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onMove = useCallback((e: React.PointerEvent) => {
    if (!drag.current.active || !topRef.current) return;
    const dx = e.clientX - drag.current.sx;
    const dy = (e.clientY - drag.current.sy) * 0.3;
    const rotation = dx / 18;
    topRef.current.style.transform = `translate(${dx}px, ${dy}px) rotate(${rotation}deg)`;

    const progress = Math.min(Math.abs(dx) / 200, 1);
    topRef.current.style.opacity = String(1 - progress * 0.3);
  }, []);

  const onUp = useCallback(() => {
    if (!drag.current.active || !topRef.current) return;
    drag.current.active = false;
    const el = topRef.current;
    const matrix = new DOMMatrix(getComputedStyle(el).transform);
    const dx = matrix.m41;

    if (Math.abs(dx) > THRESHOLD) {
      const dir = dx > 0 ? 1 : -1;
      el.style.transition = "all 0.35s cubic-bezier(0.32, 0.72, 0, 1)";
      el.style.transform = `translate(${dir * 400}px, -30px) rotate(${dir * 25}deg)`;
      el.style.opacity = "0";
      setTimeout(() => {
        setStack((s) => {
          const [, ...rest] = s;
          return [...rest, s[0]];
        });
        if (topRef.current) {
          topRef.current.style.transition = "none";
          topRef.current.style.transform = "translate(0, 0) rotate(0deg)";
          topRef.current.style.opacity = "1";
        }
      }, 300);
    } else {
      el.style.transition = "all 0.4s cubic-bezier(0.32, 0.72, 0, 1)";
      el.style.transform = "translate(0, 0) rotate(0deg)";
      el.style.opacity = "1";
    }
  }, []);

  const visible = stack.slice(0, 3);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      {visible.map((cardIdx, i) => {
        const isTop = i === 0;
        const depth = i;
        return (
          <div
            key={`${cardIdx}-${i}`}
            ref={isTop ? topRef : undefined}
            className={`absolute w-[140px] h-[180px] rounded-2xl bg-gradient-to-br ${COLORS[cardIdx % COLORS.length]} flex flex-col items-center justify-center text-white will-change-transform ${isTop ? "cursor-grab active:cursor-grabbing touch-none" : ""}`}
            style={{
              zIndex: 3 - depth,
              transform: `scale(${1 - depth * 0.06}) translateY(${depth * 10}px)`,
              transition: isTop ? "none" : "all 0.4s cubic-bezier(0.32, 0.72, 0, 1)",
              filter: depth > 0 ? `brightness(${1 - depth * 0.08})` : "none",
            }}
            onPointerDown={isTop ? onDown : undefined}
            onPointerMove={isTop ? onMove : undefined}
            onPointerUp={isTop ? onUp : undefined}
            onPointerCancel={isTop ? onUp : undefined}
          >
            <span className="text-2xl font-bold">{cardIdx + 1}</span>
            <span className="text-xs text-white/50 mt-1">Card</span>
          </div>
        );
      })}
    </div>
  );
}
