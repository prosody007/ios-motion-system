import type { CardsSection } from "@/types/motion";

export const cardFlipSection: CardsSection = {
  type: "cards",
  title: "卡片展开与翻转",
  description: "卡片展开过渡与 3D 翻转动画效果。",
  cards: [
    {
      title: "卡片展开",
      tags: [
        { text: "0.4s", variant: "duration" },
        { text: ".spring", variant: "spring" },
      ],
      previewId: "ios-card-expand",
      codes: {
        swift: `// SwiftUI — matchedGeometryEffect 卡片展开
struct CardExpandView: View {
    @Namespace private var namespace
    @State private var selectedCard: String?

    var body: some View {
        ZStack {
            if let selected = selectedCard {
                // 展开后的详情
                DetailView(id: selected)
                    .matchedGeometryEffect(
                        id: selected,
                        in: namespace
                    )
                    .onTapGesture {
                        withAnimation(
                            .spring(
                                response: 0.4,
                                dampingFraction: 0.85
                            )
                        ) {
                            selectedCard = nil
                        }
                    }
            } else {
                // 卡片列表
                ScrollView {
                    LazyVGrid(columns: columns, spacing: 16) {
                        ForEach(cards) { card in
                            CardView(card: card)
                                .matchedGeometryEffect(
                                    id: card.id,
                                    in: namespace
                                )
                                .onTapGesture {
                                    withAnimation(
                                        .spring(
                                            response: 0.4,
                                            dampingFraction: 0.85
                                        )
                                    ) {
                                        selectedCard = card.id
                                    }
                                }
                        }
                    }
                }
            }
        }
    }
}
// response: 0.4 — 快速但不突兀
// dampingFraction: 0.85 — 轻微回弹`,
        uikit: `// UIKit — 卡片展开过渡 (Hero-style)
class CardTransitionAnimator: NSObject, UIViewControllerAnimatedTransitioning {
    let isPresenting: Bool
    let originFrame: CGRect

    func transitionDuration(
        using context: UIViewControllerContextTransitioning?
    ) -> TimeInterval { 0.4 }

    func animateTransition(
        using context: UIViewControllerContextTransitioning
    ) {
        let container = context.containerView
        guard let toView = context.view(forKey: .to) else { return }

        if isPresenting {
            toView.frame = originFrame
            toView.layer.cornerRadius = 16
            toView.clipsToBounds = true
            container.addSubview(toView)

            let finalFrame = context.finalFrame(
                for: context.viewController(forKey: .to)!
            )

            UIView.animate(
                withDuration: 0.4,
                delay: 0,
                usingSpringWithDamping: 0.85,
                initialSpringVelocity: 0,
                options: [],
                animations: {
                    toView.frame = finalFrame
                    toView.layer.cornerRadius = 0
                },
                completion: { _ in
                    context.completeTransition(true)
                }
            )
        }
    }
}`,
      },
    },
    {
      title: "3D 翻转",
      tags: [
        { text: "0.5s", variant: "duration" },
        { text: ".easeInOut", variant: "easing" },
      ],
      previewId: "ios-card-flip",
      codes: {
        swift: `// SwiftUI — 3D 翻转效果
struct FlipCardView: View {
    @State private var isFlipped = false
    @State private var rotation: Double = 0

    var body: some View {
        ZStack {
            // 正面
            CardFront()
                .opacity(rotation < 90 ? 1 : 0)
                .rotation3DEffect(
                    .degrees(rotation),
                    axis: (x: 0, y: 1, z: 0)
                )

            // 背面
            CardBack()
                .opacity(rotation >= 90 ? 1 : 0)
                .rotation3DEffect(
                    .degrees(rotation - 180),
                    axis: (x: 0, y: 1, z: 0)
                )
        }
        .onTapGesture {
            withAnimation(.easeInOut(duration: 0.5)) {
                rotation += 180
                isFlipped.toggle()
            }
        }
    }
}
// .easeInOut(duration: 0.5)
// 中间速度最快, 两端减速, 翻转自然`,
        uikit: `// UIKit — UIView.transition 翻转
class FlipCardVC: UIViewController {
    let containerView = UIView()
    let frontView = UIView()
    let backView = UIView()
    var showingFront = true

    func flipCard() {
        let fromView = showingFront ? frontView : backView
        let toView = showingFront ? backView : frontView

        UIView.transition(
            from: fromView,
            to: toView,
            duration: 0.5,
            options: [
                .transitionFlipFromRight,
                .showHideTransitionViews
            ],
            completion: { _ in
                self.showingFront.toggle()
            }
        )
    }

    // 手动 CATransform3D 版本
    func flipWithTransform() {
        var transform = CATransform3DIdentity
        transform.m34 = -1.0 / 500.0 // 透视
        containerView.layer.sublayerTransform = transform

        UIView.animate(
            withDuration: 0.5,
            delay: 0,
            options: .curveEaseInOut,
            animations: {
                self.containerView.layer.transform =
                    CATransform3DRotate(transform, .pi, 0, 1, 0)
            }
        )
    }
}`,
      },
    },
  ],
};
