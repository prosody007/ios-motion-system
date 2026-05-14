"use client";

import Link from "next/link";
import Image from "next/image";
import { useDevice } from "@/components/device-context";

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
            <DeviceToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

/**
 * Device toggle — 默认 phone，点击切到 ipad（再点回 phone）。
 * 用单一图标按钮表达当前状态：phone 状态显示手机图标，ipad 状态显示平板图标。
 */
function DeviceToggle() {
  const { device, toggleDevice } = useDevice();
  const isPhone = device === "phone";

  return (
    <button
      type="button"
      onClick={toggleDevice}
      aria-label={isPhone ? "切换到 iPad 模拟器" : "切换到 iPhone 模拟器"}
      title={isPhone ? "切换到 iPad" : "切换到 iPhone"}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[rgba(5,5,5,0.06)] bg-white text-[rgba(0,0,0,0.72)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:bg-[rgba(0,0,0,0.04)]"
    >
      {isPhone ? <PhoneIcon /> : <IPadIcon />}
    </button>
  );
}

function PhoneIcon() {
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
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
      <line x1="11" y1="18.5" x2="13" y2="18.5" />
    </svg>
  );
}

function IPadIcon() {
  return (
    <svg
      width="18"
      height="18"
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
