import type { Category } from "@/types/motion";

export const categories: Category[] = [
  // 接入
  { slug: "skills", title: "Skills", icon: "⌘", description: "把动效库接入 Cursor / Claude Code / Codex 的 Agent Skill" },

  // 基础
  { slug: "tokens", title: "Duration & Curve", icon: "⏱", description: "标准时长、曲线与参数基线" },
  { slug: "spring-curves", title: "Spring & Timing", icon: "📈", description: "Spring 与 timing 曲线参考" },

  // 组件微交互
  { slug: "button", title: "Button / Tap", icon: "👆", description: "按钮按压反馈与点击状态" },
  { slug: "toggle", title: "Toggle / Switch", icon: "🔘", description: "开关控件的切换动画" },
  { slug: "checkbox", title: "Checkbox", icon: "☑", description: "勾选、单选与选择状态反馈" },
  { slug: "segmented", title: "Segmented Control", icon: "▤", description: "分段控件的切换与指示器运动" },
  { slug: "slider", title: "Slider / Stepper", icon: "⊖", description: "滑动输入与步进控制反馈" },
  { slug: "textfield", title: "Text Field", icon: "✏", description: "输入焦点、占位与校验反馈" },
  { slug: "tabbar", title: "Tab Bar", icon: "▥", description: "标签栏切换与角标反馈" },
  { slug: "pull-refresh", title: "Pull to Refresh", icon: "↻", description: "下拉刷新与回弹过程" },

  // 弹性动画
  { slug: "spring-animations", title: "Spring Animations", icon: "🧲", description: "Spring 参数、预设与运动反馈" },

  // 列表 & 内容
  { slug: "reorder", title: "Reorder", icon: "↕", description: "列表重排与拖拽占位反馈" },
  { slug: "stagger", title: "Stagger", icon: "▸▸", description: "列表与内容的分段入场" },
  { slug: "expandable", title: "Expandable", icon: "⤵", description: "内容展开、折叠与共享元素过渡" },
  { slug: "card-flip", title: "Card", icon: "🃏", description: "卡片展开、翻转与堆叠切换" },
  { slug: "carousel", title: "Carousel", icon: "⎔", description: "分页轮播与聚焦切换效果" },

  // 加载 & 状态
  { slug: "loading", title: "Loading", icon: "⏳", description: "加载中指示与等待反馈" },
  { slug: "skeleton", title: "Skeleton", icon: "▦", description: "骨架占位与闪烁加载效果" },
  { slug: "progress", title: "Progress", icon: "◔", description: "线性与环形进度反馈" },

  { slug: "success-error", title: "Success & Error", icon: "✓✗", description: "完成与错误状态反馈" },
  { slug: "toast", title: "Toast", icon: "💬", description: "轻提示与短暂通知反馈" },

  // 弹层 & 浮层
  { slug: "sheet", title: "Sheet", icon: "📄", description: "Sheet 与模态面板过渡" },
  { slug: "alert", title: "Alert", icon: "⚠", description: "居中对话框与确认反馈" },
  { slug: "action-sheet", title: "Action Sheet", icon: "☰", description: "操作面板与选项切换" },
  { slug: "tooltip", title: "Tooltip", icon: "💭", description: "提示层与锚点浮层" },
  { slug: "dropdown", title: "Dropdown", icon: "▾", description: "下拉菜单与选项展开" },
  { slug: "notification-banner", title: "Notification Banner", icon: "🔔", description: "横幅通知与顶部提示" },

  // 手势
  { slug: "swipe-dismiss", title: "Swipe to Dismiss", icon: "↓", description: "滑动关闭与回弹反馈" },
  { slug: "swipe-cards", title: "Swipe Cards", icon: "🃏", description: "卡片堆栈与滑动切换" },

  // 转场
  { slug: "navigation", title: "Navigation", icon: "➡️", description: "导航栈 Push / Pop 过渡" },
  { slug: "page-transitions", title: "Page Transitions", icon: "🔀", description: "页面级缩放与共享元素转场" },
  { slug: "custom-transitions", title: "Custom Transitions", icon: "🎭", description: "自定义过渡与视图修饰动画" },
  { slug: "hero-transition", title: "Hero Transition", icon: "🖼", description: "图片 Hero 过渡与放大切换" },

  // 触觉
  { slug: "haptics", title: "Haptics", icon: "📳", description: "触觉反馈与动画配合方式" },

  // 高级动效
  { slug: "counter", title: "Counter", icon: "#", description: "数字过渡与计数变化效果" },
  { slug: "scroll-driven", title: "Scroll-Driven", icon: "↕", description: "滚动驱动的位移、缩放与视差" },
  { slug: "keyframe", title: "Keyframes", icon: "◆", description: "关键帧动画与多属性编排" },
  { slug: "phase", title: "Phase Animator", icon: "◇", description: "阶段状态动画与序列过渡" },
  { slug: "lottie", title: "Lottie", icon: "▶", description: "Lottie 动画集成与播放控制" },
  { slug: "border-glow", title: "Border Glow", icon: "✦", description: "conic-gradient + @property 实现的彩色旋转边框" },
];
