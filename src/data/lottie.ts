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
      codes: {
        swift: `// SwiftUI — LottieView (lottie-ios 4.x)
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
        uikit: `// UIKit — LottieAnimationView (lottie-ios 4.x)
import Lottie

class LottieViewController: UIViewController {
    private var animationView: LottieAnimationView!

    override func viewDidLoad() {
        super.viewDidLoad()

        animationView = LottieAnimationView(name: "confetti")
        animationView.contentMode = .scaleAspectFit
        animationView.loopMode = .loop
        animationView.animationSpeed = 1.5
        animationView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(animationView)

        NSLayoutConstraint.activate([
            animationView.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            animationView.centerYAnchor.constraint(equalTo: view.centerYAnchor),
            animationView.widthAnchor.constraint(equalToConstant: 200),
            animationView.heightAnchor.constraint(equalToConstant: 200),
        ])

        animationView.play()
    }

    func playToMarker(named marker: String) {
        animationView.play(
            fromProgress: 0,
            toProgress: 1,
            loopMode: .playOnce
        ) { finished in
            print("Animation finished: \\(finished)")
        }
    }

    func setSpeed(_ speed: CGFloat) {
        animationView.animationSpeed = speed
    }

    func pauseAnimation() {
        animationView.pause()
    }
}`,
      },
    },
  ],
};
