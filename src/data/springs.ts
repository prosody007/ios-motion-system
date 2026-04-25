import type { SpringCurveSection } from "@/types/motion";

export const springCurvesSection: SpringCurveSection = {
  type: "spring-curves",
  title: "Spring & Timing 曲线",
  description:
    "Spring 预设与 timing 曲线参考。",
  springs: [
    { name: ".smooth", response: 0.5, damping: 1.0, description: "无过冲，丝滑停止", swift: ".smooth", swiftLegacy: ".spring(response: 0.5, dampingFraction: 1.0)", uikit: "dampingRatio: 1.0", badge: "iOS 17+" },
    { name: ".smooth (extraBouncy)", response: 0.5, damping: 0.7, description: "轻微过冲后平滑", swift: ".smooth(extraBounce: 0.3)", swiftLegacy: ".spring(response: 0.5, dampingFraction: 0.7)", uikit: "dampingRatio: 0.7", badge: "iOS 17+" },
    { name: ".snappy", response: 0.35, damping: 0.86, description: "快速响应、几乎无过冲", swift: ".snappy", swiftLegacy: ".spring(response: 0.35, dampingFraction: 0.86)", uikit: "dampingRatio: 0.86", badge: "iOS 17+ 推荐" },
    { name: ".snappy (extraBouncy)", response: 0.35, damping: 0.6, description: "快速 + 明显弹跳", swift: ".snappy(extraBounce: 0.3)", swiftLegacy: ".spring(response: 0.35, dampingFraction: 0.6)", uikit: "dampingRatio: 0.6", badge: "iOS 17+" },
    { name: ".bouncy", response: 0.5, damping: 0.55, description: "明显弹跳，活泼感", swift: ".bouncy", swiftLegacy: ".spring(response: 0.5, dampingFraction: 0.55)", uikit: "dampingRatio: 0.55", badge: "iOS 17+" },
    { name: ".bouncy (extraBouncy)", response: 0.5, damping: 0.35, description: "强烈弹跳，游戏感", swift: ".bouncy(extraBounce: 0.25)", swiftLegacy: ".spring(response: 0.5, dampingFraction: 0.35)", uikit: "dampingRatio: 0.35", badge: "iOS 17+" },
    { name: ".interactiveSpring", response: 0.35, damping: 0.86, description: "跟手交互释放（手势拖拽后）", swift: ".interactiveSpring(response: 0.35, dampingFraction: 0.86)", swiftLegacy: ".interactiveSpring(response: 0.35, dampingFraction: 0.86)", uikit: "UISpringTimingParameters(dampingRatio: 0.86)", badge: "手势场景" },
    { name: "Sheet Spring", response: 0.45, damping: 0.9, description: "底部 Sheet 弹出", swift: ".spring(response: 0.45, dampingFraction: 0.9)", swiftLegacy: ".spring(response: 0.45, dampingFraction: 0.9)", uikit: "dampingRatio: 0.9, duration: 0.45", badge: "系统 Sheet" },
  ],
  timingCurves: [
    { name: ".easeIn", css: "cubic-bezier(0.42, 0, 1, 1)", swift: ".easeIn", cp: [0.42, 0, 1, 1], desc: "加速离场（元素退出时用）" },
    { name: ".easeOut", css: "cubic-bezier(0, 0, 0.58, 1)", swift: ".easeOut", cp: [0, 0, 0.58, 1], desc: "减速入场（罕用，优先用 spring）" },
    { name: ".easeInOut", css: "cubic-bezier(0.42, 0, 0.58, 1)", swift: ".easeInOut", cp: [0.42, 0, 0.58, 1], desc: "对称过渡（淡入淡出等简单场景）" },
    { name: ".linear", css: "cubic-bezier(0, 0, 1, 1)", swift: ".linear", cp: [0, 0, 1, 1], desc: "匀速（仅用于无限循环动画如 spinner）" },
  ],
};
