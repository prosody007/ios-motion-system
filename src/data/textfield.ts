import type { CardsSection } from "@/types/motion";

export const textfieldSection: CardsSection = {
  type: "cards",
  title: "TextField / Input",
  description: "输入框动画参数：聚焦浮动标签与校验抖动。",
  cards: [
    {
      title: "浮动标签 Focus",
      tags: [
        { text: "0.25s", variant: "duration" },
        { text: ".smooth", variant: "spring" },
      ],
      previewId: "ios-textfield-focus",
      codes: {
        swift: `// SwiftUI — 浮动标签
// 用 transform(scale + offset) 代替字号变化，避免重排，动画更顺滑
@State private var text = ""
@FocusState private var focused: Bool
private var isActive: Bool { focused || !text.isEmpty }

ZStack(alignment: .topLeading) {
    Text("Email")
        .foregroundStyle(focused ? Color.blue : .secondary)
        .scaleEffect(isActive ? 0.78 : 1.0, anchor: .topLeading)
        .offset(x: 12, y: isActive ? 6 : 18)

    TextField("", text: $text)
        .focused($focused)
        .padding(.top, 20)
        .padding(.horizontal, 12)
        .padding(.bottom, 8)
}
.background(
    RoundedRectangle(cornerRadius: 10)
        .strokeBorder(focused ? Color.blue : Color(.separator),
                      lineWidth: 1.5)
)
.animation(.smooth(duration: 0.25), value: isActive)
.animation(.easeOut(duration: 0.2), value: focused)
// .smooth ≈ spring(duration: 0.25, bounce: 0) — 无弹跳，贴近 iOS 原生`,
        uikit: `// UIKit — 浮动标签
final class FloatingTextField: UITextField {
    let floatingLabel = UILabel()

    private func setLabel(active: Bool, animated: Bool) {
        let transform: CGAffineTransform = active
            ? CGAffineTransform(scaleX: 0.78, y: 0.78)
                .translatedBy(x: 0, y: -12)
            : .identity
        let color: UIColor = active ? .systemBlue : .placeholderText

        let apply = {
            self.floatingLabel.transform = transform
            self.floatingLabel.textColor = color
        }
        guard animated else { apply(); return }

        UIView.animate(
            withDuration: 0.25,
            delay: 0,
            usingSpringWithDamping: 1.0,     // .smooth = 无弹跳
            initialSpringVelocity: 0,
            options: [.beginFromCurrentState, .allowUserInteraction],
            animations: apply
        )
    }

    func textFieldDidBeginEditing(_ tf: UITextField) {
        setLabel(active: true, animated: true)
    }
    func textFieldDidEndEditing(_ tf: UITextField) {
        if tf.text?.isEmpty ?? true {
            setLabel(active: false, animated: true)
        }
    }
}`,
      },
    },
    {
      title: "校验失败 Shake",
      tags: [
        { text: "0.45s", variant: "duration" },
        { text: ".easeInOut", variant: "easing" },
      ],
      previewId: "ios-textfield-shake",
      codes: {
        swift: `// SwiftUI — 关键帧水平抖动（递减衰减，iOS 风格）
@State private var password = ""
@State private var hasError = false
@State private var shakeToken = 0

SecureField("Password", text: $password)
    .onChange(of: password) { _, new in
        if hasError, !new.isEmpty { hasError = false }
    }
    .overlay {
        RoundedRectangle(cornerRadius: 10)
            .strokeBorder(hasError ? Color.red : Color(.separator),
                          lineWidth: 1.5)
    }
    .animation(.easeOut(duration: 0.2), value: hasError)
    .keyframeAnimator(
        initialValue: CGFloat.zero,
        trigger: shakeToken
    ) { content, x in
        content.offset(x: x)
    } keyframes: { _ in
        // 均匀时长 + 振幅递减，匹配 Apple 常用抖动
        KeyframeTrack {
            CubicKeyframe(-10, duration: 0.045)
            CubicKeyframe( 8,  duration: 0.045)
            CubicKeyframe(-6,  duration: 0.045)
            CubicKeyframe( 4,  duration: 0.045)
            CubicKeyframe(-2,  duration: 0.045)
            CubicKeyframe( 1,  duration: 0.045)
            CubicKeyframe( 0,  duration: 0.045)
        }
    }

Button("Validate") {
    guard password.isEmpty else { return }
    hasError = true
    shakeToken += 1          // 变化即触发一次抖动
}`,
        uikit: `// UIKit — CAKeyframeAnimation + 错误态描边
func shakeField(_ field: UITextField) {
    let anim = CAKeyframeAnimation(keyPath: "transform.translation.x")
    anim.values   = [0, -10, 8, -6, 4, -2, 1, 0]
    anim.keyTimes = [0, 0.10, 0.25, 0.40, 0.55, 0.70, 0.85, 1]
    anim.duration = 0.45
    anim.timingFunction = CAMediaTimingFunction(
        controlPoints: 0.36, 0.07, 0.19, 0.97   // Apple 抖动曲线
    )
    field.layer.add(anim, forKey: "shake")
}

func setError(_ on: Bool, on field: UITextField) {
    UIView.animate(withDuration: 0.2) {
        field.layer.borderColor = (on
            ? UIColor.systemRed
            : UIColor.separator).cgColor
        field.layer.borderWidth = 1.5
    }
}`,
      },
    },
  ],
};
