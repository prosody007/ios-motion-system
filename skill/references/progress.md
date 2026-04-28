# Progress

线性与环形进度反馈。

## Linear Progress Bar

- Preview ID：`ios-progress-bar`
- Tags：`0.3s` (duration) · `.snappy` (spring)

### SwiftUI

```swift
// SwiftUI — ProgressView 线性进度条
struct ProgressBarView: View {
    @State private var progress: Double = 0.0

    var body: some View {
        VStack(spacing: 20) {
            ProgressView(value: progress)
                .progressViewStyle(.linear)
                .tint(.accentColor)

            // 自定义进度条
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: 4)
                        .fill(Color(.systemGray5))

                    RoundedRectangle(cornerRadius: 4)
                        .fill(Color.accentColor)
                        .frame(
                            width: geo.size.width * progress
                        )
                }
            }
            .frame(height: 8)
        }
    }

    func updateProgress(to value: Double) {
        withAnimation(.snappy(duration: 0.3)) {
            progress = value
        }
    }
}
// .snappy(duration: 0.3) — 无回弹, 快速到位
```

### UIKit

```swift
// UIKit — UIProgressView 线性进度条
class ProgressBarVC: UIViewController {
    let progressView = UIProgressView(progressViewStyle: .default)

    override func viewDidLoad() {
        super.viewDidLoad()
        progressView.progressTintColor = .systemBlue
        progressView.trackTintColor = .systemGray5
        view.addSubview(progressView)
    }

    func updateProgress(to value: Float) {
        progressView.setProgress(value, animated: true)
        // 系统 animated: true 使用 ~0.3s 动画
    }

    // 自定义动画版本
    func animateProgress(to value: Float) {
        UIView.animate(
            withDuration: 0.3,
            delay: 0,
            usingSpringWithDamping: 1.0,
            initialSpringVelocity: 0,
            options: [],
            animations: {
                self.progressView.setProgress(value, animated: false)
                self.progressView.layoutIfNeeded()
            }
        )
    }
}
```

---

## Circular Progress Ring

- Preview ID：`ios-progress-ring`
- Tags：`1.0s` (duration) · `.easeOut` (easing)

### SwiftUI

```swift
// SwiftUI — Circle trim 环形进度
struct ProgressRingView: View {
    @State private var progress: Double = 0.0
    let lineWidth: CGFloat = 8

    var body: some View {
        ZStack {
            // 背景环
            Circle()
                .stroke(
                    Color(.systemGray5),
                    lineWidth: lineWidth
                )

            // 进度环
            Circle()
                .trim(from: 0, to: progress)
                .stroke(
                    Color.accentColor,
                    style: StrokeStyle(
                        lineWidth: lineWidth,
                        lineCap: .round
                    )
                )
                .rotationEffect(.degrees(-90))
                .animation(
                    .easeOut(duration: 1.0),
                    value: progress
                )

            Text("\(Int(progress * 100))%")
                .font(.system(.title2, design: .rounded))
                .fontWeight(.semibold)
        }
        .frame(width: 120, height: 120)
    }

    func setProgress(_ value: Double) {
        progress = value
    }
}
```

### UIKit

```swift
// UIKit — CAShapeLayer 环形进度
class ProgressRingView: UIView {
    private let trackLayer = CAShapeLayer()
    private let progressLayer = CAShapeLayer()
    private let lineWidth: CGFloat = 8

    override func layoutSubviews() {
        super.layoutSubviews()
        let center = CGPoint(
            x: bounds.midX,
            y: bounds.midY
        )
        let radius = min(bounds.width, bounds.height) / 2
            - lineWidth / 2
        let path = UIBezierPath(
            arcCenter: center,
            radius: radius,
            startAngle: -.pi / 2,
            endAngle: .pi * 1.5,
            clockwise: true
        )

        trackLayer.path = path.cgPath
        trackLayer.fillColor = UIColor.clear.cgColor
        trackLayer.strokeColor = UIColor.systemGray5.cgColor
        trackLayer.lineWidth = lineWidth
        layer.addSublayer(trackLayer)

        progressLayer.path = path.cgPath
        progressLayer.fillColor = UIColor.clear.cgColor
        progressLayer.strokeColor = UIColor.systemBlue.cgColor
        progressLayer.lineWidth = lineWidth
        progressLayer.lineCap = .round
        progressLayer.strokeEnd = 0
        layer.addSublayer(progressLayer)
    }

    func setProgress(_ value: CGFloat, animated: Bool) {
        if animated {
            let anim = CABasicAnimation(keyPath: "strokeEnd")
            anim.fromValue = progressLayer.strokeEnd
            anim.toValue = value
            anim.duration = 1.0
            anim.timingFunction = CAMediaTimingFunction(
                name: .easeOut
            )
            progressLayer.add(anim, forKey: "progress")
        }
        progressLayer.strokeEnd = value
    }
}
```

