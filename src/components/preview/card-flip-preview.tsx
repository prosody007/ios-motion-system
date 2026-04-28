"use client";

import { useEffect, useId, useRef, useState } from "react";

/* ----------------------------------------------------------------
 *  CardExpandPreview · 卡片展开
 *
 *  · 内容层固定在 inset:12，由 clip-path 跟卡片同步裁切（无 layout reflow）。
 *  · 展开：clip-path 平滑打开 + 标题/正文 translateY(20→0) 滑入。
 *  · 折叠：内容 visibility 即刻 hidden + 头像 visibility 即刻 visible
 *    + 卡片同步开始 transition 收回，三件事同帧发生。
 *  · 头像 / ✕ / 底部说明：纯 visibility 切换，无 transform 动画。
 * ---------------------------------------------------------------- */
/* 展开：快一点 + 轻微回弹（y2 略 > 1 形成微小过冲） */
const EXPAND_DURATION = 320;
const EXPAND_EASE = "cubic-bezier(0.32, 1.10, 0.5, 1)";
/* 收起：略快、无回弹 */
const COLLAPSE_DURATION = 380;
const COLLAPSE_EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

const motionDuration = (expanded: boolean) =>
  expanded ? EXPAND_DURATION : COLLAPSE_DURATION;
const motionEase = (expanded: boolean) =>
  expanded ? EXPAND_EASE : COLLAPSE_EASE;

