"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type Dispatch,
  type SetStateAction,
} from "react";
import { DemoCanvas } from "./demo-canvas";

/**
 * Tutor 实例页（1:1 还原 Figma 1743:24075，393×852 设计稿）
 *
 * 结构（从下到上）：
 * 1. 渐变背景 #F6F8FA
 * 2. 椭圆光斑（蓝色，模糊扩散）
 * 3. 噪点矩形（白色 44% 不透明）
 * 4. 状态栏（9:41 + 信号 / wifi / 电池）
 * 5. 头像 + 名称 + 副标题
 * 6. 三个分页指示点
 * 7. 卡片 carousel（中央焦点 + 左右各露一半）
 * 8. 底部 CTA：键盘 / Snap a photo / 麦克风
 * 9. Tab Bar（Scan / Lecture Notes / Study(active) / Me）
 */

type TutorCarouselCard = {
  id: string;
  question: string;
  tagText: string;
  tagBg: string;
  tagColor: string;
};

const TUTOR_CAROUSEL_CARDS: TutorCarouselCard[] = [
  {
    id: "plant",
    question: "Why is this plant growing linearly?",
    tagText: "Biology",
    tagBg: "#EAF4F9",
    tagColor: "#0B99BC",
  },
  {
    id: "rollercoaster",
    question: "Why doesn't a roller coaster loop fall?",
    tagText: "Algebra",
    tagBg: "#ECF5FF",
    tagColor: "#007AFF",
  },
  {
    id: "grease",
    question: "How does soap actually break down grease?",
    tagText: "Chemistry",
    tagBg: "#ECF5ED",
    tagColor: "#33A354",
  },
  {
    id: "gravity",
    question: "Why do astronauts float inside spacecraft?",
    tagText: "Physics",
    tagBg: "#F0ECFF",
    tagColor: "#6E42D7",
  },
  {
    id: "fractions",
    question: "How do fractions turn into decimals?",
    tagText: "Math",
    tagBg: "#FFF2E5",
    tagColor: "#D46B08",
  },
  {
    id: "photosynthesis",
    question: "How does sunlight become plant energy?",
    tagText: "Biology",
    tagBg: "#EAF4F9",
    tagColor: "#0B99BC",
  },
];

const TAB_ITEMS = [
  { id: "scan", label: "Scan", Icon: TabScanIcon, active: false },
  { id: "lecture", label: "Lecture Notes", Icon: TabLectureIcon, active: false },
  { id: "study", label: "Study", Icon: TabStudyIcon, active: true },
  { id: "me", label: "Me", Icon: TabMeIcon, active: false },
];

