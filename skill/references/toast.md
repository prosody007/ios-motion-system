# Toast

轻提示与短暂通知反馈。

## Top Toast

- Preview ID：`ios-toast`
- Tags：`0.4s` (duration) · `.snappy` (spring)

### AI Motion Spec

顶部 toast 短暂出现再离开，强调轻量通知。

#### Layout

| Key | Value |
|---|---|
| placement | top overlay |

#### Motion

| Key | Value |
|---|---|
| entry | 从顶部小位移进入 + opacity |
| exit | 停留后按相反方向离开 |

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
// overlay + .transition(.move(edge: .top))

struct ToastOverlay: ViewModifier {
    @Binding var show: Bool
    let message: String
    let icon: String

    func body(content: Content) -> some View {
        content.overlay(alignment: .top) {
            if show {
                HStack(spacing: 10) {
                    Image(systemName: icon)
                        .foregroundStyle(.green)
                    Text(message)
                        .font(.subheadline.weight(.medium))
                }
                .padding(.horizontal, 20)
                .padding(.vertical, 12)
                .background(.ultraThinMaterial, in: Capsule())
                .shadow(color: .black.opacity(0.08), radius: 8, y: 4)
                .transition(.move(edge: .top).combined(with: .opacity))
                .onAppear {
                    DispatchQueue.main.asyncAfter(deadline: .now() + 2.5) {
                        withAnimation(.snappy) { show = false }
                    }
                }
            }
        }
        .animation(.snappy(duration: 0.4), value: show)
    }
}

// 使用：
.modifier(ToastOverlay(show: $showToast, message: "已保存", icon: "checkmark.circle.fill"))

// 动画参数：
// 入场: .snappy(duration: 0.4) — 从顶部 move + opacity
// 退场: 同曲线，反向
// 自动消失: 2.5s
```

---

## Bottom Snackbar with Action

- Preview ID：`ios-snackbar`
- Tags：`0.35s` (duration) · `.spring` (spring)

### AI Motion Spec

底部 snackbar 贴近安全区出现，可带操作按钮，停留后离开。

#### Layout

| Key | Value |
|---|---|
| placement | bottom overlay near safe area |
| action | 可带一个 clear action button |

#### Motion

| Key | Value |
|---|---|
| entry_exit | 底部上移进入、下移退出 |

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
// 从底部弹出，带 Undo 操作按钮

struct Snackbar: View {
    @Binding var show: Bool
    let message: String
    var action: (() -> Void)?

    var body: some View {
        if show {
            HStack(spacing: 12) {
                Text(message)
                    .font(.subheadline)
                    .foregroundStyle(.white)
                Spacer()
                if let action {
                    Button("Undo") { action() }
                        .font(.subheadline.weight(.semibold))
                        .foregroundStyle(.blue)
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 14)
            .background(Color(.systemGray6), in: RoundedRectangle(cornerRadius: 14))
            .shadow(color: .black.opacity(0.1), radius: 10, y: 5)
            .padding(.horizontal, 16)
            .transition(.move(edge: .bottom).combined(with: .opacity))
        }
    }
}

// 容器：
VStack {
    Spacer()
    Snackbar(show: $showSnack, message: "已删除") {
        // undo logic
    }
}
.animation(.spring(response: 0.35, dampingFraction: 0.86), value: showSnack)

// 入场: .spring(response: 0.35, dampingFraction: 0.86)
// 退场: 同曲线反向
// 支持手势 dismiss: .gesture(DragGesture().onEnded { if $0.translation.height > 20 { dismiss } })
```

