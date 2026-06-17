import type { Category } from "@/types/motion";

export const categories: Category[] = [
  // 基础
  { slug: "button", title: "Button", icon: "👆", description: "按钮按压反馈与点击状态" },
  { slug: "toggle", title: "Toggle / Switch", icon: "🔘", description: "开关控件的切换动画" },
  { slug: "checkbox", title: "Checkbox", icon: "☑", description: "勾选、单选与选择状态反馈" },
  { slug: "segmented", title: "Segmented Control", icon: "▤", description: "分段控件的切换与指示器运动" },
  { slug: "slider", title: "Slider / Stepper", icon: "⊖", description: "滑动输入与步进控制反馈" },
  { slug: "textfield", title: "Text Field", icon: "✏", description: "输入焦点、占位与校验反馈" },
  { slug: "tabbar", title: "Tab Bar", icon: "▥", description: "标签栏切换与角标反馈" },
  { slug: "pull-refresh", title: "Pull to Refresh", icon: "↻", description: "下拉刷新与回弹过程" },
];