export function CardExpandPreview() {
  const [expanded, setExpanded] = useState(false);

  const cardGeometry = {
    top: expanded ? 12 : "calc(50% - 40px)",
    left: expanded ? 12 : "calc(50% - 40px)",
    right: expanded ? 12 : "calc(50% - 40px)",
    bottom: expanded ? 12 : "calc(50% - 40px)",
    borderRadius: expanded ? 20 : 18,
  };

  const dur = motionDuration(expanded);
  const ease = motionEase(expanded);

  const cardTransition = [
    `top ${dur}ms ${ease}`,
    `left ${dur}ms ${ease}`,
    `right ${dur}ms ${ease}`,
    `bottom ${dur}ms ${ease}`,
    `border-radius ${dur}ms ${ease}`,
    `box-shadow ${dur}ms ${ease}`,
  ].join(", ");

  const clipPath = expanded
    ? "inset(0px round 20px)"
    : "inset(calc(50% - 40px) round 18px)";

  return (
    <div
      className="relative w-full h-full select-none cursor-pointer p-3"
      onClick={() => setExpanded((e) => !e)}
    >
      {/* 卡片底色 + 阴影 */}
      <div
        className="absolute bg-white"
        style={{
          ...cardGeometry,
          boxShadow: expanded
            ? "0 12px 32px rgba(15,23,42,0.10), 0 1px 2px rgba(15,23,42,0.06)"
            : "0 8px 22px rgba(15,23,42,0.12), 0 1px 2px rgba(15,23,42,0.06)",
          transition: cardTransition,
        }}
      />

      {/* 折叠态：居中头像 —— 不论展开/折叠都是即刻显隐 */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          visibility: expanded ? "hidden" : "visible",
          transition: "visibility 0s",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/avatars/card-expand.png"
          alt=""
          draggable={false}
          className="w-12 h-12 rounded-full object-cover"
          style={{
            background: "#F3F4F9",
            boxShadow: "0 1px 2px rgba(15,23,42,0.08)",
          }}
        />
      </div>

      {/* 展开态内容层 —— 同样即刻显隐，clip-path 跟卡片同步动画 */}
      <div
        className="absolute"
        style={{
          top: 12,
          left: 12,
          right: 12,
          bottom: 12,
          clipPath,
          WebkitClipPath: clipPath,
          visibility: expanded ? "visible" : "hidden",
          pointerEvents: expanded ? "auto" : "none",
          transition: `clip-path ${dur}ms ${ease}, visibility 0s`,
        }}
      >
        <div className="flex h-full flex-col p-5">
          {/* 头像 + 关闭按钮 — 不动，opacity 0→1 与卡片同步淡入 */}
          <div
            className="flex items-start justify-between mb-6"
            style={{
              opacity: expanded ? 1 : 0,
              transition: `opacity ${dur}ms ${ease}`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/avatars/card-expand.png"
              alt=""
              draggable={false}
              className="w-12 h-12 rounded-full object-cover"
              style={{
                background: "#F3F4F9",
                boxShadow: "0 1px 2px rgba(15,23,42,0.08)",
              }}
            />
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
              style={{
                background: "#F3F4F9",
                color: "rgba(15,23,42,0.55)",
              }}
            >
              ✕
            </div>
          </div>

          {/* 标题 + 正文 — 唯一带 translateY，时长/缓动与卡片展开同步 */}
          <div
            style={{
              transform: expanded ? "translateY(0)" : "translateY(20px)",
              transition: `transform ${dur}ms ${ease}`,
            }}
          >
            <div
              className="text-base font-bold leading-tight mb-2"
              style={{ color: "#0F172A" }}
            >
              Card Title
            </div>
            <div
              className="text-xs leading-relaxed"
              style={{ color: "rgba(15,23,42,0.6)" }}
            >
              点击空白处折叠 · 展开后内容延迟淡入，营造连贯的层级过渡感。
            </div>
          </div>

          {/* 底部说明 — 不动，opacity 0→1 与卡片同步淡入 */}
          <div
            className="mt-auto text-[11px] font-mono"
            style={{
              color: "rgba(15,23,42,0.4)",
              opacity: expanded ? 1 : 0,
              transition: `opacity ${dur}ms ${ease}`,
            }}
          >
            spring(response: 0.5, damping: 0.85)
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
 *  CardFlipPreview · 3D 翻转
 *  视觉 1:1 还原 Figma 772:11138 (front) / 683:10559 (back)
 *  动画保持原有 rotateY + .easeInOut(0.5s)
 * ---------------------------------------------------------------- */
const FLIP_CARD_W = 321;
const FLIP_CARD_H = 325;

function FlipQuoteIcon() {
  return (
    <svg
      width="29"
      height="24"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4.939 15.4075C5.268 17.194 5.061 19.0273 4.34 20.7176C3.33 22.3296 1.892 23.6906 0.155 24.6785L4.311 28.5C7.532 27.3393 9.707 25.7028 10.834 23.5903C11.965 21.5011 12.245 19.0027 12.139 15.4162V4.5H0V15.4075H4.939ZM21.147 20.7089C20.138 22.3209 18.7 23.6819 16.962 24.6698L21.108 28.4913C24.33 27.3306 26.505 25.6941 27.632 23.5816C28.763 21.4924 29.043 18.994 28.995 15.4075V4.5H16.836V15.4075H21.746C22.074 17.1912 21.867 19.0213 21.147 20.7089Z"
        fill="#E6E8EA"
      />
    </svg>
  );
}

function FlipFrontFace() {
  return (
    <div
      className="absolute inset-0 flex flex-col bg-white"
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        borderRadius: 20,
        padding: "16px 16px 20px",
        gap: 16,
        boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{ paddingTop: 8, fontFamily: "Inter, sans-serif" }}
      >
        <span
          style={{
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "1em",
            color: "#595C60",
          }}
        >
          1/3
        </span>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <p
          className="text-center"
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: 16,
            lineHeight: 1.3,
            color: "#111111",
          }}
        >
          The sum of two negative integers is always negative.integers is always integers is always
        </p>
      </div>

      <div className="flex items-center justify-center">
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: 14,
            lineHeight: "1em",
            color: "#007AFF",
          }}
        >
          Tap to reveal
        </span>
      </div>
    </div>
  );
}

function FlipBackFace() {
  return (
    <div
      className="absolute inset-0 flex flex-col bg-white"
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: "rotateY(180deg)",
        borderRadius: 20,
        padding: "16px 16px 20px",
        gap: 16,
        boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{ paddingTop: 8 }}
      >
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: 14,
            lineHeight: "1em",
            color: "#989B9E",
          }}
        >
          Answer
        </span>
      </div>

      <div
        className="flex flex-1 flex-col justify-center"
        style={{ gap: 8 }}
      >
        <p
          className="text-center"
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: 16,
            lineHeight: 1.3,
            color: "#111111",
          }}
        >
          The sum of two negative integers is always negative.
        </p>
        <div
          className="flex items-center justify-end"
          style={{ paddingLeft: 16 }}
        >
          <FlipQuoteIcon />
        </div>
      </div>

      <div className="flex items-center justify-center">
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: 14,
            lineHeight: "1em",
            color: "#007AFF",
          }}
        >
          Tap to flip back
        </span>
      </div>
    </div>
  );
}

