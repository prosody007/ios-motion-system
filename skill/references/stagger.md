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

### SwiftUI

```swift
// SwiftUI — ForEach stagger 入场
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

### UIKit

```swift
// UIKit — stagger 延迟入场
class StaggerListVC: UIViewController {
    let stackView = UIStackView()

    func animateItemsIn() {
        let subviews = stackView.arrangedSubviews

        for view in subviews {
            view.alpha = 0
            view.transform = CGAffineTransform(translationX: 0, y: 20)
        }

        for (index, view) in subviews.enumerated() {
            UIView.animate(
                withDuration: 0.4,
                delay: Double(index) * 0.05,
                usingSpringWithDamping: 0.8,
                initialSpringVelocity: 0,
                options: [],
                animations: {
                    view.alpha = 1
                    view.transform = .identity
                }
            )
        }
    }
}
// 每个 item 延迟 50ms
// 总入场时长 ≈ 0.4s + count * 0.05s
```

