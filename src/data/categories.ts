import type { Category } from "@/types/motion";

export const categories: Category[] = [
  // 基础
  { slug: "mcp-server", title: "MCP Server", icon: "⌘", description: "给 agent / IDE 的 MCP 接入说明" },
  { slug: "tokens", title: "Duration & Curve Tokens", icon: "⏱", description: "标准时长和曲线参数" },
  { slug: "spring-curves", title: "Spring & Timing 曲线", icon: "📈", description: "Spring 物理曲线可视化" },

  // 组件微交互
  { slug: "button", title: "Button / Tap 反馈", icon: "👆", description: "按下缩放、高亮、触觉" },
  { slug: "toggle", title: "Toggle / Switch", icon: "🔘", description: "开关切换动画" },
  { slug: "checkbox", title: "Checkbox / Selection", icon: "☑", description: "勾选和 List 选择行" },
  { slug: "segmented", title: "Segmented Control", icon: "▤", description: "分段切换滑块" },
  { slug: "slider", title: "Slider / Stepper", icon: "⊖", description: "拖拽与步进" },
  { slug: "textfield", title: "Text Field", icon: "✏", description: "浮动标签、校验抖动" },
  { slug: "tabbar", title: "Tab Bar", icon: "▥", description: "切换弹跳、Badge 脉冲" },
  { slug: "pull-refresh", title: "Pull to Refresh", icon: "↻", description: "下拉刷新回弹" },

  // 弹性动画
  { slug: "spring-animations", title: "Spring 弹性动画", icon: "🧲", description: "弹性位移、缩放、手势" },

  // 列表 & 内容
  { slug: "reorder", title: "拖拽排序", icon: "↕", description: "长按浮起拖拽" },
  { slug: "stagger", title: "Stagger 入场", icon: "▸▸", description: "列表逐项延迟入场" },
  { slug: "expandable", title: "展开/折叠", icon: "⤵", description: "Accordion 高度动画" },
  { slug: "card-flip", title: "卡片展开与翻转", icon: "🃏", description: "展开详情、3D 翻转" },
  { slug: "carousel", title: "轮播 / Pager", icon: "⎔", description: "翻页、缩放聚焦" },

  // 加载 & 状态
  { slug: "loading", title: "Loading 加载态", icon: "⏳", description: "Spinner" },
  { slug: "skeleton", title: "骨架屏 Shimmer", icon: "▦", description: "Shimmer 闪烁占位" },
  { slug: "progress", title: "进度指示器", icon: "◔", description: "线性、环形进度" },

  { slug: "success-error", title: "成功/错误状态", icon: "✓✗", description: "勾号绘制、抖动" },
  { slug: "toast", title: "Toast / Snackbar", icon: "💬", description: "通知滑入滑出" },

  // 弹层 & 浮层
  { slug: "sheet", title: "Sheet / Modal", icon: "📄", description: "底部弹出面板" },
  { slug: "alert", title: "Alert Dialog", icon: "⚠", description: "居中弹窗" },
  { slug: "action-sheet", title: "Action Sheet", icon: "☰", description: "底部操作面板" },
  { slug: "tooltip", title: "Tooltip / Popover", icon: "💭", description: "锚点弹出" },
  { slug: "dropdown", title: "Dropdown Menu", icon: "▾", description: "下拉菜单" },
  { slug: "notification-banner", title: "通知横幅", icon: "🔔", description: "顶部滑入横幅" },

  // 手势
  { slug: "swipe-dismiss", title: "滑动关闭", icon: "↓", description: "下拉关闭" },
  { slug: "swipe-cards", title: "滑动切换卡片", icon: "🃏", description: "卡片堆栈左右滑" },

  // 转场
  { slug: "navigation", title: "Navigation 转场", icon: "➡️", description: "Push / Pop 滑动" },
  { slug: "page-transitions", title: "页面转场", icon: "🔀", description: "Zoom / matchedGeometry" },
  { slug: "custom-transitions", title: "自定义转场", icon: "🎭", description: "AnyTransition / ViewModifier" },
  { slug: "hero-transition", title: "Hero 图片转场", icon: "🖼", description: "缩略图到全屏" },

  // 触觉
  { slug: "haptics", title: "Haptic Feedback", icon: "📳", description: "触觉反馈 + 动画配对" },

  // 高级动效
  { slug: "counter", title: "数字滚动", icon: "#", description: "numericText / 计数器" },
  { slug: "scroll-driven", title: "滚动驱动动画", icon: "↕", description: "Header 缩放、视差" },
  { slug: "keyframe", title: "Keyframe 动画", icon: "◆", description: "iOS 17+ 多属性编排" },
  { slug: "phase", title: "Phase 动画", icon: "◇", description: "iOS 17+ 状态序列" },
  { slug: "lottie", title: "Lottie 动画", icon: "▶", description: "lottie-ios 接入" },
];
