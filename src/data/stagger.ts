import type { CardsSection } from "@/types/motion";

export const staggerSection: CardsSection = {
  type: "cards",
  title: "Stagger",
  description: "列表与内容的分段入场。",
  cards: [
    {
      title: "Stagger Entry",
      tags: [
        { text: "50ms 间隔", variant: "duration" },
        { text: ".spring", variant: "spring" },
      ],
      previewId: "ios-stagger",
      code: `// React — TODO: replace with the React implementation that mirrors the preview.
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
    },
  ],
};
