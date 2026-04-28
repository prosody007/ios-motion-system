import type { CardsSection } from "@/types/motion";

export const skeletonSection: CardsSection = {
  type: "cards",
  title: "Skeleton",
  description: "骨架占位与加载反馈。",
  cards: [
    {
      title: "Skeleton Loading",
      tags: [
        { text: "1.5s", variant: "duration" },
        { text: "linear infinite", variant: "easing" },
      ],
      previewId: "ios-skeleton",
      codes: {
        swift: `// SwiftUI — redacted + 自定义 shimmer
struct SkeletonView: View {
    @State private var isAnimating = false

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            RoundedRectangle(cornerRadius: 8)
                .fill(Color(.systemGray5))
                .frame(height: 200)

            RoundedRectangle(cornerRadius: 4)
                .fill(Color(.systemGray5))
                .frame(height: 20)

            RoundedRectangle(cornerRadius: 4)
                .fill(Color(.systemGray5))
                .frame(width: 200, height: 16)
        }
        .redacted(reason: .placeholder)
        .overlay(shimmerOverlay)
    }

    var shimmerOverlay: some View {
        GeometryReader { geo in
            LinearGradient(
                colors: [
                    .clear,
                    Color.white.opacity(0.4),
                    .clear
                ],
                startPoint: .leading,
                endPoint: .trailing
            )
            .frame(width: geo.size.width * 0.6)
            .offset(x: isAnimating
                ? geo.size.width * 1.2
                : -geo.size.width * 0.6
            )
            .onAppear {
                withAnimation(
                    .linear(duration: 1.5)
                    .repeatForever(autoreverses: false)
                ) {
                    isAnimating = true
                }
            }
        }
        .clipped()
    }
}

// iOS 17+ ShimmerEffect modifier
struct ShimmerModifier: ViewModifier {
    @State private var phase: CGFloat = 0

    func body(content: Content) -> some View {
        content
            .overlay(
                LinearGradient(
                    colors: [.clear, .white.opacity(0.3), .clear],
                    startPoint: .leading,
                    endPoint: .trailing
                )
                .offset(x: phase)
            )
            .clipped()
            .onAppear {
                withAnimation(
                    .linear(duration: 1.5)
                    .repeatForever(autoreverses: false)
                ) {
                    phase = 300
                }
            }
    }
}`,
        uikit: `// UIKit — CAGradientLayer shimmer
class ShimmerView: UIView {
    private let gradientLayer = CAGradientLayer()

    override func layoutSubviews() {
        super.layoutSubviews()
        gradientLayer.frame = bounds
        setupShimmer()
    }

    func setupShimmer() {
        gradientLayer.colors = [
            UIColor.systemGray5.cgColor,
            UIColor.systemGray4.cgColor,
            UIColor.systemGray5.cgColor
        ]
        gradientLayer.startPoint = CGPoint(x: 0, y: 0.5)
        gradientLayer.endPoint = CGPoint(x: 1, y: 0.5)
        gradientLayer.locations = [0, 0.5, 1]
        layer.addSublayer(gradientLayer)

        let animation = CABasicAnimation(keyPath: "locations")
        animation.fromValue = [-1.0, -0.5, 0.0]
        animation.toValue = [1.0, 1.5, 2.0]
        animation.duration = 1.5
        animation.repeatCount = .infinity
        animation.timingFunction = CAMediaTimingFunction(
            name: .linear
        )
        gradientLayer.add(animation, forKey: "shimmer")
    }

    func stopShimmer() {
        gradientLayer.removeAnimation(forKey: "shimmer")
    }
}
// duration: 1.5s, linear, repeatForever
// locations 从 [-1, -0.5, 0] → [1, 1.5, 2]`,
      },
    },
  ],
};
