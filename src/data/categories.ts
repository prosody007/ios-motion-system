export interface Category {
  slug: string;
  title: string;
  icon: string;
  description: string;
}

export const categories: Category[] = [
  { slug: "button", title: "Button", icon: "👆", description: "按钮动效" },
  { slug: "card", title: "Card", icon: "▣", description: "卡片动效" },
  { slug: "loading", title: "Loading", icon: "⏳", description: "加载动效" },
  { slug: "navigation", title: "Navigation", icon: "➡️", description: "待补充" },
  { slug: "page-transitions", title: "Page Transitions", icon: "🔀", description: "待补充" },
  { slug: "custom-transitions", title: "Custom Transitions", icon: "🎭", description: "待补充" },
  { slug: "hero-transition", title: "Hero Transition", icon: "🖼", description: "待补充" },
  { slug: "counter", title: "Counter", icon: "#", description: "待补充" },
  { slug: "scroll-driven", title: "Scroll-Driven", icon: "↕", description: "待补充" },
  { slug: "keyframe", title: "Keyframes", icon: "◆", description: "待补充" },
  { slug: "phase", title: "Phase Animator", icon: "◇", description: "待补充" },
  { slug: "lottie", title: "Lottie", icon: "▶", description: "待补充" },
  { slug: "border-glow", title: "Border Glow", icon: "✦", description: "待补充" },
];
