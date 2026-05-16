import type { CardsSection } from "@/types/motion";

export const tutorSection: CardsSection = {
  type: "cards",
  title: "Tutor",
  description: "实例：Tutor 选择页（Lexie 头像 + 推荐卡片 + 底部 CTA + Tab Bar）。",
  cards: [
    {
      title: "Tutor",
      tags: [
        { text: "—", variant: "duration" },
        { text: "—", variant: "easing" },
      ],
      previewId: "ios-tutor",
      code: `// React — Tutor 实例页（1:1 还原 Figma 1743:24075）
// 关键结构：
// - 渐变背景 + 蓝色椭圆光斑（模糊光）+ 噪点蒙层
// - 状态栏（9:41 + 信号 / wifi / 电池）
// - 头像区：Lexie + 三个分页指示点 + 名称 + 副标题
// - 推荐卡片 carousel（白色卡 + 蓝色 wifi 图标 + 问题文本 + 标签）
// - 底部 CTA：键盘按钮 + Snap a photo 主按钮 + 麦克风按钮
// - Tab Bar：Scan / Lecture Notes / Study(active) / Me`,
    },
  ],
};
