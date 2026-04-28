"use client";

import { useEffect, useRef, useState } from "react";

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
 *  FlashCardTransitionPreview · 1:1 还原 Figma 673:10425
 *
 *  Panel = stage（卡片堆）+ 16gap + buttons
 *    stage   : 321 × 345  （三层卡片堆叠区域）
 *    buttons : 321 × 40   （Need to Review · Mastered 两颗 pill）
 *  整个 panel 用 transform: scale 自适应预览容器尺寸
 *
 *  三层卡片位置（与设计稿一致）：
 *    - top    : (0,   0)   scale(1.000, 1.000)
 *    - middle : (14,  66)  scale(0.913, 0.828)
 *    - bottom : (28, 101)  scale(0.826, 0.751)
 *
 *  交互
 *    · 拖动顶部卡片：跟手平移 + 旋转，松手如位移 ≥ 60px 算"下一张"
 *    · 点击 Need to Review（黄）：顶部卡片向左飞出 → 落回堆栈底
 *    · 点击 Mastered（绿）：顶部卡片向右飞出 → 落回堆栈底
 *    两颗按钮都是"下一张"，只是抛出方向相反
 * ---------------------------------------------------------------- */
const FLASH_STAGE_W = 321;
const FLASH_STAGE_H = 345;
const FLASH_BTN_H = 40;
const FLASH_GAP = 16;
const FLASH_PANEL_H = FLASH_STAGE_H + FLASH_GAP + FLASH_BTN_H;
const FLASH_CARD_W = 321;
const FLASH_CARD_H = 325;

const FLASH_DURATION = 580;
const FLASH_FOLLOW_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const FLASH_FLING_DURATION = 320;
const FLASH_FLING_EASE = "cubic-bezier(0.4, 0, 1, 1)";
const FLASH_FLING_DISTANCE = 480;
const FLASH_FLING_ROT = 18;

/** 拖动到这个距离时，意图描边 + 文字达到 100% 不透明度 */
const FLASH_INTENT_FULL_PX = 120;

const FLASH_SLOTS = [
  { tx: 0, ty: 0, sx: 1, sy: 1, zIndex: 30 },
  { tx: 14, ty: 66, sx: 293 / 321, sy: 269 / 325, zIndex: 20 },
  { tx: 28, ty: 101, sx: 265 / 321, sy: 244 / 325, zIndex: 10 },
];

const FLASH_ITEMS = ["card-1", "card-2", "card-3"] as const;

type FlashIntent = "review" | "mastered" | null;

const FLASH_INTENT_COLORS: Record<NonNullable<FlashIntent>, string> = {
  review: "246, 165, 7", // #F6A507
  mastered: "64, 199, 0", // #40C700
};

function FlashCardShell({
  intent,
  intensity,
}: {
  intent?: FlashIntent;
  intensity?: number;
}) {
  const i = Math.max(0, Math.min(1, intensity ?? 0));
  const rgb = intent ? FLASH_INTENT_COLORS[intent] : null;

  const borderShadow = rgb
    ? `inset 0 0 0 4px rgba(${rgb}, ${i})`
    : "inset 0 0 0 4px rgba(0,0,0,0)";

  return (
    <div
      className="relative h-full w-full bg-white overflow-hidden"
      style={{
        borderRadius: 20,
        boxShadow: `${borderShadow}, 0 12px 24px rgba(0,0,0,0.08)`,
      }}
    >
      {intent && (
        <div
          aria-hidden
          className="absolute"
          style={{
            top: 24,
            left: 16,
            right: 16,
            textAlign: "center",
            color: intent === "review" ? "#F6A507" : "#40C700",
            opacity: i,
            fontFamily:
              "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
            fontWeight: 500,
            fontSize: 14,
            lineHeight: 1,
          }}
        >
          {intent === "review" ? "Need to Review" : "Mastered"}
        </div>
      )}
    </div>
  );
}

