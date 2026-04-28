# Page Transitions · 页面转场

页面级缩放、共享元素与全屏过渡。

## Zoom Transition (iOS 18+)

- Preview ID：`ios-page-nav-transition`
- Tags：`iOS 18+` (easing) · `系统 spring` (spring)

### SwiftUI

```swift
// SwiftUI — Zoom Navigation Transition (iOS 18+)
// 从源视图放大展开到目标页面，系统自动处理动画

@Namespace private var namespace

NavigationStack {
    ScrollView {
        LazyVGrid(columns: columns) {
            ForEach(items) { item in
                NavigationLink(value: item) {
                    ItemCard(item: item)
                        // 标记源视图
                        .matchedTransitionSource(id: item.id, in: namespace)
                }
            }
        }
    }
    .navigationDestination(for: Item.self) { item in
        DetailView(item: item)
            // 标记目标页，系统自动从源 frame 放大到全屏
            .navigationTransition(.zoom(sourceID: item.id, in: namespace))
    }
}

// 也适用于 Sheet：
.sheet(isPresented: $showDetail) {
    DetailView()
        .navigationTransition(.zoom(sourceID: selectedID, in: namespace))
}

// 系统控制的动画参数（不可自定义）：
// duration: ~0.4s
// curve: 系统 spring
// 自动插值: frame, cornerRadius, shadow
// 自动处理手势返回的交互式动画

// 注意事项：
// 1. sourceID 必须在两端匹配
// 2. 只有 .zoom(sourceID:in:) 一种转场类型
// 3. 默认 push 动画仍然是 .automatic（左右滑动）
// 4. dismiss 时自动反转回源位置
```

### UIKit

```swift
// UIKit — Zoom Transition (iOS 18+)
// UIKit 通过 UINavigationControllerDelegate 实现

// 系统提供的 zoom transition：
class ViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        // iOS 18+ 系统 zoom transition
        // 通过设置 preferredTransition 属性
        let detailVC = DetailViewController()
        detailVC.preferredTransition = .zoom(sourceViewProvider: { context in
            // 返回作为 zoom 源的 view
            return self.selectedCell
        })
        navigationController?.pushViewController(detailVC, animated: true)
    }
}

// 手动实现类似效果（iOS 15+）：
class ZoomAnimator: NSObject, UIViewControllerAnimatedTransitioning {
    let sourceFrame: CGRect
    let presenting: Bool

    func transitionDuration(using ctx: UIViewControllerContextTransitioning?) -> TimeInterval {
        return 0.4
    }

    func animateTransition(using ctx: UIViewControllerContextTransitioning) {
        guard let toView = ctx.view(forKey: .to),
              let toVC = ctx.viewController(forKey: .to) else { return }
        let container = ctx.containerView
        let finalFrame = ctx.finalFrame(for: toVC)

        if presenting {
            toView.frame = sourceFrame
            toView.layer.cornerRadius = 16
            toView.clipsToBounds = true
            toView.alpha = 0.5
            container.addSubview(toView)

            UIView.animate(
                withDuration: 0.4,
                delay: 0,
                usingSpringWithDamping: 0.88,
                initialSpringVelocity: 0,
                animations: {
                    toView.frame = finalFrame
                    toView.layer.cornerRadius = 0
                    toView.alpha = 1
                }
            ) { _ in
                ctx.completeTransition(!ctx.transitionWasCancelled)
            }
        }
    }
}
```

---

## matchedGeometryEffect

- Preview ID：`ios-page-matched-geometry`
- Tags：`iOS 14+` (easing) · `.spring(response:0.35)` (spring)

### SwiftUI

```swift
// SwiftUI — matchedGeometryEffect 共享元素过渡
// 同一个 @Namespace + 相同 id → 系统自动插值 frame 和形状

@Namespace private var animation
@State private var showDetail = false
@State private var selectedItem: Item?

ZStack {
    // 列表态
    if !showDetail {
        LazyVGrid(columns: columns) {
            ForEach(items) { item in
                ItemCard(item: item)
                    .matchedGeometryEffect(id: item.id, in: animation)
                    .onTapGesture {
                        withAnimation(.spring(response: 0.35, dampingFraction: 0.86)) {
                            selectedItem = item
                            showDetail = true
                        }
                    }
            }
        }
    }

    // 详情态
    if showDetail, let item = selectedItem {
        DetailView(item: item)
            .matchedGeometryEffect(id: item.id, in: animation)
            .onTapGesture {
                withAnimation(.spring(response: 0.35, dampingFraction: 0.86)) {
                    showDetail = false
                    selectedItem = nil
                }
            }
    }
}

// 推荐动画参数：
// .spring(response: 0.35, dampingFraction: 0.86) — 快速、几乎无过冲
// 不要用 .easeInOut — spring 在 frame 插值时更自然

// 关键约束：
// 1. 源和目标必须用 if/else 切换，不能同时存在
// 2. id 必须是 Hashable 且在两态中匹配
// 3. frame 和 cornerRadius 自动插值
// 4. 背景色不会插值（需要手动处理）
```

