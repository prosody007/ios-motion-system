# Reorder

列表重排与拖拽占位反馈。

## List Reorder

- Preview ID：`ios-reorder`
- Tags：`0.35s` (duration) · `.snappy` (spring)

### SwiftUI

```swift
// SwiftUI — List 拖拽排序
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

### UIKit

```swift
// UIKit — UITableView 拖拽排序
class ReorderTableVC: UITableViewController {
    var items = ["项目 A", "项目 B", "项目 C", "项目 D"]

    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.isEditing = true
        tableView.dragInteractionEnabled = true
        tableView.dragDelegate = self
        tableView.dropDelegate = self
    }

    override func tableView(
        _ tableView: UITableView,
        moveRowAt sourceIndexPath: IndexPath,
        to destinationIndexPath: IndexPath
    ) {
        let item = items.remove(at: sourceIndexPath.row)
        items.insert(item, at: destinationIndexPath.row)

        tableView.beginUpdates()
        tableView.moveRow(at: sourceIndexPath, to: destinationIndexPath)
        tableView.endUpdates()

        UIView.animate(
            withDuration: 0.35,
            delay: 0,
            usingSpringWithDamping: 1.0,
            initialSpringVelocity: 0,
            options: .curveEaseInOut,
            animations: {
                tableView.layoutIfNeeded()
            }
        )
    }
}
```

