"use client";

const STATUS_BAR_H = 44;
const HOME_INDICATOR_H = 34;

export function HomePreview() {
  return (
    <div
      className="absolute inset-0 select-none overflow-hidden"
      style={{ background: "#000" }}
    >
      {/* Camera background — fills the phone screen */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/figma/home/camera.png"
        alt=""
        draggable={false}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          objectFit: "cover",
          objectPosition: "center top",
          userSelect: "none",
        }}
      />

      {/* Status bar (9:41 + signal/battery) */}
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
            fontFamily:
              "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
            fontWeight: 600,
            fontSize: 14,
            letterSpacing: "-0.28px",
            color: "#FFFFFF",
            textAlign: "center",
          }}
        >
          9:41
        </div>
        <div
          className="flex items-center"
          style={{ width: 66.661, height: 11.336 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/figma/home/status-icons.svg"
            alt=""
            draggable={false}
            className="block w-full h-full pointer-events-none"
          />
        </div>
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
            background: "#FFFFFF",
          }}
        />
      </div>
    </div>
  );
}
