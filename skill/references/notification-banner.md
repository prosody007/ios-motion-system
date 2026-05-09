# Notification Banner

顶部横幅通知过渡。

## Notification Banner

- Preview ID：`ios-notification`
- Tags：`0.4s` (duration) · `.spring` (spring)

### AI Motion Spec

顶部 banner 像系统通知一样从顶部滑入，短暂停留后离开。

#### Layout

| Key | Value |
|---|---|
| placement | top edge / below status area |

#### Motion

| Key | Value |
|---|---|
| entry_exit | slide down in, slide up out |
| content | banner body keeps shape stable during motion |

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
struct NotificationBanner: View {
    @Binding var isPresented: Bool
    let title: String
    let subtitle: String
    let icon: String

    var body: some View {
        if isPresented {
            HStack(spacing: 12) {
                Image(systemName: icon)
                    .font(.title2)
                    .foregroundStyle(.white)
                    .frame(width: 40, height: 40)
                    .background(Color.accentColor)
                    .clipShape(RoundedRectangle(cornerRadius: 8))

                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(.subheadline)
                        .fontWeight(.semibold)
                    Text(subtitle)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                        .lineLimit(2)
                }

                Spacer()
            }
            .padding(14)
            .background(.ultraThinMaterial)
            .clipShape(RoundedRectangle(cornerRadius: 20))
            .shadow(color: .black.opacity(0.15), radius: 12, y: 4)
            .padding(.horizontal, 8)
            .transition(.move(edge: .top))
            .gesture(
                DragGesture()
                    .onEnded { value in
                        if value.translation.height < -20 {
                            dismiss()
                        }
                    }
            )
            .onAppear {
                DispatchQueue.main.asyncAfter(
                    deadline: .now() + 4.0
                ) {
                    dismiss()
                }
            }
        }
    }

    func dismiss() {
        withAnimation(
            .spring(response: 0.35, dampingFraction: 0.85)
        ) {
            isPresented = false
        }
    }
}

// 使用方式
struct ContentView: View {
    @State private var showBanner = false

    var body: some View {
        ZStack(alignment: .top) {
            MainContent()
            NotificationBanner(
                isPresented: $showBanner,
                title: "新消息",
                subtitle: "你收到了一条新消息",
                icon: "message.fill"
            )
        }
        .animation(
            .spring(response: 0.4, dampingFraction: 0.8),
            value: showBanner
        )
    }
}
```