export function CardFlipPreview() {
  const [flipped, setFlipped] = useState(false);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const el = containerRef.current;
      if (!el) return;
      const next = Math.min(
        el.clientWidth / FLIP_CARD_W,
        el.clientHeight / FLIP_CARD_H,
        1,
      );
      setScale(Math.max(0.4, next));
    };
    update();
    const observer = new ResizeObserver(update);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full items-center justify-center select-none cursor-pointer"
      onClick={() => setFlipped((f) => !f)}
    >
      <div
        className="relative"
        style={{
          width: FLIP_CARD_W * scale,
          height: FLIP_CARD_H * scale,
        }}
      >
        <div
          className="relative"
          style={{
            width: FLIP_CARD_W,
            height: FLIP_CARD_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            perspective: 1000,
          }}
        >
          <div
            className="relative will-change-transform"
            style={{
              width: "100%",
              height: "100%",
              transformStyle: "preserve-3d",
              transform: `rotateY(${flipped ? 180 : 0}deg)`,
              transition: "transform 0.6s cubic-bezier(0.45, 0.05, 0.25, 1)",
            }}
          >
            <FlipFrontFace />
            <FlipBackFace />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
 *  FlashCardTransitionPreview · 1:1 还原 Figma 781:14407
 *
 *  舞台尺寸：321 × 409（不渲染外层 frame 灰底）
 *  卡片基础尺寸：321 × 325
 *  三层位置（与设计稿一致）：
 *    - top    : (0,   0)   scale(1.000, 1.000)
 *    - middle : (14,  66)  scale(0.913, 0.828)
 *    - bottom : (28, 101)  scale(0.826, 0.751)
 *  按钮：两颗 40×40，间距 24，整体居中位于 y=369
 * ---------------------------------------------------------------- */
const FLASH_STAGE_W = 321;
const FLASH_STAGE_H = 409;
const FLASH_CARD_W = 321;
const FLASH_CARD_H = 325;

const FLASH_BUTTON_SIZE = 40;
const FLASH_BUTTON_GAP = 24;
const FLASH_BUTTONS_W = FLASH_BUTTON_SIZE * 2 + FLASH_BUTTON_GAP;
const FLASH_BUTTONS_Y = 369;

const FLASH_DURATION = 580;
const FLASH_EASE = "linear";
const FLASH_FOLLOW_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const FLASH_SLOTS = [
  { tx: 0, ty: 0, sx: 1, sy: 1, zIndex: 30 },
  { tx: 14, ty: 66, sx: 293 / 321, sy: 269 / 325, zIndex: 20 },
  { tx: 28, ty: 101, sx: 265 / 321, sy: 244 / 325, zIndex: 10 },
];

const FLASH_ITEMS = ["card-1", "card-2", "card-3"] as const;

function FlashCardShell() {
  return (
    <div
      className="h-full w-full bg-white"
      style={{
        borderRadius: 20,
        boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
      }}
    />
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#595C60"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {direction === "left" ? (
        <path d="M15 18l-6-6 6-6" />
      ) : (
        <path d="M9 18l6-6-6-6" />
      )}
    </svg>
  );
}

const FLASH_SWIPE_THRESHOLD = 60;

type DragState = {
  dx: number;
  dy: number;
  rot: number;
};

