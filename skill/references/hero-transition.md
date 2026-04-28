# Hero Transition

共享元素与图片转场。

## Hero Image Transition

- Preview ID：`ios-hero`
- Tags：`iOS 18+` (easing) · `0.4s` (duration)

### SwiftUI

```swift
// SwiftUI — Hero 转场 (iOS 18+)
struct HeroTransitionDemo: View {
    @Namespace private var heroNamespace

    var body: some View {
        NavigationStack {
            ScrollView {
                LazyVGrid(columns: [GridItem(.adaptive(minimum: 120))]) {
                    ForEach(photos) { photo in
                        NavigationLink(value: photo) {
                            Image(photo.name)
                                .resizable()
                                .scaledToFill()
                                .frame(width: 120, height: 120)
                                .clipShape(RoundedRectangle(cornerRadius: 12))
                                .matchedTransitionSource(
                                    id: photo.id,
                                    in: heroNamespace
                                )
                        }
                    }
                }
            }
            .navigationDestination(for: Photo.self) { photo in
                Image(photo.name)
                    .resizable()
                    .scaledToFit()
                    .navigationTransition(
                        .zoom(sourceID: photo.id, in: heroNamespace)
                    )
            }
        }
    }
}

// Fallback: matchedGeometryEffect (iOS 16)
struct HeroFallbackView: View {
    @Namespace private var ns
    @State private var showDetail = false
    let photoId = "hero-photo"

    var body: some View {
        ZStack {
            if !showDetail {
                Image("thumbnail")
                    .matchedGeometryEffect(id: photoId, in: ns)
                    .onTapGesture {
                        withAnimation(.spring(response: 0.4, dampingFraction: 0.85)) {
                            showDetail = true
                        }
                    }
            } else {
                Image("thumbnail")
                    .resizable()
                    .scaledToFit()
                    .matchedGeometryEffect(id: photoId, in: ns)
                    .onTapGesture {
                        withAnimation(.spring(response: 0.4, dampingFraction: 0.85)) {
                            showDetail = false
                        }
                    }
            }
        }
    }
}
```

### UIKit

```swift
// UIKit — UIViewControllerAnimatedTransitioning
class HeroAnimator: NSObject, UIViewControllerAnimatedTransitioning {
    let isPresenting: Bool
    let originFrame: CGRect

    init(isPresenting: Bool, originFrame: CGRect) {
        self.isPresenting = isPresenting
        self.originFrame = originFrame
    }

    func transitionDuration(
        using transitionContext: UIViewControllerContextTransitioning?
    ) -> TimeInterval {
        return 0.4
    }

    func animateTransition(
        using transitionContext: UIViewControllerContextTransitioning
    ) {
        let container = transitionContext.containerView
        guard let toView = transitionContext.view(forKey: .to),
              let fromView = transitionContext.view(forKey: .from)
        else { return }

        let snapshot = UIImageView(image: captureSnapshot(of: fromView))
        snapshot.frame = isPresenting ? originFrame : fromView.frame
        snapshot.layer.cornerRadius = isPresenting ? 12 : 0
        snapshot.clipsToBounds = true

        container.addSubview(toView)
        container.addSubview(snapshot)
        toView.alpha = 0

        let finalFrame = isPresenting
            ? transitionContext.finalFrame(for: transitionContext.viewController(forKey: .to)!)
            : originFrame

        UIView.animate(
            withDuration: 0.4,
            delay: 0,
            usingSpringWithDamping: 0.85,
            initialSpringVelocity: 0,
            options: .curveEaseInOut
        ) {
            snapshot.frame = finalFrame
            snapshot.layer.cornerRadius = self.isPresenting ? 0 : 12
            toView.alpha = 1
        } completion: { _ in
            snapshot.removeFromSuperview()
            transitionContext.completeTransition(
                !transitionContext.transitionWasCancelled
            )
        }
    }
}
```

