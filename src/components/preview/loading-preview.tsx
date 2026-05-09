"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";

export function LoadingPreview() {
  return (
    <div className="w-8 h-8 border-[3px] border-neutral-200 border-t-neutral-700 rounded-full animate-spin" />
  );
}

export function LoadingGrowPreview() {
  const rawId = useId();
  const id = rawId.replace(/:/g, "");
  const growName = `loading-grow-${id}`;
  const [runId, setRunId] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCompleted(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [runId]);

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <style>{`
        @keyframes ${growName} {
          0% {
            stroke-dasharray: 0 69.12;
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dasharray: 69.12 0;
            stroke-dashoffset: 0;
          }
        }
      `}</style>
      <svg key={runId} width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
        <circle
          cx="16"
          cy="16"
          r="11"
          fill="none"
          stroke="rgba(23,23,23,0.10)"
          strokeWidth="3"
        />
        <circle
          cx="16"
          cy="16"
          r="11"
          fill="none"
          stroke="rgba(23,23,23,0.82)"
          strokeWidth="3"
          strokeLinecap="round"
          transform="rotate(-90 16 16)"
          style={{
            animation: `${growName} 3s cubic-bezier(0.32, 0.72, 0, 1) forwards`,
          }}
        />
      </svg>
      {completed && (
        <button
          type="button"
          className="rounded-full border-none px-3 py-1 text-[11px] font-medium cursor-pointer"
          style={{
            position: "absolute",
            left: "50%",
            top: "calc(50% + 56px)",
            transform: "translateX(-50%)",
            background: "rgba(0,122,255,0.10)",
            color: "#007AFF",
          }}
          onClick={() => {
            setCompleted(false);
            setRunId((value) => value + 1);
          }}
        >
          Reset
        </button>
      )}
    </div>
  );
}

const RECORDING_BAR_CONFIG = [
  { x: 2, y: 9, width: 2, height: 6, minScale: 0.45, delay: -0.42 },
  { x: 6.5, y: 6, width: 2, height: 12, minScale: 0.5, delay: -0.28 },
  { x: 11, y: 2.5, width: 2, height: 19, minScale: 0.55, delay: -0.14 },
  { x: 15.5, y: 6, width: 2, height: 12, minScale: 0.5, delay: 0 },
  { x: 20, y: 9, width: 2, height: 6, minScale: 0.45, delay: 0.14 },
];

export function LoadingRecordingBarsPreview() {
  const rawId = useId();
  const id = rawId.replace(/:/g, "");
  const waveName = `loading-recording-wave-${id}`;
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const elapsedBeforeRunRef = useRef(0);
  const runStartRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRunning) return;

    runStartRef.current = performance.now();

    const timer = window.setInterval(() => {
      if (runStartRef.current === null) return;
      const current =
        elapsedBeforeRunRef.current + (performance.now() - runStartRef.current);
      setElapsedMs(current);
    }, 33);

    return () => {
      window.clearInterval(timer);
      if (runStartRef.current !== null) {
        elapsedBeforeRunRef.current += performance.now() - runStartRef.current;
        runStartRef.current = null;
        setElapsedMs(elapsedBeforeRunRef.current);
      }
    };
  }, [isRunning]);

  const totalSeconds = Math.floor(elapsedMs / 1000);
  const hours = Math.floor(totalSeconds / 3600) % 100;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const seconds = totalSeconds % 60;
  const timeText = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0",
  )}:${String(seconds).padStart(2, "0")}`;
  const timeChars = timeText.split("");

  return (
    <div className="flex h-full w-full items-center justify-center">
      <style>{`
        @keyframes ${waveName} {
          0%, 100% {
            transform: scale(1, var(--rec-min-scale));
            opacity: 0.72;
          }
          50% {
            transform: scale(1, 1);
            opacity: 1;
          }
        }
      `}</style>
      <div
        style={{
          width: 176,
          height: 56,
          borderRadius: 28,
          background: "#FFFFFF",
          boxShadow: "0px 10px 40px 0px rgba(38, 81, 149, 0.16)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          padding: "0 16px",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          aria-hidden="true"
          focusable="false"
          style={{ flex: "0 0 24px" }}
        >
          {RECORDING_BAR_CONFIG.map((bar, index) => {
            const rectStyle: CSSProperties & Record<string, string | number> = {
              fill: "#007AFF",
              transformBox: "fill-box",
              transformOrigin: "center center",
              animationName: isRunning ? waveName : "none",
              animationDuration: isRunning ? "1.0s" : "0s",
              animationTimingFunction: isRunning ? "ease-in-out" : "linear",
              animationIterationCount: isRunning ? "infinite" : 1,
              animationDelay: isRunning ? `${bar.delay}s` : "0s",
              transform: isRunning ? undefined : `scale(1, ${bar.minScale})`,
              opacity: isRunning ? undefined : 0.72,
              "--rec-min-scale": bar.minScale,
            };

            return (
              <rect
                key={index}
                x={bar.x}
                y={bar.y}
                width={bar.width}
                height={bar.height}
                rx={1}
                style={rectStyle}
              />
            );
          })}
        </svg>

        <span
          style={{
            fontFamily:
              "Poppins, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
            fontStyle: "normal",
            fontWeight: 500,
            fontSize: 16,
            lineHeight: "24px",
            color: "#111111",
            width: 72,
            flex: "0 0 72px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            letterSpacing: 0,
          }}
        >
          {timeChars.map((char, index) => (
            <span
              key={`${char}-${index}`}
              style={{
                width: char === ":" ? 6 : 10,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flex: "0 0 auto",
              }}
            >
              {char}
            </span>
          ))}
        </span>

        <button
          type="button"
          onClick={() => setIsRunning((prev) => !prev)}
          aria-label={isRunning ? "Pause recording" : "Start recording"}
          style={{
            width: 24,
            height: 24,
            border: "none",
            background: "transparent",
            padding: 0,
            margin: 0,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flex: "0 0 24px",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              isRunning
                ? "/figma/recording-icon/record-pause.svg"
                : "/figma/recording-icon/record-play.svg"
            }
            alt=""
            width={24}
            height={24}
            draggable={false}
            style={{ display: "block", userSelect: "none", pointerEvents: "none" }}
          />
        </button>
      </div>
    </div>
  );
}
