"use client";

import { useEffect, useRef, useState } from "react";

const SEGMENTS = ["Daily", "Weekly", "Monthly"];
const SPRING_EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

export function SegmentedPreview() {
  const [selected, setSelected] = useState(0);
  const [pressed, setPressed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState<{ left: number; width: number }[]>([]);

  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const buttons = containerRef.current.querySelectorAll("button");
      const next = Array.from(buttons).map((b) => {
        const el = b as HTMLElement;
        return { left: el.offsetLeft, width: el.offsetWidth };
      });
      setBounds(next);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const activeBounds = bounds[selected];
  const thumbLeft = activeBounds?.left ?? 0;
  const thumbWidth = activeBounds?.width ?? 0;

  return (
    <div
      ref={containerRef}
      className="relative flex rounded-full p-0.5 select-none"
      style={{ background: "rgba(118,118,128,0.12)" }}
    >
      <div
        className="absolute top-0.5 bottom-0.5 rounded-full bg-white pointer-events-none"
        style={{
          left: thumbLeft,
          width: thumbWidth,
          boxShadow:
            "0 3px 8px rgba(0,0,0,0.12), 0 3px 1px rgba(0,0,0,0.04), 0 0 0 0.5px rgba(0,0,0,0.04)",
          transform: `scale(${pressed ? 0.96 : 1})`,
          transformOrigin: "center",
          transition: `left 0.34s ${SPRING_EASE}, width 0.3s ${SPRING_EASE}, transform 0.15s ease-out`,
        }}
      />

      {SEGMENTS.map((seg, i) => (
        <button
          key={seg}
          type="button"
          className="relative z-[1] px-5 py-1.5 text-[13px] font-medium border-none cursor-pointer bg-transparent text-neutral-900"
          onPointerDown={() => setPressed(true)}
          onPointerUp={() => setPressed(false)}
          onPointerCancel={() => setPressed(false)}
          onPointerLeave={() => setPressed(false)}
          onClick={() => setSelected(i)}
        >
          {seg}
        </button>
      ))}
    </div>
  );
}
