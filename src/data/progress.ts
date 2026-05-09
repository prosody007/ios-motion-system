import type { CardsSection } from "@/types/motion";

export const progressSection: CardsSection = {
  type: "cards",
  title: "Progress",
  description: "线性与环形进度反馈。",
  cards: [
    {
      title: "Linear Progress Bar",
      tags: [
        { text: "0.3s", variant: "duration" },
        { text: ".snappy", variant: "spring" },
      ],
      previewId: "ios-progress-bar",
      code: `// React — TODO: replace with the React implementation that mirrors the preview.
struct ProgressBarView: View {
    @State private var progress: Double = 0.0

    var body: some View {
        VStack(spacing: 20) {
            ProgressView(value: progress)
                .progressViewStyle(.linear)
                .tint(.accentColor)

            // 自定义进度条
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: 4)
                        .fill(Color(.systemGray5))

                    RoundedRectangle(cornerRadius: 4)
                        .fill(Color.accentColor)
                        .frame(
                            width: geo.size.width * progress
                        )
                }
            }
            .frame(height: 8)
        }
    }

    func updateProgress(to value: Double) {
        withAnimation(.snappy(duration: 0.3)) {
            progress = value
        }
    }
}
// .snappy(duration: 0.3) — 无回弹, 快速到位`,
    },
    {
      title: "Circular Progress Ring",
      tags: [
        { text: "1.0s", variant: "duration" },
        { text: ".easeOut", variant: "easing" },
      ],
      previewId: "ios-progress-ring",
      code: `// React — TODO: replace with the React implementation that mirrors the preview.
struct ProgressRingView: View {
    @State private var progress: Double = 0.0
    let lineWidth: CGFloat = 8

    var body: some View {
        ZStack {
            // 背景环
            Circle()
                .stroke(
                    Color(.systemGray5),
                    lineWidth: lineWidth
                )

            // 进度环
            Circle()
                .trim(from: 0, to: progress)
                .stroke(
                    Color.accentColor,
                    style: StrokeStyle(
                        lineWidth: lineWidth,
                        lineCap: .round
                    )
                )
                .rotationEffect(.degrees(-90))
                .animation(
                    .easeOut(duration: 1.0),
                    value: progress
                )

            Text("\\(Int(progress * 100))%")
                .font(.system(.title2, design: .rounded))
                .fontWeight(.semibold)
        }
        .frame(width: 120, height: 120)
    }

    func setProgress(_ value: Double) {
        progress = value
    }
}`,
    },
  ],
};
