import type { CardsSection } from "@/types/motion";

export const swipeCardsSection: CardsSection = {
  type: "cards",
  title: "Swipe Cards",
  description: "卡片堆栈与滑动切换。",
  cards: [
    {
      title: "Swipe Card Stack",
      tags: [
        { text: "0.4s", variant: "duration" },
        { text: ".interactiveSpring", variant: "spring" },
      ],
      previewId: "ios-swipe-cards",
      code: `// React — TODO: replace with the React implementation that mirrors the preview.
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
    },
  ],
};
