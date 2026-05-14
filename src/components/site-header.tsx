"use client";

import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { useDevice, type DeviceKind } from "@/components/device-context";

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-[rgba(5,5,5,0.06)] bg-white/92 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="flex h-full w-full items-center px-10">
        <div className="flex w-[304px] shrink-0 items-center">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <Image
              src="/brand/logo-mark.png"
              alt="Motion System logo"
              width={32}
              height={32}
              className="h-8 w-8 shrink-0"
            />
            <div className="min-w-0">
              <div className="truncate text-[15px] font-medium leading-6 text-[rgba(0,0,0,0.88)]">
                Motion System
              </div>
              <div className="truncate text-[12px] leading-4 text-[rgba(0,0,0,0.45)]">
                iOS 交互动效规范
              </div>
            </div>
          </Link>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-between pl-10">
          <div />
          <div className="hidden lg:block">
            <DeviceSegmentedControl />
          </div>
        </div>
      </div>
    </header>
  );
}

const DEVICE_OPTIONS: { id: DeviceKind; label: string; icon: () => ReactNode }[] = [
  { id: "phone", label: "iPhone", icon: () => <PhoneIcon /> },
  { id: "ipad", label: "iPad（横屏）", icon: () => <IPadIcon /> },
  { id: "ipad-portrait", label: "iPad（竖屏）", icon: () => <IPadPortraitIcon /> },
];

const SEGMENT_SPRING = "cubic-bezier(0.32, 0.72, 0, 1)";

/**
 * Segmented Control 风格设备切换：
 * - 两段（iPhone / iPad），白色 thumb 跟随选中项滑动
 * - 与 Home page Capture 模式 segmented 视觉风格一致
 */
function DeviceSegmentedControl() {
  const { device, setDevice } = useDevice();
  const selectedIndex = DEVICE_OPTIONS.findIndex((o) => o.id === device);

  const CELL_W = 36;
  const CELL_H = 28;
  const PADDING = 2;

  return (
    <div
      role="tablist"
      aria-label="设备切换"
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        padding: PADDING,
        borderRadius: 100,
        background: "rgba(0, 0, 0, 0.06)",
        gap: 2,
      }}
    >
      {/* thumb（白色滑块） */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: PADDING,
          left: PADDING,
          width: CELL_W,
          height: CELL_H,
          borderRadius: 100,
          background: "#FFFFFF",
          boxShadow:
            "0 3px 8px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.04)",
          transform: `translateX(${selectedIndex * (CELL_W + 2)}px)`,
          transition: `transform 0.34s ${SEGMENT_SPRING}`,
        }}
      />
      {DEVICE_OPTIONS.map((opt) => {
        const isActive = opt.id === device;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={opt.label}
            title={opt.label}
            onClick={() => setDevice(opt.id)}
            style={{
              position: "relative",
              zIndex: 1,
              width: CELL_W,
              height: CELL_H,
              border: "none",
              background: "transparent",
              padding: 0,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: isActive ? "rgba(0, 0, 0, 0.88)" : "rgba(0, 0, 0, 0.5)",
              transition: "color 0.2s ease-out",
            }}
          >
            {opt.icon()}
          </button>
        );
      })}
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
      <line x1="11" y1="18.5" x2="13" y2="18.5" />
    </svg>
  );
}

function IPadIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2.5" y="4" width="19" height="16" rx="2.5" />
      <line x1="18.5" y1="11" x2="18.5" y2="13" />
    </svg>
  );
}

function IPadPortraitIcon() {
  return (
    <svg
      width="14"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="2.5" width="16" height="19" rx="2.5" />
      <line x1="11" y1="18.5" x2="13" y2="18.5" />
    </svg>
  );
}
