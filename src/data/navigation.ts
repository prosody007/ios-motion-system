export type DocsNavGroup = {
  label: string;
  slugs: string[];
};

export type DocsNavMeta = {
  primary: string;
  secondary: string;
  badge?: string;
};

export const docsNavGroups: DocsNavGroup[] = [
  { label: "接入", slugs: ["mcp-server"] },
  { label: "基础", slugs: ["tokens", "spring-curves"] },
  {
    label: "组件微交互",
    slugs: [
      "button",
      "toggle",
      "checkbox",
      "segmented",
      "slider",
      "textfield",
      "tabbar",
      "pull-refresh",
    ],
  },
  { label: "弹性动画", slugs: ["spring-animations"] },
  {
    label: "列表 & 内容",
    slugs: ["reorder", "stagger", "expandable", "card-flip", "carousel"],
  },
  {
    label: "加载 & 状态",
    slugs: ["loading", "skeleton", "progress", "success-error", "toast"],
  },
  {
    label: "弹层 & 浮层",
    slugs: [
      "sheet",
      "alert",
      "action-sheet",
      "tooltip",
      "dropdown",
      "notification-banner",
    ],
  },
  { label: "手势", slugs: ["swipe-dismiss", "swipe-cards"] },
  {
    label: "转场",
    slugs: [
      "navigation",
      "page-transitions",
      "custom-transitions",
      "hero-transition",
    ],
  },
  { label: "触觉", slugs: ["haptics"] },
  {
    label: "高级动效",
    slugs: [
      "counter",
      "scroll-driven",
      "keyframe",
      "phase",
      "lottie",
      "border-glow",
    ],
  },
];

export const docsNavMetaMap: Record<string, DocsNavMeta> = {
  "mcp-server": { primary: "MCP Server", secondary: "服务接入" },
  tokens: { primary: "Duration & Curve", secondary: "时长与曲线" },
  "spring-curves": { primary: "Spring & Timing", secondary: "弹簧与曲线" },
  button: { primary: "Button / Tap", secondary: "按钮反馈" },
  toggle: { primary: "Toggle / Switch", secondary: "开关" },
  checkbox: { primary: "Checkbox", secondary: "勾选" },
  segmented: { primary: "Segmented Control", secondary: "分段控件" },
  slider: { primary: "Slider / Stepper", secondary: "滑动与步进" },
  textfield: { primary: "Text Field", secondary: "输入框" },
  tabbar: { primary: "Tab Bar", secondary: "标签栏" },
  "pull-refresh": { primary: "Pull to Refresh", secondary: "下拉刷新" },
  "spring-animations": { primary: "Spring", secondary: "弹性动画" },
  reorder: { primary: "Reorder", secondary: "拖拽排序" },
  stagger: { primary: "Stagger", secondary: "列表入场" },
  expandable: { primary: "Expandable", secondary: "展开/折叠" },
  "card-flip": { primary: "Card", secondary: "卡片" },
  carousel: { primary: "Carousel", secondary: "轮播" },
  loading: { primary: "Loading", secondary: "加载态" },
  skeleton: { primary: "Skeleton", secondary: "骨架屏" },
  progress: { primary: "Progress", secondary: "进度指示" },
  "success-error": { primary: "Success / Error", secondary: "状态反馈" },
  toast: { primary: "Toast", secondary: "轻提示" },
  sheet: { primary: "Sheet / Modal", secondary: "底部弹层" },
  alert: { primary: "Alert", secondary: "对话框" },
  "action-sheet": { primary: "Action Sheet", secondary: "操作面板" },
  tooltip: { primary: "Tooltip", secondary: "提示气泡" },
  dropdown: { primary: "Dropdown", secondary: "下拉菜单" },
  "notification-banner": { primary: "Notification", secondary: "通知横幅" },
  "swipe-dismiss": { primary: "Swipe Dismiss", secondary: "滑动关闭" },
  "swipe-cards": { primary: "Swipe Cards", secondary: "卡片切换" },
  navigation: { primary: "Navigation", secondary: "导航转场" },
  "page-transitions": { primary: "Page Transitions", secondary: "页面转场" },
  "custom-transitions": { primary: "Custom Transitions", secondary: "自定义转场" },
  "hero-transition": { primary: "Hero", secondary: "图片转场" },
  haptics: { primary: "Haptics", secondary: "触觉反馈" },
  counter: { primary: "Counter", secondary: "数字滚动" },
  "scroll-driven": { primary: "Scroll Driven", secondary: "滚动驱动" },
  keyframe: { primary: "Keyframe", secondary: "关键帧动画" },
  phase: { primary: "Phase", secondary: "阶段动画" },
  lottie: { primary: "Lottie", secondary: "矢量动画" },
  "border-glow": { primary: "Border Glow", secondary: "流光边框" },
};

export function getDocsNavMeta(slug: string): DocsNavMeta {
  return docsNavMetaMap[slug] ?? { primary: slug, secondary: "" };
}

import type { CardsSection } from "@/types/motion";

export const navigationSection: CardsSection = {
  type: "cards",
  title: "Navigation · 导航转场",
  description: "Push / Pop 导航转场。",
  cards: [
    {
      title: "Push / Pop 转场",
      tags: [
        { text: "0.35s", variant: "duration" },
        { text: ".default curve", variant: "easing" },
      ],
      previewId: "ios-nav-push",
      codes: {
        swift: `// SwiftUI — NavigationStack 转场
NavigationStack {
    List {
        NavigationLink("Detail", value: item)
    }
    .navigationDestination(for: Item.self) { item in
        DetailView(item: item)
    }
}

// 系统 Push 动画参数：
// duration: 0.35s
// curve: UIKit default (.curveEaseInOut 变体)
// 新页面从右侧 100% 宽度滑入
// 旧页面向左移动约 30% 宽度

// iOS 18+
.navigationTransition(.slide)
.navigationTransition(.zoom(sourceID: id, in: ns))`,
        uikit: `// UIKit — 自定义 Push 转场
class SlideAnimator: NSObject, UIViewControllerAnimatedTransitioning {
    func transitionDuration(using ctx: UIViewControllerContextTransitioning?) -> TimeInterval {
        return 0.35
    }

    func animateTransition(using ctx: UIViewControllerContextTransitioning) {
        guard let toVC = ctx.viewController(forKey: .to) else { return }
        let container = ctx.containerView
        let finalFrame = ctx.finalFrame(for: toVC)

        toVC.view.frame = finalFrame.offsetBy(dx: finalFrame.width, dy: 0)
        container.addSubview(toVC.view)

        UIView.animate(
            withDuration: 0.35,
            delay: 0,
            options: .curveEaseInOut,
            animations: {
                toVC.view.frame = finalFrame
            },
            completion: { ctx.completeTransition($0) }
        )
    }
}`,
      },
    },
  ],
};
