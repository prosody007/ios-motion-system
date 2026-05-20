"use client";

import { useState, type CSSProperties } from "react";
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

type TutorCard = {
  id: string;
  question: string;
  tagText: string;
  tagBg: string;
  tagColor: string;
};

const TUTOR_CARDS: TutorCard[] = [
  {
    id: "plant",
    question: "Why is this plant growing linearly?",
    tagText: "Algebra",
    tagBg: "#E5F0FF",
    tagColor: "#0A6CF4",
  },
  {
    id: "rollercoaster",
    question: "Why doesn't a roller coaster loop fall?",
    tagText: "Algebra",
    tagBg: "#E5F0FF",
    tagColor: "#0A6CF4",
  },
  {
    id: "grease",
    question: "How does soap actually break down grease?",
    tagText: "Chemistry",
    tagBg: "#E1F5DA",
    tagColor: "#1E7B0E",
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
        {/* 椭圆光斑 — Figma node 1743:24116
            蓝色 #B7C7FF 模糊扩散 */}
        <div
          aria-hidden="true"
          className="absolute pointer-events-none"
          style={{
            top: -80,
            left: "50%",
            transform: "translateX(-50%)",
            width: 540,
            height: 460,
            borderRadius: "50%",
            background:
              "radial-gradient(60% 60% at 50% 50%, rgba(160, 180, 255, 0.55) 0%, rgba(200, 210, 240, 0.2) 60%, rgba(200, 210, 240, 0) 100%)",
            filter: "blur(20px)",
          }}
        />

        {/* 噪点矩形 — Figma node 1743:24108：白色 44% 不透明，叠在光斑上 */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "rgba(255, 255, 255, 0.44)",
          }}
        />

        {/* 状态栏 */}
        <StatusBar />

        {/* 头像 + 三个分页点 + 名称 + 副标题 */}
        <div
          className="absolute left-0 right-0 flex flex-col items-center"
          style={{ top: 78 }}
        >
          {/* Lexie 头像 — 圆形，180×180 */}
          <div
            style={{
              width: 180,
              height: 180,
              borderRadius: "50%",
              overflow: "hidden",
              background: "#FFFFFF",
              boxShadow:
                "0 8px 24px rgba(20, 30, 60, 0.08), 0 1px 4px rgba(20, 30, 60, 0.04)",
              flexShrink: 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/tutor/lexie-avatar.png"
              alt=""
              draggable={false}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 12%",
              }}
            />
          </div>

          {/* 三个分页指示点 */}
          <div
            className="flex items-center"
            style={{ gap: 8, marginTop: 16 }}
          >
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  width: i === 2 ? 8 : 6,
                  height: i === 2 ? 8 : 6,
                  borderRadius: "50%",
                  background:
                    i === 2 ? "#111111" : "rgba(0, 0, 0, 0.18)",
                  transition: "all 0.2s ease",
                }}
              />
            ))}
          </div>

          {/* 名称 */}
          <p
            style={{
              margin: 0,
              marginTop: 18,
              fontFamily:
                "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Inter', 'PingFang SC', sans-serif",
              fontSize: 28,
              fontWeight: 700,
              lineHeight: "32px",
              color: "#111111",
              letterSpacing: -0.4,
            }}
          >
            Lexie
          </p>

          {/* 副标题 */}
          <p
            style={{
              margin: 0,
              marginTop: 6,
              fontFamily:
                "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Inter', 'PingFang SC', sans-serif",
              fontSize: 16,
              fontWeight: 400,
              lineHeight: "20px",
              color: "rgba(0, 0, 0, 0.45)",
            }}
          >
            Friendly . keeps it light
          </p>
        </div>

        {/* 推荐卡片 carousel — Figma Frame 2147226036，@3x PNG 原图直接渲染 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/figma/tutor/tutor-card-carousel.png"
          alt=""
          draggable={false}
          className="absolute pointer-events-none select-none"
          style={{
            left: "50%",
            bottom: 198,
            width: 665,
            height: "auto",
            transform: "translateX(-50%)",
          }}
        />

        {/* 底部 CTA */}
        <BottomCTA />

        {/* Tab Bar */}
        <div
          className="absolute left-0 right-0"
          style={{
            bottom: 0,
            height: 83,
            paddingTop: 8,
            paddingBottom: 24,
            display: "flex",
            background: "#FFFFFF",
            borderTop: "0.5px solid rgba(0, 0, 0, 0.06)",
          }}
        >
          {TAB_ITEMS.map((tab, i) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(i)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
            >
              <tab.Icon active={activeTab === i} />
              <span
                style={{
                  fontFamily:
                    "'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Inter', 'PingFang SC', sans-serif",
                  fontSize: 10,
                  fontWeight: activeTab === i ? 600 : 500,
                  lineHeight: "12px",
                  color: activeTab === i ? "#0A6CF4" : "#9A9DA1",
                  letterSpacing: -0.05,
                }}
              >
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </DemoCanvas>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sub-components                                                             */
/* -------------------------------------------------------------------------- */

function StatusBar() {
  return (
    <div
      className="absolute left-0 right-0 flex items-center"
      style={{
        top: 0,
        height: 54,
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 18,
        justifyContent: "space-between",
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

function TutorCardItem({
  card,
  isActive,
  offset,
  onClick,
}: {
  card: TutorCard;
  isActive: boolean;
  offset: number;
  onClick: () => void;
}) {
  const baseStyle: CSSProperties = {
    position: "absolute",
    left: "50%",
    top: 0,
    width: 246,
    height: 168,
    borderRadius: 20,
    background: "#FFFFFF",
    boxShadow:
      "0 12px 32px rgba(20, 30, 60, 0.08), 0 2px 6px rgba(20, 30, 60, 0.04)",
    padding: "20px 20px 16px",
    boxSizing: "border-box",
    cursor: "pointer",
    transition:
      "transform 0.45s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.3s ease-out",
    transform: `translateX(calc(-50% + ${offset * 270}px)) scale(${isActive ? 1 : 0.92})`,
    opacity: isActive ? 1 : 0.95,
    transformOrigin: "center center",
    display: "flex",
    flexDirection: "column",
    gap: 14,
  };

  return (
    <div onClick={onClick} style={baseStyle}>
      {/* 蓝色 wifi 图标 */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <CardWifiIcon />
      </div>

      {/* 问题 */}
      <p
        style={{
          margin: 0,
          fontFamily:
            "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Inter', 'PingFang SC', sans-serif",
          fontSize: 16,
          fontWeight: 600,
          lineHeight: "20px",
          color: "#111111",
          letterSpacing: -0.2,
          flex: 1,
        }}
      >
        {card.question}
      </p>

      {/* 标签 + 右侧箭头 */}
      <div
        className="flex items-center"
        style={{ justifyContent: "space-between" }}
      >
        <div
          style={{
            padding: "4px 10px",
            borderRadius: 100,
            background: card.tagBg,
          }}
        >
          <span
            style={{
              fontFamily:
                "'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
              fontSize: 13,
              fontWeight: 500,
              lineHeight: "16px",
              color: card.tagColor,
            }}
          >
            {card.tagText}
          </span>
        </div>
        {isActive && (
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              background: "rgba(0, 0, 0, 0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ChevronRightIcon />
          </div>
        )}
      </div>
    </div>
  );
}

function CardWifiIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
      <path
        d="M16 22a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
        fill="#0A6CF4"
      />
      <path
        d="M9.5 15.5a9 9 0 0 1 13 0"
        stroke="#0A6CF4"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M5 11a14.5 14.5 0 0 1 22 0"
        stroke="#0A6CF4"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M5 3l4 4-4 4"
        stroke="rgba(0, 0, 0, 0.5)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/figma/tutor/tutor-btn-keyboard.png"
        alt=""
        draggable={false}
        style={{ width: 58, height: 58, flexShrink: 0 }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/figma/tutor/tutor-btn-snap.png"
        alt=""
        draggable={false}
        style={{ width: 197, height: 58, flexShrink: 0 }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/figma/tutor/tutor-btn-mic.png"
        alt=""
        draggable={false}
        style={{ width: 58, height: 58, flexShrink: 0 }}
      />
    </div>
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
