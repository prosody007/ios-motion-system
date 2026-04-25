import type { CardsSection } from "@/types/motion";

export const staggerSection: CardsSection = {
  type: "cards",
  title: "Stagger 列表入场",
  description: "列表与内容的分段入场。",
  cards: [
    {
      title: "Stagger 延迟入场",
      tags: [
        { text: "50ms 间隔", variant: "duration" },
        { text: ".spring", variant: "spring" },
      ],
      previewId: "ios-stagger",
      codes: {
        swift: `// SwiftUI — ForEach stagger 入场
struct StaggerList: View {
    @State private var items = Array(0..<10)
    @State private var appeared = false

    var body: some View {
        ScrollView {
            LazyVStack(spacing: 12) {
                ForEach(Array(items.enumerated()), id: \\.offset) { index, item in
                    ItemRow(item: item)
                        .opacity(appeared ? 1 : 0)
                        .offset(y: appeared ? 0 : 20)
                        .animation(
                            .spring(response: 0.4, dampingFraction: 0.8)
                            .delay(Double(index) * 0.05),
                            value: appeared
                        )
                }
            }
            .padding()
        }
        .onAppear { appeared = true }
    }
}

// 也可用 .transition + .animation
ForEach(items) { item in
    ItemRow(item: item)
        .transition(
            .move(edge: .bottom)
            .combined(with: .opacity)
        )
        .animation(
            .spring.delay(Double(index) * 0.05),
            value: items
        )
}`,
        uikit: `// UIKit — stagger 延迟入场
class StaggerListVC: UIViewController {
    let stackView = UIStackView()

    func animateItemsIn() {
        let subviews = stackView.arrangedSubviews

        for view in subviews {
            view.alpha = 0
            view.transform = CGAffineTransform(translationX: 0, y: 20)
        }

        for (index, view) in subviews.enumerated() {
            UIView.animate(
                withDuration: 0.4,
                delay: Double(index) * 0.05,
                usingSpringWithDamping: 0.8,
                initialSpringVelocity: 0,
                options: [],
                animations: {
                    view.alpha = 1
                    view.transform = .identity
                }
            )
        }
    }
}
// 每个 item 延迟 50ms
// 总入场时长 ≈ 0.4s + count * 0.05s`,
      },
    },
  ],
};
