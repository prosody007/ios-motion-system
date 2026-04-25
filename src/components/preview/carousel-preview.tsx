"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useCardParams } from "@/components/card-context";

const pages = [
  { color: "from-[#007AFF] to-[#0051D5]", label: "Page 1" },
  { color: "from-[#AF52DE] to-[#8E2CC4]", label: "Page 2" },
  { color: "from-[#FF2D55] to-[#E01E45]", label: "Page 3" },
];

/* ============================================================
   useCarouselController — 真·无限循环（三副本 + 边界 snap 复位）
   ============================================================ */
function useCarouselController(N: number, initial = 0) {
  const [trackIndex, setTrackIndex] = useState(N + initial);
  const [animEnabled, setAnimEnabled] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [speedMs, setSpeedMs] = useState(2500);

  const logical = ((trackIndex % N) + N) % N;

  const next = useCallback(() => {
    setAnimEnabled(true);
    setTrackIndex((t) => t + 1);
  }, []);

  const prev = useCallback(() => {
    setAnimEnabled(true);
    setTrackIndex((t) => t - 1);
  }, []);

  const goTo = useCallback(
    (idx: number) => {
      setAnimEnabled(true);
      setTrackIndex((t) => {
        const cur = ((t % N) + N) % N;
        let diff = idx - cur;
        if (diff > N / 2) diff -= N;
        if (diff < -N / 2) diff += N;
        return t + diff;
      });
    },
    [N],
  );

  // 过渡结束后，如果落在了「外副本」，关掉动画瞬时跳回中间副本对应位置
  const onTransitionEnd = useCallback(() => {
    setTrackIndex((t) => {
      if (t < N || t >= 2 * N) {
        const normalized = N + (((t % N) + N) % N);
        if (normalized !== t) {
          setAnimEnabled(false);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => setAnimEnabled(true));
          });
          return normalized;
        }
      }
      return t;
    });
  }, [N]);

  // 自动播放（拖动中暂停；用 ref 保持 next 最新避免 stale closure）
  const nextRef = useRef(next);
  useEffect(() => {
    nextRef.current = next;
  });
  useEffect(() => {
    if (dragging) return;
    const id = setInterval(() => nextRef.current(), speedMs);
    return () => clearInterval(id);
  }, [speedMs, dragging]);

  return {
    trackIndex,
    logical,
    total: N,
    next,
    prev,
    goTo,
    animEnabled,
    onTransitionEnd,
    dragging,
    setDragging,
    speedMs,
    setSpeedMs,
  };
}

type Ctrl = ReturnType<typeof useCarouselController>;

/* ============================================================
   useCarouselDrag — Pointer 拖动切换（鼠标 + 触摸统一处理）
   ============================================================ */
function useCarouselDrag(ctrl: Ctrl, getItemSize: () => number) {
  const [dragOffset, setDragOffset] = useState(0);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const lastDxRef = useRef(0);
  const itemSizeRef = useRef(0);
  const lockedRef = useRef<"h" | "v" | null>(null);

  const reset = useCallback(() => {
    startRef.current = null;
    lastDxRef.current = 0;
    lockedRef.current = null;
    setDragOffset(0);
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      itemSizeRef.current = Math.max(1, getItemSize());
      startRef.current = { x: e.clientX, y: e.clientY };
      lastDxRef.current = 0;
      lockedRef.current = null;
      ctrl.setDragging(true);
    },
    [ctrl, getItemSize],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!startRef.current) return;
      const dx = e.clientX - startRef.current.x;
      const dy = e.clientY - startRef.current.y;
      // 方向锁定：超过阈值后判定，避免抢占垂直滚动
      if (!lockedRef.current) {
        if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
          lockedRef.current = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
          if (lockedRef.current === "h") {
            (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
          }
        }
      }
      if (lockedRef.current !== "h") return;
      lastDxRef.current = dx;
      setDragOffset(dx);
    },
    [],
  );

  const finish = useCallback(() => {
    if (!startRef.current) return;
    const dx = lastDxRef.current;
    const wasHorizontal = lockedRef.current === "h";
    reset();
    ctrl.setDragging(false);
    if (!wasHorizontal) return;
    const threshold = itemSizeRef.current * 0.18;
    if (dx <= -threshold) ctrl.next();
    else if (dx >= threshold) ctrl.prev();
    // 否则什么都不做：动画恢复后会回到原位
  }, [ctrl, reset]);

  return {
    dragOffset,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: finish,
      onPointerCancel: finish,
      onPointerLeave: finish,
      style: { touchAction: "pan-y" as const, cursor: "grab" as const },
    },
  };
}

