"use client";

import { useState } from "react";
import { ScanIcon, StudyIcon, MeIcon } from "./tabbar-preview";

const STATUS_BAR_H = 44;
const HOME_INDICATOR_H = 34;
const FG = "#000000";

const TAB_ACTIVE = "#007AFF";
const TAB_INACTIVE = "#989B9E";
const TAB_BG =
  "linear-gradient(180deg, rgba(17, 17, 17, 0.8) 0%, #111111 100%)";
const TAB_TOP_BORDER = "#F6F8FA";

const TABS = [
  { id: "scan", label: "Scan", Icon: ScanIcon },
  { id: "study", label: "Study", Icon: StudyIcon },
  { id: "me", label: "Me", Icon: MeIcon },
];

function StatusIcons() {
  return (
    <svg
      width="66.661"
      height="11.336"
      viewBox="0 0 66.661 11.336"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ color: FG }}
    >
      {/* Cellular signal — 4 bars */}
      <rect x="0" y="7" width="3" height="4.336" rx="0.6" fill="currentColor" />
      <rect x="4.5" y="5" width="3" height="6.336" rx="0.6" fill="currentColor" />
      <rect x="9" y="3" width="3" height="8.336" rx="0.6" fill="currentColor" />
      <rect x="13.5" y="1" width="3" height="10.336" rx="0.6" fill="currentColor" />

      {/* Wi-Fi */}
      <path
        d="M21.5 8.4 q3.4 -3 6.8 0"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M19.7 6.4 q5.2 -4.8 10.4 0"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M18 4.4 q6.9 -6.4 13.8 0"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="24.9" cy="10.1" r="1" fill="currentColor" />

      {/* Battery */}
      <rect
        x="42.833"
        y="0.503"
        width="21"
        height="10.333"
        rx="2.167"
        stroke="currentColor"
        strokeOpacity="0.35"
      />
      <path
        d="M65.333 3.67 V 7.67"
        stroke="currentColor"
        strokeOpacity="0.4"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <rect
        x="44.333"
        y="2.003"
        width="18"
        height="7.336"
        rx="1.167"
        fill="currentColor"
      />
    </svg>
  );
}

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

      {/* Status bar */}
      <div
        className="absolute left-0 right-0 top-0 flex items-center justify-between"
        style={{
          height: STATUS_BAR_H,
          paddingLeft: 21,
          paddingRight: 14.34,
          paddingTop: 15,
          paddingBottom: 12,
        }}
      >
        <div
          className="flex items-center justify-center"
          style={{
            width: 54,
            height: 17,
            color: FG,
            fontFamily:
              "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
            fontWeight: 600,
            fontSize: 14,
            letterSpacing: "-0.28px",
            textAlign: "center",
          }}
        >
          9:41
        </div>
        <div className="flex items-center" style={{ height: 11.336 }}>
          <StatusIcons />
        </div>
      </div>

      {/* Bottom Tab Bar (Scan / Study / Me) */}
      <div
        className="absolute left-0 right-0 flex"
        style={{
          bottom: 0,
          background: TAB_BG,
          borderTop: `1px solid ${TAB_TOP_BORDER}`,
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
                <Icon />
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

      {/* Home indicator */}
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
            background: FG,
          }}
        />
      </div>
    </div>
  );
}
