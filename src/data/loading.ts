import type { CardsSection } from "@/types/motion";

export const loadingSection: CardsSection = {
  type: "cards",
  title: "Loading 加载态",
  description: "加载指示器和骨架屏动画。",
  cards: [
    {
      title: "Activity Indicator",
      tags: [{ text: "1.0s", variant: "duration" }, { text: "linear repeat", variant: "easing" }],
      previewId: "ios-loading-spinner",
      codes: {
        swift: `// SwiftUI — ProgressView 加载指示器
ProgressView()
    .progressViewStyle(.circular)
    .tint(.white)
    .scaleEffect(1.5)

// 自定义 Spinner:
struct SpinnerView: View {
    @State private var rotation: Double = 0

    var body: some View {
        Circle()
            .trim(from: 0.2, to: 1.0)
            .stroke(style: StrokeStyle(lineWidth: 3, lineCap: .round))
            .frame(width: 30, height: 30)
            .rotationEffect(.degrees(rotation))
            .onAppear {
                withAnimation(
                    .linear(duration: 1.0).repeatForever(autoreverses: false)
                ) {
                    rotation = 360
                }
            }
    }
}`,
        uikit: `// UIKit — UIActivityIndicatorView
let spinner = UIActivityIndicatorView(style: .medium)
spinner.color = .white
spinner.startAnimating()

// 系统参数：duration 1.0s, linear, infinite repeat

// 自定义 CABasicAnimation Spinner:
let rotation = CABasicAnimation(keyPath: "transform.rotation.z")
rotation.fromValue = 0
rotation.toValue = Double.pi * 2
rotation.duration = 1.0
rotation.repeatCount = .infinity
rotation.timingFunction = CAMediaTimingFunction(name: .linear)
layer.add(rotation, forKey: "spin")

// Shimmer 骨架屏：
let shimmer = CAGradientLayer()
shimmer.colors = [
    UIColor.systemGray5.cgColor,
    UIColor.systemGray4.cgColor,
    UIColor.systemGray5.cgColor
]
shimmer.locations = [0, 0.5, 1]
shimmer.startPoint = CGPoint(x: 0, y: 0.5)
shimmer.endPoint = CGPoint(x: 1, y: 0.5)

let anim = CABasicAnimation(keyPath: "locations")
anim.fromValue = [-1, -0.5, 0]
anim.toValue = [1, 1.5, 2]
anim.duration = 1.5
anim.repeatCount = .infinity
shimmer.add(anim, forKey: "shimmer")`,
      },
    },
  ],
};
