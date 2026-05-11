"use client";

import { useEffect, useRef, useState } from "react";
import { ScanIcon, StudyIcon, MeIcon } from "./tabbar-preview";

const HOME_INDICATOR_H = 34;
const STATUS_BAR_FG = "#FFFFFF";
const CAPTURE_MODE_PANEL_H = 160;

const TAB_ACTIVE = "#007AFF";
const TAB_INACTIVE = "#989B9E";
const TAB_BG =
  "linear-gradient(180deg, rgba(17, 17, 17, 0.8) 0%, #111111 100%)";

const TABS = [
  { id: "scan", label: "Scan", Icon: ScanIcon },
  { id: "study", label: "Study", Icon: StudyIcon },
  { id: "me", label: "Me", Icon: MeIcon },
];

export function HomePreview() {
  const [active, setActive] = useState(0);
  const [tapped, setTapped] = useState(-1);
  const [captureMode, setCaptureMode] = useState(0);

  const tap = (i: number) => {
    setActive(i);
    setTapped(i);
    setTimeout(() => setTapped(-1), 140);
  };

  return (
    <div
      className="absolute inset-0 select-none overflow-hidden"
      style={{ background: "#FFFFFF" }}
    >
      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/figma/home/camera.png"
        alt=""
        draggable={false}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ objectFit: "cover", objectPosition: "center center" }}
      />

      {/* 全屏蒙层 — 纯黑 10% 透明度，叠在背景图片之上 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "rgba(0, 0, 0, 0.1)" }}
      />

      {/* 顶部蒙层 — 与底部蒙层方向相反，叠在背景图片之上 */}
      <div
        className="absolute left-0 right-0 top-0 pointer-events-none"
        style={{
          height: 320,
          background:
            "linear-gradient(to bottom, rgba(17, 17, 17, 0.75) 0%, rgba(34, 34, 34, 0) 100%)",
        }}
      />

      {/* Status bar — 1:1 与 Figma 节点 1460:15612 对齐 */}
      <div
        className="absolute left-0 right-0 top-0 flex flex-col items-start justify-center"
        style={{ paddingTop: 20, paddingBottom: 8 }}
      >
        <div className="flex w-full shrink-0 items-center justify-between">
          {/* Time */}
          <div
            className="flex items-center justify-center min-w-0"
            style={{ flex: "1 0 0", paddingLeft: 16, paddingRight: 6 }}
          >
            <p
              className="m-0 whitespace-nowrap text-center"
              style={{
                fontFamily:
                  "'SF Pro', -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
                fontWeight: 590,
                fontSize: 17,
                lineHeight: "22px",
                color: STATUS_BAR_FG,
                fontVariationSettings: "'wdth' 100",
              }}
            >
              9:41
            </p>
          </div>

          {/* Dynamic Island spacer */}
          <div style={{ width: 124, height: 10, flexShrink: 0 }} />

          {/* Levels */}
          <div
            className="flex items-center justify-center min-w-0"
            style={{
              flex: "1 0 0",
              gap: 7,
              paddingLeft: 6,
              paddingRight: 16,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/home/cellular.svg"
              alt=""
              draggable={false}
              style={{ width: 19.2, height: 12.226, flexShrink: 0 }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/home/wifi.svg"
              alt=""
              draggable={false}
              style={{ width: 17.142, height: 12.328, flexShrink: 0 }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/home/battery.svg"
              alt=""
              draggable={false}
              style={{ width: 27.328, height: 13, flexShrink: 0 }}
            />
          </div>
        </div>
      </div>

      {/* Tool bar — 1:1 与 Figma 节点 1465:13774 对齐 */}
      <div
        className="absolute left-0 right-0 flex items-center justify-between"
        style={{
          top: 50,
          height: 48,
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 8,
          paddingBottom: 8,
        }}
      >
        <div className="flex items-center" style={{ gap: 24 }}>
          <div style={{ position: "relative", width: 32, height: 32, flexShrink: 0 }}>
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: 24,
                height: 24,
                border: "2px dashed #FFFFFF",
                borderRadius: 6,
              }}
            />
          </div>
          <div style={{ position: "relative", width: 32, height: 32, flexShrink: 0 }}>
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: 24,
                height: 24,
                border: "2px dashed #FFFFFF",
                borderRadius: 6,
              }}
            />
          </div>
        </div>

        <div className="flex items-center" style={{ gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/figma/home/history.svg"
            alt=""
            draggable={false}
            style={{ width: 32, height: 32, flexShrink: 0 }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/figma/home/lightning.svg"
            alt=""
            draggable={false}
            style={{ width: 32, height: 32, flexShrink: 0 }}
          />
          <div
            style={{
              position: "relative",
              width: 32,
              height: 32,
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 6,
                top: 4,
                width: 20,
                height: 24,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/figma/home/calculator.svg"
                alt=""
                draggable={false}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
        </div>
      </div>

      <InfoModule mode={captureMode} />

      {/* Capture mode panel + Bottom Tab Bar */}
      <div className="absolute left-0 right-0 bottom-0 flex flex-col">
        <CaptureMode mode={captureMode} setMode={setCaptureMode} />

        <div
          className="flex"
          style={{
            background: TAB_BG,
            paddingTop: 6,
            paddingBottom: 24,
            position: "relative",
            zIndex: 20,
          }}
        >
          {TABS.map((tab, i) => {
            const isActive = active === i;
            const isTapped = tapped === i;
            const color = isActive ? TAB_ACTIVE : TAB_INACTIVE;
            const Icon = tab.Icon;
            return (
              <button
                key={tab.id}
                type="button"
                className="flex-1 flex flex-col items-center border-none bg-transparent cursor-pointer pt-1 pb-1"
                style={{ gap: 3 }}
                onClick={(e) => {
                  e.stopPropagation();
                  tap(i);
                }}
              >
                <span
                  className="inline-flex items-center justify-center"
                  style={{
                    width: 28,
                    height: 28,
                    color,
                    transform: isTapped ? "scale(0.88)" : "scale(1)",
                    transition: isTapped
                      ? "transform 0.07s ease-in, color 0.18s ease"
                      : "transform 0.22s cubic-bezier(0.34, 1.4, 0.64, 1), color 0.18s ease",
                  }}
                >
                  <Icon active={isActive} />
                </span>
                <span
                  style={{
                    fontSize: 10,
                    lineHeight: 1.21,
                    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
                    fontWeight: isActive ? 600 : 500,
                    color,
                    transition: "color 0.18s ease",
                  }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Home indicator (drawn on top of the dark tab bar) */}
      <div
        className="absolute left-0 right-0 bottom-0 pointer-events-none"
        style={{ height: HOME_INDICATOR_H, zIndex: 30 }}
      >
        <div
          className="absolute"
          style={{
            bottom: 8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 144,
            height: 5,
            borderRadius: 100,
            background: "#FFFFFF",
          }}
        />
      </div>
    </div>
  );
}

const CAPTURE_LABEL_FONT = {
  fontFamily:
    "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
  fontWeight: 600,
  fontSize: 12,
  color: "#FFFFFF",
  opacity: 0.8,
  textAlign: "center" as const,
};

const SEGMENT_TEXT_BASE = {
  fontFamily:
    "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
  fontSize: 13,
  lineHeight: "18px",
  color: "#111111",
  whiteSpace: "nowrap" as const,
};

function CaptureMode({
  mode,
  setMode,
}: {
  mode: number;
  setMode: (n: number) => void;
}) {
  return (
    <div
      className="relative w-full"
      style={{ height: CAPTURE_MODE_PANEL_H, pointerEvents: "none" }}
    >
      {/* 底部蒙层 — Figma node 1467:14077 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 160,
          background:
            "linear-gradient(to top, rgba(17, 17, 17, 0.75) 0%, rgba(34, 34, 34, 0) 100%)",
        }}
      />

      {/* Photos — Figma node 1467:14083 */}
      <div
        style={{
          position: "absolute",
          left: 54.5,
          bottom: 20,
          width: 41,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          pointerEvents: "auto",
        }}
      >
        <div
          style={{ position: "relative", width: 32, height: 32, flexShrink: 0 }}
        >
          <div
            style={{
              position: "absolute",
              top: "20.31%",
              right: "10.94%",
              bottom: "20.31%",
              left: "14.06%",
              border: "2.5px solid #FFFFFF",
              borderRadius: 4,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "35.94%",
              right: "11.83%",
              bottom: "20.31%",
              left: "17.19%",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/home/capture-photo-mountain.svg"
              alt=""
              draggable={false}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              top: "29.69%",
              right: "57.81%",
              bottom: "57.81%",
              left: "29.69%",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/home/capture-photo-dot.svg"
              alt=""
              draggable={false}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
        <span style={CAPTURE_LABEL_FONT}>Photos</span>
      </div>

      {/* Text — Figma node 1467:14078 */}
      <div
        style={{
          position: "absolute",
          left: 297.5,
          bottom: 20,
          width: 41,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          pointerEvents: "auto",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/figma/home/capture-text.svg"
          alt=""
          draggable={false}
          style={{ width: 32, height: 32, flexShrink: 0 }}
        />
        <span style={CAPTURE_LABEL_FONT}>Text</span>
      </div>

      {/* 中央按钮 — Figma node 1467:14086 (home_btn_normal)，整体导出图片 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/figma/home/capture-btn.png"
        alt=""
        draggable={false}
        style={{
          position: "absolute",
          left: 151,
          bottom: 20,
          width: 90,
          height: 90,
          pointerEvents: "auto",
          userSelect: "none",
        }}
      />

      {/* 顶部 Segmented (Quick Solve / Guided Solve) — Figma node 1467:14119
          交互动画与 Segmented Control 共用：滑动指示器 + 按压 0.96 缩放 */}
      <SegmentedControl selected={mode} setSelected={setMode} />
    </div>
  );
}

const SEGMENT_LABELS = ["Quick Solve", "Guided Solve"];
const SEGMENT_SPRING = "cubic-bezier(0.32, 0.72, 0, 1)";

function SegmentedControl({
  selected,
  setSelected,
}: {
  selected: number;
  setSelected: (n: number) => void;
}) {
  const [pressed, setPressed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState<{ left: number; width: number }[]>([]);

  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const buttons = containerRef.current.querySelectorAll("button");
      const next = Array.from(buttons).map((b) => {
        const el = b as HTMLElement;
        return { left: el.offsetLeft, width: el.offsetWidth };
      });
      setBounds(next);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const activeBounds = bounds[selected];
  const thumbLeft = activeBounds?.left ?? 0;
  const thumbWidth = activeBounds?.width ?? 0;

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        left: "50%",
        bottom: 124,
        transform: "translateX(-50%)",
        padding: 2,
        borderRadius: 100,
        background: "rgba(0, 0, 0, 0.2)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        pointerEvents: "auto",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 2,
          bottom: 2,
          left: thumbLeft,
          width: thumbWidth,
          borderRadius: 100,
          background: "#FFFFFF",
          border: "0.5px solid #FFFFFF",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.24)",
          transform: `scale(${pressed ? 0.96 : 1})`,
          transformOrigin: "center",
          transition: `left 0.34s ${SEGMENT_SPRING}, width 0.3s ${SEGMENT_SPRING}, transform 0.15s ease-out`,
          pointerEvents: "none",
        }}
      />
      {SEGMENT_LABELS.map((label, i) => (
        <button
          key={label}
          type="button"
          onPointerDown={() => setPressed(true)}
          onPointerUp={() => setPressed(false)}
          onPointerCancel={() => setPressed(false)}
          onPointerLeave={() => setPressed(false)}
          onClick={() => setSelected(i)}
          style={{
            position: "relative",
            zIndex: 1,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            width: 116,
            height: 32,
            paddingLeft: 16,
            paddingRight: 16,
            borderRadius: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            ...SEGMENT_TEXT_BASE,
            color: selected === i ? "#111111" : "rgba(255, 255, 255, 0.9)",
            fontWeight: 600,
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

const INFO_TEXTS = [
  "Get the full step-by-step solution",
  "Snap for step-by-step solution",
];

function InfoModule({ mode }: { mode: number }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: "50%",
        top: 258,
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 48,
      }}
    >
      <p
        style={{
          margin: 0,
          minWidth: "max-content",
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
          fontWeight: 700,
          fontSize: 18,
          lineHeight: 1.3,
          color: "#FFFFFF",
          textAlign: "center",
          textShadow: "0px 0px 3px rgba(17, 17, 17, 0.8)",
        }}
      >
        {INFO_TEXTS[mode]}
      </p>
      <div style={{ position: "relative", width: 52, height: 52 }}>
        <div style={{ position: "absolute", inset: "-5.77%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/figma/home/info-icon.svg"
            alt=""
            draggable={false}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}