### UIKit

```swift
// UIKit — 共享元素转场
// 需要 UIViewControllerAnimatedTransitioning

class SharedElementTransition: NSObject, UIViewControllerAnimatedTransitioning {
    let sourceView: UIView
    let sourceFrame: CGRect

    init(sourceView: UIView, in container: UIView) {
        self.sourceView = sourceView
        self.sourceFrame = sourceView.convert(sourceView.bounds, to: container)
    }

    func transitionDuration(using ctx: UIViewControllerContextTransitioning?) -> TimeInterval {
        return 0.35
    }

    func animateTransition(using ctx: UIViewControllerContextTransitioning) {
        guard let toVC = ctx.viewController(forKey: .to),
              let toView = ctx.view(forKey: .to) else { return }

        let container = ctx.containerView
        let finalFrame = ctx.finalFrame(for: toVC)

        // 用 snapshot 做过渡，避免破坏源 view
        guard let snapshot = sourceView.snapshotView(afterScreenUpdates: false) else {
            ctx.completeTransition(false)
            return
        }
        snapshot.frame = sourceFrame

        sourceView.isHidden = true
        toView.frame = finalFrame
        toView.alpha = 0
        container.addSubview(toView)
        container.addSubview(snapshot)

        UIView.animate(
            withDuration: 0.35,
            delay: 0,
            usingSpringWithDamping: 0.86,
            initialSpringVelocity: 0,
            animations: {
                // snapshot 飞到目标位置
                snapshot.frame = /* 目标 imageView 的 frame */
                    toVC.view.convert(toVC.imageView.frame, to: container)
                toView.alpha = 1
            }
        ) { _ in
            snapshot.removeFromSuperview()
            self.sourceView.isHidden = false
            ctx.completeTransition(!ctx.transitionWasCancelled)
        }
    }
}

// 动画参数：
// duration: 0.35s
// dampingRatio: 0.86 — 几乎无过冲
// snapshot 保证源 view 不受影响
```

---

## fullScreenCover / Sheet

- Preview ID：`ios-page-fullscreen`
- Tags：`~0.5s` (duration) · `系统 spring` (spring)

### SwiftUI

```swift
// SwiftUI — fullScreenCover 和 sheet 的系统动画参数

// Sheet（半屏）
@State private var showSheet = false

Button("Show Sheet") { showSheet = true }
    .sheet(isPresented: $showSheet) {
        SheetContent()
            .presentationDetents([.medium, .large])
            .presentationDragIndicator(.visible)
    }

// fullScreenCover（全屏）
@State private var showFull = false

Button("Full Screen") { showFull = true }
    .fullScreenCover(isPresented: $showFull) {
        FullScreenContent()
    }

// 系统默认动画参数（sheet 和 fullScreenCover 共用）：
// animation: .spring(response: 0.5, dampingFraction: 0.825)
// 等价 .spring(duration: 0.5, bounce: 0.0)
// 从底部向上滑入

// sheet 支持下拉手势关闭（系统自带交互式动画）
// fullScreenCover 不支持下拉关闭

// 自定义 Sheet 的 present/dismiss 动画不被官方支持
// 但可以通过 .transaction 修改：
.sheet(isPresented: $show) {
    content
        .transaction { transaction in
            transaction.animation = .spring(response: 0.3, dampingFraction: 0.8)
        }
}
```

### UIKit

```swift
// UIKit — Sheet 和 FullScreen 系统动画参数

// Sheet (iOS 15+)
let vc = SheetViewController()
if let sheet = vc.sheetPresentationController {
    sheet.detents = [.medium(), .large()]
    sheet.prefersGrabberVisible = true
    sheet.preferredCornerRadius = 20
}
present(vc, animated: true)

// 系统 sheet present 动画参数：
// duration: ~0.5s
// curve: UISpringTimingParameters(dampingRatio: 0.825)
// 从 y = screenHeight 滑入到目标 detent 位置

// FullScreen
let fullVC = FullScreenViewController()
fullVC.modalPresentationStyle = .fullScreen
fullVC.modalTransitionStyle = .coverVertical  // 默认
present(fullVC, animated: true)

// modalTransitionStyle 选项：
// .coverVertical    — 从底部滑入（默认，spring 动画）
// .crossDissolve    — 交叉淡入淡出（0.35s ease）
// .flipHorizontal   — 水平翻转（0.6s）

// 自定义转场动画：
fullVC.modalPresentationStyle = .custom
fullVC.transitioningDelegate = self

// 在 delegate 中返回自定义 animator：
func animationController(
    forPresented presented: UIViewController,
    presenting: UIViewController,
    source: UIViewController
) -> UIViewControllerAnimatedTransitioning? {
    return SlideUpAnimator(presenting: true)
}

func animationController(
    forDismissed dismissed: UIViewController
) -> UIViewControllerAnimatedTransitioning? {
    return SlideUpAnimator(presenting: false)
}
```

