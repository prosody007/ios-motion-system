# Expandable

内容展开与折叠过渡。

## Expandable Content

- Preview ID：`ios-expandable`
- Tags：`0.3s` (duration) · `.snappy` (spring)

### AI Motion Spec

内容区在同一容器内展开/折叠，高度、透明度和图标状态同步变化。

#### Trigger & State

| Key | Value |
|---|---|
| trigger | tap header toggles expanded |
| states | collapsed / expanded |

#### Layout

| Key | Value |
|---|---|
| collapsed | 只显示标题和摘要行 |
| expanded | 显示完整正文或子内容 |

#### Motion

| Key | Value |
|---|---|
| height | 容器高度连续展开/收起 |
| content | 正文 opacity 或 small translate 同步进入 |
| indicator | chevron / plus-minus 与内容状态同步变化 |

#### Acceptance

- 展开和收起都在同一块容器内完成，不是切页面。

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
struct ExpandableView: View {
    @State private var isExpanded = false

    var body: some View {
        DisclosureGroup("详细信息", isExpanded: $isExpanded) {
            VStack(alignment: .leading, spacing: 8) {
                Text("展开内容行 1")
                Text("展开内容行 2")
                Text("展开内容行 3")
            }
            .padding(.top, 8)
        }
        .animation(.snappy(duration: 0.3), value: isExpanded)
        .padding()
    }
}

// 自定义展开/折叠
struct CustomExpandable: View {
    @State private var showContent = false

    var body: some View {
        VStack(spacing: 0) {
            Button {
                withAnimation(.snappy(duration: 0.3)) {
                    showContent.toggle()
                }
            } label: {
                HStack {
                    Text("展开更多")
                    Image(systemName: "chevron.down")
                        .rotationEffect(.degrees(showContent ? 180 : 0))
                }
            }

            if showContent {
                DetailContent()
                    .transition(.opacity.combined(with: .move(edge: .top)))
            }
        }
        .clipped()
    }
}
```

