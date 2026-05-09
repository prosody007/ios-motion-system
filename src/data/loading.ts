import type { CardsSection } from "@/types/motion";

export const loadingSection: CardsSection = {
  type: "cards",
  title: "Loading",
  description: "加载指示与等待反馈。",
  cards: [
    {
      title: "Activity Indicator",
      tags: [{ text: "1.0s", variant: "duration" }, { text: "linear repeat", variant: "easing" }],
      previewId: "ios-loading-spinner",
      code: `// React — TODO: replace with the React implementation that mirrors the preview.
ProgressView()
    .progressViewStyle(.circular)
    .tint(.white)
    .scaleEffect(1.5)

// 自定义 Spinner:
struct SpinnerView: View {
    @State private var rotation: Double = 0

    var body: some View {
        Circle()
            .trim(from: 0.2, to: 1.0)
            .stroke(style: StrokeStyle(lineWidth: 3, lineCap: .round))
            .frame(width: 30, height: 30)
            .rotationEffect(.degrees(rotation))
        .frame(width: 30, height: 30)
        .onAppear {
            withAnimation(
                .linear(duration: 1.0).repeatForever(autoreverses: false)
            ) {
                rotation = 360
            }
        }
    }
}
// duration 1.0s, linear, infinite repeat`,
    },
    {
      title: "Grow Ring",
      tags: [{ text: "3.0s", variant: "duration" }, { text: "grow 0→1", variant: "easing" }],
      previewId: "ios-loading-grow",
      code: `// React — TODO: replace with the React implementation that mirrors the preview.
struct GrowRingView: View {
    @State private var progress: CGFloat = 0
    @State private var completed = false

    var body: some View {
        VStack(spacing: 12) {
            ZStack {
                Circle()
                    .stroke(Color.black.opacity(0.10), lineWidth: 3)

                Circle()
                    .trim(from: 0, to: progress)
                    .stroke(style: StrokeStyle(lineWidth: 3, lineCap: .round))
                    .rotationEffect(.degrees(-90))
            }
            .frame(width: 30, height: 30)

            if completed {
                Button("Reset") {
                    progress = 0
                    completed = false
                    play()
                }
            }
        }
        .onAppear {
            play()
        }
    }

    private func play() {
        withAnimation(.timingCurve(0.32, 0.72, 0, 1, duration: 3.0)) {
            progress = 1
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) {
            completed = true
        }
    }
}
// 灰色底环保持不变；深色弧线 3 秒长到 1 后停住`,
    },
    {
      title: "Recording Bars",
      tags: [{ text: "1.0s", variant: "duration" }, { text: "center wave", variant: "easing" }],
      previewId: "ios-loading-recording-bars",
      code: `// React — 录音条加载指示（接近 Figma 稿）
const bars = [
  { x: 2, y: 9, width: 2, height: 6, minScale: 0.45, delay: -0.42 },
  { x: 6.5, y: 6, width: 2, height: 12, minScale: 0.5, delay: -0.28 },
  { x: 11, y: 2.5, width: 2, height: 19, minScale: 0.55, delay: -0.14 },
  { x: 15.5, y: 6, width: 2, height: 12, minScale: 0.5, delay: 0 },
  { x: 20, y: 9, width: 2, height: 6, minScale: 0.45, delay: 0.14 },
];

// 关键：transform-origin 用 center center，避免底边始终平齐
// 每根柱设置不同 delay，形成录音感波动
// duration: 1.0s, ease-in-out, infinite`,
    },
  ],
};