/* ============================================================
   把当前速度同步到 CodeBlock 的 {{speedSec}} 占位符
   ============================================================ */
function useSyncSpeedToCard(speedMs: number) {
  const { setParam } = useCardParams();
  useEffect(() => {
    setParam("speedSec", (speedMs / 1000).toFixed(1));
  }, [speedMs, setParam]);
}

/* ---------------- 1. 全屏 Pager ---------------- */
export function CarouselPreview() {
  const c = useCarouselController(pages.length);
  useSyncSpeedToCard(c.speedMs);
  const tripled = [...pages, ...pages, ...pages];
  const wrapRef = useRef<HTMLDivElement>(null);
  const drag = useCarouselDrag(c, () => wrapRef.current?.clientWidth ?? 260);

  return (
    <div className="w-full max-w-[260px] flex flex-col items-center gap-2.5 select-none">
      <div
        ref={wrapRef}
        className="w-full overflow-hidden rounded-2xl"
        style={{ height: 90 }}
      >
        <div
          className="flex h-full will-change-transform"
          style={{
            transform: `translateX(calc(-${c.trackIndex * 100}% + ${drag.dragOffset}px))`,
            transition:
              c.animEnabled && !c.dragging
                ? "transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)"
                : "none",
            ...drag.handlers.style,
          }}
          onPointerDown={drag.handlers.onPointerDown}
          onPointerMove={drag.handlers.onPointerMove}
          onPointerUp={drag.handlers.onPointerUp}
          onPointerCancel={drag.handlers.onPointerCancel}
          onTransitionEnd={(e) => {
            if (e.propertyName === "transform") c.onTransitionEnd();
          }}
        >
          {tripled.map((p, i) => (
            <div
              key={i}
              className={`min-w-full h-full bg-gradient-to-br ${p.color} flex items-center justify-center pointer-events-none`}
            >
              <span className="text-white text-sm font-bold">{p.label}</span>
            </div>
          ))}
        </div>
      </div>

      <NavRow ctrl={c} total={pages.length} />
      <CarouselControls ctrl={c} />
    </div>
  );
}

/* ---------------- 2. 卡片露边 (Peek) ---------------- */
const peekItems = [
  { color: "from-[#007AFF] to-[#0040A8]", title: "Spring" },
  { color: "from-[#AF52DE] to-[#6D1E99]", title: "Summer" },
  { color: "from-[#FF2D55] to-[#B8133A]", title: "Autumn" },
  { color: "from-[#32ADE6] to-[#1A6F9C]", title: "Winter" },
];

