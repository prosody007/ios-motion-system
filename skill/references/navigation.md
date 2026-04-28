# Navigation

Push / Pop 导航转场。

## Push / Pop Transition

- Preview ID：`ios-nav-push`
- Tags：`0.35s` (duration) · `.default curve` (easing)

### SwiftUI

```swift
// SwiftUI — NavigationStack 转场
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
.navigationTransition(.zoom(sourceID: id, in: ns))
```

### UIKit

```swift
// UIKit — 自定义 Push 转场
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
}
```

