# Button / Tap

按钮按压反馈与点击状态。

## Scale Down Press

- Preview ID：`ios-btn-scale`
- Tags：`0.1s` (duration) · `.easeInOut` (easing)

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
Button(action: { }) {
    Text("按钮")
        .padding(.horizontal, 36)
        .padding(.vertical, 14)
        .background(Color.accentColor)
        .cornerRadius(12)
}
.buttonStyle(ScaleButtonStyle())

struct ScaleButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
            .opacity(configuration.isPressed ? 0.9 : 1.0)
            .animation(.easeInOut(duration: 0.1), value: configuration.isPressed)
    }
}
```

---

## Highlight + Haptic

- Preview ID：`ios-btn-highlight`
- Tags：`0.08s` (duration) · `.easeOut` (easing)

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
Button(action: {
    let impact = UIImpactFeedbackGenerator(style: .medium)
    impact.impactOccurred()
}) {
    Text("Tap Me")
        .padding(.horizontal, 36)
        .padding(.vertical, 14)
}
.buttonStyle(HighlightButtonStyle())

struct HighlightButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .foregroundStyle(.white)
            .background(
                configuration.isPressed
                    ? Color(hex: 0x0051D5)
                    : Color(hex: 0x007AFF)
            )
            .cornerRadius(12)
            .animation(.easeOut(duration: 0.08), value: configuration.isPressed)
    }
}
```

---

## Depth Press

- Preview ID：`ios-btn-depth`
- Tags：`0.1s` (duration) · `5pt depth` (easing)

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
// 通过下方实色阴影模拟"按键厚度"，按下时下沉消失
struct DepthButtonStyle: ButtonStyle {
    let depth: CGFloat = 5

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .foregroundStyle(.white)
            .padding(.horizontal, 36)
            .padding(.vertical, 14)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color(hex: 0x007AFF))
            )
            .offset(y: configuration.isPressed ? depth : 0)
            .background(alignment: .bottom) {
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color(hex: 0x0060C8))
                    .frame(height: 44 + (configuration.isPressed ? 0 : depth))
                    .offset(y: configuration.isPressed ? 0 : depth)
            }
            .animation(.easeOut(duration: 0.1), value: configuration.isPressed)
    }
}

Button("Press") { }
    .buttonStyle(DepthButtonStyle())
```

