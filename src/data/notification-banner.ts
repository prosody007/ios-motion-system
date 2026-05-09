import type { CardsSection } from "@/types/motion";

const SHARED_CODE = `// React — Notification Banner（按 Figma 设计稿规范）
type NoticeLayout = "title" | "title-text";
type NoticeAction = "none" | "button";

function NotificationBanner({
  visible,
  icon,
  title,
  description,
  layout = "title-text",
  action = "none",
  buttonLabel = "View",
  onAction,
}: {
  visible: boolean;
  icon: React.ReactNode;
  title: string;
  description?: string;
  layout?: NoticeLayout;
  action?: NoticeAction;
  buttonLabel?: string;
  onAction?: () => void;
}) {
  const showText = layout === "title-text" && Boolean(description);
  const showButton = action === "button";

  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        left: "50%",
        width: 361,
        gap: 12,
        padding: "12px 16px 12px 12px",
        borderRadius: 20,
        background: "#FFFFFF",
        filter: "drop-shadow(0px 16px 15px rgba(0,0,0,0.08))",
        display: "flex",
        alignItems: "center",
        transform: visible
          ? "translate(-50%, 0)"
          : "translate(-50%, calc(-100% - 24px))",
        opacity: visible ? 1 : 0,
        transition: visible
          ? "transform 0.4s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.4s cubic-bezier(0.32, 0.72, 0, 1)"
          : "transform 0.3s cubic-bezier(0.4, 0, 1, 1), opacity 0.3s cubic-bezier(0.4, 0, 1, 1)",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          flexShrink: 0,
          borderRadius: 16,
          background: "#F6F8FA",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          flex: "1 1 0",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: showText ? 2 : 0,
        }}
      >
        <p
          style={{
            margin: 0,
            width: "100%",
            fontFamily: "Inter, -apple-system, sans-serif",
            fontWeight: 600,
            fontSize: 16,
            lineHeight: 1.4,
            color: "#111111",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </p>
        {showText ? (
          <p
            style={{
              margin: 0,
              width: "100%",
              fontFamily: "Inter, -apple-system, sans-serif",
              fontWeight: 400,
              fontSize: 14,
              lineHeight: 1.5,
              color: "#595C60",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {description}
          </p>
        ) : null}
      </div>

      {showButton ? (
        <button
          type="button"
          onClick={onAction}
          style={{
            flexShrink: 0,
            padding: 0,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontFamily: "Inter, -apple-system, sans-serif",
            fontWeight: 600,
            fontSize: 12,
            lineHeight: 1.4,
            color: "#007AFF",
            whiteSpace: "nowrap",
          }}
        >
          {buttonLabel}
        </button>
      ) : null}
    </div>
  );
}`;

const SHARED_TAGS = [
  { text: "0.4s", variant: "duration" as const },
  { text: ".spring", variant: "spring" as const },
];

export const notificationBannerSection: CardsSection = {
  type: "cards",
  title: "Notification Banner",
  description: "顶部横幅通知。按 Figma 设计稿规范的 4 种 layout × action 组合。",
  cards: [
    {
      title: "Title + Text + Button",
      tags: SHARED_TAGS,
      previewId: "ios-notification-title-text-button",
      code: SHARED_CODE,
    },
    {
      title: "Title + Button",
      tags: SHARED_TAGS,
      previewId: "ios-notification-title-button",
      code: SHARED_CODE,
    },
    {
      title: "Title + Text",
      tags: SHARED_TAGS,
      previewId: "ios-notification-title-text",
      code: SHARED_CODE,
    },
    {
      title: "Title",
      tags: SHARED_TAGS,
      previewId: "ios-notification-title",
      code: SHARED_CODE,
    },
  ],
};
