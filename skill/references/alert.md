# Alert

Alert 对话框过渡与反馈。

## Alert Dialog

- Preview ID：`ios-alert`
- Tags：`0.25s` (duration) · `系统 spring` (spring)

### AI Motion Spec

居中 alert 以缩放 + opacity 入场，背景 dim，同步出场。

#### Layout

| Key | Value |
|---|---|
| placement | centered modal dialog |
| backdrop | full-screen dim background |

#### Motion

| Key | Value |
|---|---|
| entry | scale up + fade in |
| exit | scale down + fade out |

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
struct AlertDemo: View {
    @State private var showAlert = false

    var body: some View {
        Button("显示 Alert") {
            showAlert = true
        }
        .alert("提示", isPresented: $showAlert) {
            Button("取消", role: .cancel) { }
            Button("确定") { confirm() }
        } message: {
            Text("确定要执行此操作吗？")
        }
    }
}
// 系统 Alert 动画参数:
// 弹出: scale 1.1 → 1.0 + opacity 0 → 1, ~0.25s spring
// 背景: 同步添加暗色遮罩 opacity 0 → 0.4
// 收起: scale 1.0 → 0.95 + opacity 1 → 0, ~0.2s

// 自定义 Alert 复现系统效果
struct CustomAlert: View {
    @State private var isPresented = false

    var alertContent: some View {
        VStack(spacing: 0) {
            Text("标题")
                .font(.headline)
                .padding(.top, 20)

            Text("描述信息")
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .padding(.vertical, 12)
                .padding(.horizontal, 16)

            Divider()

            HStack(spacing: 0) {
                Button("取消") { dismiss() }
                    .frame(maxWidth: .infinity)
                Divider()
                Button("确定") { confirm() }
                    .fontWeight(.semibold)
                    .frame(maxWidth: .infinity)
            }
            .frame(height: 44)
        }
        .background(.regularMaterial)
        .clipShape(RoundedRectangle(cornerRadius: 14))
        .frame(width: 270)
        .scaleEffect(isPresented ? 1.0 : 1.1)
        .opacity(isPresented ? 1.0 : 0)
        .animation(
            .spring(response: 0.25, dampingFraction: 0.9),
            value: isPresented
        )
    }
}
```

