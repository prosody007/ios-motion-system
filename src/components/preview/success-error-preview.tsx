"use client";

import { useState, useEffect } from "react";

export function SuccessCheckPreview() {
  const [done, setDone] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 300);
    return () => clearTimeout(t);
  }, [key]);

  const replay = () => {
    setDone(false);
    setTimeout(() => setKey((k) => k + 1), 100);
  };

  return (
    <div className="flex flex-col items-center gap-3 select-none" key={key}>
      <div className="relative w-16 h-16">
        {/* Circle */}
        <svg width="64" height="64" viewBox="0 0 64 64" className="absolute inset-0">
          <circle
            cx="32" cy="32" r="28" fill="none" stroke="#22c55e" strokeWidth="3"
            strokeDasharray={175.9}
            strokeDashoffset={done ? 0 : 175.9}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.5s cubic-bezier(0.25, 1, 0.5, 1)", transformOrigin: "center", transform: "rotate(-90deg)" }}
          />
        </svg>
        {/* Checkmark */}
        <svg width="64" height="64" viewBox="0 0 64 64" className="absolute inset-0">
          <path
            d="M20 33L28 41L44 25"
            fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={40}
            strokeDashoffset={done ? 0 : 40}
            style={{ transition: "stroke-dashoffset 0.4s cubic-bezier(0.25, 1, 0.5, 1) 0.3s" }}
          />
        </svg>
      </div>
      <span className="text-sm text-neutral-700" style={{ opacity: done ? 1 : 0, transition: "opacity 0.3s ease 0.5s" }}>
        Success!
      </span>
      <button
        className="px-4 py-1.5 rounded-xl text-xs font-medium border-none cursor-pointer"
        style={{ background: "rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.7)" }}
        onClick={(e) => { e.stopPropagation(); replay(); }}
      >
        Replay
      </button>
    </div>
  );
}

export function ErrorShakePreview() {
  const [shaking, setShaking] = useState(false);
  const [showError, setShowError] = useState(false);

  const trigger = () => {
    setShaking(true);
    setShowError(true);
    setTimeout(() => setShaking(false), 500);
  };

  const reset = () => {
    setShowError(false);
  };

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold"
        style={{
          background: showError ? "rgba(239,68,68,0.12)" : "rgba(0,0,0,0.05)",
          color: showError ? "#ef4444" : "rgba(0,0,0,0.4)",
          animation: shaking ? "errShake 0.4s ease-in-out" : "none",
          transition: "background 0.2s ease, color 0.2s ease",
        }}
      >
        ✗
      </div>
      <span className="text-sm" style={{ color: showError ? "#ef4444" : "rgba(0,0,0,0.55)", transition: "color 0.2s ease" }}>
        {showError ? "验证失败" : "Error state"}
      </span>
      <button
        className="px-4 py-1.5 rounded-xl text-xs font-medium border-none cursor-pointer"
        style={{ background: "rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.7)" }}
        onClick={(e) => { e.stopPropagation(); showError ? reset() : trigger(); }}
      >
        {showError ? "Reset" : "Trigger Error"}
      </button>
      <style>{`@keyframes errShake{0%,100%{transform:translateX(0)}15%{transform:translateX(-10px)}30%{transform:translateX(8px)}45%{transform:translateX(-5px)}60%{transform:translateX(3px)}75%{transform:translateX(-1px)}}`}</style>
    </div>
  );
}
