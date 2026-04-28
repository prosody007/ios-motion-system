# Tab Bar · 标签栏

标签栏切换与角标反馈。

## Tab 切换弹跳

- Preview ID：`ios-tabbar-bounce`
- Tags：`0.22s` (duration) · `.bouncy` (spring)

### SwiftUI

```swift
// SwiftUI — 自定义 TabBar，Scan / Study / Me
// 设计规范：
//   • active  = #007AFF  字重 600
//   • inactive = #989B9E 字重 500
//   • 字号 10pt Inter，图标 24×24
@State private var selected = 0

struct TabItem: Identifiable {
    let id = UUID()
    let icon: String   // SF Symbol or Asset name
    let label: String
}

let tabs: [TabItem] = [
    .init(icon: "qrcode.viewfinder", label: "Scan"),
    .init(icon: "book.fill",         label: "Study"),
    .init(icon: "person.crop.circle",label: "Me"),
]

HStack(alignment: .center, spacing: 0) {
    ForEach(Array(tabs.enumerated()), id: \.1.id) { index, tab in
        let active = selected == index
        VStack(spacing: 2) {
            Image(systemName: tab.icon)
                .font(.system(size: 20))
                .frame(width: 24, height: 24)
                .symbolEffect(.bounce.down.byLayer, value: selected == index)
            Text(tab.label)
                .font(.system(size: 10, weight: active ? .semibold : .medium))
        }
        .foregroundStyle(active ? Color(hex: 0x007AFF) : Color(hex: 0x989B9E))
        .frame(maxWidth: .infinity)
        .contentShape(Rectangle())
        .onTapGesture {
            withAnimation(.bouncy(duration: 0.22)) {
                selected = index
            }
        }
    }
}
.padding(.bottom, 6)
.background(Color.white)
.overlay(alignment: .top) {
    Rectangle()
        .fill(Color(hex: 0xF6F8FA))
        .frame(height: 1)
}
```

### UIKit

```swift
// UIKit — 自定义 TabBar，Scan / Study / Me
final class TabBarView: UIView {
    private let stack = UIStackView()
    private let topLine = UIView()
    private var items: [(icon: UIImageView, label: UILabel)] = []

    private let active   = UIColor(red: 0/255, green: 122/255, blue: 255/255, alpha: 1)
    private let inactive = UIColor(red: 152/255, green: 155/255, blue: 158/255, alpha: 1)

    func select(index: Int) {
        for (i, (icon, label)) in items.enumerated() {
            let isActive = i == index
            let color = isActive ? active : inactive
            label.textColor = color
            icon.tintColor   = color
            label.font = .systemFont(
                ofSize: 10,
                weight: isActive ? .semibold : .medium
            )
            if isActive {
                icon.transform = CGAffineTransform(scaleX: 0.88, y: 0.88)
                UIView.animate(
                    withDuration: 0.22,
                    delay: 0,
                    usingSpringWithDamping: 0.65,
                    initialSpringVelocity: 0.3
                ) {
                    icon.transform = .identity
                }
            }
        }
    }
}

// 样式规范
stack.distribution = .fillEqually    // 3 Tab 等分
stack.alignment    = .center
icon.frame = CGRect(x: 0, y: 0, width: 24, height: 24)
label.font = .systemFont(ofSize: 10, weight: .medium)
topLine.backgroundColor = UIColor(white: 0.965, alpha: 1) // #F6F8FA
```

---

## Badge 脉冲

- Preview ID：`ios-tabbar-badge`
- Tags：`0.3s` (duration) · `spring overshoot` (easing)

### SwiftUI

```swift
// SwiftUI — Badge 计数变化时的 pop 动画
@State private var count = 3
@State private var bump = false

ZStack(alignment: .topTrailing) {
    Image(systemName: "book.fill")
        .font(.system(size: 20))
        .foregroundStyle(.secondary)
        .frame(width: 48, height: 48)

    Text("\(count)")
        .font(.caption2.bold())
        .foregroundStyle(.white)
        .padding(.horizontal, 5)
        .frame(minWidth: 20, minHeight: 20)
        .background(Color.red, in: Capsule())
        .offset(x: 6, y: -6)
        .scaleEffect(bump ? 1.18 : 1.0)
        .animation(.spring(duration: 0.3, bounce: 0.5), value: bump)
}
.onChange(of: count) { _, _ in
    bump = true
    DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
        bump = false
    }
}
```

### UIKit

```swift
// UIKit — Badge 计数 pop 动画
func bumpBadge(_ badge: UIView) {
    badge.transform = CGAffineTransform(scaleX: 1.18, y: 1.18)
    UIView.animate(
        withDuration: 0.3,
        delay: 0,
        usingSpringWithDamping: 0.5,
        initialSpringVelocity: 0.4,
        options: [.beginFromCurrentState]
    ) {
        badge.transform = .identity
    }
}
```

