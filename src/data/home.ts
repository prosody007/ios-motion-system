import type { CardsSection } from "@/types/motion";

export const homeSection: CardsSection = {
  type: "cards",
  title: "Home",
  description: "实例：相机首页（页面背景，后续在此基础上增加功能）。",
  cards: [
    {
      title: "Home",
      tags: [
        { text: "0s", variant: "duration" },
        { text: "—", variant: "easing" },
      ],
      previewId: "ios-home",
      code: `// React — Home（按 Figma 设计稿规范的相机首页背景）
// 相机视图填充屏幕、顶部状态栏白字 9:41 + 系统图标、底部 home indicator。
// 后续具体功能（如扫描按钮、识别浮层等）会在此结构上增量添加。

export function Home() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black select-none">
      <img
        src="/figma/home/camera.png"
        alt=""
        draggable={false}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ objectFit: "cover", objectPosition: "center top" }}
      />

      {/* Status bar */}
      <div
        className="absolute inset-x-0 top-0 flex items-center justify-between"
        style={{ height: 44, paddingLeft: 21, paddingRight: 14.34, paddingTop: 15, paddingBottom: 12 }}
      >
        <div
          style={{
            width: 54, height: 17, color: "#FFFFFF",
            fontFamily: "Inter, -apple-system, sans-serif",
            fontWeight: 600, fontSize: 14, letterSpacing: "-0.28px",
            textAlign: "center", display: "flex",
            alignItems: "center", justifyContent: "center",
          }}
        >
          9:41
        </div>
        <img
          src="/figma/home/status-icons.svg"
          alt=""
          style={{ width: 66.661, height: 11.336, pointerEvents: "none" }}
        />
      </div>

      {/* Home indicator */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ height: 34 }}>
        <div
          style={{
            position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
            width: 144, height: 5, borderRadius: 100, background: "#FFFFFF",
          }}
        />
      </div>
    </div>
  );
}`,
    },
  ],
};
