# Stagger

列表与内容的分段入场。

## Stagger Entry

- Preview ID：`ios-stagger`
- Tags：`50ms 间隔` (duration) · `.spring` (spring)

### AI Motion Spec

一组列表/内容按固定节奏分段入场，重点是统一方向、稳定间隔和整体节奏。

#### Trigger & State

| Key | Value |
|---|---|
| trigger | on first appear or data reveal |
| states | hidden -> staggering -> visible |

#### Motion

| Key | Value |
|---|---|
| entry_order | 按视觉顺序依次进入 |
| base_motion | 每项通常是 opacity + translateY 小位移 |
| delay_rule | 相邻项有固定 delay，不要随机 |

#### Constraints

| Key | Value |
|---|---|
| do_not_change | 不要把 stagger 做成所有项同时淡入 |
| rhythm | 间隔要足够短，整体像一个序列而不是单独动画集合 |

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
struct StaggerList: View {
    @State private var items = Array(0..<10)
    @State private var appeared = false

    var body: some View {
        ScrollView {
            LazyVStack(spacing: 12) {
                ForEach(Array(items.enumerated()), id: \.offset) { index, item in
                    ItemRow(item: item)
                        .opacity(appeared ? 1 : 0)
                        .offset(y: appeared ? 0 : 20)
                        .animation(
                            .spring(response: 0.4, dampingFraction: 0.8)
                            .delay(Double(index) * 0.05),
                            value: appeared
                        )
                }
            }
            .padding()
        }
        .onAppear { appeared = true }
    }
}

// 也可用 .transition + .animation
ForEach(items) { item in
    ItemRow(item: item)
        .transition(
            .move(edge: .bottom)
            .combined(with: .opacity)
        )
        .animation(
            .spring.delay(Double(index) * 0.05),
            value: items
        )
}
```

