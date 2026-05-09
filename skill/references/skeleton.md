# Skeleton

骨架占位与加载反馈。

## Skeleton Loading

- Preview ID：`ios-skeleton`
- Tags：`1.5s` (duration) · `linear infinite` (easing)

### AI Motion Spec

骨架屏以占位结构 + shimmer 横向扫光组成，重点是版式像真实内容。

#### Layout

| Key | Value |
|---|---|
| placeholder | 骨架块尺寸接近真实内容布局 |
| shape | 文字用圆角短条，头像/封面按真实比例 |

#### Motion

| Key | Value |
|---|---|
| shimmer | 高光从一侧扫到另一侧 |
| loop | 低存在感循环，不抢主体 |

#### Constraints

| Key | Value |
|---|---|
| do_not_change | 不要改成单纯 pulse opacity |

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
struct SkeletonView: View {
    @State private var isAnimating = false

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            RoundedRectangle(cornerRadius: 8)
                .fill(Color(.systemGray5))
                .frame(height: 200)

            RoundedRectangle(cornerRadius: 4)
                .fill(Color(.systemGray5))
                .frame(height: 20)

            RoundedRectangle(cornerRadius: 4)
                .fill(Color(.systemGray5))
                .frame(width: 200, height: 16)
        }
        .redacted(reason: .placeholder)
        .overlay(shimmerOverlay)
    }

    var shimmerOverlay: some View {
        GeometryReader { geo in
            LinearGradient(
                colors: [
                    .clear,
                    Color.white.opacity(0.4),
                    .clear
                ],
                startPoint: .leading,
                endPoint: .trailing
            )
            .frame(width: geo.size.width * 0.6)
            .offset(x: isAnimating
                ? geo.size.width * 1.2
                : -geo.size.width * 0.6
            )
            .onAppear {
                withAnimation(
                    .linear(duration: 1.5)
                    .repeatForever(autoreverses: false)
                ) {
                    isAnimating = true
                }
            }
        }
        .clipped()
    }
}

// iOS 17+ ShimmerEffect modifier
struct ShimmerModifier: ViewModifier {
    @State private var phase: CGFloat = 0

    func body(content: Content) -> some View {
        content
            .overlay(
                LinearGradient(
                    colors: [.clear, .white.opacity(0.3), .clear],
                    startPoint: .leading,
                    endPoint: .trailing
                )
                .offset(x: phase)
            )
            .clipped()
            .onAppear {
                withAnimation(
                    .linear(duration: 1.5)
                    .repeatForever(autoreverses: false)
                ) {
                    phase = 300
                }
            }
    }
}
```

