import type { CardsSection } from "@/types/motion";

export const onboardingSection: CardsSection = {
  type: "cards",
  title: "Onboarding",
  description: "实例：Onboarding 欢迎页（白板导师介绍 + Continue CTA）。",
  cards: [
    {
      title: "Onboarding",
      tags: [
        { text: "—", variant: "duration" },
        { text: "—", variant: "easing" },
      ],
      previewId: "ios-onboarding",
      code: `// React — Onboarding 实例页（1:1 还原 Figma 2468:15565）
// 关键结构：
// - 393×852 iPhone 画布
// - 顶部 F6F8FA 空白区域 + iOS 状态栏
// - 底部白色内容区：标题、说明、Continue CTA、Home Indicator
// - 标题使用 Poppins Semibold 24 / 1.4，正文使用 Inter 16 / 1.5`,
    },
  ],
};
