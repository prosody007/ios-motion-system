import type { CardsSection } from "@/types/motion";

export const reorderSection: CardsSection = {
  type: "cards",
  title: "Reorder",
  description: "列表重排与拖拽占位反馈。",
  cards: [
    {
      title: "List Reorder",
      tags: [
        { text: "0.35s", variant: "duration" },
        { text: ".snappy", variant: "spring" },
      ],
      previewId: "ios-reorder",
      code: `// React — TODO: replace with the React implementation that mirrors the preview.
struct ReorderableList: View {
    @State private var items = ["项目 A", "项目 B", "项目 C", "项目 D"]

    var body: some View {
        List {
            ForEach(items, id: \\.self) { item in
                Text(item)
                    .padding(.vertical, 8)
            }
            .onMove { from, to in
                withAnimation(.snappy(duration: 0.35)) {
                    items.move(fromOffsets: from, toOffset: to)
                }
            }
        }
        .environment(\\.editMode, .constant(.active))
    }
}
// .snappy = .spring(duration: 0.35, bounce: 0.0)
// 系统拖拽时自动应用 spring 动画到占位符和周围行`,
    },
  ],
};