export function TutorPreview() {
  const [activeIndex, setActiveIndex] = useState(1); // 中央卡（rollercoaster）选中
  const [activeTab, setActiveTab] = useState(2); // Study tab

  return (
    <DemoCanvas mode="fill" background="#F6F8FA">
      <div
        className="absolute inset-0 select-none overflow-hidden"
        style={{ background: "#F6F8FA" }}
      >
        {/* 顶部背景光斑 — Figma node 2042:18327
            由 393×200 蓝色矩形 blur(300) + 80×80 绿色椭圆 blur(200) 叠加生成 */}
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 pointer-events-none"
          style={{
            width: 393,
            height: 200,
            background: "rgba(38, 92, 255, 0.7)",
            filter: "blur(300px)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 pointer-events-none"
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "#6EFF7F",
            filter: "blur(200px)",
          }}
        />

        {/* 白色蒙层 — Figma node 1743:24108：白色 44% 不透明，叠在光斑上 */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "rgba(255, 255, 255, 0.44)",
          }}
        />

        {/* 顶部 Title 区 — Figma node 2004:17288：状态栏 + Tutor 工具栏 */}
        <TutorTitleHeader />

        {/* Hero + Carousel 组 — Figma node 1761:15434
            title 高 92，组距离 title top 外边距 40，因此 group top = 132；组内 gap = 48 */}
        <div
          className="absolute left-0 right-0"
          style={{
            top: 132,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 48,
            overflow: "visible",
          }}
        >
          {/* 新 Hero 区 — Figma node 2004:17323，@3x PNG 原图直接渲染 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/figma/tutor/tutor-teacher-hero.png"
            alt=""
            draggable={false}
            className="pointer-events-none select-none"
            style={{
              width: 393,
              height: "auto",
              display: "block",
            }}
          />

          {/* 推荐卡片 carousel — 6 张卡组成无限圆环轮播 */}
          <TutorRingCarousel
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        </div>

        {/* 底部 CTA */}
        <BottomCTA />

        {/* 底部导航栏 — Figma node 2004:17484，@3x PNG 原图直接渲染 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/figma/tutor/tutor-bottom-nav.png"
          alt=""
          draggable={false}
          className="absolute left-0 bottom-0 pointer-events-none select-none"
          style={{ width: 393, height: "auto" }}
        />
      </div>
    </DemoCanvas>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sub-components                                                             */
/* -------------------------------------------------------------------------- */

function TutorRingCarousel({
  activeIndex,
  setActiveIndex,
}: {
  activeIndex: number;
  setActiveIndex: Dispatch<SetStateAction<number>>;
}) {
  const pointerStartX = useRef<number | null>(null);
  const dragDeltaX = useRef(0);
  const [trackIndex, setTrackIndex] = useState(
    TUTOR_CAROUSEL_CARDS.length + activeIndex,
  );
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const count = TUTOR_CAROUSEL_CARDS.length;
  const CARD_W = 184;
  const CARD_H = 174;
  // Figma Frame 2147226036 子卡坐标：left -91 / 105 / 301，中心间距 196px。
  const CARD_STEP = 196;
  const tripledCards = [
    ...TUTOR_CAROUSEL_CARDS,
    ...TUTOR_CAROUSEL_CARDS,
    ...TUTOR_CAROUSEL_CARDS,
  ];
  const logicalIndex = ((trackIndex % count) + count) % count;
  // 连续虚拟位置：track 本身在拖动时用 dragOffset 平移，
  // 每张卡片的 rotate / scale / y 也必须使用同一个连续位置计算，
  // 否则拖动过程中只有位置变，旋转会等松手后才跳变。
  const visualTrackIndex = trackIndex - dragOffset / CARD_STEP;

  useEffect(() => {
    setActiveIndex(logicalIndex);
  }, [logicalIndex, setActiveIndex]);

  useEffect(() => {
    if (dragging) return;
    const id = window.setInterval(() => {
      setTransitionEnabled(true);
      setTrackIndex((prev) => prev + 1);
    }, 3000);
    return () => window.clearInterval(id);
  }, [dragging]);

  const setByDirection = (direction: -1 | 1) => {
    setTransitionEnabled(true);
    setTrackIndex((prev) => prev + direction);
  };

  const snapLoopBoundary = () => {
    setTrackIndex((prev) => {
      if (prev < count || prev >= count * 2) {
        const normalized = count + (((prev % count) + count) % count);
        if (normalized !== prev) {
          setTransitionEnabled(false);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => setTransitionEnabled(true));
          });
          return normalized;
        }
      }
      return prev;
    });
  };

  return (
    <div
      className="relative w-full"
      style={{
        // 对齐 Figma：Frame 2147226036 是 176px 高。
        // 由父级 Frame 2147226037 负责与 hero 形成 gap 48 的组。
        height: 176,
        overflow: "visible",
        touchAction: "pan-y",
      }}
      onPointerDown={(event) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        pointerStartX.current = event.clientX;
        dragDeltaX.current = 0;
        setDragging(true);
        setTransitionEnabled(false);
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (pointerStartX.current === null) return;
        const delta = event.clientX - pointerStartX.current;
        dragDeltaX.current = delta;
        setDragOffset(delta);
      }}
      onPointerUp={(event) => {
        if (pointerStartX.current === null) return;
        event.currentTarget.releasePointerCapture(event.pointerId);
        const delta = dragDeltaX.current;
        pointerStartX.current = null;
        dragDeltaX.current = 0;
        setDragOffset(0);
        setDragging(false);
        setTransitionEnabled(true);
        if (Math.abs(delta) < CARD_STEP * 0.18) return;
        // 左滑看下一张，右滑看上一张
        setByDirection(delta < 0 ? 1 : -1);
      }}
      onPointerCancel={() => {
        pointerStartX.current = null;
        dragDeltaX.current = 0;
        setDragOffset(0);
        setDragging(false);
        setTransitionEnabled(true);
      }}
    >
      <div
        className="absolute top-0 left-1/2 will-change-transform"
        style={{
          transform: `translate(calc(-${CARD_W / 2}px - ${trackIndex * CARD_STEP}px + ${dragOffset}px), 0px)`,
          transition: transitionEnabled
            ? "transform 1.008s cubic-bezier(0.32, 0.72, 0, 1)"
            : "none",
        }}
        onTransitionEnd={(event) => {
          if (event.propertyName === "transform") snapLoopBoundary();
        }}
      >
        {tripledCards.map((card, index) => {
          const offset = index - visualTrackIndex;
          const distance = Math.abs(offset);
          const clamped = Math.max(-2, Math.min(2, offset));
          const scale =
            distance <= 1
              ? 1 - distance * 0.04
              : Math.max(0.9, 0.96 - (distance - 1) * 0.06);
          const rotate = clamped * 4;
          const y = Math.min(10, distance * 10);

          return (
            <button
              key={`${card.id}-${index}`}
              type="button"
              aria-label={`Tutor card ${index + 1}`}
              onClick={() => {
                setTransitionEnabled(true);
                setTrackIndex(index);
              }}
              style={{
                position: "absolute",
                left: index * CARD_STEP,
                top: 0,
                width: CARD_W,
                height: CARD_H,
                padding: 0,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                transform: `translateY(${y}px) rotate(${rotate}deg) scale(${scale})`,
                opacity: 1,
                transformOrigin: "center center",
                transition: transitionEnabled
                  ? "transform 1.008s cubic-bezier(0.32, 0.72, 0, 1)"
                  : "none",
                willChange: "transform",
              }}
            >
              <TutorCarouselCardView card={card} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TutorCarouselCardView({ card }: { card: TutorCarouselCard }) {
  return (
    <div
      style={{
        width: 184,
        height: 174,
        borderRadius: 24,
        background: "#FFFFFF",
        boxShadow: "0px 16px 32px rgba(0, 0, 0, 0.04)",
        padding: 12,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          flex: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: 0,
        }}
      >
        <CardSignalIcon />
        <p
          style={{
            margin: 0,
            fontFamily:
              "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
            fontWeight: 600,
            fontSize: 14,
            lineHeight: "16.8px",
            color: "#111111",
            textAlign: "left",
            whiteSpace: "pre-line",
          }}
        >
          {card.question}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div
          style={{
            padding: "6px 8px",
            borderRadius: 100,
            background: card.tagBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily:
                "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
              fontWeight: 500,
              fontSize: 10,
              lineHeight: "10px",
              color: card.tagColor,
            }}
          >
            {card.tagText}
          </span>
        </div>
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: 100,
            background: "#EDEEF3",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SmallChevronRight />
        </div>
      </div>
    </div>
  );
}

function CardSignalIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
      <path
        d="M20 28.4V20"
        stroke="#007AFF"
        strokeWidth="3.33"
        strokeLinecap="round"
      />
      <path
        d="M13.4 24.8a9.33 9.33 0 0 1 13.2 0"
        stroke="#007AFF"
        strokeWidth="3.33"
        strokeLinecap="round"
      />
      <path
        d="M8.4 19.8a16.4 16.4 0 0 1 23.2 0"
        stroke="#007AFF"
        strokeWidth="3.33"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SmallChevronRight() {
  return (
    <svg width="8" height="9" viewBox="0 0 8 9" fill="none" aria-hidden>
      <path
        d="M2 1.5L5.5 4.5L2 7.5"
        stroke="#111111"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TutorTitleHeader() {
  return (
    <div
      className="absolute left-0 right-0 top-0"
      style={{
        height: 92,
        zIndex: 20,
      }}
    >
      <StatusBar />

      {/* 工具栏 — Figma node 2004:17308 / Title */}
      <div
        className="absolute left-0 right-0 flex items-stretch"
        style={{
          top: 44,
          height: 48,
          padding: "12px 16px 4px",
          boxSizing: "border-box",
          gap: 10,
        }}
      >
        {/* 左侧占位，与右侧 Share and More Icons 等宽逻辑保持中心 Tutor */}
        <div style={{ flex: 1, minWidth: 0 }} />

        {/* 中间 Model selection：Tutor */}
        <div
          className="flex items-center justify-center"
          style={{
            height: 32,
            borderRadius: 100,
            padding: "0 2px",
            boxSizing: "border-box",
          }}
        >
          <span
            style={{
              fontFamily:
                "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
              fontWeight: 600,
              fontSize: 16,
              lineHeight: "16px",
              color: "#111111",
            }}
          >
            Tutor
          </span>
        </div>

        {/* 右侧 1.00X + history icon */}
        <div
          className="flex items-center justify-end"
          style={{
            flex: 1,
            minWidth: 0,
            gap: 8,
          }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              padding: "8px 10px",
              borderRadius: 100,
              background: "rgba(0, 0, 0, 0.06)",
              boxSizing: "border-box",
              height: 28,
            }}
          >
            <span
              style={{
                fontFamily:
                  "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
                fontWeight: 600,
                fontSize: 12,
                lineHeight: "12px",
                color: "#111111",
              }}
            >
              1.00X
            </span>
          </div>
          <PressableImageButton
            src="/figma/tutor/tutor-history-icon.png"
            label="History"
            width={32}
            height={32}
          />
        </div>
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div
      className="absolute left-0 right-0 flex items-center"
      style={{
        top: 0,
        height: 44,
        paddingLeft: 21,
        paddingRight: 14.34,
        paddingTop: 15,
        justifyContent: "space-between",
        boxSizing: "border-box",
      }}
    >
      <span
        style={{
          fontFamily:
            "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
          fontSize: 17,
          fontWeight: 590,
          color: "#111111",
          fontVariationSettings: "'wdth' 100",
        }}
      >
        9:41
      </span>
      <div className="flex items-center" style={{ gap: 6 }}>
        <SignalIcon />
        <WifiIcon />
        <BatteryIcon />
      </div>
    </div>
  );
}

function SignalIcon() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden>
      {[3, 6, 9, 12].map((h, i) => (
        <rect
          key={i}
          x={i * 4}
          y={12 - h}
          width="3"
          height={h}
          rx="0.6"
          fill="#111"
        />
      ))}
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden>
      <path
        d="M9 11.5a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Z"
        fill="#111"
      />
      <path
        d="M3.6 6.5C5.2 5 7 4.2 9 4.2s3.8.8 5.4 2.3"
        stroke="#111"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M0.8 3.7C3 1.7 5.9 0.6 9 0.6c3.1 0 6 1.1 8.2 3.1"
        stroke="#111"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="26" height="12" viewBox="0 0 26 12" fill="none" aria-hidden>
      <rect
        x="0.5"
        y="0.5"
        width="22"
        height="11"
        rx="2.5"
        stroke="rgba(0,0,0,0.35)"
        fill="none"
      />
      <rect x="2" y="2" width="19" height="8" rx="1.5" fill="#111" />
      <rect
        x="23.5"
        y="3.5"
        width="2"
        height="5"
        rx="1"
        fill="rgba(0,0,0,0.35)"
      />
    </svg>
  );
}

function BottomCTA() {
  return (
    <div
      className="absolute"
      style={{
        bottom: 119,
        left: 0,
        right: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        paddingLeft: 24,
        paddingRight: 24,
      }}
    >
      {/* 三个按钮均为 Figma @3x PNG 原图直接渲染，不做二次处理 */}
      <PressableImageButton
        src="/figma/tutor/tutor-btn-keyboard.png"
        label="Keyboard"
        width={58}
        height={58}
      />
      <PressableImageButton
        src="/figma/tutor/tutor-btn-snap.png"
        label="Snap a photo"
        width={197}
        height={58}
      />
      <PressableImageButton
        src="/figma/tutor/tutor-btn-mic.png"
        label="Microphone"
        width={58}
        height={58}
      />
    </div>
  );
}

function PressableImageButton({
  src,
  label,
  width,
  height,
}: {
  src: string;
  label: string;
  width: number;
  height: number;
}) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      style={{
        width,
        height,
        padding: 0,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        flexShrink: 0,
        transform: pressed ? "scale(0.95)" : "scale(1)",
        transition: "transform 0.1s ease-in-out",
        transformOrigin: "center center",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        draggable={false}
        style={{
          width,
          height,
          display: "block",
          pointerEvents: "none",
          userSelect: "none",
        }}
      />
    </button>
  );
}

function KeyboardIcon() {
  return (
    <svg width="22" height="18" viewBox="0 0 22 18" fill="none" aria-hidden>
      <rect
        x="1"
        y="2"
        width="20"
        height="14"
        rx="2.5"
        stroke="#111"
        strokeWidth="1.5"
        fill="none"
      />
      <rect x="4" y="6" width="2" height="2" rx="0.5" fill="#111" />
      <rect x="8" y="6" width="2" height="2" rx="0.5" fill="#111" />
      <rect x="12" y="6" width="2" height="2" rx="0.5" fill="#111" />
      <rect x="16" y="6" width="2" height="2" rx="0.5" fill="#111" />
      <rect x="6" y="11" width="10" height="2" rx="0.5" fill="#111" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="22" height="20" viewBox="0 0 22 20" fill="none" aria-hidden>
      <path
        d="M3 6.5h2.6L7 4h8l1.4 2.5H19a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 19 18.5H3A1.5 1.5 0 0 1 1.5 17V8A1.5 1.5 0 0 1 3 6.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
        fill="none"
      />
      <circle
        cx="11"
        cy="12"
        r="3.5"
        stroke="currentColor"
        strokeWidth="1.7"
        fill="none"
      />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width="16" height="22" viewBox="0 0 16 22" fill="none" aria-hidden>
      <rect
        x="5"
        y="1.5"
        width="6"
        height="11"
        rx="3"
        stroke="#111"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M2 10v.5a6 6 0 0 0 12 0V10"
        stroke="#111"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <line
        x1="8"
        y1="17"
        x2="8"
        y2="20.5"
        stroke="#111"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* Tab icons */
function TabScanIcon({ active }: { active: boolean }) {
  const c = active ? "#0A6CF4" : "#9A9DA1";
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <path
        d="M3 6.5h2L6 4.5h10l1 2h2A1.5 1.5 0 0 1 20.5 8v9.5A1.5 1.5 0 0 1 19 19H3a1.5 1.5 0 0 1-1.5-1.5V8A1.5 1.5 0 0 1 3 6.5Z"
        stroke={c}
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="11" cy="12.5" r="3.4" stroke={c} strokeWidth="1.6" fill="none" />
    </svg>
  );
}

function TabLectureIcon({ active }: { active: boolean }) {
  const c = active ? "#0A6CF4" : "#9A9DA1";
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <rect x="7.5" y="2.5" width="7" height="11" rx="3.5" stroke={c} strokeWidth="1.6" fill="none" />
      <path
        d="M4 11v.5a7 7 0 0 0 14 0V11"
        stroke={c}
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      <line x1="11" y1="18.5" x2="11" y2="20" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function TabStudyIcon({ active }: { active: boolean }) {
  const c = active ? "#0A6CF4" : "#9A9DA1";
  if (active) {
    return (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
        <path
          d="M5 3.5h12V18a1.5 1.5 0 0 1-2.6 1L11 16l-3.4 3a1.5 1.5 0 0 1-2.6-1V3.5Z"
          fill={c}
        />
        <path d="M9 9.5h4M11 7.5v4" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <path
        d="M5 3.5h12V18a1.5 1.5 0 0 1-2.6 1L11 16l-3.4 3a1.5 1.5 0 0 1-2.6-1V3.5Z"
        stroke={c}
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M9 9.5h4M11 7.5v4" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TabMeIcon({ active }: { active: boolean }) {
  const c = active ? "#0A6CF4" : "#9A9DA1";
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="8.5" stroke={c} strokeWidth="1.6" fill="none" />
      <circle cx="8.4" cy="9.6" r="0.9" fill={c} />
      <circle cx="13.6" cy="9.6" r="0.9" fill={c} />
    </svg>
  );
}
