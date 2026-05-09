import type { CSSProperties } from "react";

const BAR_CONFIG = [
  { x: 2.0039, y: 9, width: 2, height: 6, minScale: 0.45, delay: -0.42 },
  { x: 6.502, y: 6, width: 2, height: 12, minScale: 0.5, delay: -0.28 },
  { x: 11, y: 2.5, width: 2, height: 19, minScale: 0.55, delay: -0.14 },
  { x: 15.498, y: 6, width: 2, height: 12, minScale: 0.5, delay: 0 },
  { x: 19.9961, y: 9, width: 2, height: 6, minScale: 0.45, delay: 0.14 },
];

function RecordingBarsLoadingIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      aria-hidden="true"
      focusable="false"
      className="recording-bars-loading"
    >
      {BAR_CONFIG.map((bar, i) => {
        const rectStyle: CSSProperties & Record<string, string | number> = {
          "--rec-delay": `${bar.delay}s`,
          "--rec-min-scale": bar.minScale,
        };

        return (
          <rect
            key={i}
            className="rec-bar"
            x={bar.x}
            y={bar.y}
            width={bar.width}
            height={bar.height}
            rx={1}
            fill="#007AFF"
            style={rectStyle}
          />
        );
      })}
    </svg>
  );
}

export default function RecordingIconPage() {
  return (
    <div className="flex min-h-[calc(100svh-10rem)] w-full items-center justify-center">
      <div
        style={{
          width: 170,
          height: 56,
          borderRadius: 28,
          background: "#FFFFFF",
          boxShadow: "0px 10px 40px 0px rgba(38, 81, 149, 0.16)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          padding: "0 16px",
        }}
      >
        <RecordingBarsLoadingIcon />
        <span
          style={{
            fontFamily:
              "Poppins, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
            fontStyle: "normal",
            fontWeight: 500,
            fontSize: 16,
            lineHeight: "24px",
            color: "#111111",
            textAlign: "center",
            letterSpacing: 0,
          }}
        >
          00:00:00
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/figma/recording-icon/record-stop.svg"
          alt=""
          width={24}
          height={24}
          draggable={false}
          style={{ display: "block", userSelect: "none", pointerEvents: "none" }}
        />
      </div>

      <style>{`
        .recording-bars-loading .rec-bar {
          transform-box: fill-box;
          transform-origin: center center;
          animation: recording-bars-wave 1s ease-in-out infinite;
          animation-delay: var(--rec-delay);
        }

        @keyframes recording-bars-wave {
          0%, 100% {
            transform: scaleY(var(--rec-min-scale));
            opacity: 0.72;
          }
          50% {
            transform: scaleY(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
