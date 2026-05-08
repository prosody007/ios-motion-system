import type { CardsSection } from "@/types/motion";

export const loadingSection: CardsSection = {
  type: "cards",
  title: "Loading",
  description: "加载指示与等待反馈。",
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
        .frame(width: 30, height: 30)
        .onAppear {
            withAnimation(
                .linear(duration: 1.0).repeatForever(autoreverses: false)
            ) {
                rotation = 360
            }
        }
    }
}
// duration 1.0s, linear, infinite repeat`,
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
    {
      title: "Grow Ring",
      tags: [{ text: "3.0s", variant: "duration" }, { text: "grow 0→1", variant: "easing" }],
      previewId: "ios-loading-grow",
      codes: {
        swift: `// SwiftUI — 灰色底环固定，深色进度弧从 0 -> 1 生长，完成后停住
struct GrowRingView: View {
    @State private var progress: CGFloat = 0
    @State private var completed = false

    var body: some View {
        VStack(spacing: 12) {
            ZStack {
                Circle()
                    .stroke(Color.black.opacity(0.10), lineWidth: 3)

                Circle()
                    .trim(from: 0, to: progress)
                    .stroke(style: StrokeStyle(lineWidth: 3, lineCap: .round))
                    .rotationEffect(.degrees(-90))
            }
            .frame(width: 30, height: 30)

            if completed {
                Button("Reset") {
                    progress = 0
                    completed = false
                    play()
                }
            }
        }
        .onAppear {
            play()
        }
    }

    private func play() {
        withAnimation(.timingCurve(0.32, 0.72, 0, 1, duration: 3.0)) {
            progress = 1
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) {
            completed = true
        }
    }
}
// 灰色底环保持不变；深色弧线 3 秒长到 1 后停住`,
        uikit: `// UIKit — 灰底固定 + CAShapeLayer strokeEnd 生长，完成后停住
let track = CAShapeLayer()
track.path = UIBezierPath(
    arcCenter: CGPoint(x: 15, y: 15),
    radius: 11,
    startAngle: 0,
    endAngle: .pi * 2,
    clockwise: true
).cgPath
track.fillColor = UIColor.clear.cgColor
track.strokeColor = UIColor.black.withAlphaComponent(0.10).cgColor
track.lineWidth = 3

let progress = CAShapeLayer()
progress.path = track.path
progress.fillColor = UIColor.clear.cgColor
progress.strokeColor = UIColor.black.withAlphaComponent(0.82).cgColor
progress.lineWidth = 3
progress.lineCap = .round
progress.strokeEnd = 0
progress.setAffineTransform(CGAffineTransform(rotationAngle: -.pi / 2))

let grow = CABasicAnimation(keyPath: "strokeEnd")
grow.fromValue = 0
grow.toValue = 1
grow.duration = 3.0
grow.timingFunction = CAMediaTimingFunction(controlPoints: 0.32, 0.72, 0, 1)
grow.fillMode = .forwards
grow.isRemovedOnCompletion = false
progress.add(grow, forKey: "grow")

// 完成后显示 Reset 按钮；点击时移除旧动画并重新 add(grow, forKey: "grow")`,
      },
    },
  ],
};
