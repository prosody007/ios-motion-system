"use client";

import { useState, useRef, useCallback, useEffect } from "react";

const IOS_SPRING = "cubic-bezier(0.32, 0.72, 0, 1)";
const IOS_DUR = "0.5s";

export function ZoomTransitionPreview() {
  const [expanded, setExpanded] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [rect, setRect] = useState({ top: 0, left: 0, width: 0, height: 0 });

  const expand = useCallback((idx: number) => {
    const cell = cellRefs.current[idx];
    const container = containerRef.current;
    if (!cell || !container) return;
    const cR = container.getBoundingClientRect();
    const eR = cell.getBoundingClientRect();
    setRect({ top: eR.top - cR.top, left: eR.left - cR.left, width: eR.width, height: eR.height });
    setSelectedIdx(idx);
    requestAnimationFrame(() => setExpanded(true));
  }, []);

  const collapse = useCallback(() => {
    setExpanded(false);
    setTimeout(() => setSelectedIdx(-1), 500);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full select-none overflow-hidden">
      <div className="absolute inset-0 p-4 grid grid-cols-3 gap-2.5 content-center">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            ref={(el) => { cellRefs.current[i] = el; }}
            className="rounded-2xl aspect-[4/5] flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors"
            style={{ background: "#ffffff", boxShadow: "0 1px 0 rgba(0,0,0,0.04)", opacity: selectedIdx === i && expanded ? 0 : 1, transition: "opacity 0.15s ease" }}
            onClick={(e) => { e.stopPropagation(); expand(i); }}
          >
            <div className="w-5 h-5 rounded-md" style={{ background: "rgba(0,0,0,0.08)" }} />
            <span className="text-xs font-medium text-neutral-500">Item {i + 1}</span>
          </div>
        ))}
      </div>

      {selectedIdx >= 0 && (
        <div
          className="absolute bg-[#007AFF] rounded-2xl flex flex-col items-center justify-center text-white will-change-[top,left,width,height] cursor-pointer overflow-hidden"
          style={{
            top: expanded ? 8 : rect.top,
            left: expanded ? 8 : rect.left,
            width: expanded ? "calc(100% - 16px)" : rect.width,
            height: expanded ? "calc(100% - 16px)" : rect.height,
            borderRadius: expanded ? 16 : 20,
            transition: `top ${IOS_DUR} ${IOS_SPRING}, left ${IOS_DUR} ${IOS_SPRING}, width ${IOS_DUR} ${IOS_SPRING}, height ${IOS_DUR} ${IOS_SPRING}, border-radius 0.3s ease`,
          }}
          onClick={(e) => { e.stopPropagation(); collapse(); }}
        >
          <div style={{ opacity: expanded ? 1 : 0, transition: `opacity 0.2s ease ${expanded ? "0.2s" : "0s"}` }} className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/20" />
            <div className="text-sm font-bold">Item {selectedIdx + 1}</div>
            <div className="text-xs text-white/50 font-mono">.zoom(sourceID:in:)</div>
          </div>
        </div>
      )}
    </div>
  );
}

export function MatchedGeometryPreview() {
  const [isDetail, setIsDetail] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardRect, setCardRect] = useState({ top: 0, left: 0, width: 0, height: 0 });

  const toggle = useCallback(() => {
    if (!isDetail && cardRef.current && containerRef.current) {
      const cR = containerRef.current.getBoundingClientRect();
      const eR = cardRef.current.getBoundingClientRect();
      setCardRect({ top: eR.top - cR.top, left: eR.left - cR.left, width: eR.width, height: eR.height });
    }
    setIsDetail((d) => !d);
  }, [isDetail]);

  return (
    <div ref={containerRef} className="relative w-full h-full cursor-pointer select-none overflow-hidden" onClick={toggle}>
      <div className="absolute inset-0 flex items-end p-5 gap-3"
        style={{ opacity: isDetail ? 0 : 1, transition: "opacity 0.15s ease", pointerEvents: isDetail ? "none" : "auto" }}
      >
        <div ref={cardRef} className="w-12 h-12 rounded-xl bg-[#007AFF] flex items-center justify-center flex-shrink-0">
          <div className="w-6 h-6 rounded-md bg-white/25" />
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="h-2.5 w-20 rounded-full" style={{ background: "rgba(0,0,0,0.12)" }} />
          <div className="h-2 w-14 rounded-full" style={{ background: "rgba(0,0,0,0.07)" }} />
        </div>
      </div>

      {isDetail && (
        <div
          className="absolute bg-[#007AFF] will-change-[top,left,width,height] overflow-hidden"
          style={{
            top: isDetail ? 12 : cardRect.top,
            left: isDetail ? 12 : cardRect.left,
            width: isDetail ? "calc(100% - 24px)" : cardRect.width,
            height: isDetail ? "calc(100% - 24px)" : cardRect.height,
            borderRadius: isDetail ? 16 : 12,
            transition: `all 0.4s ${IOS_SPRING}`,
          }}
        >
          <div className="w-full h-full flex flex-col items-center justify-center text-white"
            style={{ opacity: isDetail ? 1 : 0, transition: "opacity 0.2s ease 0.15s" }}
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 mb-2" />
            <div className="font-bold text-sm">Detail View</div>
            <div className="text-xs text-white/40 mt-1 font-mono">matchedGeometryEffect</div>
          </div>
        </div>
      )}
    </div>
  );
}

