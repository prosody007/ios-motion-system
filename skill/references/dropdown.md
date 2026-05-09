# Dropdown

下拉菜单展开与收起过渡。

## Dropdown Menu

- Preview ID：`ios-dropdown`
- Tags：`0.2s` (duration) · `系统 spring` (spring)

### AI Motion Spec

Dropdown 菜单围绕按钮展开，菜单项以统一容器出现而不是逐项乱飞。

#### Trigger & State

| Key | Value |
|---|---|
| trigger | tap trigger button toggles open/close |
| states | closed / open |

#### Motion

| Key | Value |
|---|---|
| container | menu container scales/fades from trigger edge |
| items | items can stagger slightly but remain within one menu panel |

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
struct DropdownDemo: View {
    var body: some View {
        Menu {
            Button(action: { edit() }) {
                Label("编辑", systemImage: "pencil")
            }
            Button(action: { duplicate() }) {
                Label("复制", systemImage: "doc.on.doc")
            }
            Button(action: { share() }) {
                Label("分享", systemImage: "square.and.arrow.up")
            }

            Divider()

            Button(role: .destructive, action: { delete() }) {
                Label("删除", systemImage: "trash")
            }
        } label: {
            Image(systemName: "ellipsis.circle")
                .font(.title2)
        }
    }
}
// 系统 Menu 动画参数:
// 弹出: scale 0.9 → 1.0 + opacity 0 → 1, ~0.2s spring
// 背景: 模糊材质 + shadow
// 收起: opacity 1 → 0, ~0.15s
// 选中: 高亮背景闪烁 → 收起

// 带 primaryAction 的 Menu
Menu {
    Button("选项 A") { }
    Button("选项 B") { }
} label: {
    Text("长按显示菜单")
} primaryAction: {
    // 点击触发主操作
    primaryAction()
}
```

