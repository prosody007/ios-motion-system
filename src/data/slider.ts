import type { CardsSection } from "@/types/motion";

export const sliderSection: CardsSection = {
  type: "cards",
  title: "Slider / Stepper",
  description: "Slider 与 Stepper 交互反馈。",
  cards: [
    {
      title: "Slider Drag",
      tags: [
        { text: "跟手", variant: "duration" },
        { text: ".selection", variant: "easing" },
      ],
      previewId: "ios-slider",
      code: `// React — TODO: replace with the React implementation that mirrors the preview.
@State private var value: Double = 0.5
let steps = stride(from: 0, through: 1, by: 0.25)

Slider(value: $value, in: 0...1, step: 0.25)
    .sensoryFeedback(.selection, trigger: value)
// 拖拽跟手，无额外动画
// 到达刻度时触发 .selection 触觉

// 自定义 Slider thumb 按下缩放：
@State private var isDragging = false

Circle()
    .frame(width: 28, height: 28)
    .scaleEffect(isDragging ? 1.15 : 1)
    .animation(.spring(duration: 0.2, bounce: 0.3), value: isDragging)
    .gesture(
        DragGesture(minimumDistance: 0)
            .onChanged { _ in isDragging = true }
            .onEnded { _ in isDragging = false }
    )`,
    },
    {
      title: "Stepper",
      tags: [
        { text: "长按加速", variant: "duration" },
      ],
      previewId: "ios-stepper",
      code: `// React — TODO: replace with the React implementation that mirrors the preview.
@State private var count = 1
let range = 0...99

HStack(spacing: 16) {
    Button { count = max(count - 1, range.lowerBound) } label: {
        Image(systemName: "minus")
            .frame(width: 36, height: 36)
            .background(Color(.systemGray6), in: .rect(cornerRadius: 12))
    }
    .disabled(count <= range.lowerBound)
    .opacity(count <= range.lowerBound ? 0.35 : 1)

    Text("\\(count)")
        .font(.title2.weight(.semibold))
        .monospacedDigit()
        .frame(minWidth: 44)

    Button { count = min(count + 1, range.upperBound) } label: {
        Image(systemName: "plus")
            .frame(width: 36, height: 36)
            .background(Color(.systemGray6), in: .rect(cornerRadius: 12))
    }
    .disabled(count >= range.upperBound)
    .opacity(count >= range.upperBound ? 0.35 : 1)
}
// 系统 Stepper 默认支持长按自动加速（autorepeat）
// 首次 420ms 延迟后开始重复，间隔从 140ms 递减到 40ms`,
    },
  ],
};
