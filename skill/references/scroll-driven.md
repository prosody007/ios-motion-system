# Scroll-Driven

滚动驱动的位移、缩放与视差。

## Header Scale

- Preview ID：`ios-scroll-header`
- Tags：`实时跟随` (easing) · `无 duration` (duration)

### AI Motion Spec

滚动驱动 header 缩放/压缩：滚动越深，头部越收敛，但信息层级仍清晰。

#### Trigger & State

| Key | Value |
|---|---|
| trigger | vertical scroll offset |

#### Motion

| Key | Value |
|---|---|
| mapping | header scale/height maps continuously to scroll progress |
| clamp | 到达最小状态后停止继续缩小 |

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
struct ScrollHeaderView: View {
    @State private var scrollOffset: CGFloat = 0

    var headerScale: CGFloat {
        let scale = 1.0 + max(0, -scrollOffset) / 500.0
        return min(scale, 1.5)
    }
    var headerOpacity: CGFloat {
        let opacity = 1.0 - max(0, scrollOffset) / 200.0
        return max(opacity, 0)
    }

    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                Image("header")
                    .resizable()
                    .scaledToFill()
                    .frame(height: 250)
                    .scaleEffect(headerScale)
                    .opacity(headerOpacity)
                    .clipped()

                LazyVStack {
                    ForEach(0..<30, id: \.self) { i in
                        Text("Item \(i)")
                            .frame(maxWidth: .infinity, minHeight: 60)
                    }
                }
            }
        }
        .onScrollGeometryChange(for: CGFloat.self) { geo in
            geo.contentOffset.y
        } action: { _, newOffset in
            scrollOffset = newOffset
        }
    }
}

// Fallback: GeometryReader (iOS 16)
struct ScrollHeaderFallback: View {
    var body: some View {
        ScrollView {
            GeometryReader { geo in
                let offset = geo.frame(in: .named("scroll")).minY
                Image("header")
                    .resizable()
                    .scaledToFill()
                    .scaleEffect(1.0 + max(0, -offset) / 500.0)
                    .opacity(1.0 - max(0, offset) / 200.0)
            }
            .frame(height: 250)
        }
        .coordinateSpace(name: "scroll")
    }
}
```

---

## Parallax

- Preview ID：`ios-scroll-parallax`
- Tags：`0.5x 系数` (easing) · `实时` (duration)

### AI Motion Spec

视差滚动：前后景移动速度不同，形成空间层次。

#### Motion

| Key | Value |
|---|---|
| parallax | background and foreground move at different rates |
| continuity | scroll progress is continuous, not stepped |

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
struct ParallaxScrollView: View {
    let parallaxFactor: CGFloat = 0.5

    var body: some View {
        ScrollView {
            LazyVStack(spacing: 16) {
                ForEach(0..<10, id: \.self) { index in
                    GeometryReader { geo in
                        let midY = geo.frame(in: .global).midY
                        let screenMid = UIScreen.main.bounds.height / 2
                        let offset = (midY - screenMid) * parallaxFactor

                        Image("photo_\(index)")
                            .resizable()
                            .scaledToFill()
                            .offset(y: offset)
                            .clipped()
                    }
                    .frame(height: 240)
                    .clipShape(RoundedRectangle(cornerRadius: 16))
                }
            }
            .padding()
        }
    }
}
```

