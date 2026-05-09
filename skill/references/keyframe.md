# Keyframes

关键帧动画与多属性编排。

## KeyframeAnimator (iOS 17+)

- Preview ID：`ios-keyframe`
- Tags：`iOS 17+` (easing) · `多属性` (spring)

### AI Motion Spec

关键帧动画由多个阶段组成，每个阶段定义明确属性目标。

#### Trigger & State

| Key | Value |
|---|---|
| trigger | tap or state change starts timeline |

#### Motion

| Key | Value |
|---|---|
| timeline | animation split into ordered keyframe segments |
| properties | different properties can peak at different times |

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
struct KeyframeAnimationDemo: View {
    @State private var isAnimating = false

    struct AnimationValues {
        var scale: Double = 1.0
        var rotation: Angle = .zero
        var offsetY: Double = 0
    }

    var body: some View {
        VStack(spacing: 40) {
            KeyframeAnimator(
                initialValue: AnimationValues(),
                trigger: isAnimating
            ) { values in
                Image(systemName: "star.fill")
                    .font(.system(size: 64))
                    .foregroundStyle(.yellow)
                    .scaleEffect(values.scale)
                    .rotationEffect(values.rotation)
                    .offset(y: values.offsetY)
            } keyframes: { _ in
                KeyframeTrack(\.scale) {
                    SpringKeyframe(1.5, duration: 0.3, spring: .bouncy)
                    CubicKeyframe(0.8, duration: 0.2)
                    SpringKeyframe(1.0, duration: 0.3, spring: .bouncy)
                }

                KeyframeTrack(\.rotation) {
                    LinearKeyframe(.degrees(0), duration: 0.1)
                    SpringKeyframe(.degrees(360), duration: 0.6, spring: .smooth)
                }

                KeyframeTrack(\.offsetY) {
                    SpringKeyframe(-30, duration: 0.2, spring: .snappy)
                    MoveKeyframe(0)
                    CubicKeyframe(-15, duration: 0.2)
                    SpringKeyframe(0, duration: 0.3, spring: .bouncy)
                }
            }

            Button("播放动画") {
                isAnimating.toggle()
            }
        }
    }
}
```