export function FullScreenCoverPreview() {
  const [show, setShow] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ startY: 0, currentY: 0, active: false });

  const onDown = useCallback((e: React.PointerEvent) => {
    drag.current = { startY: e.clientY, currentY: e.clientY, active: true };
    if (sheetRef.current) sheetRef.current.style.transition = "none";
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onMove = useCallback((e: React.PointerEvent) => {
    if (!drag.current.active || !sheetRef.current) return;
    const dy = Math.max(0, e.clientY - drag.current.startY);
    drag.current.currentY = e.clientY;
    sheetRef.current.style.transform = `translateY(${dy}px)`;
  }, []);

  const onUp = useCallback(() => {
    if (!drag.current.active || !sheetRef.current) return;
    drag.current.active = false;
    const dy = drag.current.currentY - drag.current.startY;
    sheetRef.current.style.transition = `transform ${IOS_DUR} ${IOS_SPRING}`;
    if (dy > 50) {
      sheetRef.current.style.transform = "translateY(100%)";
      setTimeout(() => setShow(false), 500);
    } else {
      sheetRef.current.style.transform = "translateY(0)";
    }
  }, []);

  useEffect(() => {
    if (show && sheetRef.current) {
      sheetRef.current.style.transition = `transform ${IOS_DUR} ${IOS_SPRING}`;
      sheetRef.current.style.transform = "translateY(0)";
    }
  }, [show]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden">
      <div className="absolute inset-0 flex flex-col p-4 gap-2"
        style={{
          transform: show ? "scale(0.92) translateY(-3%)" : "scale(1)",
          borderRadius: show ? 14 : 0, transition: `all ${IOS_DUR} ${IOS_SPRING}`, overflow: "hidden",
        }}
      >
        <div className="flex gap-2">
          <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(0,0,0,0.1)" }} />
          <div className="w-6 h-2 rounded-full" style={{ background: "rgba(0,0,0,0.06)" }} />
        </div>
        <div className="flex gap-2 flex-1">
          <div className="flex-1 rounded-xl" style={{ background: "#ffffff", boxShadow: "0 1px 0 rgba(0,0,0,0.04)" }} />
          <div className="flex-1 rounded-xl" style={{ background: "#ffffff", boxShadow: "0 1px 0 rgba(0,0,0,0.04)" }} />
        </div>
        <button
          className="w-full py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold border-none cursor-pointer"
          onClick={(e) => { e.stopPropagation(); setShow(true); }}
        >
          Present Sheet
        </button>
      </div>

      <div className="absolute inset-0 bg-black/20 pointer-events-none"
        style={{ opacity: show ? 1 : 0, transition: `opacity ${IOS_DUR} ${IOS_SPRING}` }}
      />

      <div
        ref={sheetRef}
        className="absolute inset-x-0 bottom-0 will-change-transform"
        style={{
          background: "#ffffff",
          height: "70%",
          transform: show ? "translateY(0)" : "translateY(100%)",
          transition: show ? `transform ${IOS_DUR} ${IOS_SPRING}` : "transform 0.35s cubic-bezier(0.4,0,1,1)",
          boxShadow: "0 -8px 28px rgba(0,0,0,0.16)",
          borderRadius: "14px 14px 0 0",
        }}
      >
        <div
          className="flex justify-center pt-2 pb-3 cursor-grab active:cursor-grabbing touch-none"
          onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
        >
          <div className="w-9 h-1 rounded-full" style={{ background: "rgba(60,60,67,0.3)" }} />
        </div>
        <div className="flex flex-col items-center justify-center gap-2 px-4">
          <div className="w-8 h-8 rounded-lg" style={{ background: "rgba(0,0,0,0.06)" }} />
          <span className="text-sm font-bold text-neutral-900">Sheet Content</span>
          <span className="text-xs text-neutral-500 font-mono">.spring(duration: 0.5, bounce: 0)</span>
          <span className="text-xs text-neutral-400">拖拽 grabber 下拉收起</span>
        </div>
      </div>
    </div>
  );
}
