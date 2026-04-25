"use client";

import { useState, useCallback } from "react";

export function HapticImpactPreview() {
  const [active, setActive] = useState(-1);
  const levels = [
    { name: "light", size: 32, color: "bg-[#66B2FF]" },
    { name: "medium", size: 40, color: "bg-[#3395FF]" },
    { name: "heavy", size: 48, color: "bg-[#007AFF]" },
    { name: "rigid", size: 44, color: "bg-[#5856D6]" },
    { name: "soft", size: 36, color: "bg-[#0051D5]" },
  ];

  const tap = useCallback((i: number) => {
    setActive(i);
    setTimeout(() => setActive(-1), 250);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 px-4">
      <div className="flex items-end justify-center gap-3 w-full">
        {levels.map((l, i) => (
          <div key={l.name} className="flex flex-col items-center gap-1.5 flex-1">
            <div className="relative flex items-center justify-center">
              <div
                className={`absolute rounded-full ${l.color}/30`}
                style={{
                  width: active === i ? l.size + 24 : 0,
                  height: active === i ? l.size + 24 : 0,
                  opacity: active === i ? 0.6 : 0,
                  transition: "all 0.25s cubic-bezier(0, 0, 0.2, 1)",
                }}
              />
              <button
                className={`${l.color} rounded-full text-white text-xs font-bold border-none cursor-pointer flex items-center justify-center will-change-transform`}
                style={{
                  width: l.size,
                  height: l.size,
                  transform: active === i ? "scale(0.85)" : "scale(1)",
                  transition: "transform 0.1s ease-in-out",
                }}
                onClick={(e) => { e.stopPropagation(); tap(i); }}
              >
                {l.name[0].toUpperCase()}
              </button>
            </div>
            <span className="text-xs text-neutral-500 font-mono">.{l.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HapticPairingPreview() {
  const [state, setState] = useState<"idle" | "success" | "error" | "warning">("idle");

  const next = () => {
    const order: typeof state[] = ["idle", "success", "warning", "error"];
    setState(order[(order.indexOf(state) + 1) % order.length]);
  };

  const cfg = {
    idle:    { icon: "●", bg: "bg-neutral-200",  text: "text-neutral-500", anim: "scale(1)" },
    success: { icon: "✓", bg: "bg-emerald-500",  text: "text-white",       anim: "scale(1.1)" },
    warning: { icon: "!", bg: "bg-amber-500",    text: "text-white",       anim: "translateY(-4px)" },
    error:   { icon: "✗", bg: "bg-red-500",      text: "text-white",       anim: "translateX(0)" },
  }[state];

  return (
    <div className="w-full h-full flex items-center justify-center gap-6 cursor-pointer select-none" onClick={next}>
      <div className="flex flex-col items-center gap-2">
        <div
          className={`w-16 h-16 rounded-2xl ${cfg.bg} ${cfg.text} flex items-center justify-center text-2xl font-bold will-change-transform`}
          style={{
            transform: cfg.anim,
            transition: state === "error" ? "none" : "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            animation: state === "error" ? "hShake 0.4s ease-in-out" : undefined,
          }}
        >
          {cfg.icon}
        </div>
        <span className="text-xs text-neutral-500 font-mono">.{state === "idle" ? "impact" : state}</span>
      </div>
      <div className="text-xs text-neutral-500 leading-relaxed max-w-[120px]">
        {state === "idle" && "点击切换"}
        {state === "success" && "弹性放大 + .success"}
        {state === "warning" && "上浮提醒 + .warning"}
        {state === "error" && "横向抖动 + .error"}
      </div>
      <style>{`@keyframes hShake{0%,100%{transform:translateX(0)}15%{transform:translateX(-8px)}30%{transform:translateX(6px)}45%{transform:translateX(-4px)}60%{transform:translateX(3px)}75%{transform:translateX(-1px)}}`}</style>
    </div>
  );
}

export function HapticSelectionPreview() {
  const [selected, setSelected] = useState(2);
  return (
    <div className="w-full h-full flex items-center justify-center px-6">
      <div className="flex flex-col items-center gap-3 w-full max-w-[240px]">
        <div className="flex w-full rounded-xl p-1 gap-0.5" style={{ background: "rgba(120,120,128,0.16)" }}>
          {["S", "M", "L", "XL", "XXL"].map((size, i) => (
            <button
              key={size}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold border-none cursor-pointer transition-all duration-200 ${
                selected === i ? "bg-white text-neutral-900 shadow-sm" : "bg-transparent text-neutral-500"
              }`}
              onClick={(e) => { e.stopPropagation(); setSelected(i); }}
            >
              {size}
            </button>
          ))}
        </div>
        <span className="text-xs text-neutral-500 font-mono">.selection</span>
      </div>
    </div>
  );
}

export function HapticIncreaseDecreasePreview() {
  const [value, setValue] = useState(50);
  return (
    <div className="w-full h-full flex items-center justify-center px-6">
      <div className="flex flex-col items-center gap-3 w-full max-w-[220px]">
        <div className="flex items-center gap-3 w-full">
          <button
            className="w-10 h-10 rounded-xl text-lg font-bold border-none cursor-pointer transition-colors"
            style={{ background: "rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.85)" }}
            onClick={(e) => { e.stopPropagation(); setValue((v) => Math.max(0, v - 10)); }}
          >−</button>
          <div className="flex-1 relative h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.1)" }}>
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-[#007AFF]"
              style={{ width: `${value}%`, transition: "width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
            />
          </div>
          <button
            className="w-10 h-10 rounded-xl text-lg font-bold border-none cursor-pointer transition-colors"
            style={{ background: "rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.85)" }}
            onClick={(e) => { e.stopPropagation(); setValue((v) => Math.min(100, v + 10)); }}
          >+</button>
        </div>
        <span className="text-xs text-neutral-500 font-mono">
          .{value > 50 ? "increase" : value < 50 ? "decrease" : "levelChange"} · {value}%
        </span>
      </div>
    </div>
  );
}
