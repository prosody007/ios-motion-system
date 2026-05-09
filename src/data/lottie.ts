import type { CardsSection } from "@/types/motion";

export const lottieSection: CardsSection = {
  type: "cards",
  title: "Lottie",
  description: "Lottie 动画集成与播放。",
  cards: [
    {
      title: "Lottie Integration",
      tags: [
        { text: "lottie-ios", variant: "easing" },
        { text: "自定义 speed", variant: "duration" },
      ],
      previewId: "ios-lottie",
      code: `// React — TODO: replace with the React implementation that mirrors the preview.
import Lottie

struct LottieDemo: View {
    var body: some View {
        VStack(spacing: 24) {
            // 基本播放
            LottieView(animation: .named("confetti"))
                .playbackMode(.playing(.toProgress(1, loopMode: .loop)))
                .animationSpeed(1.5)
                .frame(width: 200, height: 200)

            // 播放到指定进度
            LottieView(animation: .named("checkmark"))
                .playbackMode(.playing(.toProgress(1, loopMode: .playOnce)))
                .animationSpeed(1.0)
                .frame(width: 120, height: 120)
        }
    }
}

// 带控制的 Lottie
struct LottieControlledView: View {
    @State private var playbackMode: LottiePlaybackMode = .paused

    var body: some View {
        VStack {
            LottieView(animation: .named("loading"))
                .playbackMode(playbackMode)
                .animationSpeed(1.5)
                .frame(width: 160, height: 160)

            HStack(spacing: 16) {
                Button("播放") {
                    playbackMode = .playing(
                        .toProgress(1, loopMode: .loop)
                    )
                }
                Button("暂停") {
                    playbackMode = .paused
                }
            }
        }
    }
}`,
    },
  ],
};
