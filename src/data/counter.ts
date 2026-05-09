import type { CardsSection } from "@/types/motion";

export const counterSection: CardsSection = {
  type: "cards",
  title: "Counter",
  description: "数字过渡与计数变化效果。",
  cards: [
    {
      title: "ContentTransition Counter",
      tags: [
        { text: "0.3s", variant: "duration" },
        { text: ".snappy", variant: "spring" },
      ],
      previewId: "ios-counter-text",
      code: `// React — TODO: replace with the React implementation that mirrors the preview.
struct NumericCounterView: View {
    @State private var count = 0

    var body: some View {
        VStack(spacing: 20) {
            Text("\\(count)")
                .font(.system(size: 64, weight: .bold, design: .rounded))
                .monospacedDigit()
                .contentTransition(.numericText())

            Button("增加") {
                withAnimation(.snappy) {
                    count += 1
                }
            }
        }
    }
}`,
    },
    {
      title: "Custom Counter",
      tags: [
        { text: "1.0s", variant: "duration" },
        { text: "easeOutCubic", variant: "easing" },
      ],
      previewId: "ios-counter-custom",
      code: `// React — TODO: replace with the React implementation that mirrors the preview.
struct CustomCounterView: View {
    @State private var targetValue: Double = 0
    @State private var displayValue: Double = 0
    @State private var animationStart: Date = .now

    let duration: Double = 1.0

    var body: some View {
        TimelineView(.animation) { context in
            let elapsed = context.date.timeIntervalSince(animationStart)
            let progress = min(elapsed / duration, 1.0)
            let eased = 1.0 - pow(1.0 - progress, 3) // easeOutCubic

            let current = displayValue + (targetValue - displayValue) * eased

            Text("\\(Int(current))")
                .font(.system(size: 64, weight: .bold, design: .rounded))
                .monospacedDigit()
        }

        Button("设为 1000") {
            displayValue = targetValue
            targetValue = 1000
            animationStart = .now
        }
    }
}`,
    },
  ],
};
