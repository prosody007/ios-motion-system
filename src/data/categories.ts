import type { Category } from "@/types/motion";

export const categories: Category[] = [
  // 基础
  { slug: "mcp-server", title: "MCP Server", icon: "⌘", description: "MCP 配置、调用方式与示例" },
  { slug: "tokens", title: "Duration & Curve Tokens", icon: "⏱", description: "标准时长、曲线与参数基线" },
  { slug: "spring-curves", title: "Spring & Timing 曲线", icon: "📈", description: "Spring 与 timing 曲线参考" },

  // 组件微交互
  { slug: "button", title: "Button / Tap 反馈", icon: "👆", description: "按钮按压反馈与点击状态" },
  { slug: "toggle", title: "Toggle / Switch", icon: "🔘", description: "开关控件的切换动画" },
  { slug: "checkbox", title: "Checkbox / Selection", icon: "☑", description: "勾选、单选与选择状态反馈" },
  { slug: "segmented", title: "Segmented Control", icon: "▤", description: "分段控件的切换与指示器运动" },
  { slug: "slider", title: "Slider / Stepper", icon: "⊖", description: "滑动输入与步进控制反馈" },
  { slug: "textfield", title: "Text Field", icon: "✏", description: "输入焦点、占位与校验反馈" },
  { slug: "tabbar", title: "Tab Bar", icon: "▥", description: "标签栏切换与角标反馈" },
  { slug: "pull-refresh", title: "Pull to Refresh", icon: "↻", description: "下拉刷新与回弹过程" },

  // 弹性动画
  { slug: "spring-animations", title: "Spring 弹性动画", icon: "🧲", description: "Spring 参数、预设与运动反馈" },

  // 列表 & 内容
  { slug: "reorder", title: "拖拽排序", icon: "↕", description: "列表重排与拖拽占位反馈" },
  { slug: "stagger", title: "Stagger 入场", icon: "▸▸", description: "列表与内容的分段入场" },
  { slug: "expandable", title: "展开/折叠", icon: "⤵", description: "内容展开、折叠与共享元素过渡" },
  { slug: "card-flip", title: "卡片展开与翻转", icon: "🃏", description: "卡片展开、翻转与详情切换" },
  { slug: "carousel", title: "轮播 / Pager", icon: "⎔", description: "分页轮播与聚焦切换效果" },

  // 加载 & 状态
  { slug: "loading", title: "Loading 加载态", icon: "⏳", description: "加载中指示与等待反馈" },
  { slug: "skeleton", title: "骨架屏 Shimmer", icon: "▦", description: "骨架占位与闪烁加载效果" },
  { slug: "progress", title: "进度指示器", icon: "◔", description: "线性与环形进度反馈" },

  { slug: "success-error", title: "成功/错误状态", icon: "✓✗", description: "完成与错误状态反馈" },
  { slug: "toast", title: "Toast / Snackbar", icon: "💬", description: "轻提示与短暂通知反馈" },

  // 弹层 & 浮层
  { slug: "sheet", title: "Sheet / Modal", icon: "📄", description: "Sheet 与模态面板过渡" },
  { slug: "alert", title: "Alert Dialog", icon: "⚠", description: "居中对话框与确认反馈" },
  { slug: "action-sheet", title: "Action Sheet", icon: "☰", description: "操作面板与选项切换" },
  { slug: "tooltip", title: "Tooltip / Popover", icon: "💭", description: "提示层与锚点浮层" },
  { slug: "dropdown", title: "Dropdown Menu", icon: "▾", description: "下拉菜单与选项展开" },
  { slug: "notification-banner", title: "通知横幅", icon: "🔔", description: "横幅通知与顶部提示" },

  // 手势
  { slug: "swipe-dismiss", title: "滑动关闭", icon: "↓", description: "滑动关闭与回弹反馈" },
  { slug: "swipe-cards", title: "滑动切换卡片", icon: "🃏", description: "卡片堆栈与滑动切换" },

  // 转场
  { slug: "navigation", title: "Navigation 转场", icon: "➡️", description: "导航栈 Push / Pop 过渡" },
  { slug: "page-transitions", title: "页面转场", icon: "🔀", description: "页面级缩放与共享元素转场" },
  { slug: "custom-transitions", title: "自定义转场", icon: "🎭", description: "自定义过渡与视图修饰动画" },
  { slug: "hero-transition", title: "Hero 图片转场", icon: "🖼", description: "图片 Hero 过渡与放大切换" },

  // 触觉
  { slug: "haptics", title: "Haptic Feedback", icon: "📳", description: "触觉反馈与动画配合方式" },

  // 高级动效
  { slug: "counter", title: "数字滚动", icon: "#", description: "数字过渡与计数变化效果" },
  { slug: "scroll-driven", title: "滚动驱动动画", icon: "↕", description: "滚动驱动的位移、缩放与视差" },
  { slug: "keyframe", title: "Keyframe 动画", icon: "◆", description: "关键帧动画与多属性编排" },
  { slug: "phase", title: "Phase 动画", icon: "◇", description: "阶段状态动画与序列过渡" },
  { slug: "lottie", title: "Lottie 动画", icon: "▶", description: "Lottie 动画集成与播放控制" },
];
