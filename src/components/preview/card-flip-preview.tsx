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
 *  FlashCardTransitionPreview · 回退到旧版 Flash Card Stack
 *
 *  舞台尺寸：321 × 409（不渲染外层 frame 灰底）
 *  卡片基础尺寸：321 × 325
 *  三层位置：
 *    - top    : (0,   0)   scale(1.000, 1.000)
 *    - middle : (14,  66)  scale(0.913, 0.828)
 *    - bottom : (28, 101)  scale(0.826, 0.751)
 *  按钮：两颗 40×40 chevron，整体居中
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
const FLASH_STACK_BUTTON_SIZE = 40;
const FLASH_STACK_BUTTON_GAP = 24;

type FlashIntent = "review" | "mastered" | null;

const FLASH_INTENT_COLORS: Record<NonNullable<FlashIntent>, string> = {
  review: "246, 165, 7", // #F6A507
  mastered: "64, 199, 0", // #40C700
};

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

function FlashSwipePillButton({
  variant,
  label,
  iconSrc,
  disabled,
  onClick,
}: {
  variant: "review" | "mastered";
  label: string;
  iconSrc: string;
  disabled?: boolean;
  onClick: (e: React.MouseEvent) => void;
}) {
  const theme =
    variant === "review"
      ? { bg: "#FFF6D9", border: "#F6A507", color: "#F6A507" }
      : { bg: "#EAFFEA", border: "#40C700", color: "#40C700" };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex flex-1 items-center justify-center gap-1 rounded-full transition-transform duration-100 active:scale-[0.97] disabled:cursor-default disabled:active:scale-100"
      style={{
        height: FLASH_BTN_H,
        background: theme.bg,
        border: `1px solid ${theme.border}`,
        color: theme.color,
        opacity: disabled ? 0.45 : 1,
        cursor: disabled ? "default" : "pointer",
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

function FlashResetButton({
  onClick,
}: {
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center rounded-full cursor-pointer transition-transform duration-100 active:scale-[0.97]"
      style={{
        height: FLASH_BTN_H,
        background: "#EAF2FF",
        border: "1px solid #007AFF",
        color: "#007AFF",
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
        fontWeight: 600,
        fontSize: 14,
        lineHeight: 1,
      }}
    >
      Reset
    </button>
  );
}

function FlashIntentOverlay({
  intent,
  intensity,
}: {
  intent: FlashIntent;
  intensity: number;
}) {
  if (!intent) return null;

  const i = Math.max(0, Math.min(1, intensity));
  const rgb = FLASH_INTENT_COLORS[intent];

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: 20,
          boxShadow: `inset 0 0 0 4px rgba(${rgb}, ${i})`,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          top: 24,
          left: intent === "review" ? 20 : undefined,
          right: intent === "mastered" ? 20 : undefined,
          maxWidth: 136,
          textAlign: intent === "review" ? "left" : "right",
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
    </>
  );
}

const FLASH_SWIPE_THRESHOLD = 60;

type DragState = {
  dx: number;
  dy: number;
  rot: number;
};

/* ----------------------------------------------------------------
 *  Flash Card Stack · 1:1 还原 Figma 1185:8887
 *
 *  Panel  : 353 × hug，内部 padding 16，gap 16
 *  Stage  : 321 × 460  （3 张卡叠放）
 *  Card   : 321 × 440  （白底，圆角 20，内部 padding 16/16/20）
 *  3 个槽位（让 3 张同样大小的卡按比例缩放堆叠）：
 *    top    : (0,   0)   scale 1.000
 *    middle : (14, 48)   scale 293/321 ≈ 0.913
 *    bottom : (28, 97)   scale 265/321 ≈ 0.826
 *
 *  Buttons: 两颗 40 × 40 灰底 chevron，gap 24，居中
 *
 *  动画规则：
 *    Next → 顶层卡片向左走弧线，从 z 前层下沉到底层位置
 *    Prev → 第三层卡片向右走弧线，从 z 后层升到顶层
 *    其他两张同步过渡到新槽位
 * ---------------------------------------------------------------- */
const FLASH_STACK_PANEL_W = 353;
const FLASH_STACK_STAGE_W = 321;
const FLASH_STACK_STAGE_H = 460;
const FLASH_STACK_CARD_W = 321;
const FLASH_STACK_CARD_H = 440;
const FLASH_STACK_PANEL_GAP = 16;
const FLASH_STACK_PANEL_PADDING = 16;

const FLASH_STACK_SLOTS = [
  { tx: 0, ty: 0, scale: 1, zIndex: 30 },
  { tx: 14, ty: 48, scale: 293 / 321, zIndex: 20 },
  { tx: 28, ty: 97, scale: 265 / 321, zIndex: 10 },
];

const FLASH_STACK_DURATION = 500;
const FLASH_STACK_FOLLOW_EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
const FLASH_STACK_EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

interface FlashStackCardData {
  id: string;
  indexLabel: string;
  question: string;
  choices: [string, string, string, string];
}

const FLASH_STACK_CARDS: FlashStackCardData[] = [
  {
    id: "card-1",
    indexLabel: "1/3",
    question: "What is the perimeter of a square with side length 4?",
    choices: [
      "Separate different chromosomes",
      "Identical chromosome copies",
      "Nuclear membrane fragments",
      "Spindle fiber proteins",
    ],
  },
  {
    id: "card-2",
    indexLabel: "2/3",
    question: "Which structure separates chromosomes during mitosis?",
    choices: [
      "Mitotic spindle",
      "Cell membrane",
      "Golgi apparatus",
      "Nucleolus",
    ],
  },
  {
    id: "card-3",
    indexLabel: "3/3",
    question: "What is the chemical symbol for water?",
    choices: ["H2O", "CO2", "NaCl", "O2"],
  },
];

function FlashStackCardFront({ card }: { card: FlashStackCardData }) {
  return (
    <div
      className="flex flex-col"
      style={{
        width: FLASH_STACK_CARD_W,
        height: FLASH_STACK_CARD_H,
        padding: "16px 16px 20px",
        gap: 16,
        borderRadius: 20,
        background: "#FFFFFF",
        boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
      }}
    >
      <div className="flex flex-col" style={{ gap: 12 }}>
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "14px",
            color: "#595C60",
          }}
        >
          {card.indexLabel}
        </div>
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: 16,
            lineHeight: "20.8px",
            color: "#111111",
          }}
        >
          {card.question}
        </div>
      </div>

      <div className="mt-auto flex flex-col" style={{ gap: 8 }}>
        {card.choices.map((choice) => (
          <div
            key={choice}
            style={{
              paddingBottom: 4,
              borderRadius: 12,
              background: "#DCE7F3",
            }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                padding: "12px 16px",
                borderRadius: 12,
                background: "#F4F9FF",
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: 16,
                lineHeight: "22.4px",
                color: "#111111",
                textAlign: "center",
              }}
            >
              {choice}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FlashCardTransitionPreview() {
  const [order, setOrder] = useState([0, 1, 2]);
  const [phase, setPhase] = useState<{
    direction: "next" | "prev";
    cardId: string;
  } | null>(null);
  const phaseTimeoutRef = useRef<number | null>(null);

  const rawId = useId();
  const animId = `flash-stack-${rawId.replace(/:/g, "")}`;
  const slotThird = FLASH_STACK_SLOTS[2];

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
    if (phase) return;
    const exitingId = FLASH_STACK_CARDS[order[0]].id;
    setPhase({ direction: "next", cardId: exitingId });
    setOrder(([first, second, third]) => [second, third, first]);
    schedulePhaseClear(FLASH_STACK_DURATION + 20);
  };

  const rotateBackward = () => {
    if (phase) return;
    const enteringId = FLASH_STACK_CARDS[order[2]].id;
    setPhase({ direction: "prev", cardId: enteringId });
    setOrder(([first, second, third]) => [third, first, second]);
    schedulePhaseClear(FLASH_STACK_DURATION + 20);
  };

  return (
    <div className="flex h-full w-full items-center justify-center px-4 py-3 select-none">
      <style>{`
        @keyframes ${animId}-exit-next {
          0% {
            transform: translate(0px, 0px) rotateY(0deg) rotate(0deg) scale(1, 1);
            z-index: 40;
            animation-timing-function: cubic-bezier(0.55, 0, 0.85, 0.4);
          }
          49.9% {
            transform: translate(-184px, 36px) rotateY(-30deg) rotate(-4deg) scale(0.91, 0.91);
            z-index: 40;
            animation-timing-function: step-end;
          }
          50.1% {
            transform: translate(-184px, 36px) rotateY(-30deg) rotate(-4deg) scale(0.91, 0.91);
            z-index: 5;
            animation-timing-function: cubic-bezier(0.15, 0.6, 0.35, 1);
          }
          100% {
            transform: translate(${slotThird.tx}px, ${slotThird.ty}px) rotateY(0deg) rotate(0deg) scale(${slotThird.scale}, ${slotThird.scale});
            z-index: 5;
          }
        }
        @keyframes ${animId}-enter-prev {
          0% {
            transform: translate(${slotThird.tx}px, ${slotThird.ty}px) rotateY(0deg) rotate(0deg) scale(${slotThird.scale}, ${slotThird.scale});
            z-index: 5;
            animation-timing-function: cubic-bezier(0.55, 0, 0.85, 0.4);
          }
          49.9% {
            transform: translate(184px, 36px) rotateY(30deg) rotate(4deg) scale(0.91, 0.91);
            z-index: 5;
            animation-timing-function: step-end;
          }
          50.1% {
            transform: translate(184px, 36px) rotateY(30deg) rotate(4deg) scale(0.91, 0.91);
            z-index: 40;
            animation-timing-function: cubic-bezier(0.15, 0.6, 0.35, 1);
          }
          100% {
            transform: translate(0px, 0px) rotateY(0deg) rotate(0deg) scale(1, 1);
            z-index: 40;
          }
        }
      `}</style>

      <div
        className="relative rounded-[24px] border bg-[#FBFCFF] flex flex-col"
        style={{
          width: FLASH_STACK_PANEL_W,
          padding: FLASH_STACK_PANEL_PADDING,
          gap: FLASH_STACK_PANEL_GAP,
          borderColor: "#E6E8EA",
        }}
      >
        <div
          className="relative"
          style={{
            width: FLASH_STACK_STAGE_W,
            height: FLASH_STACK_STAGE_H,
            perspective: "1400px",
            perspectiveOrigin: "50% 40%",
          }}
        >
          {FLASH_STACK_CARDS.map((card, cardIndex) => {
            const stackIndex = order.indexOf(cardIndex);
            const slot = FLASH_STACK_SLOTS[stackIndex];
            const isPhaseCard = phase?.cardId === card.id;
            const animationName = isPhaseCard
              ? phase?.direction === "next"
                ? `${animId}-exit-next`
                : `${animId}-enter-prev`
              : undefined;

            const transformValue = `translate(${slot.tx}px, ${slot.ty}px) rotate(0deg) scale(${slot.scale})`;
            const transition = animationName
              ? "none"
              : `transform ${FLASH_STACK_DURATION}ms ${FLASH_STACK_FOLLOW_EASE}`;

            return (
              <div
                key={card.id}
                className="absolute left-0 top-0 will-change-transform"
                style={{
                  width: FLASH_STACK_CARD_W,
                  height: FLASH_STACK_CARD_H,
                  transform: transformValue,
                  transformOrigin: "top left",
                  zIndex: slot.zIndex,
                  transition,
                  animation: animationName
                    ? `${animationName} ${FLASH_STACK_DURATION}ms ${FLASH_STACK_EASE} both`
                    : undefined,
                }}
              >
                <FlashStackCardFront card={card} />
              </div>
            );
          })}
        </div>

        <div
          className="flex items-center justify-center"
          style={{ height: FLASH_STACK_BUTTON_SIZE, gap: FLASH_STACK_BUTTON_GAP }}
        >
          <button
            type="button"
            className="flex items-center justify-center rounded-full border-none p-0 cursor-pointer transition-transform duration-100 active:scale-90"
            onClick={(e) => {
              e.stopPropagation();
              rotateBackward();
            }}
            aria-label="Previous card"
            style={{
              width: FLASH_STACK_BUTTON_SIZE,
              height: FLASH_STACK_BUTTON_SIZE,
              background: "#EDEEF3",
            }}
          >
            <ChevronIcon direction="left" />
          </button>

          <button
            type="button"
            className="flex items-center justify-center rounded-full border-none p-0 cursor-pointer transition-transform duration-100 active:scale-90"
            onClick={(e) => {
              e.stopPropagation();
              rotateForward();
            }}
            aria-label="Next card"
            style={{
              width: FLASH_STACK_BUTTON_SIZE,
              height: FLASH_STACK_BUTTON_SIZE,
              background: "#EDEEF3",
            }}
          >
            <ChevronIcon direction="right" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function FlashCardFlipSwipeAwayPreview() {
  const [cards, setCards] = useState([0, 1, 2]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [exiting, setExiting] = useState<{ card: number; sign: -1 | 1 } | null>(
    null,
  );
  const [scale, setScale] = useState(0.62);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
  } | null>(null);
  const exitTimerRef = useRef<number | null>(null);
  const suppressFlipRef = useRef(false);

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
      if (exitTimerRef.current !== null) {
        clearTimeout(exitTimerRef.current);
      }
    };
  }, []);

  const triggerDismiss = (sign: -1 | 1) => {
    if (exiting || cards.length === 0) return;
    if (exitTimerRef.current !== null) {
      clearTimeout(exitTimerRef.current);
    }

    const exitingCard = cards[0];
    setExiting({ card: exitingCard, sign });
    exitTimerRef.current = window.setTimeout(() => {
      setCards((prev) => prev.slice(1));
      setFlippedCards((prev) => prev.filter((id) => id !== exitingCard));
      setDrag(null);
      setExiting(null);
      exitTimerRef.current = null;
    }, FLASH_FLING_DURATION);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (cards.length === 0 || exiting) return;
    if ((e.target as HTMLElement).closest("button")) return;
    suppressFlipRef.current = false;
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
    };
    setDrag({ dx: 0, dy: 0, rot: 0 });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const cur = dragRef.current;
    if (!cur || cur.pointerId !== e.pointerId || exiting) return;
    const dx = e.clientX - cur.startX;
    const dy = e.clientY - cur.startY;
    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
      suppressFlipRef.current = true;
    }
    setDrag({
      dx: dx / scale,
      dy: (dy / scale) * 0.4,
      rot: (dx / scale) * 0.06,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const cur = dragRef.current;
    dragRef.current = null;
    if (!cur || cur.pointerId !== e.pointerId) return;
    const dx = e.clientX - cur.startX;
    const dy = e.clientY - cur.startY;

    const isTap =
      !suppressFlipRef.current && Math.abs(dx) < 8 && Math.abs(dy) < 8;
    if (isTap) {
      setDrag(null);
      toggleTopCardFlip();
      return;
    }

    if (Math.abs(dx) < FLASH_SWIPE_THRESHOLD) {
      setDrag(null);
      return;
    }

    triggerDismiss(dx < 0 ? -1 : 1);
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === e.pointerId) {
      dragRef.current = null;
      setDrag(null);
    }
  };

  const toggleTopCardFlip = () => {
    if (cards.length === 0 || exiting || suppressFlipRef.current) return;
    const cardId = cards[0];
    setFlippedCards((prev) =>
      prev.includes(cardId)
        ? prev.filter((id) => id !== cardId)
        : [...prev, cardId],
    );
  };

  const buttonsDisabled = cards.length === 0;
  const showReset = cards.length === 0;

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full items-center justify-center px-4 py-3 select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      style={{
        touchAction: "pan-y",
        cursor:
          drag !== null ? "grabbing" : cards.length > 0 && !exiting ? "grab" : "default",
      }}
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
          <div
            className="relative"
            style={{
              width: FLASH_STAGE_W,
              height: FLASH_STAGE_H,
              perspective: "1400px",
              perspectiveOrigin: "50% 40%",
            }}
          >
            {cards.map((itemIndex, stackIndex) => {
              const itemKey = FLASH_ITEMS[itemIndex];
              const slot = FLASH_SLOTS[stackIndex];
              const slotScale = Math.min(slot.sx, slot.sy);
              const centeredTx =
                slot.tx + ((slot.sx - slotScale) * FLASH_CARD_W) / 2;
              const isTop = stackIndex === 0;
              const isDragFollow = drag !== null && isTop;
              const isExitingCard = exiting?.card === itemIndex;
              const isFlipped = flippedCards.includes(itemIndex);

              let transformValue: string;
              let transition = `transform ${FLASH_DURATION}ms ${FLASH_FOLLOW_EASE}`;
              let zIndex = slot.zIndex;

              let intent: FlashIntent = null;
              let intensity = 0;
              if (isTop) {
                if (drag && Math.abs(drag.dx) > 1) {
                  intent = drag.dx < 0 ? "review" : "mastered";
                  intensity = Math.min(
                    Math.abs(drag.dx) / FLASH_INTENT_FULL_PX,
                    1,
                  );
                } else if (exiting) {
                  intent = exiting.sign < 0 ? "review" : "mastered";
                  intensity = 1;
                }
              }

              if (isExitingCard && exiting) {
                const tx = (drag?.dx ?? slot.tx) + exiting.sign * FLASH_FLING_DISTANCE;
                const ty = drag?.dy ?? slot.ty;
                const rot = (drag?.rot ?? 0) + exiting.sign * FLASH_FLING_ROT;
                transformValue = `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(1, 1)`;
                transition = `transform ${FLASH_FLING_DURATION}ms ${FLASH_FLING_EASE}`;
                zIndex = 40;
              } else if (isDragFollow && drag) {
                transformValue = `translate(${drag.dx}px, ${drag.dy}px) rotate(${drag.rot}deg) scale(1, 1)`;
                transition = "none";
                zIndex = 40;
              } else {
                transformValue = `translate(${centeredTx}px, ${slot.ty}px) rotate(0deg) scale(${slotScale})`;
              }

              return (
                <div
                  key={itemKey}
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
                  {isTop ? (
                    <div
                      className="relative h-full w-full cursor-pointer"
                      style={{ perspective: 1000 }}
                    >
                      <div
                        className="relative h-full w-full will-change-transform"
                        style={{
                          transformStyle: "preserve-3d",
                          transform: `rotateY(${isFlipped ? 180 : 0}deg)`,
                          transition: "transform 0.6s cubic-bezier(0.45, 0.05, 0.25, 1)",
                        }}
                      >
                        <FlipFrontFace />
                        <FlipBackFace />
                      </div>
                      <FlashIntentOverlay intent={intent} intensity={intensity} />
                    </div>
                  ) : (
                    <div className="relative h-full w-full">
                      <FlipFrontFace />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div
            className="flex items-stretch"
            style={{
              width: FLASH_STAGE_W,
              height: FLASH_BTN_H,
              marginTop: FLASH_GAP,
              gap: 8,
            }}
          >
            {showReset ? (
              <FlashResetButton
                onClick={(e) => {
                  e.stopPropagation();
                  if (exitTimerRef.current !== null) {
                    clearTimeout(exitTimerRef.current);
                    exitTimerRef.current = null;
                  }
                  setCards([0, 1, 2]);
                  setFlippedCards([]);
                  setDrag(null);
                  setExiting(null);
                }}
              />
            ) : (
              <>
                <FlashSwipePillButton
                  variant="review"
                  label="Need to Review"
                  iconSrc="/figma/card-flip/flash-btn-review.svg"
                  disabled={buttonsDisabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerDismiss(-1);
                  }}
                />
                <FlashSwipePillButton
                  variant="mastered"
                  label="Mastered"
                  iconSrc="/figma/card-flip/flash-btn-mastered.svg"
                  disabled={buttonsDisabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerDismiss(1);
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
