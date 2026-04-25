import type { CardsSection } from "@/types/motion";

export const swipeCardsSection: CardsSection = {
  type: "cards",
  title: "滑动切换卡片",
  description: "Tinder 风格卡片堆栈，左右滑动切换，带旋转和缩放层次感。",
  cards: [
    {
      title: "Swipe Card Stack",
      tags: [
        { text: "0.4s", variant: "duration" },
        { text: ".interactiveSpring", variant: "spring" },
      ],
      previewId: "ios-swipe-cards",
      codes: {
        swift: `// SwiftUI — 滑动切换卡片堆栈
struct CardStack<Content: View>: View {
    @State private var offset: CGSize = .zero
    @State private var currentIndex = 0
    let cards: [Content]

    var body: some View {
        ZStack {
            ForEach(cards.indices.reversed(), id: \\.self) { index in
                let relativeIndex = index - currentIndex
                if relativeIndex >= 0 && relativeIndex < 3 {
                    cards[index]
                        .frame(width: 300, height: 400)
                        .clipShape(RoundedRectangle(cornerRadius: 20))
                        .shadow(radius: 5)
                        // 堆叠缩放 + 偏移
                        .scaleEffect(1 - CGFloat(relativeIndex) * 0.05)
                        .offset(y: CGFloat(relativeIndex) * 8)
                        // 顶部卡片跟手
                        .offset(relativeIndex == 0 ? offset : .zero)
                        .rotationEffect(
                            relativeIndex == 0
                                ? .degrees(Double(offset.width) / 20)
                                : .zero
                        )
                        .gesture(
                            relativeIndex == 0
                                ? DragGesture()
                                    .onChanged { offset = $0.translation }
                                    .onEnded { value in
                                        if abs(value.translation.width) > 120 {
                                            // 滑出
                                            withAnimation(.interactiveSpring(
                                                response: 0.4,
                                                dampingFraction: 0.86
                                            )) {
                                                offset = CGSize(
                                                    width: value.translation.width > 0 ? 500 : -500,
                                                    height: 0
                                                )
                                            }
                                            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                                                currentIndex += 1
                                                offset = .zero
                                            }
                                        } else {
                                            // 回弹
                                            withAnimation(.interactiveSpring(
                                                response: 0.35,
                                                dampingFraction: 0.86
                                            )) {
                                                offset = .zero
                                            }
                                        }
                                    }
                                : nil
                        )
                        .animation(
                            .spring(response: 0.4, dampingFraction: 0.8),
                            value: currentIndex
                        )
                }
            }
        }
    }
}

// 关键动画参数：
// 拖拽中: 直接跟手（无动画）
// 释放回弹: .interactiveSpring(response: 0.35, dampingFraction: 0.86)
// 滑出: .interactiveSpring(response: 0.4, dampingFraction: 0.86)
// 底层卡片上移: .spring(response: 0.4, dampingFraction: 0.8)
// 旋转: offset.width / 20 度`,
        uikit: `// UIKit — 滑动切换卡片堆栈
class CardStackView: UIView {
    private var cards: [UIView] = []
    private var currentIndex = 0

    func setupCards() {
        // 从后往前添加，保证顶部卡片在最前
        for (i, card) in cards.enumerated().reversed() {
            addSubview(card)
            let scale = 1.0 - CGFloat(i) * 0.05
            let offsetY = CGFloat(i) * 8
            card.transform = CGAffineTransform(scaleX: scale, y: scale)
                .translatedBy(x: 0, y: offsetY)

            if i == 0 {
                let pan = UIPanGestureRecognizer(
                    target: self,
                    action: #selector(handlePan)
                )
                card.addGestureRecognizer(pan)
            }
        }
    }

    @objc private func handlePan(_ gesture: UIPanGestureRecognizer) {
        guard let card = gesture.view else { return }
        let translation = gesture.translation(in: self)

        switch gesture.state {
        case .changed:
            // 跟手 + 旋转
            let rotation = translation.x / 20 * .pi / 180
            card.transform = CGAffineTransform(translationX: translation.x, y: translation.y)
                .rotated(by: rotation)

        case .ended:
            let velocity = gesture.velocity(in: self)

            if abs(translation.x) > 120 {
                // 滑出
                let direction: CGFloat = translation.x > 0 ? 1 : -1
                UIView.animate(
                    withDuration: 0.4,
                    delay: 0,
                    usingSpringWithDamping: 0.86,
                    initialSpringVelocity: abs(velocity.x) / 500,
                    animations: {
                        card.transform = CGAffineTransform(
                            translationX: direction * 500, y: 0
                        )
                        card.alpha = 0
                    },
                    completion: { _ in
                        card.removeFromSuperview()
                        self.promoteNextCard()
                    }
                )
            } else {
                // 回弹
                UIView.animate(
                    withDuration: 0.35,
                    delay: 0,
                    usingSpringWithDamping: 0.86,
                    initialSpringVelocity: 0,
                    animations: {
                        card.transform = .identity
                    }
                )
            }

        default: break
        }
    }

    private func promoteNextCard() {
        // 底层卡片 spring 上移
        UIView.animate(
            withDuration: 0.4,
            delay: 0,
            usingSpringWithDamping: 0.8,
            initialSpringVelocity: 0,
            animations: {
                // 更新各层 scale 和 offset
            }
        )
    }
}`,
      },
    },
  ],
};
