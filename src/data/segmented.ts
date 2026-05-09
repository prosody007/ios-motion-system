import type { CardsSection } from "@/types/motion";

export const segmentedSection: CardsSection = {
  type: "cards",
  title: "Segmented Control",
  description: "分段控件切换与指示器运动。",
  cards: [
    {
      title: "Segmented Control",
      tags: [
        { text: "0.34s", variant: "duration" },
        { text: ".snappy", variant: "spring" },
      ],
      previewId: "ios-segmented",
      code: `// React — TODO: replace with the React implementation that mirrors the preview.
@State private var selection = 0

Picker("Mode", selection: $selection) {
    Text("Daily").tag(0)
    Text("Weekly").tag(1)
    Text("Monthly").tag(2)
}
.pickerStyle(.segmented)
// 系统内部使用 ~0.34s snappy 曲线

// 自定义滑动指示器（文字样式保持不变）：
@Namespace private var ns
@State private var active = 0
let items = ["Daily", "Weekly", "Monthly"]

HStack(spacing: 0) {
    ForEach(Array(items.enumerated()), id: \\.offset) { i, item in
        Text(item)
            .font(.footnote.weight(.medium))
            .foregroundStyle(.primary)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 6)
            .background {
                if active == i {
                    Capsule()
                        .fill(.white)
                        .matchedGeometryEffect(id: "seg", in: ns)
                        .shadow(color: .black.opacity(0.12), radius: 2, y: 1)
                }
            }
            .contentShape(Rectangle())
            .onTapGesture {
                withAnimation(.snappy(duration: 0.34)) { active = i }
            }
    }
}
.padding(2)
.background(Color(.systemFill), in: Capsule())`,
    },
  ],
};
