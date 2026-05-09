import type { CardsSection } from "@/types/motion";

export const phaseSection: CardsSection = {
  type: "cards",
  title: "Phase Animator",
  description: "阶段状态动画与序列过渡。",
  cards: [
    {
      title: "PhaseAnimator (iOS 17+)",
      tags: [
        { text: "iOS 17+", variant: "easing" },
        { text: "序列状态", variant: "spring" },
      ],
      previewId: "ios-phase",
      code: `// React — TODO: replace with the React implementation that mirrors the preview.
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
}`,
    },
  ],
};
