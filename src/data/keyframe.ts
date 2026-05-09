import type { CardsSection } from "@/types/motion";

export const keyframeSection: CardsSection = {
  type: "cards",
  title: "Keyframes",
  description: "关键帧动画与多属性编排。",
  cards: [
    {
      title: "KeyframeAnimator (iOS 17+)",
      tags: [
        { text: "iOS 17+", variant: "easing" },
        { text: "多属性", variant: "spring" },
      ],
      previewId: "ios-keyframe",
      code: `// React — TODO: replace with the React implementation that mirrors the preview.
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
                KeyframeTrack(\\.scale) {
                    SpringKeyframe(1.5, duration: 0.3, spring: .bouncy)
                    CubicKeyframe(0.8, duration: 0.2)
                    SpringKeyframe(1.0, duration: 0.3, spring: .bouncy)
                }

                KeyframeTrack(\\.rotation) {
                    LinearKeyframe(.degrees(0), duration: 0.1)
                    SpringKeyframe(.degrees(360), duration: 0.6, spring: .smooth)
                }

                KeyframeTrack(\\.offsetY) {
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
}`,
    },
  ],
};
