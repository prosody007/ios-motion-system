import type { CardsSection } from "@/types/motion";

export const tooltipSection: CardsSection = {
  type: "cards",
  title: "Tooltip",
  description: "提示层与 Popover 过渡。",
  cards: [
    {
      title: "Popover",
      tags: [
        { text: "0.25s", variant: "duration" },
        { text: ".spring", variant: "spring" },
      ],
      previewId: "ios-tooltip",
      code: `// React — TODO: replace with the React implementation that mirrors the preview.
struct PopoverDemo: View {
    @State private var showPopover = false

    var body: some View {
        Button("显示 Popover") {
            showPopover = true
        }
        .popover(isPresented: $showPopover) {
            VStack(spacing: 12) {
                Text("提示信息")
                    .font(.headline)
                Text("这是一个 Popover 弹出内容")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
            .padding()
            .presentationCompactAdaptation(.popover)
        }
    }
}
// 系统 popover 动画: scale + opacity, ~0.25s spring

// 自定义 Tooltip
struct TooltipView: View {
    @State private var showTooltip = false

    var body: some View {
        Text("长按查看提示")
            .onLongPressGesture {
                withAnimation(
                    .spring(response: 0.25, dampingFraction: 0.8)
                ) {
                    showTooltip = true
                }
            }
            .overlay(alignment: .top) {
                if showTooltip {
                    TooltipBubble(text: "这是提示内容")
                        .offset(y: -50)
                        .transition(
                            .scale(scale: 0.8, anchor: .bottom)
                            .combined(with: .opacity)
                        )
                }
            }
    }
}

struct TooltipBubble: View {
    let text: String

    var body: some View {
        Text(text)
            .font(.caption)
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(Color(.systemGray6))
            .clipShape(RoundedRectangle(cornerRadius: 8))
            .shadow(radius: 4)
    }
}`,
    },
  ],
};
