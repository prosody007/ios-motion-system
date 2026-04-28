import type { CardsSection } from "@/types/motion";

export const swipeDismissSection: CardsSection = {
  type: "cards",
  title: "Swipe to Dismiss",
  description: "滑动关闭与回弹反馈。",
  cards: [
    {
      title: "Swipe to Dismiss",
      tags: [
        { text: "0.35s", variant: "duration" },
        { text: ".interactiveSpring", variant: "spring" },
      ],
      previewId: "ios-swipe-dismiss",
      codes: {
        swift: `// SwiftUI — Vertical Swipe to Dismiss
struct SwipeDismissView: View {
    @Environment(\\.dismiss) private var dismiss
    @State private var offsetY: CGFloat = 0

    var body: some View {
        VStack {
            RoundedRectangle(cornerRadius: 2.5)
                .fill(.secondary)
                .frame(width: 36, height: 5)
                .padding(.top, 8)
            Spacer()
            Text("内容区域")
            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(.regularMaterial)
        .cornerRadius(16)
        .offset(y: offsetY)
        .gesture(
            DragGesture()
                .onChanged { value in
                    if value.translation.height > 0 {
                        offsetY = value.translation.height
                    }
                }
                .onEnded { value in
                    if value.translation.height > 100 {
                        withAnimation(
                            .spring(response: 0.35, dampingFraction: 0.86)
                        ) {
                            offsetY = UIScreen.main.bounds.height
                        }
                        DispatchQueue.main.asyncAfter(deadline: .now() + 0.35) {
                            dismiss()
                        }
                    } else {
                        withAnimation(
                            .interactiveSpring(
                                response: 0.35,
                                dampingFraction: 0.86
                            )
                        ) {
                            offsetY = 0
                        }
                    }
                }
        )
    }
}`,
        uikit: `// UIKit — Interactive Swipe Dismiss
class SwipeDismissController: UIViewController {
    private var panStartY: CGFloat = 0

    override func viewDidLoad() {
        super.viewDidLoad()
        let pan = UIPanGestureRecognizer(
            target: self,
            action: #selector(handlePan)
        )
        view.addGestureRecognizer(pan)
    }

    @objc private func handlePan(_ gesture: UIPanGestureRecognizer) {
        let translation = gesture.translation(in: view)

        switch gesture.state {
        case .changed:
            if translation.y > 0 {
                view.transform = CGAffineTransform(
                    translationX: 0,
                    y: translation.y
                )
            }
        case .ended:
            if translation.y > 100 {
                let springTiming = UISpringTimingParameters(
                    dampingRatio: 0.86,
                    initialVelocity: CGVector(dx: 0, dy: 8)
                )
                let animator = UIViewPropertyAnimator(
                    duration: 0.35,
                    timingParameters: springTiming
                )
                animator.addAnimations {
                    self.view.transform = CGAffineTransform(
                        translationX: 0,
                        y: self.view.bounds.height
                    )
                }
                animator.addCompletion { _ in
                    self.dismiss(animated: false)
                }
                animator.startAnimation()
            } else {
                let springTiming = UISpringTimingParameters(
                    dampingRatio: 0.86,
                    initialVelocity: .zero
                )
                let animator = UIViewPropertyAnimator(
                    duration: 0.35,
                    timingParameters: springTiming
                )
                animator.addAnimations {
                    self.view.transform = .identity
                }
                animator.startAnimation()
            }
        default:
            break
        }
    }
}`,
      },
    },
  ],
};
