import type { CardsSection } from "@/types/motion";

export const cardFlipSection: CardsSection = {
  type: "cards",
  title: "Card",
  description: "卡片展开、翻转与堆叠切换。",
  cards: [
    {
      title: "Card Expand",
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
      title: "Matched Geometry",
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
      title: "3D Flip",
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
      title: "Flash Card Stack",
      tags: [
        { text: "0.32s", variant: "duration" },
        { text: ".smooth", variant: "spring" },
      ],
      previewId: "ios-card-flash-stack",
      codes: {
        swift: `// SwiftUI — 3 张卡片堆叠 + 抛掷式翻面
//   · 顶部卡片可拖拽跟手；松手位移 ≥ 60pt 进入下一张
//   · "Need to Review" 把当前卡向左抛出 → 落到堆栈底
//   · "Mastered" 把当前卡向右抛出 → 落到堆栈底
//   两颗按钮都是「下一张」，只是抛出方向相反

struct FlashCardStackView: View {
    @State private var order = [0, 1, 2]
    @State private var dragOffset: CGSize = .zero
    @State private var fling: CGFloat = 0   // -1 / 0 / +1
    @State private var phase: Phase = .idle

    enum Phase { case idle, animating }

    private let cards = ["card-1", "card-2", "card-3"]
    private let slots: [(tx: CGFloat, ty: CGFloat, s: CGFloat)] = [
        (0,   0,   1.000),
        (14,  66,  0.913),
        (28, 101,  0.826),
    ]

    var body: some View {
        VStack(spacing: 16) {
            ZStack(alignment: .topLeading) {
                ForEach(0..<3) { itemIndex in
                    let stackIndex = order.firstIndex(of: itemIndex)!
                    let slot = slots[stackIndex]
                    let isTop = stackIndex == 0

                    FlashCardShell(label: cards[itemIndex])
                        .frame(width: 321, height: 325)
                        .offset(x: isTop ? dragOffset.width : 0,
                                y: isTop ? dragOffset.height * 0.4 : 0)
                        .rotationEffect(isTop ? .degrees(dragOffset.width * 0.06) : .zero)
                        .scaleEffect(slot.s)
                        .offset(x: slot.tx, y: slot.ty)
                        .zIndex(Double(3 - stackIndex))
                        .gesture(isTop ? dragGesture : nil)
                }
            }
            .frame(width: 321, height: 345)

            HStack(spacing: 8) {
                pillButton(title: "Need to Review",
                           accent: Color(hex: 0xF6A507),
                           bg:     Color(hex: 0xFFF6D9),
                           system: "xmark") { fling(direction: -1) }
                pillButton(title: "Mastered",
                           accent: Color(hex: 0x40C700),
                           bg:     Color(hex: 0xEAFFEA),
                           system: "checkmark") { fling(direction: +1) }
            }
            .frame(width: 321, height: 40)
        }
    }

    // MARK: 手势 —— 跟手平移
    private var dragGesture: some Gesture {
        DragGesture()
            .onChanged { dragOffset = $0.translation }
            .onEnded { value in
                if abs(value.translation.width) >= 60 {
                    advance()                  // 越过阈值 → 下一张
                } else {
                    withAnimation(.smooth(duration: 0.45)) {
                        dragOffset = .zero      // 弹回原位
                    }
                }
            }
    }

    // MARK: 按钮 —— 抛出 + 进入下一张
    private func fling(direction: CGFloat) {
        guard phase == .idle else { return }
        phase = .animating
        withAnimation(.easeIn(duration: 0.32)) {
            dragOffset = CGSize(width: direction * 480, height: 0)
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.32) {
            advance()
            phase = .idle
        }
    }

    private func advance() {
        var transaction = Transaction(animation: .smooth(duration: 0.58))
        transaction.disablesAnimations = false
        withTransaction(transaction) {
            order = [order[1], order[2], order[0]]
            dragOffset = .zero
        }
    }

    // MARK: 按钮样式
    private func pillButton(title: String, accent: Color, bg: Color,
                            system: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack(spacing: 4) {
                Image(systemName: system)
                Text(title)
            }
            .font(.system(size: 14, weight: .medium))
            .foregroundStyle(accent)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(bg, in: Capsule())
            .overlay(Capsule().stroke(accent, lineWidth: 1))
        }
        .buttonStyle(.plain)
    }
}`,
        uikit: `// UIKit — Flash Card 堆叠 + 抛掷式翻面
final class FlashCardStackView: UIView {
    private let cards: [UIView] = (0..<3).map { _ in UIView() }
    private var order = [0, 1, 2]
    private var isAnimating = false

    // 三个槽位（与 SwiftUI 版本一致）
    private let slots: [(tx: CGFloat, ty: CGFloat, s: CGFloat)] = [
        (0,   0,   1.000),
        (14,  66,  0.913),
        (28, 101,  0.826),
    ]

    func setupGestures() {
        let pan = UIPanGestureRecognizer(target: self, action: #selector(onPan(_:)))
        cards[0].addGestureRecognizer(pan)
    }

    // MARK: 拖拽跟手 + 阈值释放
    @objc private func onPan(_ g: UIPanGestureRecognizer) {
        guard let top = topCard else { return }
        let t = g.translation(in: self)

        switch g.state {
        case .changed:
            top.transform = CGAffineTransform(translationX: t.x, y: t.y * 0.4)
                .rotated(by: t.x * 0.06 * .pi / 180)

        case .ended, .cancelled:
            if abs(t.x) >= 60 {
                advance(animated: true)
            } else {
                UIView.animate(withDuration: 0.45,
                               delay: 0, usingSpringWithDamping: 0.85,
                               initialSpringVelocity: 0) {
                    top.transform = .identity
                }
            }
        default: break
        }
    }

    // MARK: 按钮 —— 抛出 + 进入下一张
    func fling(direction sign: CGFloat) {
        guard !isAnimating, let top = topCard else { return }
        isAnimating = true

        UIView.animate(withDuration: 0.32, delay: 0,
                       options: [.curveEaseIn]) {
            top.transform = CGAffineTransform(translationX: sign * 480, y: 0)
                .rotated(by: sign * 18 * .pi / 180)
        } completion: { _ in
            self.advance(animated: true)
            self.isAnimating = false
        }
    }

    // MARK: 推进顺序 + 让所有卡同步到新槽位
    private func advance(animated: Bool) {
        order = [order[1], order[2], order[0]]
        let updates = {
            for (stackIndex, cardIndex) in self.order.enumerated() {
                let view = self.cards[cardIndex]
                let slot = self.slots[stackIndex]
                view.transform = CGAffineTransform(translationX: slot.tx, y: slot.ty)
                    .scaledBy(x: slot.s, y: slot.s)
                view.layer.zPosition = CGFloat(3 - stackIndex)
            }
        }
        if animated {
            UIView.animate(withDuration: 0.58, delay: 0,
                           usingSpringWithDamping: 1.0,
                           initialSpringVelocity: 0,
                           animations: updates)
        } else {
            updates()
        }
    }

    private var topCard: UIView? { cards[order[0]] }
}`,
      },
    },
  ],
};
