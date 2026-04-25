"use client";

import { useState } from "react";

export function AnyTransitionPreview() {
  const [items, setItems] = useState([1, 2, 3]);
  const [counter, setCounter] = useState(3);

  const addItem = () => {
    const next = counter + 1;
    setCounter(next);
    setItems((prev) => [...prev, next]);
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((i) => i !== id));
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-4 select-none">
      <div className="flex gap-2 items-center min-h-[48px] flex-wrap justify-center">
        {items.map((id) => (
          <div
            key={id}
            className="w-11 h-11 rounded-xl bg-neutral-900 text-white flex items-center justify-center text-xs font-bold cursor-pointer hover:bg-neutral-800 transition-colors"
            style={{ animation: "atp-enter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }}
            onClick={(e) => { e.stopPropagation(); removeItem(id); }}
          >
            {id}
          </div>
        ))}
      </div>
      <button
        className="px-3 py-1 rounded-lg text-xs font-medium border-none cursor-pointer transition-colors"
        style={{ background: "rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.7)" }}
        onClick={(e) => { e.stopPropagation(); addItem(); }}
      >
        + Add
      </button>
      <span className="text-xs text-neutral-400 font-mono">.asymmetric(insertion: .scale, removal: .opacity)</span>
      <style>{`@keyframes atp-enter { from { opacity:0; transform:scale(0.5) } to { opacity:1; transform:scale(1) } }`}</style>
    </div>
  );
}

export function ViewModifierTransitionPreview() {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="w-full h-full flex items-center justify-center cursor-pointer select-none" onClick={() => setFlipped((f) => !f)}>
      <div className="flex flex-col items-center gap-3">
        <div style={{ perspective: 800 }}>
          <div
            className="will-change-transform relative"
            style={{
              width: 120, height: 80,
              transformStyle: "preserve-3d",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#3395FF] to-[#0051D5] flex flex-col items-center justify-center text-white shadow-lg"
              style={{ backfaceVisibility: "hidden" }}
            >
              <span className="text-base font-bold">Front</span>
              <span className="text-xs text-white/70 mt-1">tap to flip</span>
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#C88BE8] to-[#6D1E99] flex flex-col items-center justify-center text-white shadow-lg"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <span className="text-base font-bold">Back</span>
              <span className="text-xs text-white/70 mt-1">.rotation3DEffect</span>
            </div>
          </div>
        </div>
        <span className="text-xs text-neutral-400 font-mono">.modifier(active: FlipModifier)</span>
      </div>
    </div>
  );
}

export function VCTransitionPreview() {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState(0);
  const labels = ["Settings", "Profile", "Notifications"];

  return (
    <div className="relative w-full h-full select-none overflow-hidden">
      <div className="absolute inset-0 flex flex-col p-3 gap-2 justify-center"
        style={{
          transform: expanded ? "scale(0.92)" : "scale(1)",
          opacity: expanded ? 0.4 : 1,
          filter: expanded ? "blur(1px)" : "none",
          borderRadius: expanded ? 12 : 0,
          transition: "all 0.4s cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      >
        {labels.map((label, i) => (
          <div
            key={label}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors"
            style={{
              background: i === selected ? "rgba(0,122,255,0.12)" : "#ffffff",
              boxShadow: "0 1px 0 rgba(0,0,0,0.04)",
            }}
            onClick={(e) => { e.stopPropagation(); setSelected(i); setExpanded(true); }}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold
              ${i === selected ? "bg-[#007AFF] text-white" : "bg-neutral-200 text-neutral-500"}`}>
              {label[0]}
            </div>
            <span className="text-xs font-medium text-neutral-800">{label}</span>
            <span className="ml-auto text-neutral-400 text-xs">›</span>
          </div>
        ))}
      </div>

      <div
        className="absolute inset-0 flex flex-col items-center justify-center will-change-transform cursor-pointer"
        style={{
          background: "#ffffff",
          transform: expanded ? "translateX(0) scale(1)" : "translateX(100%) scale(0.95)",
          opacity: expanded ? 1 : 0,
          transition: expanded
            ? "transform 0.42s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.15s ease"
            : "transform 0.32s cubic-bezier(0.4, 0, 0.6, 1), opacity 0.12s ease 0.15s",
          boxShadow: "-4px 0 20px rgba(0,0,0,0.08)",
        }}
        onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
      >
        <div className="w-8 h-8 rounded-lg bg-[#007AFF] text-white flex items-center justify-center font-bold text-sm mb-2">
          {labels[selected]?.[0]}
        </div>
        <div className="text-sm font-bold text-neutral-900">{labels[selected]}</div>
        <div className="text-xs text-neutral-500 mt-1 font-mono">push transition</div>
        <div className="text-xs text-neutral-400 mt-0.5">← tap to pop</div>
      </div>
    </div>
  );
}
