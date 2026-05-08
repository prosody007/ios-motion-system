"use client";

import { useEffect, useId, useState } from "react";

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
