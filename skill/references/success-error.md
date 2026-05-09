# Success & Error

成功与错误状态反馈。

## Success Check

- Preview ID：`ios-success-check`
- Tags：`0.5s` (duration) · `.easeOut` (easing)

### AI Motion Spec

成功反馈通常是圆形容器先出现，再绘制 check。

#### Motion

| Key | Value |
|---|---|
| sequence | container appears -> check draws |
| timing | 符号绘制略晚于容器 |

#### Constraints

| Key | Value |
|---|---|
| do_not_change | 不要只做静态图标淡入 |

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
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
}
```

---

## Error Shake

- Preview ID：`ios-error-shake`
- Tags：`0.4s` (duration) · `.easeInOut` (easing)

### AI Motion Spec

错误反馈以短促水平 shake 为主，强调拒绝感而不是夸张弹跳。

#### Motion

| Key | Value |
|---|---|
| axis | x-axis shake only |
| beats | 2~4 次衰减式来回位移 |
| duration | 整体偏短，不能拖泥带水 |

#### Constraints

| Key | Value |
|---|---|
| do_not_change | 不要混入大幅缩放、旋转或纵向跳动 |

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
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
}
```

