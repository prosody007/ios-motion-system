import type { TokenSection } from "@/types/motion";

export const tokensSection: TokenSection = {
  type: "tokens",
  title: "Duration & Curve Tokens",
  description: "标准时长、曲线与参数基线。",
  tokens: [
    { name: "ultraFast", value: "0.1s", bar: 10, desc: "即时反馈（按下高亮）" },
    { name: "fast", value: "0.2s", bar: 20, desc: "小元素切换（toggle、checkbox）" },
    { name: "normal", value: "0.3s", bar: 30, desc: "通用动画（fade、slide）" },
    { name: "slow", value: "0.45s", bar: 45, desc: "大面积转场（sheet、modal）" },
    { name: "spring", value: "0.5s", bar: 50, desc: "弹性动画（回弹、拖拽释放）" },
    { name: "page", value: "0.35s", bar: 35, desc: "页面导航转场" },
  ],
  codeSnippet: `// MARK: - Motion Tokens (iOS 17+)

enum Motion {
    static let ultraFast: Double = 0.1   // 按下高亮
    static let fast:      Double = 0.2   // toggle, checkbox
    static let normal:    Double = 0.3   // fade, slide
    static let slow:      Double = 0.45  // sheet, modal
    static let page:      Double = 0.35  // navigation push/pop
}

// MARK: - Spring Presets (推荐优先使用)
extension Animation {
    // iOS 17+ 系统预设
    static let motionSmooth  = Animation.smooth        // 无过冲，丝滑
    static let motionSnappy  = Animation.snappy        // 快速响应（推荐默认）
    static let motionBouncy  = Animation.bouncy        // 明显弹跳

    // 场景化预设
    static let motionSheet   = Animation.spring(response: 0.45, dampingFraction: 0.9)
    static let motionDrag    = Animation.interactiveSpring(response: 0.35, dampingFraction: 0.86)
    static let motionPop     = Animation.spring(response: 0.4, dampingFraction: 0.55)
}`,
};
