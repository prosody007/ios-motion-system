import type { CardsSection } from "@/types/motion";

export const successErrorSection: CardsSection = {
  type: "cards",
  title: "成功/错误状态",
  description: "成功勾号路径绘制与错误抖动反馈动画。",
  cards: [
    {
      title: "成功勾号绘制",
      tags: [
        { text: "0.5s", variant: "duration" },
        { text: ".easeOut", variant: "easing" },
      ],
      previewId: "ios-success-check",
      codes: {
        swift: `// SwiftUI — 勾号路径绘制动画
struct CheckmarkView: View {
    @State private var trimEnd: CGFloat = 0

    var body: some View {
        ZStack {
            Circle()
                .fill(Color.green.opacity(0.15))
                .frame(width: 80, height: 80)

            CheckmarkShape()
                .trim(from: 0, to: trimEnd)
                .stroke(
                    Color.green,
                    style: StrokeStyle(
                        lineWidth: 4,
                        lineCap: .round,
                        lineJoin: .round
                    )
                )
                .frame(width: 36, height: 36)
        }
        .onAppear {
            withAnimation(
                .easeOut(duration: 0.5)
                .delay(0.1)
            ) {
                trimEnd = 1
            }
        }
    }
}

struct CheckmarkShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(
            x: rect.width * 0.15,
            y: rect.height * 0.5
        ))
        path.addLine(to: CGPoint(
            x: rect.width * 0.4,
            y: rect.height * 0.75
        ))
        path.addLine(to: CGPoint(
            x: rect.width * 0.85,
            y: rect.height * 0.25
        ))
        return path
    }
}`,
        uikit: `// UIKit — CAShapeLayer 勾号路径绘制
class CheckmarkAnimationView: UIView {
    private let checkLayer = CAShapeLayer()

    func setupCheckmark() {
        let path = UIBezierPath()
        let size = bounds.size
        path.move(to: CGPoint(
            x: size.width * 0.15,
            y: size.height * 0.5
        ))
        path.addLine(to: CGPoint(
            x: size.width * 0.4,
            y: size.height * 0.75
        ))
        path.addLine(to: CGPoint(
            x: size.width * 0.85,
            y: size.height * 0.25
        ))

        checkLayer.path = path.cgPath
        checkLayer.fillColor = UIColor.clear.cgColor
        checkLayer.strokeColor = UIColor.systemGreen.cgColor
        checkLayer.lineWidth = 4
        checkLayer.lineCap = .round
        checkLayer.lineJoin = .round
        checkLayer.strokeEnd = 0
        layer.addSublayer(checkLayer)
    }

    func animateCheckmark() {
        let animation = CABasicAnimation(keyPath: "strokeEnd")
        animation.fromValue = 0
        animation.toValue = 1
        animation.duration = 0.5
        animation.timingFunction = CAMediaTimingFunction(
            name: .easeOut
        )
        animation.fillMode = .forwards
        animation.isRemovedOnCompletion = false
        checkLayer.add(animation, forKey: "checkmark")
    }
}`,
      },
    },
    {
      title: "错误抖动",
      tags: [
        { text: "0.4s", variant: "duration" },
        { text: ".easeInOut", variant: "easing" },
      ],
      previewId: "ios-error-shake",
      codes: {
        swift: `// SwiftUI — keyframe 抖动动画
struct ShakeView: View {
    @State private var shakeOffset: CGFloat = 0
    @State private var showError = false

    var body: some View {
        TextField("输入内容", text: $text)
            .padding()
            .background(
                RoundedRectangle(cornerRadius: 10)
                    .stroke(
                        showError ? Color.red : Color.gray,
                        lineWidth: 1
                    )
            )
            .offset(x: shakeOffset)
    }

    func triggerShake() {
        showError = true
        let generator = UINotificationFeedbackGenerator()
        generator.notificationOccurred(.error)

        // Keyframe 抖动序列
        withAnimation(.easeInOut(duration: 0.4)) {
            shakeOffset = -10
        }
        // 手动 keyframe 序列
        let values: [(CGFloat, Double)] = [
            (-10, 0.07), (10, 0.07),
            (-6, 0.06), (6, 0.06),
            (-2, 0.06), (0, 0.08)
        ]
        var delay = 0.0
        for (offset, dur) in values {
            delay += dur
            DispatchQueue.main.asyncAfter(
                deadline: .now() + delay
            ) {
                withAnimation(.easeInOut(duration: dur)) {
                    shakeOffset = offset
                }
            }
        }
    }
}

// iOS 17+ KeyframeAnimator
KeyframeAnimator(
    initialValue: CGFloat.zero,
    trigger: errorTrigger
) { offset in
    content.offset(x: offset)
} keyframes: { _ in
    SpringKeyframe(-10, duration: 0.07)
    SpringKeyframe(10, duration: 0.07)
    SpringKeyframe(-6, duration: 0.06)
    SpringKeyframe(6, duration: 0.06)
    SpringKeyframe(-2, duration: 0.06)
    SpringKeyframe(0, duration: 0.08)
}`,
        uikit: `// UIKit — CAKeyframeAnimation 抖动
class ShakeTextField: UITextField {
    func shake() {
        let animation = CAKeyframeAnimation(keyPath: "position.x")
        animation.values = [
            0, -10, 10, -6, 6, -2, 0
        ].map { center.x + $0 }
        animation.keyTimes = [
            0, 0.15, 0.35, 0.5, 0.65, 0.8, 1.0
        ]
        animation.duration = 0.4
        animation.timingFunction = CAMediaTimingFunction(
            name: .easeInOut
        )
        layer.add(animation, forKey: "shake")

        // 配合红色边框
        UIView.animate(withDuration: 0.2) {
            self.layer.borderColor = UIColor.systemRed.cgColor
            self.layer.borderWidth = 1
        }

        // 触觉反馈
        let generator = UINotificationFeedbackGenerator()
        generator.notificationOccurred(.error)
    }
}
// values: [-10, 10, -6, 6, -2, 0] 递减振幅
// duration: 0.4s, .easeInOut`,
      },
    },
  ],
};
