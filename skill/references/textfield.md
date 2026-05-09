# Text Field

输入焦点、占位与校验反馈。

## Floating Label Focus

- Preview ID：`ios-textfield-focus`
- Tags：`0.25s` (duration) · `.smooth` (spring)

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
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
// .smooth ≈ spring(duration: 0.25, bounce: 0) — 无弹跳，贴近 iOS 原生
```

---

## Validation Shake

- Preview ID：`ios-textfield-shake`
- Tags：`0.45s` (duration) · `.easeInOut` (easing)

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
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
}
```

