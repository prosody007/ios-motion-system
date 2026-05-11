import type { CardsSection } from "@/types/motion";

export const homeSection: CardsSection = {
  type: "cards",
  title: "Home",
  description: "实例：白底首页 + iOS 状态栏 + 底部 home indicator。",
  cards: [
    {
      title: "Home",
      tags: [
        { text: "0s", variant: "duration" },
        { text: "—", variant: "easing" },
      ],
      previewId: "ios-home",
      code: `// React — Home（空白页 + iOS 状态栏 + 底部 home indicator）
// 后续具体功能在状态栏与 home indicator 中间区域增量添加。

const FG = "#000000";

export function Home() {
  return (
    <div className="absolute inset-0 bg-white select-none">
      {/* Status bar */}
      <div
        className="absolute inset-x-0 top-0 flex items-center justify-between"
        style={{ height: 44, paddingLeft: 21, paddingRight: 14.34, paddingTop: 15, paddingBottom: 12 }}
      >
        <div
          style={{
            width: 54, height: 17, color: FG,
            fontFamily: "Inter, -apple-system, sans-serif",
            fontWeight: 600, fontSize: 14, letterSpacing: "-0.28px",
            textAlign: "center", display: "flex",
            alignItems: "center", justifyContent: "center",
          }}
        >
          9:41
        </div>
        {/* 系统图标（cellular + wifi + battery）按 currentColor 渲染 */}
        <StatusIcons />
      </div>

      {/* Home indicator */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ height: 34 }}>
        <div
          style={{
            position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
            width: 144, height: 5, borderRadius: 100, background: FG,
          }}
        />
      </div>
    </div>
  );
}`,
    },
  ],
};