function FlashPillButton({
  variant,
  label,
  iconSrc,
  onClick,
}: {
  variant: "review" | "mastered";
  label: string;
  iconSrc: string;
  onClick: (e: React.MouseEvent) => void;
}) {
  const theme =
    variant === "review"
      ? { bg: "#FFF6D9", border: "#F6A507", color: "#F6A507" }
      : { bg: "#EAFFEA", border: "#40C700", color: "#40C700" };

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-1 items-center justify-center gap-1 rounded-full cursor-pointer transition-transform duration-100 active:scale-[0.97]"
      style={{
        height: FLASH_BTN_H,
        background: theme.bg,
        border: `1px solid ${theme.border}`,
        color: theme.color,
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
        fontWeight: 500,
        fontSize: 14,
        lineHeight: 1,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={iconSrc}
        alt=""
        width={16}
        height={16}
        draggable={false}
        style={{ display: "block" }}
      />
      <span>{label}</span>
    </button>
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
  const [drag, setDrag] = useState<DragState | null>(null);
  const [fling, setFling] = useState<{ sign: -1 | 1 } | null>(null);
  const [snapId, setSnapId] = useState<number | null>(null);
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
  const flingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const updateScale = () => {
      const el = containerRef.current;
      if (!el) return;
      const next = Math.min(
        (el.clientWidth - 16) / FLASH_STAGE_W,
        (el.clientHeight - 16) / FLASH_PANEL_H,
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
      if (flingTimerRef.current !== null) {
        clearTimeout(flingTimerRef.current);
      }
    };
  }, []);

  const triggerFling = (sign: -1 | 1) => {
    if (drag || fling) return;
    if (flingTimerRef.current !== null) {
      clearTimeout(flingTimerRef.current);
    }
    const exitingIndex = order[0];
    setFling({ sign });
    flingTimerRef.current = window.setTimeout(() => {
      setSnapId(exitingIndex);
      setOrder(([first, second, third]) => [second, third, first]);
      setFling(null);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setSnapId(null));
      });
      flingTimerRef.current = null;
    }, FLASH_FLING_DURATION);
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
    if (drag || fling) return;
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
      <div
        style={{
          width: FLASH_STAGE_W * scale,
          height: FLASH_PANEL_H * scale,
        }}
      >
        <div
          style={{
            width: FLASH_STAGE_W,
            height: FLASH_PANEL_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {/* 卡片堆 */}
          <div
            ref={stageRef}
            className="relative"
            style={{
              width: FLASH_STAGE_W,
              height: FLASH_STAGE_H,
              perspective: "1400px",
              perspectiveOrigin: "50% 40%",
            }}
          >
            {FLASH_ITEMS.map((itemKey, itemIndex) => {
              const stackIndex = order.indexOf(itemIndex);
              const slot = FLASH_SLOTS[stackIndex];
              const isTop = stackIndex === 0;
              const isDragFollow = drag !== null && isTop;
              const isFlingCard = fling !== null && isTop;
              const isSnap = snapId === itemIndex;

              let transformValue: string;
              let transition: string;
              let zIndex = slot.zIndex;

              // Drag/fling 时按方向显示意图描边 + 文字标签
              let intent: FlashIntent = null;
              let intensity = 0;
              if (isTop) {
                if (drag && Math.abs(drag.dx) > 1) {
                  intent = drag.dx < 0 ? "review" : "mastered";
                  intensity = Math.min(
                    Math.abs(drag.dx) / FLASH_INTENT_FULL_PX,
                    1,
                  );
                } else if (fling) {
                  intent = fling.sign < 0 ? "review" : "mastered";
                  intensity = 1;
                }
              }

              if (isFlingCard && fling) {
                const tx = fling.sign * FLASH_FLING_DISTANCE;
                const rot = fling.sign * FLASH_FLING_ROT;
                transformValue = `translate(${tx}px, 0px) rotate(${rot}deg) scale(1, 1)`;
                transition = `transform ${FLASH_FLING_DURATION}ms ${FLASH_FLING_EASE}`;
                zIndex = 40;
              } else if (isDragFollow && drag) {
                transformValue = `translate(${drag.dx}px, ${drag.dy}px) rotate(${drag.rot}deg) scale(1, 1)`;
                transition = "none";
                zIndex = 40;
              } else {
                transformValue = `translate(${slot.tx}px, ${slot.ty}px) rotate(0deg) scale(${slot.sx}, ${slot.sy})`;
                transition = isSnap
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
                  }}
                >
                  <FlashCardShell intent={intent} intensity={intensity} />
                </div>
              );
            })}
          </div>

          {/* 按钮行 */}
          <div
            className="flex items-stretch"
            style={{
              width: FLASH_STAGE_W,
              height: FLASH_BTN_H,
              marginTop: FLASH_GAP,
              gap: 8,
            }}
          >
            <FlashPillButton
              variant="review"
              label="Need to Review"
              iconSrc="/figma/card-flip/flash-btn-review.svg"
              onClick={(e) => {
                e.stopPropagation();
                triggerFling(-1);
              }}
            />
            <FlashPillButton
              variant="mastered"
              label="Mastered"
              iconSrc="/figma/card-flip/flash-btn-mastered.svg"
              onClick={(e) => {
                e.stopPropagation();
                triggerFling(1);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
