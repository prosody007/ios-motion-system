"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const TRIGGER = 55;
const MAX_PULL = 140;
const DAMP = 0.55;
const RUBBER_K = 70;

const SNAP_EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const SNAP_DURATION = 0.32;

const SPINNER_SIZE = 22;
const STROKE = 2.2;
const RADIUS = (SPINNER_SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * RADIUS;
const ARC_OFFSET = CIRC * 0.28; // 72% 圆弧

const ROTATE_DURATION = 0.75;
const ROTATE_COUNT = 3;
const REFRESH_MS = ROTATE_DURATION * 1000 * ROTATE_COUNT;

type Phase = "idle" | "pulling" | "armed" | "refreshing";

export function PullRefreshPreview() {
  const [pullY, setPullY] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [isDragging, setIsDragging] = useState(false);

  const startYRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const pendingYRef = useRef(0);
  const activePointerIdRef = useRef<number | null>(null);
  const phaseRef = useRef<Phase>("idle");

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const cancelRaf = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const flushPullY = useCallback(() => {
    rafRef.current = null;
    const y = pendingYRef.current;
    setPullY(y);
    setPhase(y >= TRIGGER ? "armed" : y > 0 ? "pulling" : "idle");
  }, []);

  const scheduleUpdate = useCallback(
    (y: number) => {
      pendingYRef.current = y;
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(flushPullY);
      }
    },
    [flushPullY]
  );

  const endDrag = useCallback(() => {
    if (activePointerIdRef.current == null) return;
    activePointerIdRef.current = null;
    cancelRaf();
    const finalY = pendingYRef.current;
    setIsDragging(false);
    if (finalY >= TRIGGER) {
      setPullY(TRIGGER);
      setPhase("refreshing");
      window.setTimeout(() => {
        setPullY(0);
        setPhase("idle");
      }, REFRESH_MS);
    } else {
      setPullY(0);
      setPhase("idle");
    }
  }, [cancelRaf]);

  // 全局 pointermove / pointerup / pointercancel —— 杜绝鼠标拖出视窗卡住
  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: PointerEvent) => {
      if (e.pointerId !== activePointerIdRef.current) return;
      const raw = e.clientY - startYRef.current;
      let y = 0;
      if (raw > 0) {
        if (raw * DAMP <= TRIGGER) {
          y = raw * DAMP;
        } else {
          const past = raw - TRIGGER / DAMP;
          const span = MAX_PULL - TRIGGER;
          y = TRIGGER + span * (1 - Math.exp(-past / RUBBER_K));
        }
        y = Math.min(y, MAX_PULL);
      }
      scheduleUpdate(y);
    };

    const handleUp = (e: PointerEvent) => {
      if (e.pointerId !== activePointerIdRef.current) return;
      endDrag();
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerup", handleUp, { passive: true });
    window.addEventListener("pointercancel", handleUp, { passive: true });
    // 浏览器失焦 / 切 tab 时兜底
    window.addEventListener("blur", endDrag);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
      window.removeEventListener("blur", endDrag);
    };
  }, [isDragging, scheduleUpdate, endDrag]);

  useEffect(() => () => cancelRaf(), [cancelRaf]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (phaseRef.current === "refreshing") return;
    activePointerIdRef.current = e.pointerId;
    startYRef.current = e.clientY;
    pendingYRef.current = 0;
    setIsDragging(true);
  }, []);

  const progress = Math.max(0, Math.min(1, pullY / TRIGGER));
  const overshoot = Math.max(
    0,
    Math.min(1, (pullY - TRIGGER) / (MAX_PULL - TRIGGER))
  );
  const spinnerScale =
    phase === "refreshing" ? 1 : 0.7 + progress * 0.3 + overshoot * 0.06;
  const spinnerOpacity = phase === "refreshing" ? 1 : progress;

  const useSnapTransition = !isDragging;
  const contentTransition = useSnapTransition
    ? `transform ${SNAP_DURATION}s ${SNAP_EASE}`
    : "none";
  const spinnerTransition = useSnapTransition
    ? `opacity ${SNAP_DURATION}s ${SNAP_EASE}, transform ${SNAP_DURATION}s ${SNAP_EASE}`
    : "none";

  const statusText =
    phase === "refreshing"
      ? "刷新中…"
      : phase === "armed"
        ? "松开刷新"
        : phase === "pulling"
          ? ""
          : "↓ 下拉刷新";

  return (
    <div className="w-full max-w-[240px] flex flex-col items-center select-none">
      <div className="relative w-full">
        <div
          className="absolute z-0 left-1/2"
          style={{
            top: 10,
            opacity: spinnerOpacity,
            transform: `translateX(-50%) scale(${spinnerScale})`,
            transition: spinnerTransition,
            willChange: "transform, opacity",
          }}
        >
          <div
            style={{
              width: SPINNER_SIZE,
              height: SPINNER_SIZE,
              animation:
                phase === "refreshing"
                  ? `prRotate ${ROTATE_DURATION}s linear ${ROTATE_COUNT}`
                  : "none",
            }}
          >
            <svg
              width={SPINNER_SIZE}
              height={SPINNER_SIZE}
              viewBox={`0 0 ${SPINNER_SIZE} ${SPINNER_SIZE}`}
            >
              <circle
                cx={SPINNER_SIZE / 2}
                cy={SPINNER_SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke="rgba(60,60,67,0.15)"
                strokeWidth={STROKE}
              />
              <circle
                cx={SPINNER_SIZE / 2}
                cy={SPINNER_SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke="rgba(60,60,67,0.75)"
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={ARC_OFFSET}
                transform={`rotate(-90 ${SPINNER_SIZE / 2} ${SPINNER_SIZE / 2})`}
              />
            </svg>
          </div>
        </div>

        <div
          className="relative z-10 w-full flex flex-col gap-1 touch-none cursor-grab active:cursor-grabbing"
          onPointerDown={onPointerDown}
          style={{
            transform: `translate3d(0, ${pullY}px, 0)`,
            transition: contentTransition,
            willChange: "transform",
          }}
        >
          {["Today", "Yesterday", "Last Week", "Older"].map((item) => (
            <div
              key={item}
              className="px-3 py-2.5 rounded-lg text-sm text-neutral-700"
              style={{
                background: "#ffffff",
                boxShadow: "0 1px 0 rgba(0,0,0,0.04)",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <span
        className="text-xs text-neutral-400 mt-4 tabular-nums"
        style={{
          opacity: statusText ? 1 : 0,
          transition: "opacity 0.2s ease",
          lineHeight: 1.2,
        }}
      >
        {statusText || "\u00A0"}
      </span>

      <style>{`
        @keyframes prRotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
