# Action Sheet

Action Sheet 过渡与选项反馈。

## Action Sheet

- Preview ID：`ios-action-sheet`
- Tags：`0.4s` (duration) · `.spring` (spring)

### AI Motion Spec

Action Sheet 从底部整体上移，动作列表保持分组感。

#### Layout

| Key | Value |
|---|---|
| placement | bottom anchored grouped list |
| actions | destructive / cancel visual hierarchy clear |

#### Motion

| Key | Value |
|---|---|
| entry_exit | bottom-up enter and reverse exit |

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
struct ActionSheetDemo: View {
    @State private var showSheet = false

    var body: some View {
        Button("显示操作菜单") {
            showSheet = true
        }
        .confirmationDialog(
            "选择操作",
            isPresented: $showSheet,
            titleVisibility: .visible
        ) {
            Button("拍照") { takePhoto() }
            Button("从相册选择") { pickFromLibrary() }
            Button("选择文件") { pickFile() }
            Button("取消", role: .cancel) { }
        }
    }
}
// 系统 Action Sheet 动画:
// 弹出: 从底部滑入, ~0.4s spring
// 背景: 暗色遮罩 opacity 0 → 0.4
// 收起: 向下滑出, ~0.3s

// 自定义 Action Sheet
struct CustomActionSheet: View {
    @State private var isPresented = false

    var body: some View {
        ZStack(alignment: .bottom) {
            if isPresented {
                Color.black.opacity(0.4)
                    .ignoresSafeArea()
                    .onTapGesture {
                        withAnimation(.spring(
                            response: 0.35,
                            dampingFraction: 0.85
                        )) {
                            isPresented = false
                        }
                    }

                VStack(spacing: 8) {
                    ActionGroup {
                        ActionButton("拍照", icon: "camera")
                        ActionButton("相册", icon: "photo")
                    }

                    ActionButton("取消", role: .cancel)
                }
                .padding()
                .transition(.move(edge: .bottom))
            }
        }
        .animation(
            .spring(response: 0.4, dampingFraction: 0.85),
            value: isPresented
        )
    }
}
```

