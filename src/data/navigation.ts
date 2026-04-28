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
  { label: "接入", slugs: ["skills"] },
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
  skills: { primary: "Skills", secondary: "" },
  tokens: { primary: "Duration & Curve", secondary: "" },
  "spring-curves": { primary: "Spring & Timing", secondary: "" },
  button: { primary: "Button / Tap", secondary: "" },
  toggle: { primary: "Toggle / Switch", secondary: "" },
  checkbox: { primary: "Checkbox", secondary: "" },
  segmented: { primary: "Segmented Control", secondary: "" },
  slider: { primary: "Slider / Stepper", secondary: "" },
  textfield: { primary: "Text Field", secondary: "" },
  tabbar: { primary: "Tab Bar", secondary: "" },
  "pull-refresh": { primary: "Pull to Refresh", secondary: "" },
  "spring-animations": { primary: "Spring Animations", secondary: "" },
  reorder: { primary: "Reorder", secondary: "" },
  stagger: { primary: "Stagger", secondary: "" },
  expandable: { primary: "Expandable", secondary: "" },
  "card-flip": { primary: "Card", secondary: "" },
  carousel: { primary: "Carousel", secondary: "" },
  loading: { primary: "Loading", secondary: "" },
  skeleton: { primary: "Skeleton", secondary: "" },
  progress: { primary: "Progress", secondary: "" },
  "success-error": { primary: "Success & Error", secondary: "" },
  toast: { primary: "Toast", secondary: "" },
  sheet: { primary: "Sheet", secondary: "" },
  alert: { primary: "Alert", secondary: "" },
  "action-sheet": { primary: "Action Sheet", secondary: "" },
  tooltip: { primary: "Tooltip", secondary: "" },
  dropdown: { primary: "Dropdown", secondary: "" },
  "notification-banner": { primary: "Notification Banner", secondary: "" },
  "swipe-dismiss": { primary: "Swipe to Dismiss", secondary: "" },
  "swipe-cards": { primary: "Swipe Cards", secondary: "" },
  navigation: { primary: "Navigation", secondary: "" },
  "page-transitions": { primary: "Page Transitions", secondary: "" },
  "custom-transitions": { primary: "Custom Transitions", secondary: "" },
  "hero-transition": { primary: "Hero Transition", secondary: "" },
  haptics: { primary: "Haptics", secondary: "" },
  counter: { primary: "Counter", secondary: "" },
  "scroll-driven": { primary: "Scroll-Driven", secondary: "" },
  keyframe: { primary: "Keyframes", secondary: "" },
  phase: { primary: "Phase Animator", secondary: "" },
  lottie: { primary: "Lottie", secondary: "" },
  "border-glow": { primary: "Border Glow", secondary: "" },
};

export function getDocsNavMeta(slug: string): DocsNavMeta {
  return docsNavMetaMap[slug] ?? { primary: slug, secondary: "" };
}

import type { CardsSection } from "@/types/motion";

export const navigationSection: CardsSection = {
  type: "cards",
  title: "Navigation",
  description: "Push / Pop 导航转场。",
  cards: [
    {
      title: "Push / Pop Transition",
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
