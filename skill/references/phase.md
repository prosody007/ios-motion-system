# Phase · 阶段动画

阶段状态动画与序列过渡。

## PhaseAnimator (iOS 17+)

- Preview ID：`ios-phase`
- Tags：`iOS 17+` (easing) · `序列状态` (spring)

### SwiftUI

```swift
// SwiftUI — PhaseAnimator (iOS 17+)
struct PhaseAnimationDemo: View {
    enum AnimationPhase: CaseIterable {
        case initial
        case scaleUp
        case rotateAndFade
    }

    var body: some View {
        PhaseAnimator(AnimationPhase.allCases) { phase in
            Image(systemName: "heart.fill")
                .font(.system(size: 64))
                .foregroundStyle(.pink)
                .scaleEffect(phase == .scaleUp ? 1.4 : 1.0)
                .rotationEffect(
                    phase == .rotateAndFade ? .degrees(15) : .zero
                )
                .opacity(phase == .rotateAndFade ? 0.6 : 1.0)
        } animation: { phase in
            switch phase {
            case .initial:
                .bouncy(duration: 0.4)
            case .scaleUp:
                .spring(response: 0.3, dampingFraction: 0.6)
            case .rotateAndFade:
                .easeInOut(duration: 0.3)
            }
        }
    }
}

// 带触发器的 PhaseAnimator
struct TriggeredPhaseDemo: View {
    @State private var trigger = false

    var body: some View {
        VStack(spacing: 40) {
            PhaseAnimator(
                [false, true, false],
                trigger: trigger
            ) { phase in
                Circle()
                    .fill(.blue.gradient)
                    .frame(width: 80, height: 80)
                    .scaleEffect(phase ? 1.3 : 1.0)
                    .shadow(
                        color: .blue.opacity(phase ? 0.5 : 0),
                        radius: phase ? 20 : 0
                    )
            } animation: { _ in
                .bouncy(duration: 0.5)
            }

            Button("触发") {
                trigger.toggle()
            }
        }
    }
}
```

### UIKit

```swift
// UIKit — 模拟 Phase 动画序列
class PhaseAnimationViewController: UIViewController {
    private var heartView: UIImageView!
    private var currentPhase = 0
    private let phases = 3

    override func viewDidLoad() {
        super.viewDidLoad()
        heartView = UIImageView(
            image: UIImage(systemName: "heart.fill")?
                .withTintColor(.systemPink, renderingMode: .alwaysOriginal)
        )
        heartView.frame = CGRect(x: 0, y: 0, width: 64, height: 64)
        heartView.center = view.center
        view.addSubview(heartView)
    }

    func startPhaseLoop() {
        animatePhase(0)
    }

    private func animatePhase(_ phase: Int) {
        let nextPhase = (phase + 1) % phases

        switch phase {
        case 0: // initial
            UIView.animate(
                withDuration: 0.4,
                delay: 0,
                usingSpringWithDamping: 0.6,
                initialSpringVelocity: 0.5
            ) {
                self.heartView.transform = .identity
                self.heartView.alpha = 1.0
            } completion: { _ in
                self.animatePhase(nextPhase)
            }

        case 1: // scaleUp
            UIView.animate(
                withDuration: 0.3,
                delay: 0,
                usingSpringWithDamping: 0.6,
                initialSpringVelocity: 0
            ) {
                self.heartView.transform = CGAffineTransform(scaleX: 1.4, y: 1.4)
            } completion: { _ in
                self.animatePhase(nextPhase)
            }

        case 2: // rotateAndFade
            UIView.animate(
                withDuration: 0.3,
                delay: 0,
                options: .curveEaseInOut
            ) {
                self.heartView.transform = CGAffineTransform(rotationAngle: .pi / 12)
                    .scaledBy(x: 1.0, y: 1.0)
                self.heartView.alpha = 0.6
            } completion: { _ in
                self.animatePhase(nextPhase)
            }

        default:
            break
        }
    }
}
```

