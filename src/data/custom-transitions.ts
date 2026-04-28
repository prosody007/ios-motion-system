import type { CardsSection } from "@/types/motion";

export const customTransitionsSection: CardsSection = {
  type: "cards",
  title: "Custom Transitions · 自定义转场",
  description: "自定义过渡与视图控制器转场。",
  cards: [
    {
      title: "AnyTransition 内置组合",
      tags: [{ text: ".combined", variant: "easing" }, { text: ".asymmetric", variant: "easing" }],
      previewId: "ios-custom-any-transition",
      codes: {
        swift: `// SwiftUI — AnyTransition 内置类型 + 组合方式

@State private var show = false

// 基础用法：
if show {
    CardView()
        .transition(.opacity)  // 淡入淡出
}

// 组合多个 transition：
if show {
    CardView()
        .transition(
            .move(edge: .trailing)
            .combined(with: .opacity)
        )
}

// 入场/退场使用不同动画：
if show {
    CardView()
        .transition(.asymmetric(
            insertion: .move(edge: .bottom).combined(with: .opacity),
            removal: .move(edge: .top).combined(with: .opacity)
        ))
}

Button("Toggle") {
    withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
        show.toggle()
    }
}

// 全部内置 AnyTransition：
// .opacity           — 淡入/淡出
// .scale             — 从中心缩放
// .scale(scale:anchor:) — 指定缩放比和锚点
// .slide             — 从前导/尾随边缘滑入
// .move(edge:)       — 从指定边缘滑入
// .offset(x:y:)      — 从指定偏移位置
// .push(from:)       — 推入效果（iOS 16+）
// .blurReplace       — 模糊替换（iOS 17+）

// 组合方式：
// .combined(with:) — 两个同时生效
// .asymmetric(insertion:removal:) — 入场/退场不同
// .animation(_:) — 附加独立动画曲线（覆盖外部 withAnimation）`,
        uikit: `// UIKit — CATransition + UIView.transition

// 1. CATransition — Layer 级转场
let transition = CATransition()
transition.type = .push        // .fade | .push | .moveIn | .reveal
transition.subtype = .fromRight // .fromLeft | .fromTop | .fromBottom
transition.duration = 0.35
transition.timingFunction = CAMediaTimingFunction(name: .easeInEaseOut)

view.layer.add(transition, forKey: kCATransition)
newSubview.isHidden = false
oldSubview.isHidden = true

// 2. UIView.transition — View 级转场
UIView.transition(
    with: containerView,
    duration: 0.3,
    options: [.transitionCrossDissolve],  // 交叉淡入淡出
    animations: {
        oldView.isHidden = true
        newView.isHidden = false
    }
)

// UIView.transition options：
// .transitionCrossDissolve
// .transitionFlipFromLeft / .fromRight / .fromTop / .fromBottom
// .transitionCurlUp / .transitionCurlDown

// 3. 手动组合动画
UIView.animate(
    withDuration: 0.35,
    delay: 0,
    usingSpringWithDamping: 0.86,
    initialSpringVelocity: 0,
    animations: {
        // 入场
        newView.alpha = 1
        newView.transform = .identity
        // 退场
        oldView.alpha = 0
        oldView.transform = CGAffineTransform(translationX: -50, y: 0)
    },
    completion: { _ in oldView.removeFromSuperview() }
)`,
      },
    },
    {
      title: "自定义 ViewModifier Transition",
      tags: [{ text: "自定义", variant: "spring" }, { text: ".modifier(active:identity:)", variant: "easing" }],
      previewId: "ios-custom-modifier",
      codes: {
        swift: `// SwiftUI — 用 ViewModifier 创建自定义 Transition
// active: 元素不可见时的状态
// identity: 元素可见时的状态（通常是正常态）

// 示例 1: 滑动 + 淡出 + 轻微缩放
struct SlideAndFade: ViewModifier {
    let isActive: Bool

    func body(content: Content) -> some View {
        content
            .offset(y: isActive ? 0 : 30)
            .opacity(isActive ? 1 : 0)
            .scaleEffect(isActive ? 1 : 0.95)
    }
}

extension AnyTransition {
    static var slideAndFade: AnyTransition {
        .modifier(
            active: SlideAndFade(isActive: false),
            identity: SlideAndFade(isActive: true)
        )
    }
}

// 使用：
if show {
    CardView()
        .transition(.slideAndFade)
}

// 示例 2: 3D 翻转
struct FlipModifier: ViewModifier {
    let angle: Double

    func body(content: Content) -> some View {
        content
            .rotation3DEffect(.degrees(angle), axis: (x: 0, y: 1, z: 0))
            .opacity(abs(angle) < 90 ? 1 : 0)
    }
}

extension AnyTransition {
    static var flip: AnyTransition {
        .asymmetric(
            insertion: .modifier(
                active: FlipModifier(angle: -90),
                identity: FlipModifier(angle: 0)
            ),
            removal: .modifier(
                active: FlipModifier(angle: 90),
                identity: FlipModifier(angle: 0)
            )
        )
    }
}

// 推荐搭配的动画：
// 滑动类: .spring(response: 0.4, dampingFraction: 0.8)
// 翻转类: .easeInOut(duration: 0.5)`,
        uikit: `// UIKit — 自定义转场动画封装

// 封装可复用的 view 切换动画
extension UIView {

    /// 滑动 + 淡入淡出切换
    static func slideTransition(
        in container: UIView,
        from oldView: UIView,
        to newView: UIView,
        direction: CGFloat = 1,  // 1=向左，-1=向右
        duration: TimeInterval = 0.35
    ) {
        newView.alpha = 0
        newView.transform = CGAffineTransform(
            translationX: 50 * direction, y: 0
        ).scaledBy(x: 0.95, y: 0.95)
        container.addSubview(newView)

        UIView.animate(
            withDuration: duration,
            delay: 0,
            usingSpringWithDamping: 0.86,
            initialSpringVelocity: 0,
            animations: {
                newView.alpha = 1
                newView.transform = .identity

                oldView.alpha = 0
                oldView.transform = CGAffineTransform(
                    translationX: -30 * direction, y: 0
                )
            },
            completion: { _ in
                oldView.removeFromSuperview()
                oldView.transform = .identity
                oldView.alpha = 1
            }
        )
    }

    /// 3D 翻转切换
    static func flipTransition(
        in container: UIView,
        duration: TimeInterval = 0.6
    ) {
        UIView.transition(
            with: container,
            duration: duration,
            options: .transitionFlipFromRight,
            animations: {
                // 在 animations 块中切换 subview 的可见性
                // container.subviews[0].isHidden = true
                // container.subviews[1].isHidden = false
            }
        )
    }
}

// 动画参数参考：
// 滑动: 0.35s, dampingRatio 0.86
// 翻转: 0.6s, 系统内置翻转动画
// 淡入淡出: 0.3s, .transitionCrossDissolve`,
      },
    },
    {
      title: "UIViewControllerAnimatedTransitioning",
      tags: [{ text: "UIKit 完全控制", variant: "spring" }, { text: "交互式", variant: "easing" }],
      previewId: "ios-custom-vc-transition",
      codes: {
        swift: `// SwiftUI — 桥接 UIKit 自定义转场
// SwiftUI 没有直接等价 UIViewControllerAnimatedTransitioning 的 API
// 推荐方案：

// 方案 1: matchedGeometryEffect（覆盖大部分场景）
@Namespace var ns
@State var expanded = false

ZStack {
    if !expanded {
        MiniCard()
            .matchedGeometryEffect(id: "card", in: ns)
            .onTapGesture {
                withAnimation(.spring(response: 0.4, dampingFraction: 0.85)) {
                    expanded = true
                }
            }
    } else {
        ExpandedCard()
            .matchedGeometryEffect(id: "card", in: ns)
            .onTapGesture {
                withAnimation(.spring(response: 0.35, dampingFraction: 0.9)) {
                    expanded = false
                }
            }
    }
}

// 方案 2: iOS 18+ zoom transition（前一张卡片已介绍）

// 方案 3: UIViewControllerRepresentable 桥接
// 当 matchedGeometryEffect 无法满足时
// 用 UIViewControllerRepresentable 包装 UIKit VC
// 在 UIKit 侧实现完整的转场动画`,
        uikit: `// UIKit — UIViewControllerAnimatedTransitioning
// 完全自定义 ViewController 之间的转场动画

// 1. 实现 Animator
class CardExpandAnimator: NSObject, UIViewControllerAnimatedTransitioning {
    let presenting: Bool
    let sourceFrame: CGRect

    init(presenting: Bool, sourceFrame: CGRect) {
        self.presenting = presenting
        self.sourceFrame = sourceFrame
    }

    func transitionDuration(
        using ctx: UIViewControllerContextTransitioning?
    ) -> TimeInterval {
        return presenting ? 0.45 : 0.35  // 退场比入场快
    }

    func animateTransition(
        using ctx: UIViewControllerContextTransitioning
    ) {
        let container = ctx.containerView
        let duration = transitionDuration(using: ctx)

        if presenting {
            guard let toView = ctx.view(forKey: .to),
                  let toVC = ctx.viewController(forKey: .to)
            else { return }

            let endFrame = ctx.finalFrame(for: toVC)
            toView.frame = sourceFrame
            toView.layer.cornerRadius = 16
            toView.clipsToBounds = true
            container.addSubview(toView)

            UIView.animate(
                withDuration: duration,
                delay: 0,
                usingSpringWithDamping: 0.85,   // 轻微过冲
                initialSpringVelocity: 0,
                animations: {
                    toView.frame = endFrame
                    toView.layer.cornerRadius = 0
                }
            ) { _ in
                ctx.completeTransition(!ctx.transitionWasCancelled)
            }
        } else {
            guard let fromView = ctx.view(forKey: .from) else { return }

            UIView.animate(
                withDuration: duration,
                delay: 0,
                options: .curveEaseIn,  // 退场用 easeIn 加速离开
                animations: {
                    fromView.frame = self.sourceFrame
                    fromView.layer.cornerRadius = 16
                    fromView.alpha = 0.8
                }
            ) { _ in
                ctx.completeTransition(!ctx.transitionWasCancelled)
            }
        }
    }
}

// 2. 实现 TransitioningDelegate
class TransitionDelegate: NSObject, UIViewControllerTransitioningDelegate {
    var sourceFrame: CGRect = .zero

    func animationController(
        forPresented presented: UIViewController,
        presenting: UIViewController,
        source: UIViewController
    ) -> UIViewControllerAnimatedTransitioning? {
        CardExpandAnimator(presenting: true, sourceFrame: sourceFrame)
    }

    func animationController(
        forDismissed dismissed: UIViewController
    ) -> UIViewControllerAnimatedTransitioning? {
        CardExpandAnimator(presenting: false, sourceFrame: sourceFrame)
    }
}

// 3. 使用
let detail = DetailViewController()
detail.modalPresentationStyle = .custom
detail.transitioningDelegate = transitionDelegate
transitionDelegate.sourceFrame = cell.frame
present(detail, animated: true)

// 动画参数：
// 入场: 0.45s, dampingRatio 0.85 (spring)
// 退场: 0.35s, .curveEaseIn (加速离开)
// 原则: 退场比入场快 ~25%`,
      },
    },
  ],
};
