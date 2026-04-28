import type { CardsSection } from "@/types/motion";

export const cardFlipSection: CardsSection = {
  type: "cards",
  title: "Card · 卡片",
  description: "卡片展开、翻转与堆叠切换。",
  cards: [
    {
      title: "Card Expand · 卡片展开",
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
    /* Matched Geometry 卡片折叠/展开 — 共享元素式的展开/折叠 */
    {
      title: "Matched Geometry · 卡片折叠展开",
      tags: [
        { text: "open: 0.40s", variant: "spring" },
        { text: "close: 0.24s", variant: "spring" },
      ],
      previewId: "ios-spring-matched-geometry",
      codes: {
        swift: `// SwiftUI — 标题 matched，正文从截断 → 完整两段
// 动画规则：入场 0.40s 让眼睛看清新内容；出场 0.24s 用 Apple 招牌的柔和曲线收掉
@State private var expanded = false

struct HabitCard: View {
    @Binding var expanded: Bool

    private var animation: Animation {
        expanded
            ? .smooth(duration: 0.40, extraBounce: 0)
            // (0.32, 0.72, 0, 1) → SwiftUI 没有内置同名预设，最接近的是 .smooth
            : .smooth(duration: 0.24, extraBounce: 0)
    }

    var body: some View {
        VStack(alignment: .leading, spacing: expanded ? 32 : 16) {
            Text("小さな習慣が、人生の輪郭をつくる")
                .font(.system(size: 24, weight: .semibold))
                .foregroundStyle(.black)

            if expanded {
                VStack(alignment: .leading, spacing: 24) {
                    Text(paragraph1)
                    Text(paragraph2)
                }
                .font(.system(size: 16, weight: .light))
                .foregroundStyle(.black)
                .transition(.opacity.animation(.easeOut(duration: 0.24).delay(0.16)))
            } else {
                Text(previewText)
                    .font(.system(size: 16, weight: .light))
                    .foregroundStyle(.black)
                    .lineLimit(1)
                    .truncationMode(.tail)
                    .transition(.opacity.animation(.easeIn(duration: 0.10).delay(0.08)))
            }
        }
        .padding(.horizontal, 24)
        .padding(.vertical, 32)
        .frame(maxWidth: 528, alignment: .leading)
        .background(
            RoundedRectangle(cornerRadius: 20)
                .fill(.white)
                .shadow(color: .black.opacity(0.06), radius: 12, y: 4)
        )
        .onTapGesture {
            withAnimation(animation) { expanded.toggle() }
        }
    }
}`,
        uikit: `// UIKit — 入场 0.40s / 出场 0.24s，出场用 Apple 柔和曲线 (0.32, 0.72, 0, 1)
@IBAction func toggle() {
    expanded.toggle()

    let duration: TimeInterval = expanded ? 0.40 : 0.24
    let timing: UICubicTimingParameters = expanded
        ? UICubicTimingParameters(controlPoint1: CGPoint(x: 0.22, y: 1),
                                  controlPoint2: CGPoint(x: 0.36, y: 1))
        : UICubicTimingParameters(controlPoint1: CGPoint(x: 0.32, y: 0.72),
                                  controlPoint2: CGPoint(x: 0, y: 1))

    let anim = UIViewPropertyAnimator(duration: duration, timingParameters: timing)
    anim.addAnimations {
        self.previewLabel.alpha = self.expanded ? 0 : 1
        self.fullStack.alpha = self.expanded ? 1 : 0
        self.previewLabel.isHidden = self.expanded
        self.fullStack.isHidden = !self.expanded
        self.stackView.spacing = self.expanded ? 32 : 16
        self.view.layoutIfNeeded()
    }
    anim.startAnimation()
}

// 关键：所有变化放在同一个 animate block + layoutIfNeeded()，
// 让 AutoLayout 的约束变化、alpha、isHidden 共享同一条曲线。`,
      },
    },
    {
      title: "3D Flip · 卡片翻转",
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
    {
      title: "Flash Card Stack · 卡牌堆叠",
      tags: [
        { text: "0.36s", variant: "duration" },
        { text: ".smooth", variant: "spring" },
      ],
      previewId: "ios-card-flash-stack",
      codes: {
        swift: `// SwiftUI — 3 张卡片堆叠轮换
struct FlashCardStackView: View {
    struct FlashCard: Identifiable {
        let id: String
        let indexLabel: String
        let title: String
        let accent: Color
        let image: LinearGradient
    }

    @State private var order = [0, 1, 2]

    let cards: [FlashCard] = [
        .init(
            id: "scan",
            indexLabel: "1/3",
            title: "The sum of two negative integers is always negative.",
            accent: Color(hex: 0x007AFF),
            image: .init(colors: [Color(hex: 0xE3EEFF), Color(hex: 0xBCD7FF)], startPoint: .topLeading, endPoint: .bottomTrailing)
        ),
        .init(
            id: "study",
            indexLabel: "2/3",
            title: "Choose the correct verb form to complete the sentence.",
            accent: Color(hex: 0xAF52DE),
            image: .init(colors: [Color(hex: 0xF4E8FF), Color(hex: 0xDEC3FF)], startPoint: .topLeading, endPoint: .bottomTrailing)
        ),
        .init(
            id: "focus",
            indexLabel: "3/3",
            title: "Review the highlighted term before moving to the next card.",
            accent: Color(hex: 0x34C759),
            image: .init(colors: [Color(hex: 0xE5F8EB), Color(hex: 0xBFE9CB)], startPoint: .topLeading, endPoint: .bottomTrailing)
        ),
    ]

    private let stack = [
        (offsetY: 0.0,  scale: 1.00, z: 3.0),
        (offsetY: 12.0, scale: 0.95, z: 2.0),
        (offsetY: 24.0, scale: 0.90, z: 1.0),
    ]

    var body: some View {
        VStack(spacing: 20) {
            ZStack(alignment: .top) {
                ForEach(Array(order.enumerated()), id: \\.offset) { stackIndex, cardIndex in
                    let item = cards[cardIndex]
                    let style = stack[stackIndex]

                    VStack(spacing: 0) {
                        Rectangle()
                            .fill(item.image)
                            .frame(height: 140)

                        VStack(spacing: 12) {
                            Text(item.indexLabel)
                                .font(.system(size: 14, weight: .regular))
                                .foregroundStyle(Color(hex: 0x595C60))

                            Text(item.title)
                                .font(.system(size: 14, weight: .semibold))
                                .multilineTextAlignment(.center)
                                .foregroundStyle(.black)

                            Text("Tap to reveal")
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundStyle(item.accent)
                        }
                        .padding(.horizontal, 16)
                        .padding(.top, 16)
                        .padding(.bottom, 20)
                    }
                    .frame(width: 210)
                    .background(.white)
                    .clipShape(RoundedRectangle(cornerRadius: 20))
                    .shadow(color: .black.opacity(0.08), radius: 12, y: 8)
                    .frame(width: 321, height: 325, alignment: .top)
                    .scaleEffect(style.scale)
                    .offset(y: style.offsetY)
                    .zIndex(style.z)
                }
            }
            .frame(width: 321, height: 280)

            HStack(spacing: 8) {
                Button {
                    withAnimation(.smooth(duration: 0.42)) {
                        order = [order[2], order[0], order[1]]
                    }
                } label: {
                    Image(systemName: "chevron.left")
                        .frame(width: 40, height: 40)
                        .background(Color(hex: 0xE9ECF5), in: Circle())
                }

                Button {
                    withAnimation(.smooth(duration: 0.42)) {
                        order = [order[1], order[2], order[0]]
                    }
                } label: {
                    Image(systemName: "chevron.right")
                        .frame(width: 40, height: 40)
                        .background(Color(hex: 0xE9ECF5), in: Circle())
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(Color(hex: 0xEDEEF3), in: Capsule())
        }
    }
}

// 交互规则：
// • 共 3 张卡片，后两张逐级缩小并向下堆叠
// • Next  = 第一张移到最后，第二张放大到最前
// • Prev  = 最后一张移到最前，第一张退到第二位
// • 全部卡片在同一段 smooth 动画中交换位置`,
        uikit: `// UIKit — Flash Card 堆叠轮换
final class FlashCardStackView: UIView {
    private let cards: [UIView] = [UIView(), UIView(), UIView()]
    private var order = [0, 1, 2]

    private let stack: [(y: CGFloat, scale: CGFloat, z: CGFloat)] = [
        (0, 1.00, 3),
        (12, 0.95, 2),
        (24, 0.90, 1),
    ]

    func moveForward() {
        order = [order[1], order[2], order[0]]
        applyStack(animated: true)
    }

    func moveBackward() {
        order = [order[2], order[0], order[1]]
        applyStack(animated: true)
    }

    private func applyStack(animated: Bool) {
        for (stackIndex, cardIndex) in order.enumerated() {
            let view = cards[cardIndex]
            let style = stack[stackIndex]

            let updates = {
                view.transform = CGAffineTransform(translationX: 0, y: style.y)
                    .scaledBy(x: style.scale, y: style.scale)
                view.layer.zPosition = style.z
            }

            guard animated else {
                updates()
                continue
            }

            let timing = UISpringTimingParameters(dampingRatio: 1.0)
            let animator = UIViewPropertyAnimator(duration: 0.42, timingParameters: timing)
            animator.addAnimations(updates)
            animator.startAnimation()
        }
    }
}

// 交互规则：
// • 3 张卡片保持堆叠
// • 后两张逐级缩小并向下露出
// • Next  = 顶层卡片移到最后
// • Prev  = 底层卡片提到最前
// • 所有卡片在同一段动画中交换位置`,
      },
    },
  ],
};
