import type { CardsSection } from "@/types/motion";

export const expandableSection: CardsSection = {
  type: "cards",
  title: "Expandable",
  description: "内容展开与折叠过渡。",
  cards: [
    {
      title: "Expandable Content",
      tags: [
        { text: "0.3s", variant: "duration" },
        { text: ".snappy", variant: "spring" },
      ],
      previewId: "ios-expandable",
      code: `// React — TODO: replace with the React implementation that mirrors the preview.
struct ExpandableView: View {
    @State private var isExpanded = false

    var body: some View {
        DisclosureGroup("详细信息", isExpanded: $isExpanded) {
            VStack(alignment: .leading, spacing: 8) {
                Text("展开内容行 1")
                Text("展开内容行 2")
                Text("展开内容行 3")
            }
            .padding(.top, 8)
        }
        .animation(.snappy(duration: 0.3), value: isExpanded)
        .padding()
    }
}

// 自定义展开/折叠
struct CustomExpandable: View {
    @State private var showContent = false

    var body: some View {
        VStack(spacing: 0) {
            Button {
                withAnimation(.snappy(duration: 0.3)) {
                    showContent.toggle()
                }
            } label: {
                HStack {
                    Text("展开更多")
                    Image(systemName: "chevron.down")
                        .rotationEffect(.degrees(showContent ? 180 : 0))
                }
            }

            if showContent {
                DetailContent()
                    .transition(.opacity.combined(with: .move(edge: .top)))
            }
        }
        .clipped()
    }
}`,
    },
  ],
};
