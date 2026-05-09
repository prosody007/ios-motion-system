# Swipe to Dismiss

滑动关闭与回弹反馈。

## Swipe to Dismiss

- Preview ID：`ios-swipe-dismiss`
- Tags：`0.35s` (duration) · `.interactiveSpring` (spring)

### AI Motion Spec

卡片或浮层可向下/横向滑动关闭，未过阈值时回弹。

#### Trigger & State

| Key | Value |
|---|---|
| trigger | drag on dismissible surface |
| states | idle / dragging / dismissed or rebound |

#### Motion

| Key | Value |
|---|---|
| follow | 拖动时组件跟手位移 |
| threshold | 达到阈值后离场，否则 spring 回位 |

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
struct SwipeDismissView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var offsetY: CGFloat = 0

    var body: some View {
        VStack {
            RoundedRectangle(cornerRadius: 2.5)
                .fill(.secondary)
                .frame(width: 36, height: 5)
                .padding(.top, 8)
            Spacer()
            Text("内容区域")
            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(.regularMaterial)
        .cornerRadius(16)
        .offset(y: offsetY)
        .gesture(
            DragGesture()
                .onChanged { value in
                    if value.translation.height > 0 {
                        offsetY = value.translation.height
                    }
                }
                .onEnded { value in
                    if value.translation.height > 100 {
                        withAnimation(
                            .spring(response: 0.35, dampingFraction: 0.86)
                        ) {
                            offsetY = UIScreen.main.bounds.height
                        }
                        DispatchQueue.main.asyncAfter(deadline: .now() + 0.35) {
                            dismiss()
                        }
                    } else {
                        withAnimation(
                            .interactiveSpring(
                                response: 0.35,
                                dampingFraction: 0.86
                            )
                        ) {
                            offsetY = 0
                        }
                    }
                }
        )
    }
}
```

