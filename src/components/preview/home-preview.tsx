"use client";

import { useState } from "react";
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

      {/* Capture mode panel + Bottom Tab Bar */}
      <div className="absolute left-0 right-0 bottom-0 flex flex-col">
        <div
          className="relative w-full pointer-events-none"
          style={{ height: CAPTURE_MODE_PANEL_H }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/figma/home/capture-mode.png"
            alt=""
            draggable={false}
            className="absolute inset-0 w-full h-full"
            style={{ objectFit: "cover", objectPosition: "center center" }}
          />
        </div>

        <div
          className="flex"
          style={{
            background: TAB_BG,
            paddingTop: 6,
            paddingBottom: 24,
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
        style={{ height: HOME_INDICATOR_H }}
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
