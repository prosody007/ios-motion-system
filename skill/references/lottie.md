# Lottie

Lottie 动画集成与播放。

## Lottie Integration

- Preview ID：`ios-lottie`
- Tags：`lottie-ios` (easing) · `自定义 speed` (duration)

### AI Motion Spec

Lottie 集成重点在于播放、暂停、循环和状态触发的准确性。

#### Trigger & State

| Key | Value |
|---|---|
| trigger | playback starts on appear or explicit action |
| states | idle / playing / paused / completed |

#### Motion

| Key | Value |
|---|---|
| asset_rule | use provided lottie asset, not a hand-rebuilt approximation |

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
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
}
```