export function CarouselPeekPreview() {
  const c = useCarouselController(peekItems.length, 1);
  useSyncSpeedToCard(c.speedMs);
  const tripled = [...peekItems, ...peekItems, ...peekItems];
  const CARD_W = 150;
  const GAP = 12;
  const drag = useCarouselDrag(c, () => CARD_W + GAP);
  const itemTransitionEnabled = c.animEnabled && !c.dragging;

  return (
    <div className="w-full flex flex-col items-center gap-2.5 select-none">
      <div className="relative w-full overflow-hidden" style={{ height: 100 }}>
        <div
          className="absolute top-0 left-1/2 flex h-full will-change-transform"
          style={{
            gap: GAP,
            transform: `translateX(calc(-${CARD_W / 2}px - ${c.trackIndex * (CARD_W + GAP)}px + ${drag.dragOffset}px))`,
            transition: itemTransitionEnabled
              ? "transform 0.45s cubic-bezier(0.32, 0.72, 0, 1)"
              : "none",
            ...drag.handlers.style,
          }}
          onPointerDown={drag.handlers.onPointerDown}
          onPointerMove={drag.handlers.onPointerMove}
          onPointerUp={drag.handlers.onPointerUp}
          onPointerCancel={drag.handlers.onPointerCancel}
          onTransitionEnd={(e) => {
            if (e.propertyName === "transform") c.onTransitionEnd();
          }}
        >
          {tripled.map((it, i) => (
            <div
              key={i}
              className={`shrink-0 rounded-2xl bg-gradient-to-br ${it.color} flex flex-col items-center justify-center text-white shadow-[0_6px_20px_rgba(0,0,0,0.3)] pointer-events-none`}
              style={{
                width: CARD_W,
                height: 90,
                opacity: i === c.trackIndex ? 1 : 0.55,
                transition: itemTransitionEnabled
                  ? "opacity 0.35s ease"
                  : "none",
              }}
            >
              <span className="text-sm font-bold">{it.title}</span>
              <span className="text-[11px] text-white/70">
                Card {(i % peekItems.length) + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      <NavRow ctrl={c} total={peekItems.length} />
      <CarouselControls ctrl={c} />
    </div>
  );
}

/* ---------------- 3. 缩放渐隐 (scrollTransition) ---------------- */
const scaleItems = [
  { color: "from-[#007AFF] to-[#0040A8]", icon: "🎵" },
  { color: "from-[#AF52DE] to-[#6D1E99]", icon: "🎬" },
  { color: "from-[#FF2D55] to-[#B8133A]", icon: "📚" },
  { color: "from-[#FF9500] to-[#CC6A00]", icon: "🎮" },
  { color: "from-[#32ADE6] to-[#30B0C7]", icon: "🏃" },
];

export function CarouselScalePreview() {
  const c = useCarouselController(scaleItems.length, 2);
  useSyncSpeedToCard(c.speedMs);
  const tripled = [...scaleItems, ...scaleItems, ...scaleItems];
  const CARD_W = 100;
  const GAP = 14;
  const drag = useCarouselDrag(c, () => CARD_W + GAP);
  const itemTransitionEnabled = c.animEnabled && !c.dragging;

  return (
    <div className="w-full flex flex-col items-center gap-2.5 select-none">
      <div className="relative w-full overflow-hidden" style={{ height: 100 }}>
        <div
          className="absolute top-1/2 left-1/2 flex items-center will-change-transform"
          style={{
            gap: GAP,
            transform: `translate(calc(-${CARD_W / 2}px - ${c.trackIndex * (CARD_W + GAP)}px + ${drag.dragOffset}px), -50%)`,
            transition: itemTransitionEnabled
              ? "transform 0.45s cubic-bezier(0.32, 0.72, 0, 1)"
              : "none",
            ...drag.handlers.style,
          }}
          onPointerDown={drag.handlers.onPointerDown}
          onPointerMove={drag.handlers.onPointerMove}
          onPointerUp={drag.handlers.onPointerUp}
          onPointerCancel={drag.handlers.onPointerCancel}
          onTransitionEnd={(e) => {
            if (e.propertyName === "transform") c.onTransitionEnd();
          }}
        >
          {tripled.map((it, i) => {
            const distance = Math.abs(i - c.trackIndex);
            const scale = distance === 0 ? 1 : distance === 1 ? 0.78 : 0.6;
            const opacity = distance === 0 ? 1 : distance === 1 ? 0.55 : 0.25;
            return (
              <div
                key={i}
                className={`shrink-0 rounded-2xl bg-gradient-to-br ${it.color} flex items-center justify-center text-white shadow-[0_6px_18px_rgba(0,0,0,0.35)] pointer-events-none`}
                style={{
                  width: CARD_W,
                  height: 80,
                  transform: `scale(${scale})`,
                  opacity,
                  transition: itemTransitionEnabled
                    ? "transform 0.45s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.35s ease"
                    : "none",
                }}
              >
                <span className="text-2xl">{it.icon}</span>
              </div>
            );
          })}
        </div>
      </div>

      <NavRow ctrl={c} total={scaleItems.length} />
      <CarouselControls ctrl={c} />
    </div>
  );
}

/* ---------------- 4. Cover Flow ---------------- */
const coverItems = [
  "from-[#007AFF] to-[#0040A8]",
  "from-[#AF52DE] to-[#6D1E99]",
  "from-[#FF2D55] to-[#B8133A]",
  "from-[#FF9500] to-[#CC6A00]",
  "from-[#32ADE6] to-[#30B0C7]",
];

export function CarouselCoverFlowPreview() {
  const c = useCarouselController(coverItems.length, 2);
  useSyncSpeedToCard(c.speedMs);
  const tripled = [...coverItems, ...coverItems, ...coverItems];
  const CARD = 80;
  const GAP = 4;
  const drag = useCarouselDrag(c, () => CARD + GAP);
  const itemTransitionEnabled = c.animEnabled && !c.dragging;

  return (
    <div className="w-full flex flex-col items-center gap-2.5 select-none">
      <div
        className="relative w-full overflow-hidden"
        style={{ height: 110, perspective: 800 }}
      >
        <div
          className="absolute top-1/2 left-1/2 flex items-center will-change-transform"
          style={{
            gap: GAP,
            transformStyle: "preserve-3d",
            transform: `translate(calc(-${CARD / 2}px - ${c.trackIndex * (CARD + GAP)}px + ${drag.dragOffset}px), -50%)`,
            transition: itemTransitionEnabled
              ? "transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)"
              : "none",
            ...drag.handlers.style,
          }}
          onPointerDown={drag.handlers.onPointerDown}
          onPointerMove={drag.handlers.onPointerMove}
          onPointerUp={drag.handlers.onPointerUp}
          onPointerCancel={drag.handlers.onPointerCancel}
          onTransitionEnd={(e) => {
            if (e.propertyName === "transform") c.onTransitionEnd();
          }}
        >
          {tripled.map((color, i) => {
            const offset = i - c.trackIndex;
            const angle = Math.max(-1, Math.min(1, offset)) * -45;
            const scale = offset === 0 ? 1 : 0.8;
            const z = offset === 0 ? 20 : 0;
            return (
              <div
                key={i}
                className={`shrink-0 rounded-xl bg-gradient-to-br ${color} shadow-[0_8px_20px_rgba(0,0,0,0.45)] pointer-events-none`}
                style={{
                  width: CARD,
                  height: 100,
                  transform: `translateZ(${z}px) rotateY(${angle}deg) scale(${scale})`,
                  transformOrigin: "center center",
                  transition: itemTransitionEnabled
                    ? "transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)"
                    : "none",
                  zIndex: 10 - Math.abs(offset),
                }}
              />
            );
          })}
        </div>
      </div>

      <NavRow ctrl={c} total={coverItems.length} />
      <CarouselControls ctrl={c} />
    </div>
  );
}

/* ============================================================
   共享控件
   ============================================================ */
function NavRow({ ctrl, total }: { ctrl: Ctrl; total: number }) {
  return (
    <div className="flex items-center gap-3">
      <ArrowBtn dir="left" onClick={ctrl.prev} />
      <Dots total={total} active={ctrl.logical} onSelect={ctrl.goTo} />
      <ArrowBtn dir="right" onClick={ctrl.next} />
    </div>
  );
}

function ArrowBtn({
  dir,
  onClick,
}: {
  dir: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      className="w-7 h-7 rounded-full flex items-center justify-center border-none cursor-pointer text-neutral-700 text-base"
      style={{ background: "rgba(0,0,0,0.06)" }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {dir === "left" ? "‹" : "›"}
    </button>
  );
}

function Dots({
  total,
  active,
  onSelect,
}: {
  total: number;
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(i);
          }}
          className="rounded-full border-none cursor-pointer p-0"
          style={{
            width: active === i ? 16 : 6,
            height: 6,
            background: active === i ? "#007AFF" : "rgba(0,0,0,0.18)",
            transition: "all 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
          }}
        />
      ))}
    </div>
  );
}

function CarouselControls({ ctrl }: { ctrl: Ctrl }) {
  return (
    <div className="flex items-center gap-2 mt-0.5">
      <span className="text-[11px] text-neutral-500">速度</span>
      <SpeedPicker value={ctrl.speedMs} onChange={ctrl.setSpeedMs} />
    </div>
  );
}

const SPEEDS: { label: string; ms: number }[] = [
  { label: "1.5s", ms: 1500 },
  { label: "2.5s", ms: 2500 },
  { label: "3.5s", ms: 3500 },
];

function SpeedPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (ms: number) => void;
}) {
  return (
    <div
      className="flex rounded-md overflow-hidden"
      style={{ background: "rgba(0,0,0,0.05)" }}
    >
      {SPEEDS.map((s) => {
        const active = s.ms === value;
        return (
          <button
            key={s.ms}
            onClick={(e) => {
              e.stopPropagation();
              onChange(s.ms);
            }}
            className="border-none px-2 py-0.5 text-[11px] cursor-pointer"
            style={{
              background: active ? "#007AFF" : "transparent",
              color: active ? "white" : "rgba(0,0,0,0.55)",
            }}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}
