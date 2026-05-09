# Reorder

列表重排与拖拽占位反馈。

## List Reorder

- Preview ID：`ios-reorder`
- Tags：`0.35s` (duration) · `.snappy` (spring)

### AI Motion Spec

列表项长按抬起后进入拖拽重排，目标位置出现占位反馈，释放时平滑落位。

#### Trigger & State

| Key | Value |
|---|---|
| trigger | long press or drag handle starts reorder |
| states | idle / lifted / dragging / settle |

#### Motion

| Key | Value |
|---|---|
| lift_feedback | 被拖拽项轻微放大并抬高，显示浮起感 |
| sibling_reflow | 其他项根据目标位置让位，不要整列闪跳 |
| settle | release 后平滑落到最终位置 |

#### Constraints

| Key | Value |
|---|---|
| do_not_change | 不要退化成数据瞬移；必须保留占位让位过程 |
| axis | 主要沿列表主轴移动，避免多余旋转 |

#### Acceptance

- 拖动项始终跟手移动。
- 其他项会连续让位，而不是 release 后才整体重排。

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
struct ReorderableList: View {
    @State private var items = ["项目 A", "项目 B", "项目 C", "项目 D"]

    var body: some View {
        List {
            ForEach(items, id: \.self) { item in
                Text(item)
                    .padding(.vertical, 8)
            }
            .onMove { from, to in
                withAnimation(.snappy(duration: 0.35)) {
                    items.move(fromOffsets: from, toOffset: to)
                }
            }
        }
        .environment(\.editMode, .constant(.active))
    }
}
// .snappy = .spring(duration: 0.35, bounce: 0.0)
// 系统拖拽时自动应用 spring 动画到占位符和周围行
```

