"use client";

import { useState } from "react";

const ACTIVE = "#007AFF";
const INACTIVE = "#989B9E";
const BG = "#FFFFFF";
const TOP_BORDER = "#F6F8FA";

const TABS = [
  { id: "scan",  label: "Scan",  Icon: ScanIcon },
  { id: "study", label: "Study", Icon: StudyIcon },
  { id: "me",    label: "Me",    Icon: MeIcon },
];

export function TabBarBouncePreview() {
  const [active, setActive] = useState(0);
  const [tapped, setTapped] = useState(-1);

  const tap = (i: number) => {
    setActive(i);
    setTapped(i);
    setTimeout(() => setTapped(-1), 140);
  };

  return (
    <div className="w-full max-w-[320px] flex flex-col items-center select-none">
      <div
        className="w-full rounded-t-2xl flex items-center justify-center h-14"
        style={{ background: BG }}
      >
        <span className="text-sm" style={{ color: INACTIVE }}>
          {TABS[active].label} Page
        </span>
      </div>

      <div
        className="w-full flex rounded-b-2xl pb-1.5"
        style={{
          background: BG,
          borderTop: `1px solid ${TOP_BORDER}`,
        }}
      >
        {TABS.map((tab, i) => {
          const isActive = active === i;
          const isTapped = tapped === i;
          const color = isActive ? ACTIVE : INACTIVE;
          const Icon = tab.Icon;
          return (
            <button
              key={tab.id}
              className="flex-1 flex flex-col items-center border-none bg-transparent cursor-pointer pt-3 pb-1"
              style={{ gap: 2 }}
              onClick={(e) => { e.stopPropagation(); tap(i); }}
            >
              <span
                className="inline-flex items-center justify-center"
                style={{
                  width: 24,
                  height: 24,
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
    </div>
  );
}

export function TabBarBadgePreview() {
  const [count, setCount] = useState(3);
  const [pulse, setPulse] = useState(false);
  const BADGE_TAB_INDEX = 1;

  const increment = () => {
    setCount((c) => c + 1);
    setPulse(true);
    setTimeout(() => setPulse(false), 300);
  };

  return (
    <div className="absolute inset-0 select-none">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-[320px] flex flex-col items-center">
          <div
            className="w-full rounded-t-2xl flex items-center justify-center h-14"
            style={{ background: BG }}
          >
            <span className="text-sm" style={{ color: INACTIVE }}>
              Scan Page
            </span>
          </div>

          <div
            className="w-full flex rounded-b-2xl pb-1.5"
            style={{
              background: BG,
              borderTop: `1px solid ${TOP_BORDER}`,
            }}
          >
            {TABS.map((tab, i) => {
              const isActive = i === 0;
              const color = isActive ? ACTIVE : INACTIVE;
              const Icon = tab.Icon;
              const showBadge = i === BADGE_TAB_INDEX;
              return (
                <div
                  key={tab.id}
                  className="flex-1 flex flex-col items-center pt-3 pb-1"
                  style={{ gap: 2 }}
                >
                  <span
                    className="relative inline-flex items-center justify-center"
                    style={{ width: 24, height: 24, color }}
                  >
                    <Icon />
                    {showBadge && (
                      <span
                        className="absolute flex items-center justify-center rounded-full bg-red-500 text-white font-bold leading-none"
                        style={{
                          minWidth: 18,
                          height: 18,
                          padding: "0 5px",
                          fontSize: 11,
                          top: -8,
                          right: -14,
                          transformOrigin: "center",
                          transform: pulse ? "scale(1.18)" : "scale(1)",
                          transition:
                            "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                          boxShadow: "0 0 0 2px #FFFFFF",
                        }}
                      >
                        {count}
                      </span>
                    )}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      lineHeight: 1.21,
                      fontFamily:
                        "Inter, ui-sans-serif, system-ui, sans-serif",
                      fontWeight: isActive ? 600 : 500,
                      color,
                    }}
                  >
                    {tab.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <button
        className="absolute px-3 py-1.5 rounded-lg text-xs font-medium border-none cursor-pointer"
        style={{
          bottom: 16,
          right: 16,
          background: "rgba(0,0,0,0.06)",
          color: "rgba(0,0,0,0.7)",
        }}
        onClick={(e) => { e.stopPropagation(); increment(); }}
      >
        + New Message
      </button>
    </div>
  );
}

function ScanIcon() {
  return (
    <svg width="23" height="21" viewBox="0 0 23 21" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.1477 1.27778C9.097 1.27778 8.13653 1.87138 7.66667 2.81111C7.1968 3.75084 6.23633 4.34444 5.18568 4.34444H4.34444C2.65077 4.34444 1.27778 5.71744 1.27778 7.41111V16.6111C1.27778 18.3048 2.65077 19.6778 4.34444 19.6778H18.6556C20.3492 19.6778 21.7222 18.3048 21.7222 16.6111V7.41111C21.7222 5.71744 20.3492 4.34444 18.6556 4.34444H17.8143C16.7637 4.34444 15.8032 3.75084 15.3333 2.81111C14.8635 1.87138 13.903 1.27778 12.8523 1.27778H10.1477Z"
        fill="currentColor"
      />
      <path
        d="M15.3333 2.81111L16.4762 2.23967L15.3333 2.81111ZM4.34444 4.34444V5.62222H5.18568V4.34444V3.06667H4.34444V4.34444ZM1.27778 16.6111H2.55556V7.41111H1.27778H0V16.6111H1.27778ZM18.6556 19.6778V18.4H4.34444V19.6778V20.9556H18.6556V19.6778ZM21.7222 7.41111H20.4444V16.6111H21.7222H23V7.41111H21.7222ZM17.8143 4.34444V5.62222H18.6556V4.34444V3.06667H17.8143V4.34444ZM10.1477 1.27778V2.55556H12.8523V1.27778V0H10.1477V1.27778ZM15.3333 2.81111L16.4762 2.23967C15.7899 0.867052 14.387 0 12.8523 0V1.27778V2.55556C13.419 2.55556 13.937 2.87571 14.1905 3.38255L15.3333 2.81111ZM17.8143 4.34444V3.06667C17.2477 3.06667 16.7296 2.74651 16.4762 2.23967L15.3333 2.81111L14.1905 3.38255C14.8768 4.75517 16.2797 5.62222 17.8143 5.62222V4.34444ZM21.7222 7.41111H23C23 5.01174 21.0549 3.06667 18.6556 3.06667V4.34444V5.62222C19.6435 5.62222 20.4444 6.42313 20.4444 7.41111H21.7222ZM18.6556 19.6778V20.9556C21.0549 20.9556 23 19.0105 23 16.6111H21.7222H20.4444C20.4444 17.5991 19.6435 18.4 18.6556 18.4V19.6778ZM1.27778 16.6111H0C0 19.0105 1.94507 20.9556 4.34444 20.9556V19.6778V18.4C3.35647 18.4 2.55556 17.5991 2.55556 16.6111H1.27778ZM4.34444 4.34444V3.06667C1.94507 3.06667 0 5.01174 0 7.41111H1.27778H2.55556C2.55556 6.42313 3.35647 5.62222 4.34444 5.62222V4.34444ZM7.66667 2.81111L8.80955 3.38255C9.06296 2.87571 9.58099 2.55556 10.1477 2.55556V1.27778V0C8.61302 0 7.2101 0.867052 6.52379 2.23967L7.66667 2.81111ZM7.66667 2.81111L6.52379 2.23967C6.27037 2.74651 5.75234 3.06667 5.18568 3.06667V4.34444V5.62222C6.72032 5.62222 8.12324 4.75517 8.80955 3.38255L7.66667 2.81111Z"
        fill="currentColor"
      />
      <path
        d="M11.5 16.1C13.7582 16.1 15.5889 14.2694 15.5889 12.0111C15.5889 9.75287 13.7582 7.92222 11.5 7.92222C9.24176 7.92222 7.41111 9.75287 7.41111 12.0111C7.41111 14.2694 9.24176 16.1 11.5 16.1Z"
        fill="currentColor"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StudyIcon() {
  return (
    <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
      <rect
        x="1"
        y="1"
        width="16"
        height="20"
        rx="3"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12.358 3.61612C12.6258 2.95678 13.5767 3.01078 13.7681 3.6962L14.0949 4.86635C14.1571 5.08889 14.3188 5.27009 14.5329 5.35703L15.6585 5.8142C16.3179 6.08199 16.2639 7.03295 15.5785 7.22438L14.4083 7.55119C14.1858 7.61334 14.0046 7.77506 13.9176 7.98913L13.4604 9.11477C13.1927 9.77411 12.2417 9.72011 12.0503 9.03469L11.7235 7.86454C11.6613 7.642 11.4996 7.46081 11.2855 7.37386L10.1599 6.91669C9.50053 6.6489 9.55453 5.69794 10.24 5.50651L11.4101 5.1797C11.6326 5.11755 11.8138 4.95583 11.9008 4.74176L12.358 3.61612Z"
        fill="#FFFFFF"
      />
      <path
        d="M4.26562 11H7.86133"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.26562 16H14.2031"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 0C17.0751 0 22 4.92487 22 11C22 17.0751 17.0751 22 11 22C4.92487 22 0 17.0751 0 11C0 4.92487 4.92487 0 11 0ZM7.31934 7.68945C6.9313 7.29646 6.29827 7.29165 5.90527 7.67969C5.319 8.25857 5 9.11384 5 10C5.00002 10.8859 5.31927 11.7405 5.90527 12.3193C6.29824 12.7073 6.93129 12.7035 7.31934 12.3105C7.70738 11.9176 7.70354 11.2845 7.31055 10.8965C7.1589 10.7466 7.00002 10.432 7 10C7 9.568 7.15892 9.25344 7.31055 9.10352C7.70354 8.71548 7.70737 8.08245 7.31934 7.68945ZM14.3193 7.68945C13.9313 7.29646 13.2983 7.29165 12.9053 7.67969C12.319 8.25857 12 9.11384 12 10C12 10.8859 12.3193 11.7405 12.9053 12.3193C13.2982 12.7073 13.9313 12.7035 14.3193 12.3105C14.7074 11.9176 14.7035 11.2845 14.3105 10.8965C14.1589 10.7466 14 10.432 14 10C14 9.568 14.1589 9.25344 14.3105 9.10352C14.7035 8.71548 14.7074 8.08245 14.3193 7.68945Z"
        fill="currentColor"
      />
    </svg>
  );
}
