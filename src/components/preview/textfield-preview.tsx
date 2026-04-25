"use client";

import { useRef, useState } from "react";

const SMOOTH = "cubic-bezier(0.32, 0.72, 0, 1)";
const SHAKE_EASE = "cubic-bezier(0.36, 0.07, 0.19, 0.97)";

export function TextFieldFocusPreview() {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const labelUp = focused || value.length > 0;

  return (
    <div className="w-full max-w-[220px] select-none">
      <div
        className="relative cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        <span
          className="absolute pointer-events-none"
          style={{
            left: 12,
            top: "50%",
            fontSize: 14,
            lineHeight: 1,
            color: focused ? "#007AFF" : "rgba(0,0,0,0.4)",
            transformOrigin: "left center",
            transform: labelUp
              ? "translateY(-50%) translateY(-14px) scale(0.78)"
              : "translateY(-50%) scale(1)",
            transition: `transform 0.25s ${SMOOTH}, color 0.2s ease`,
            willChange: "transform",
          }}
        >
          Email
        </span>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent text-neutral-900 text-sm outline-none"
          style={{
            padding: "20px 12px 8px",
            border: "1.5px solid",
            borderColor: focused ? "#007AFF" : "rgba(0,0,0,0.15)",
            borderRadius: 10,
            transition: "border-color 0.2s ease",
            caretColor: "#007AFF",
          }}
        />
      </div>
    </div>
  );
}

export function TextFieldShakePreview() {
  const [shaking, setShaking] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [value, setValue] = useState("");

  const triggerShake = () => {
    if (shaking) return;
    setHasError(true);
    setShaking(true);
    window.setTimeout(() => setShaking(false), 450);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (hasError && e.target.value.length > 0) setHasError(false);
  };

  return (
    <div className="w-full max-w-[220px] flex flex-col items-center select-none">
      <div className="w-full">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="Enter password"
          className="w-full text-neutral-900 text-sm outline-none placeholder:text-neutral-400"
          style={{
            padding: "10px 12px",
            background: "rgba(0,0,0,0.04)",
            border: `1.5px solid ${hasError ? "#ef4444" : "rgba(0,0,0,0.1)"}`,
            borderRadius: 10,
            animation: shaking ? `fieldShake 0.45s ${SHAKE_EASE} both` : "none",
            transition: "border-color 0.2s ease",
            caretColor: "#007AFF",
          }}
        />
        <div
          className="flex items-center"
          style={{ height: 20, marginTop: 4 }}
        >
          <span
            className="text-xs"
            style={{
              color: "#ef4444",
              opacity: hasError ? 1 : 0,
              transform: `translateY(${hasError ? 0 : -3}px)`,
              transition: `opacity 0.18s ease, transform 0.2s ${SMOOTH}`,
            }}
          >
            密码不能为空
          </span>
        </div>
      </div>
      <button
        className="px-4 py-1.5 rounded-lg text-xs font-medium border-none cursor-pointer"
        style={{
          background: "rgba(0,0,0,0.06)",
          color: "rgba(0,0,0,0.7)",
          marginTop: 16,
        }}
        onClick={(e) => { e.stopPropagation(); triggerShake(); }}
      >
        Validate
      </button>
      <style>{`@keyframes fieldShake {
        0%   { transform: translateX(0) }
        10%  { transform: translateX(-10px) }
        25%  { transform: translateX(8px) }
        40%  { transform: translateX(-6px) }
        55%  { transform: translateX(4px) }
        70%  { transform: translateX(-2px) }
        85%  { transform: translateX(1px) }
        100% { transform: translateX(0) }
      }`}</style>
    </div>
  );
}
