import type { CardsSection } from "@/types/motion";

export const homeSection: CardsSection = {
  type: "cards",
  title: "Home",
  description: "实例：空白首页（后续在此基础上增加功能）。",
  cards: [
    {
      title: "Home",
      tags: [
        { text: "0s", variant: "duration" },
        { text: "—", variant: "easing" },
      ],
      previewId: "ios-home",
      code: `// React — Home（空白页面，作为后续加功能的起点）

export function Home() {
  return <div className="absolute inset-0 bg-white select-none" />;
}`,
    },
  ],
};
