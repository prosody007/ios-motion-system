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
      codes: {
        swift: `// SwiftUI — KeyframeAnimator (iOS 17+)
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
        uikit: `// UIKit — CAKeyframeAnimation 多属性
class KeyframeViewController: UIViewController {
    private var starView: UIImageView!

    override func viewDidLoad() {
        super.viewDidLoad()
        starView = UIImageView(
            image: UIImage(systemName: "star.fill")?
                .withTintColor(.systemYellow, renderingMode: .alwaysOriginal)
        )
        starView.frame = CGRect(x: 0, y: 0, width: 64, height: 64)
        starView.center = view.center
        view.addSubview(starView)
    }

    func playKeyframeAnimation() {
        // Scale keyframes
        let scaleAnim = CAKeyframeAnimation(keyPath: "transform.scale")
        scaleAnim.values = [1.0, 1.5, 0.8, 1.0]
        scaleAnim.keyTimes = [0, 0.3, 0.5, 1.0]
        scaleAnim.timingFunctions = [
            CAMediaTimingFunction(name: .easeOut),
            CAMediaTimingFunction(name: .easeInEaseOut),
            CAMediaTimingFunction(name: .easeOut),
        ]

        // Rotation keyframes
        let rotationAnim = CAKeyframeAnimation(keyPath: "transform.rotation.z")
        rotationAnim.values = [0, Double.pi * 2]
        rotationAnim.keyTimes = [0, 1.0]

        // Position keyframes
        let positionAnim = CAKeyframeAnimation(keyPath: "position.y")
        let centerY = starView.center.y
        positionAnim.values = [centerY, centerY - 30, centerY, centerY - 15, centerY]
        positionAnim.keyTimes = [0, 0.2, 0.5, 0.7, 1.0]

        let group = CAAnimationGroup()
        group.animations = [scaleAnim, rotationAnim, positionAnim]
        group.duration = 0.8
        group.fillMode = .forwards
        group.isRemovedOnCompletion = true

        starView.layer.add(group, forKey: "keyframeGroup")
    }
}`,
      },
    },
  ],
};
