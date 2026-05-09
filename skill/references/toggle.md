# Toggle / Switch

开关控件的切换动画。

## Standard Switch

- Preview ID：`ios-toggle-demo`
- Tags：`0.3s` (duration) · `.spring` (spring)

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
@State private var isOn = false

Toggle(isOn: $isOn) {
    Text("Wi-Fi")
}
.toggleStyle(.switch)
.tint(.green)

// 系统 Toggle 动画参数：
// spring(response: 0.3, dampingFraction: 0.8)
// knob translateX: 20pt
// track color: gray → systemGreen
```

---

## Icon Knob (Dark Mode)

- Preview ID：`ios-toggle-icon`
- Tags：`0.35s` (duration) · `.spring` (spring)

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
struct IconSwitch: View {
    @Binding var isOn: Bool

    var body: some View {
        Capsule()
            .fill(isOn ? Color(hex: 0x1e293b) : Color(hex: 0xfde68a))
            .frame(width: 51, height: 31)
            .overlay(alignment: .leading) {
                Circle()
                    .fill(.white).shadow(radius: 1)
                    .frame(width: 27)
                    .padding(2)
                    .overlay {
                        ZStack {
                            Image(systemName: "sun.max.fill")
                                .foregroundStyle(.orange)
                                .opacity(isOn ? 0 : 1)
                                .rotationEffect(.degrees(isOn ? 90 : 0))
                                .scaleEffect(isOn ? 0.5 : 1)
                            Image(systemName: "moon.fill")
                                .foregroundStyle(Color(hex: 0x1e293b))
                                .opacity(isOn ? 1 : 0)
                                .rotationEffect(.degrees(isOn ? 0 : -90))
                                .scaleEffect(isOn ? 1 : 0.5)
                        }
                    }
                    .offset(x: isOn ? 20 : 0)
            }
            .animation(.spring(response: 0.35, dampingFraction: 0.8), value: isOn)
            .onTapGesture { isOn.toggle() }
    }
}
```

---

## Segmented Toggle

- Preview ID：`ios-toggle-segmented`
- Tags：`0.4s` (duration) · `.spring` (spring)

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
enum AppTheme: String, CaseIterable { case light, dark }

@State private var theme: AppTheme = .light

Picker("Theme", selection: $theme) {
    Label("Light", systemImage: "sun.max.fill").tag(AppTheme.light)
    Label("Dark",  systemImage: "moon.fill").tag(AppTheme.dark)
}
.pickerStyle(.segmented)
.animation(.spring(response: 0.4, dampingFraction: 0.85), value: theme)

// 或者自定义：
HStack(spacing: 0) {
    ForEach(AppTheme.allCases, id: \.self) { t in
        Button { theme = t } label: {
            HStack(spacing: 4) {
                Image(systemName: t == .light ? "sun.max.fill" : "moon.fill")
                Text(t == .light ? "Light" : "Dark")
            }
            .font(.caption.weight(.medium))
            .foregroundStyle(theme == t ? .primary : .secondary)
            .frame(maxWidth: .infinity, minHeight: 28)
        }
    }
}
.background(Color(.systemGray5), in: Capsule())
.overlay(alignment: .leading) {
    Capsule().fill(.white).shadow(radius: 2)
        .padding(4)
        .frame(width: 76)
        .offset(x: theme == .light ? 0 : 76)
}
.animation(.spring(response: 0.4, dampingFraction: 0.85), value: theme)
```

