"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function SliderPreview() {
  const [value, setValue] = useState(0.5);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const pointerDown = useRef(false);

  const updateValue = useCallback((clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setValue(ratio);
  }, []);

  const onDown = useCallback((e: React.PointerEvent) => {
    pointerDown.current = true;
    // 点击时保持过渡动画，让进度条平滑跳到目标位置
    updateValue(e.clientX);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [updateValue]);

  const onMove = useCallback((e: React.PointerEvent) => {
    if (!pointerDown.current) return;
    // 一旦开始拖动就关闭过渡，保证跟手
    if (!isDragging) setIsDragging(true);
    updateValue(e.clientX);
  }, [updateValue, isDragging]);

  const onUp = useCallback(() => {
    pointerDown.current = false;
    setIsDragging(false);
  }, []);

  const transition = isDragging
    ? "none"
    : "left 0.25s cubic-bezier(0.32, 0.72, 0, 1), width 0.25s cubic-bezier(0.32, 0.72, 0, 1)";

  return (
    <div className="w-full max-w-[220px] flex flex-col items-center gap-3 select-none">
      <div
        ref={trackRef}
        className="relative w-full h-2 rounded-full cursor-pointer touch-none"
        style={{ background: "rgba(0,0,0,0.1)" }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-[#007AFF]"
          style={{
            width: `${value * 100}%`,
            transition: isDragging ? "none" : "width 0.25s cubic-bezier(0.32, 0.72, 0, 1)",
          }}
        />
        <div
          className="absolute top-1/2 w-5 h-5 rounded-full bg-white shadow-md border-2 border-[#007AFF]"
          style={{
            left: `${value * 100}%`,
            transform: "translate(-50%, -50%)",
            transition,
          }}
        />
      </div>
      <span className="text-xs text-neutral-500 font-mono">{Math.round(value * 100)}%</span>
    </div>
  );
}

export function StepperPreview() {
  const [count, setCount] = useState(1);
  const [pressedBtn, setPressedBtn] = useState<"up" | "down" | null>(null);
  const holdTimerRef = useRef<number | null>(null);
  const repeatTimerRef = useRef<number | null>(null);

  const MIN = 0;
  const MAX = 99;
  const disableDown = count <= MIN;
  const disableUp = count >= MAX;

  const clearTimers = useCallback(() => {
    if (holdTimerRef.current != null) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (repeatTimerRef.current != null) {
      window.clearTimeout(repeatTimerRef.current);
      repeatTimerRef.current = null;
    }
  }, []);

  const applyStep = useCallback((d: "up" | "down") => {
    setCount((c) => (d === "up" ? Math.min(c + 1, MAX) : Math.max(c - 1, MIN)));
  }, []);

  const startHold = useCallback((d: "up" | "down") => {
    setPressedBtn(d);
    applyStep(d);
    holdTimerRef.current = window.setTimeout(() => {
      let interval = 140;
      const tick = () => {
        applyStep(d);
        interval = Math.max(40, interval * 0.92);
        repeatTimerRef.current = window.setTimeout(tick, interval);
      };
      tick();
    }, 420);
  }, [applyStep]);

  const stopHold = useCallback(() => {
    clearTimers();
    setPressedBtn(null);
  }, [clearTimers]);

  useEffect(() => clearTimers, [clearTimers]);

  return (
    <div className="flex items-center gap-4 select-none">
      <StepBtn
        symbol="−"
        pressed={pressedBtn === "down"}
        onStart={() => startHold("down")}
        onEnd={stopHold}
        disabled={disableDown}
      />
      <div className="text-2xl font-semibold text-neutral-900 tabular-nums min-w-[44px] text-center">
        {count}
      </div>
      <StepBtn
        symbol="+"
        pressed={pressedBtn === "up"}
        onStart={() => startHold("up")}
        onEnd={stopHold}
        disabled={disableUp}
      />
    </div>
  );
}

function StepBtn({
  symbol,
  onStart,
  onEnd,
  disabled,
}: {
  symbol: string;
  pressed: boolean;
  onStart: () => void;
  onEnd: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      className="w-9 h-9 rounded-xl flex items-center justify-center text-neutral-900 text-lg font-bold border-none"
      style={{
        background: "rgba(0,0,0,0.06)",
        opacity: disabled ? 0.35 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "opacity 0.12s ease",
      }}
      onPointerDown={(e) => {
        if (disabled) return;
        e.stopPropagation();
        onStart();
      }}
      onPointerUp={(e) => { e.stopPropagation(); onEnd(); }}
      onPointerLeave={onEnd}
      onPointerCancel={onEnd}
    >
      {symbol}
    </button>
  );
}
