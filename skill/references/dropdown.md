# Dropdown

下拉菜单展开与收起过渡。

## Dropdown Menu

- Preview ID：`ios-dropdown`
- Tags：`0.2s` (duration) · `系统 spring` (spring)

### SwiftUI

```swift
// SwiftUI — Menu 下拉菜单
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

### UIKit

```swift
// UIKit — UIMenu + UIContextMenuInteraction
class DropdownVC: UIViewController {
    func setupMenu() {
        let edit = UIAction(
            title: "编辑",
            image: UIImage(systemName: "pencil")
        ) { _ in self.edit() }

        let duplicate = UIAction(
            title: "复制",
            image: UIImage(systemName: "doc.on.doc")
        ) { _ in self.duplicate() }

        let share = UIAction(
            title: "分享",
            image: UIImage(systemName: "square.and.arrow.up")
        ) { _ in self.share() }

        let delete = UIAction(
            title: "删除",
            image: UIImage(systemName: "trash"),
            attributes: .destructive
        ) { _ in self.delete() }

        let menu = UIMenu(children: [
            edit, duplicate, share, delete
        ])

        // UIButton 直接绑定菜单 (iOS 14+)
        let button = UIButton(type: .system)
        button.menu = menu
        button.showsMenuAsPrimaryAction = true

        // 或通过 UIContextMenuInteraction
        let interaction = UIContextMenuInteraction(
            delegate: self
        )
        targetView.addInteraction(interaction)
    }
}

extension DropdownVC: UIContextMenuInteractionDelegate {
    func contextMenuInteraction(
        _ interaction: UIContextMenuInteraction,
        configurationForMenuAtLocation location: CGPoint
    ) -> UIContextMenuConfiguration? {
        UIContextMenuConfiguration(
            actionProvider: { _ in
                UIMenu(children: [
                    UIAction(title: "编辑") { _ in },
                    UIAction(title: "删除",
                        attributes: .destructive) { _ in }
                ])
            }
        )
    }
}
// 系统动画: scale 0.9 → 1.0 + opacity
// duration: ~0.2s spring
// 不可自定义动画参数
```

