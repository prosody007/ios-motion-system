"use client";

import { useState } from "react";

export function SheetPreview() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="px-4 py-1.5 rounded-lg bg-neutral-900 text-white text-xs font-semibold border-none cursor-pointer relative z-10"
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
      >
        Show Sheet
      </button>
      <div
        className="absolute bottom-0 left-1/2 w-44 h-28 rounded-t-xl flex items-start justify-center pt-2.5"
        style={{
          background: "#ffffff",
          transform: open ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(100%)",
          transition: "transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)",
          boxShadow: "0 -8px 28px rgba(0,0,0,0.16)",
        }}
      >
        <div className="w-9 h-1 rounded-full" style={{ background: "rgba(60,60,67,0.3)" }} />
      </div>
    </>
  );
}

export function SheetSwitchPreview() {
  const [stage, setStage] = useState<"closed" | "a" | "closing-a" | "b">("closed");
  const [selection, setSelection] = useState("Family");
  const smoothCurve = "cubic-bezier(0.22, 1, 0.36, 1)";

  const showA = stage === "a" || stage === "closing-a";
  const showB = stage === "b";
  const overlayVisible = stage !== "closed";
  const sheetATransition =
    stage === "closing-a"
      ? `transform 0.30s ${smoothCurve}, opacity 160ms ease`
      : `transform 0.60s ${smoothCurve}, opacity 190ms ease`;

  const openFlow = () => {
    if (stage !== "closed") return;
    setStage("a");
  };

  const pick = (value: string) => {
    if (stage !== "a") return;
    setSelection(value);
    setStage("closing-a");
    window.setTimeout(() => setStage("b"), 300);
  };

  const closeAll = () => setStage("closed");

  return (
    <>
      <button
        className="px-4 py-1.5 rounded-lg bg-neutral-900 text-white text-xs font-semibold border-none cursor-pointer relative z-10"
        onClick={(e) => {
          e.stopPropagation();
          openFlow();
        }}
      >
        Show Flow
      </button>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: overlayVisible ? 1 : 0,
          transition: "opacity 180ms ease",
          background: "linear-gradient(to top, rgba(0,0,0,0.08), rgba(0,0,0,0.02) 42%, transparent)",
        }}
      />

      {/* Sheet A */}
      <div
        className="absolute bottom-0 left-1/2 w-[188px] rounded-t-[18px] overflow-hidden pointer-events-none"
        style={{
          background: "#FFFFFF",
          transform:
            stage === "a"
              ? "translateX(-50%) translateY(0)"
              : stage === "closing-a"
                ? "translateX(-50%) translateY(108%)"
                : "translateX(-50%) translateY(110%)",
          opacity: showA ? 1 : 0,
          transition: sheetATransition,
          boxShadow: "0 -12px 32px rgba(0,0,0,0.16)",
        }}
      >
        <div className="pt-2.5 pb-3 px-4 flex flex-col gap-2.5">
          <div
            className="w-9 h-1 rounded-full self-center"
            style={{ background: "rgba(60,60,67,0.3)" }}
          />
          <div className="text-[11px] font-semibold" style={{ color: "rgba(0,0,0,0.82)" }}>
            Choose category
          </div>
          <div className="flex flex-col gap-1">
            {["Family", "Friends", "Work"].map((item) => (
              <button
                key={item}
                className="h-7 px-2.5 rounded-[10px] text-[11px] font-medium border-none text-left"
                style={{
                  background: "#F3F4F9",
                  color: "#111111",
                  pointerEvents: stage === "a" ? "auto" : "none",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  pick(item);
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sheet B */}
      <div
        className="absolute bottom-0 left-1/2 w-[200px] rounded-t-[20px] overflow-hidden pointer-events-none"
        style={{
          background: "#FFFFFF",
          transform: showB
            ? "translateX(-50%) translateY(0)"
            : "translateX(-50%) translateY(112%)",
          opacity: showB ? 1 : 0,
          transition: `transform 0.60s ${smoothCurve}, opacity 210ms ease`,
          boxShadow: "0 -14px 34px rgba(0,0,0,0.18)",
        }}
      >
        <div className="pt-2.5 pb-4 px-4 flex flex-col gap-2.5">
          <div
            className="w-9 h-1 rounded-full self-center"
            style={{ background: "rgba(60,60,67,0.3)" }}
          />
          <div className="text-[11px] font-semibold" style={{ color: "rgba(0,0,0,0.82)" }}>
            Add to {selection}
          </div>
          <div
            className="rounded-[12px] px-3 py-2 text-[11px] leading-[16px]"
            style={{ background: "#F3F4F9", color: "rgba(0,0,0,0.62)" }}
          >
            Sheet A dismisses first, then Sheet B is presented with the selected item.
          </div>
          <button
            className="h-8 rounded-[12px] border-none text-[11px] font-semibold"
            style={{
              background: "#007AFF",
              color: "#FFFFFF",
              pointerEvents: showB ? "auto" : "none",
            }}
            onClick={(e) => {
              e.stopPropagation();
              closeAll();
            }}
          >
            Done
          </button>
        </div>
      </div>
    </>
  );
}
