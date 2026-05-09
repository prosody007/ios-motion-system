"use client";

import { useEffect, useState, type ReactNode } from "react";

const NOTICE_BG = "#FFFFFF";
const NOTICE_SHADOW = "drop-shadow(0px 16px 15px rgba(0,0,0,0.08))";
const NOTICE_RADIUS = 20;
const NOTICE_GAP = 12;
const NOTICE_WIDTH = 361;
const NOTICE_PADDING = "12px 16px 12px 12px";

const ICON_OUTER_BG = "#F6F8FA";
const ICON_OUTER_SIZE = 48;
const ICON_OUTER_RADIUS = 16;
const ICON_INNER_SIZE = 32;

const TITLE_COLOR = "#111111";
const TEXT_COLOR = "#595C60";
const BRAND_COLOR = "#007AFF";

const FONT_FAMILY =
  "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif";

const ENTER_TRANSITION =
  "transform 0.4s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.4s cubic-bezier(0.32, 0.72, 0, 1)";
const EXIT_TRANSITION =
  "transform 0.3s cubic-bezier(0.4, 0, 1, 1), opacity 0.3s cubic-bezier(0.4, 0, 1, 1)";

type NoticeLayout = "title" | "title-text";
type NoticeAction = "none" | "button";

interface NotificationBannerProps {
  visible: boolean;
  icon: ReactNode;
  title: string;
  description?: string;
  layout?: NoticeLayout;
  action?: NoticeAction;
  buttonLabel?: string;
  onAction?: () => void;
}

function NotificationBanner({
  visible,
  icon,
  title,
  description,
  layout = "title-text",
  action = "none",
  buttonLabel = "View",
  onAction,
}: NotificationBannerProps) {
  const showText = layout === "title-text" && Boolean(description);
  const showButton = action === "button";

  return (
    <div
      className="absolute top-3 left-1/2 z-10 flex items-center"
      style={{
        width: NOTICE_WIDTH,
        gap: NOTICE_GAP,
        padding: NOTICE_PADDING,
        borderRadius: NOTICE_RADIUS,
        background: NOTICE_BG,
        filter: NOTICE_SHADOW,
        transform: visible
          ? "translate(-50%, 0)"
          : "translate(-50%, calc(-100% - 24px))",
        opacity: visible ? 1 : 0,
        transition: visible ? ENTER_TRANSITION : EXIT_TRANSITION,
      }}
    >
      <div
        className="shrink-0 overflow-hidden flex items-center justify-center"
        style={{
          width: ICON_OUTER_SIZE,
          height: ICON_OUTER_SIZE,
          borderRadius: ICON_OUTER_RADIUS,
          background: ICON_OUTER_BG,
        }}
      >
        <div
          className="flex items-center justify-center"
          style={{ width: ICON_INNER_SIZE, height: ICON_INNER_SIZE }}
        >
          {icon}
        </div>
      </div>

      <div
        className="flex-1 min-w-0 flex flex-col items-start"
        style={{ gap: showText ? 2 : 0 }}
      >
        <p
          className="w-full m-0 truncate"
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 600,
            fontSize: 16,
            lineHeight: 1.4,
            color: TITLE_COLOR,
          }}
        >
          {title}
        </p>
        {showText ? (
          <p
            className="w-full m-0 truncate"
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: 400,
              fontSize: 14,
              lineHeight: 1.5,
              color: TEXT_COLOR,
            }}
          >
            {description}
          </p>
        ) : null}
      </div>

      {showButton ? (
        <button
          type="button"
          className="shrink-0 bg-transparent border-none cursor-pointer p-0"
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 600,
            fontSize: 12,
            lineHeight: 1.4,
            color: BRAND_COLOR,
            whiteSpace: "nowrap",
          }}
          onClick={(e) => {
            e.stopPropagation();
            onAction?.();
          }}
        >
          {buttonLabel}
        </button>
      ) : null}
    </div>
  );
}

function useAutoDismiss(
  visible: boolean,
  setVisible: (v: boolean) => void,
  ms = 3000,
) {
  useEffect(() => {
    if (!visible) return;
    const t = window.setTimeout(() => setVisible(false), ms);
    return () => window.clearTimeout(t);
  }, [visible, setVisible, ms]);
}

function TriggerButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className="px-5 py-2 rounded-xl text-sm font-medium border-none cursor-pointer"
      style={{ background: "rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.7)" }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {label}
    </button>
  );
}

function BellIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 6.5a5.5 5.5 0 0 0-5.5 5.5v3.6L9 19a1 1 0 0 0 .9 1.4h12.2A1 1 0 0 0 23 19l-1.5-3.4V12A5.5 5.5 0 0 0 16 6.5Z"
        stroke="#3C4043"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M13.8 23.2a2.4 2.4 0 0 0 4.4 0"
        stroke="#3C4043"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 11.5A3.5 3.5 0 0 1 11.5 8h9A3.5 3.5 0 0 1 24 11.5V17a3.5 3.5 0 0 1-3.5 3.5h-5.6L11 24v-3.5h-.5A3.5 3.5 0 0 1 7 17v-5.5Z"
        stroke="#3C4043"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12.5" cy="14.5" r="0.9" fill="#3C4043" />
      <circle cx="16" cy="14.5" r="0.9" fill="#3C4043" />
      <circle cx="19.5" cy="14.5" r="0.9" fill="#3C4043" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="7"
        y="9"
        width="18"
        height="16"
        rx="3"
        stroke="#3C4043"
        strokeWidth="1.6"
      />
      <path d="M7 14h18" stroke="#3C4043" strokeWidth="1.6" />
      <path
        d="M11 7v4M21 7v4"
        stroke="#3C4043"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m16 7 2.85 5.78 6.38.93-4.62 4.5 1.09 6.36L16 21.55 10.3 24.57l1.09-6.36-4.62-4.5 6.38-.93L16 7Z"
        stroke="#3C4043"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function NotificationBannerPreview() {
  const [visible, setVisible] = useState(false);
  useAutoDismiss(visible, setVisible);
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden">
      <NotificationBanner
        visible={visible}
        icon={<MessageIcon />}
        title="Sarah Chen"
        description="Hey, are you free for lunch tomorrow?"
        layout="title-text"
        action="button"
        buttonLabel="View"
        onAction={() => setVisible(false)}
      />
      <TriggerButton label="Send Notification" onClick={() => setVisible(true)} />
    </div>
  );
}

export function NotificationBannerTitlePreview() {
  const [visible, setVisible] = useState(false);
  useAutoDismiss(visible, setVisible);
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden">
      <NotificationBanner
        visible={visible}
        icon={<BellIcon />}
        title="Reminder"
        layout="title"
        action="none"
      />
      <TriggerButton label="Send Notification" onClick={() => setVisible(true)} />
    </div>
  );
}

export function NotificationBannerTitleButtonPreview() {
  const [visible, setVisible] = useState(false);
  useAutoDismiss(visible, setVisible);
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden">
      <NotificationBanner
        visible={visible}
        icon={<StarIcon />}
        title="New version available"
        layout="title"
        action="button"
        buttonLabel="View"
        onAction={() => setVisible(false)}
      />
      <TriggerButton label="Send Notification" onClick={() => setVisible(true)} />
    </div>
  );
}

export function NotificationBannerTitleTextPreview() {
  const [visible, setVisible] = useState(false);
  useAutoDismiss(visible, setVisible);
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden">
      <NotificationBanner
        visible={visible}
        icon={<CalendarIcon />}
        title="Reminder"
        description="Meeting in 15 minutes"
        layout="title-text"
        action="none"
      />
      <TriggerButton label="Send Notification" onClick={() => setVisible(true)} />
    </div>
  );
}

export function NotificationBannerTitleTextButtonPreview() {
  const [visible, setVisible] = useState(false);
  useAutoDismiss(visible, setVisible);
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden">
      <NotificationBanner
        visible={visible}
        icon={<MessageIcon />}
        title="Sarah Chen"
        description="Hey, are you free for lunch tomorrow?"
        layout="title-text"
        action="button"
        buttonLabel="View"
        onAction={() => setVisible(false)}
      />
      <TriggerButton label="Send Notification" onClick={() => setVisible(true)} />
    </div>
  );
}
