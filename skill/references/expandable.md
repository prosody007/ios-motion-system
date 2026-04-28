# Expandable

内容展开与折叠过渡。

## Expandable Content

- Preview ID：`ios-expandable`
- Tags：`0.3s` (duration) · `.snappy` (spring)

### SwiftUI

```swift
// SwiftUI — DisclosureGroup 展开/折叠
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

### UIKit

```swift
// UIKit — UITableView cell 展开/折叠
class ExpandableCell: UITableViewCell {
    var isExpanded = false
    let detailLabel = UILabel()
    var heightConstraint: NSLayoutConstraint!
}

class ExpandableTableVC: UITableViewController {
    var expandedIndexPaths: Set<IndexPath> = []

    override func tableView(
        _ tableView: UITableView,
        didSelectRowAt indexPath: IndexPath
    ) {
        tableView.deselectRow(at: indexPath, animated: true)

        if expandedIndexPaths.contains(indexPath) {
            expandedIndexPaths.remove(indexPath)
        } else {
            expandedIndexPaths.insert(indexPath)
        }

        tableView.beginUpdates()
        tableView.endUpdates()

        UIView.animate(
            withDuration: 0.3,
            delay: 0,
            usingSpringWithDamping: 1.0,
            initialSpringVelocity: 0,
            options: .curveEaseInOut,
            animations: {
                if let cell = tableView.cellForRow(at: indexPath)
                    as? ExpandableCell {
                    cell.detailLabel.alpha =
                        self.expandedIndexPaths.contains(indexPath) ? 1 : 0
                }
                tableView.layoutIfNeeded()
            }
        )
    }

    override func tableView(
        _ tableView: UITableView,
        heightForRowAt indexPath: IndexPath
    ) -> CGFloat {
        expandedIndexPaths.contains(indexPath) ? 120 : 52
    }
}
```