export function FlashCardTransitionPreview() {
  const [order, setOrder] = useState([0, 1, 2]);
  const [phase, setPhase] = useState<{
    direction: "next" | "prev";
    cardId: string;
  } | null>(null);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [scale, setScale] = useState(0.62);
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    initDx: number;
    initDy: number;
    initRot: number;
  } | null>(null);
  const phaseTimeoutRef = useRef<number | null>(null);

  const rawId = useId();
  const id = `flash-${rawId.replace(/:/g, "")}`;

  useEffect(() => {
    const updateScale = () => {
      const el = containerRef.current;
      if (!el) return;
      const next = Math.min(
        (el.clientWidth - 16) / FLASH_STAGE_W,
        (el.clientHeight - 16) / FLASH_STAGE_H,
      );
      setScale(Math.max(0.34, Math.min(1, next)));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (phaseTimeoutRef.current !== null) {
        clearTimeout(phaseTimeoutRef.current);
      }
    };
  }, []);

  const schedulePhaseClear = (duration: number) => {
    if (phaseTimeoutRef.current !== null) {
      clearTimeout(phaseTimeoutRef.current);
    }
    phaseTimeoutRef.current = window.setTimeout(() => {
      setPhase(null);
      phaseTimeoutRef.current = null;
    }, duration);
  };

  const rotateForward = () => {
    if (phase || drag) return;
    const exitingId = FLASH_ITEMS[order[0]];
    setPhase({ direction: "next", cardId: exitingId });
    setOrder(([first, second, third]) => [second, third, first]);
    schedulePhaseClear(FLASH_DURATION + 20);
  };

  const rotateBackward = () => {
    if (phase || drag) return;
    const enteringId = FLASH_ITEMS[order[2]];
    setPhase({ direction: "prev", cardId: enteringId });
    setOrder(([first, second, third]) => [third, first, second]);
    schedulePhaseClear(FLASH_DURATION + 20);
  };

  const readTopCardTransform = (): {
    initDx: number;
    initDy: number;
    initRot: number;
  } => {
    const stage = stageRef.current;
    if (!stage) return { initDx: 0, initDy: 0, initRot: 0 };
    const topKey = FLASH_ITEMS[order[0]];
    const el = stage.querySelector<HTMLElement>(
      `[data-flash-card="${topKey}"]`,
    );
    if (!el) return { initDx: 0, initDy: 0, initRot: 0 };
    const tr = window.getComputedStyle(el).transform;
    if (!tr || tr === "none") return { initDx: 0, initDy: 0, initRot: 0 };
    try {
      const m = new DOMMatrixReadOnly(tr);
      return {
        initDx: m.m41,
        initDy: m.m42,
        initRot: Math.atan2(m.b, m.a) * (180 / Math.PI),
      };
    } catch {
      return { initDx: 0, initDy: 0, initRot: 0 };
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (drag) return;
    if (phase) return;
    if ((e.target as HTMLElement).closest("button")) return;

    const { initDx, initDy, initRot } = readTopCardTransform();
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      initDx,
      initDy,
      initRot,
    };
    setDrag({ dx: initDx, dy: initDy, rot: initRot });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const cur = dragRef.current;
    if (!cur || cur.pointerId !== e.pointerId) return;
    const dx = e.clientX - cur.startX;
    const dy = e.clientY - cur.startY;
    setDrag({
      dx: cur.initDx + dx / scale,
      dy: cur.initDy + (dy / scale) * 0.4,
      rot: cur.initRot + (dx / scale) * 0.06,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const cur = dragRef.current;
    dragRef.current = null;
    if (!cur || cur.pointerId !== e.pointerId) return;
    const dx = e.clientX - cur.startX;

    if (Math.abs(dx) < FLASH_SWIPE_THRESHOLD) {
      setDrag(null);
      return;
    }

    setOrder(([first, second, third]) => [second, third, first]);
    setDrag(null);
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === e.pointerId) {
      dragRef.current = null;
      setDrag(null);
    }
  };

  const slotThird = FLASH_SLOTS[2];

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full items-center justify-center px-4 py-3 select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      style={{ touchAction: "pan-y", cursor: drag ? "grabbing" : "grab" }}
    >
      <style>{`
        @keyframes ${id}-exit-next {
          0%    { transform: translate(0px, 0px) rotateY(0deg) rotate(0deg) scale(1, 1); z-index: 40; }
          18%   { transform: translate(-78px, 2px) rotateY(-14deg) rotate(-2deg) scale(0.97, 0.96); z-index: 40; }
          35%   { transform: translate(-145px, 18px) rotateY(-26deg) rotate(-4deg) scale(0.94, 0.92); z-index: 40; }
          49.9% { transform: translate(-168px, 42px) rotateY(-34deg) rotate(-5deg) scale(0.91, 0.88); z-index: 40; }
          50.1% { transform: translate(-168px, 42px) rotateY(-34deg) rotate(-5deg) scale(0.91, 0.88); z-index: 5; }
          65%   { transform: translate(-138px, 68px) rotateY(-26deg) rotate(-4deg) scale(0.89, 0.85); z-index: 5; }
          82%   { transform: translate(-58px, 90px) rotateY(-12deg) rotate(-2deg) scale(0.86, 0.81); z-index: 5; }
          100%  { transform: translate(${slotThird.tx}px, ${slotThird.ty}px) rotateY(0deg) rotate(0deg) scale(${slotThird.sx}, ${slotThird.sy}); z-index: 5; }
        }
        @keyframes ${id}-enter-prev {
          0%    { transform: translate(${slotThird.tx}px, ${slotThird.ty}px) rotateY(0deg) rotate(0deg) scale(${slotThird.sx}, ${slotThird.sy}); z-index: 5; }
          18%   { transform: translate(58px, 90px) rotateY(12deg) rotate(2deg) scale(0.86, 0.81); z-index: 5; }
          35%   { transform: translate(138px, 68px) rotateY(26deg) rotate(4deg) scale(0.89, 0.85); z-index: 5; }
          49.9% { transform: translate(168px, 42px) rotateY(34deg) rotate(5deg) scale(0.91, 0.88); z-index: 5; }
          50.1% { transform: translate(168px, 42px) rotateY(34deg) rotate(5deg) scale(0.91, 0.88); z-index: 40; }
          65%   { transform: translate(145px, 18px) rotateY(26deg) rotate(4deg) scale(0.94, 0.92); z-index: 40; }
          82%   { transform: translate(78px, 2px) rotateY(14deg) rotate(2deg) scale(0.97, 0.96); z-index: 40; }
          100%  { transform: translate(0px, 0px) rotateY(0deg) rotate(0deg) scale(1, 1); z-index: 40; }
        }
      `}</style>

      <div
        style={{
          width: FLASH_STAGE_W * scale,
          height: FLASH_STAGE_H * scale,
        }}
      >
        <div
          ref={stageRef}
          className="relative"
          style={{
            width: FLASH_STAGE_W,
            height: FLASH_STAGE_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            perspective: "1400px",
            perspectiveOrigin: "50% 40%",
          }}
        >
          {FLASH_ITEMS.map((itemKey, itemIndex) => {
            const stackIndex = order.indexOf(itemIndex);
            const slot = FLASH_SLOTS[stackIndex];
            const isTop = stackIndex === 0;
            const isPhaseCard = phase?.cardId === itemKey;
            const isDragFollow = drag !== null && isTop;

            const animationName = isPhaseCard
              ? phase?.direction === "next"
                ? `${id}-exit-next`
                : `${id}-enter-prev`
              : undefined;

            let transformValue: string;
            let transition: string;
            let zIndex = slot.zIndex;

            if (isDragFollow) {
              transformValue = `translate(${drag.dx}px, ${drag.dy}px) rotate(${drag.rot}deg) scale(1, 1)`;
              transition = "none";
              zIndex = 40;
            } else {
              transformValue = `translate(${slot.tx}px, ${slot.ty}px) rotate(0deg) scale(${slot.sx}, ${slot.sy})`;
              transition = animationName
                ? "none"
                : `transform ${FLASH_DURATION}ms ${FLASH_FOLLOW_EASE}`;
            }

            return (
              <div
                key={itemKey}
                data-flash-card={itemKey}
                className="absolute left-0 top-0 will-change-transform"
                style={{
                  width: FLASH_CARD_W,
                  height: FLASH_CARD_H,
                  transform: transformValue,
                  transformOrigin: "top left",
                  zIndex,
                  transition,
                  animation: animationName
                    ? `${animationName} ${FLASH_DURATION}ms ${FLASH_EASE} both`
                    : undefined,
                }}
              >
                <FlashCardShell />
              </div>
            );
          })}

          <div
            className="absolute"
            style={{
              top: FLASH_BUTTONS_Y,
              left: (FLASH_STAGE_W - FLASH_BUTTONS_W) / 2,
              width: FLASH_BUTTONS_W,
              height: FLASH_BUTTON_SIZE,
              zIndex: 100,
            }}
          >
            <button
              type="button"
              className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border-none p-0 cursor-pointer transition-transform duration-100 active:scale-90"
              onClick={(e) => {
                e.stopPropagation();
                rotateBackward();
              }}
              aria-label="Previous card"
              style={{ background: "#EDEEF3" }}
            >
              <ChevronIcon direction="left" />
            </button>

            <button
              type="button"
              className="absolute top-0 flex h-10 w-10 items-center justify-center rounded-full border-none p-0 cursor-pointer transition-transform duration-100 active:scale-90"
              onClick={(e) => {
                e.stopPropagation();
                rotateForward();
              }}
              aria-label="Next card"
              style={{
                left: FLASH_BUTTON_SIZE + FLASH_BUTTON_GAP,
                background: "#EDEEF3",
              }}
            >
              <ChevronIcon direction="right" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
