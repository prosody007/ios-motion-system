"use client";

import { useState } from "react";

const DRAW_EASE = "cubic-bezier(0.34, 1.2, 0.64, 1)";

function GrowingCheck({
  size = 16,
  color = "#ffffff",
  strokeWidth = 2,
  shown,
  delay = 0.05,
}: {
  size?: number;
  color?: string;
  strokeWidth?: number;
  shown: boolean;
  delay?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      style={{
        opacity: shown ? 1 : 0,
        transition: shown
          ? "opacity 0.1s ease-out"
          : "opacity 0.15s ease-in",
      }}
    >
      <path
        d="M4 9.5L7.8 13L14 5.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={shown ? 0 : 1}
        style={{
          transition: shown
            ? `stroke-dashoffset 0.32s ${DRAW_EASE} ${delay}s`
            : `stroke-dashoffset 0.01s linear 0.15s`,
        }}
      />
    </svg>
  );
}

export function CheckboxPreview() {
  const [tasks, setTasks] = useState([
    { id: 1, label: "Buy groceries", done: false },
    { id: 2, label: "Schedule meeting", done: true },
    { id: 3, label: "Reply to emails", done: false },
  ]);

  const toggle = (id: number) =>
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  return (
    <div className="w-full max-w-[240px] flex flex-col gap-0.5 select-none">
      {tasks.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-3 px-2 py-2 cursor-pointer rounded-lg"
          onClick={() => toggle(t.id)}
        >
          <div
            className="w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0 relative"
            style={{
              border: `1.5px solid ${t.done ? "#007AFF" : "rgba(60,60,67,0.3)"}`,
              background: t.done ? "#007AFF" : "transparent",
              transform: `scale(${t.done ? 1 : 0.95})`,
              transition: `background 0.2s ease-out, border-color 0.2s ease-out, transform 0.25s ${DRAW_EASE}`,
            }}
          >
            <GrowingCheck size={14} color="#ffffff" strokeWidth={2.2} shown={t.done} />
          </div>
          <span
            className="text-sm relative"
            style={{
              color: t.done ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.85)",
              transition: "color 0.25s ease-out",
            }}
          >
            {t.label}
            <span
              className="absolute left-0 top-1/2 h-[1px]"
              style={{
                background: "rgba(0,0,0,0.4)",
                width: t.done ? "100%" : 0,
                transition: `width 0.3s ${DRAW_EASE}`,
              }}
            />
          </span>
        </div>
      ))}
    </div>
  );
}

export function ConsentCheckPreview() {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="w-full max-w-[320px] select-none">
      <div
        className="flex items-start gap-3 cursor-pointer py-1"
        onClick={() => setAgreed((v) => !v)}
      >
        <div
          className="w-[20px] h-[20px] rounded-[6px] flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{
            border: `1.5px solid ${agreed ? "#007AFF" : "rgba(60,60,67,0.35)"}`,
            background: agreed ? "#007AFF" : "transparent",
            transform: `scale(${agreed ? 1 : 0.95})`,
            transition: `background 0.2s ease-out, border-color 0.2s ease-out, transform 0.25s ${DRAW_EASE}`,
          }}
        >
          <GrowingCheck size={14} color="#ffffff" strokeWidth={2.4} shown={agreed} />
        </div>
        <span className="text-xs leading-relaxed text-neutral-700 whitespace-nowrap">
          我已阅读并同意
          <span className="text-[#007AFF]" style={{ textDecoration: "underline" }} onClick={(e) => e.stopPropagation()}>
            《服务协议》
          </span>
          和
          <span className="text-[#007AFF]" style={{ textDecoration: "underline" }} onClick={(e) => e.stopPropagation()}>
            《隐私政策》
          </span>
        </span>
      </div>

      <button
        type="button"
        disabled={!agreed}
        className="mt-3 w-full h-9 rounded-full text-sm font-medium border-none cursor-pointer"
        style={{
          background: agreed ? "#007AFF" : "rgba(0,122,255,0.3)",
          color: "#ffffff",
          transition: "background 0.25s ease-out",
          cursor: agreed ? "pointer" : "not-allowed",
        }}
      >
        下一步
      </button>
    </div>
  );
}

export function RadioPreview() {
  const [selected, setSelected] = useState(0);
  const options = ["Wi-Fi", "蓝牙", "蜂窝网络"];

  return (
    <div className="w-full max-w-[240px] flex flex-col select-none bg-white rounded-xl overflow-hidden"
      style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.04)" }}
    >
      {options.map((opt, i) => (
        <div
          key={opt}
          className="flex items-center justify-between px-3.5 py-3 cursor-pointer"
          style={{
            borderTop: i === 0 ? "none" : "1px solid rgba(60,60,67,0.12)",
          }}
          onClick={() => setSelected(i)}
        >
          <span className="text-sm text-neutral-800">{opt}</span>
          <GrowingCheck size={17} color="#007AFF" strokeWidth={2.2} shown={selected === i} />
        </div>
      ))}
    </div>
  );
}
