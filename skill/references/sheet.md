# Sheet

Sheet 与模态面板过渡。

## Bottom Sheet

- Preview ID：`ios-sheet-bottom`
- Tags：`0.45s` (duration) · `interactiveSpring` (spring)

### AI Motion Spec

底部 sheet 从底部上拉进入，支持背景 dim 和阻尼回落。

#### Trigger & State

| Key | Value |
|---|---|
| trigger | tap open / drag close |
| states | closed / open / dragging |

#### Motion

| Key | Value |
|---|---|
| entry | sheet 从底部上移进入 |
| drag | 支持跟手拖拽和阈值决定关闭/回弹 |
| backdrop | 背景 dim 与 sheet 进度同步 |

### SwiftUI

```swift
// SwiftUI — 标准 Sheet
@State private var showSheet = false

Button("Show Sheet") { showSheet = true }
    .sheet(isPresented: $showSheet) {
        SheetContent()
            .presentationDetents([.medium, .large])
            .presentationDragIndicator(.visible)
            .presentationCornerRadius(20)
    }

// iOS 16+ Sheet 参数：
// .presentationDetents — 停靠高度
// .presentationBackgroundInteraction(.enabled) — 背景可交互
// 动画曲线: 系统默认 ~0.45s interactiveSpring
```

### UIKit

```swift
// UIKit — 标准 Sheet
let vc = SheetViewController()

// iOS 15+ Sheet 配置
if let sheet = vc.sheetPresentationController {
    sheet.detents = [.medium(), .large()]
    sheet.prefersGrabberVisible = true
    sheet.preferredCornerRadius = 20
    sheet.prefersScrollingExpandsWhenScrolledToEdge = true
    sheet.largestUndimmedDetentIdentifier = .medium
}

present(vc, animated: true)

// 系统动画参数：
// duration ≈ 0.45s
// curve ≈ cubic-bezier(0.32, 0.72, 0, 1)
```

---

## Sheet Flow (A → B)

- Preview ID：`ios-sheet-switch`
- Tags：`dismiss + present` (duration) · `open: 0.6s` (duration) · `close: 0.3s` (duration)

### AI Motion Spec

在一个 sheet 内从 A 内容切到 B 内容，容器保持稳定，内容做阶段切换。

#### Trigger & State

| Key | Value |
|---|---|
| trigger | button or step action switches sheet content |
| states | sheet A / sheet B |

#### Motion

| Key | Value |
|---|---|
| container | 外层 sheet 不消失，只切内部内容 |
| content | 旧内容退场，新内容进场 |

### SwiftUI

```swift
// SwiftUI — Sheet A 选择后，收起再弹出 Sheet B
enum ActiveSheet: Identifiable {
    case picker
    case detail(String)

    var id: String {
        switch self {
        case .picker: return "picker"
        case .detail(let value): return "detail-\(value)"
        }
    }
}

@State private var activeSheet: ActiveSheet?
@State private var pendingSelection: String?

Button("Show Flow") {
    activeSheet = .picker
}
.sheet(item: $activeSheet, onDismiss: {
    guard let pendingSelection else { return }
    // 等 A 完全收起，再弹出 B，避免系统 sheet 冲突
    DispatchQueue.main.asyncAfter(deadline: .now() + 0.30) {
        activeSheet = .detail(pendingSelection)
        self.pendingSelection = nil
    }
}) { route in
    switch route {
    case .picker:
        PickerSheet { choice in
            pendingSelection = choice
            activeSheet = nil
        }
        .presentationDetents([.medium])
        .presentationCornerRadius(20)

    case .detail(let choice):
        DetailSheet(choice: choice)
            .presentationDetents([.medium, .large])
            .presentationCornerRadius(20)
    }
}

struct PickerSheet: View {
    var onSelect: (String) -> Void

    var body: some View {
        VStack(spacing: 12) {
            Button("Family") { onSelect("Family") }
            Button("Friends") { onSelect("Friends") }
            Button("Work") { onSelect("Work") }
        }
        .padding()
    }
}
```

### UIKit

```swift
// UIKit — dismiss Sheet A, then present Sheet B
final class PickerSheetViewController: UIViewController {
    var onSelect: ((String) -> Void)?
}

func presentPickerFlow() {
    let picker = PickerSheetViewController()

    if let sheet = picker.sheetPresentationController {
        sheet.detents = [.medium()]
        sheet.prefersGrabberVisible = true
        sheet.preferredCornerRadius = 20
    }

    picker.onSelect = { [weak self, weak picker] choice in
        guard let self, let picker else { return }

        picker.dismiss(animated: true) {
            let detail = DetailSheetViewController(choice: choice)
            if let sheet = detail.sheetPresentationController {
                sheet.detents = [.medium(), .large()]
                sheet.prefersGrabberVisible = true
                sheet.preferredCornerRadius = 20
            }
            self.present(detail, animated: true)
        }
    }

    present(picker, animated: true)
}
```

