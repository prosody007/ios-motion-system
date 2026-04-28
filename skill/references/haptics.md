# Haptics · 触觉反馈

触觉反馈与动画配合方式。

## .sensoryFeedback (iOS 17+)

- Preview ID：`ios-haptic-impact`
- Tags：`iOS 17+` (easing) · `声明式` (spring)

### SwiftUI

```swift
// SwiftUI iOS 17+ — .sensoryFeedback 修饰器
// 当 trigger 值变化时自动触发触觉反馈

// 1. 按钮点击 — impact
Button("保存") { save() }
    .sensoryFeedback(.impact, trigger: saveCount)

// 2. 成功/失败 — 搭配状态变化
ContentView()
    .sensoryFeedback(.success, trigger: didSave)
    .sensoryFeedback(.error, trigger: didFail)

// 3. 选择变化 — picker / slider
Picker("选项", selection: $selected) { ... }
    .sensoryFeedback(.selection, trigger: selected)

// 4. 自定义 impact 强度和重量
Button("Drop") { dropped.toggle() }
    .sensoryFeedback(
        .impact(weight: .heavy, intensity: 0.8),
        trigger: dropped
    )

// 5. 条件触觉 — 根据新旧值决定反馈类型
List(items) { ... }
    .sensoryFeedback(trigger: items.count) { oldVal, newVal in
        if newVal > oldVal { return .impact(weight: .light) }
        if newVal < oldVal { return .warning }
        return nil
    }

// 全部 SensoryFeedback 类型：
// 状态:  .success  .warning  .error
// 数值:  .increase .decrease .levelChange .selection
// 物理:  .impact  .impact(weight:intensity:)
//        weight: .light | .medium | .heavy
//        intensity: 0.0 ~ 1.0
// 活动:  .start  .stop
// 对齐:  .alignment  .pathComplete
```

### UIKit

```swift
// UIKit — UIFeedbackGenerator (iOS 10+)
// 三种 Generator，手动调用

// 1. Impact — 物理碰撞反馈
let impact = UIImpactFeedbackGenerator(style: .medium)
impact.prepare()  // 预热，降低首次延迟
impact.impactOccurred()

// style: .light | .medium | .heavy | .rigid | .soft
// 带强度: impact.impactOccurred(intensity: 0.7)

// 2. Notification — 操作结果反馈
let notification = UINotificationFeedbackGenerator()
notification.prepare()
notification.notificationOccurred(.success)  // 或 .warning .error

// 3. Selection — 连续选择反馈
let selection = UISelectionFeedbackGenerator()
selection.prepare()
selection.selectionChanged()  // Picker/Slider 每档切换调用

// 使用场景对照：
// .light    → 轻量切换（segmented control 切换）
// .medium   → 标准按钮点击（推荐默认）
// .heavy    → 重要操作（删除确认、长按菜单弹出）
// .rigid    → 刚性碰撞（拖拽到边界吸附）
// .soft     → 柔性碰撞（弹性释放回弹结束）
//
// .success  → Face ID 解锁、支付完成
// .warning  → 接近限额、电量低
// .error    → 密码错误、网络失败
//
// .selection → UIPickerView 滚动、Slider 刻度
```

---

## 动画 + 触觉配对模式

- Preview ID：`ios-haptic-notification`
- Tags：`最佳实践` (duration) · `配对参考` (easing)

### SwiftUI

```swift
// SwiftUI — 动画与触觉配对的标准模式

// 模式 1: 按钮缩放 + impact
struct HapticButton: View {
    @State private var tapCount = 0

    var body: some View {
        Button("Tap") { tapCount += 1 }
            .buttonStyle(ScaleButtonStyle())
            .sensoryFeedback(.impact(weight: .medium), trigger: tapCount)
    }
}

// 模式 2: 状态切换 + success/error
struct SaveView: View {
    @State private var saved = false

    var body: some View {
        Button("Save") {
            withAnimation(.snappy) { saved = true }
        }
        .sensoryFeedback(.success, trigger: saved)
    }
}

// 模式 3: Toggle + selection
struct SettingToggle: View {
    @State private var isOn = false

    var body: some View {
        Toggle("Wi-Fi", isOn: $isOn)
            .sensoryFeedback(.selection, trigger: isOn)
    }
}

// 模式 4: 拖拽吸附 + rigid impact
struct SnapView: View {
    @State private var snapped = false

    var body: some View {
        DraggableItem()
            .sensoryFeedback(
                .impact(weight: .heavy, intensity: 1.0),
                trigger: snapped
            )
    }
}

// 模式 5: 删除 + warning
struct DeleteView: View {
    @State private var deleted = false

    var body: some View {
        List { ... }
            .sensoryFeedback(.warning, trigger: deleted)
    }
}
```

### UIKit

```swift
// UIKit — 动画与触觉配对

// 模式 1: 按钮缩放 + impact
class HapticButton: UIButton {
    private let impact = UIImpactFeedbackGenerator(style: .medium)

    func animatePress() {
        impact.prepare()
        UIView.animate(withDuration: 0.1, delay: 0,
            options: [.curveEaseInOut, .allowUserInteraction],
            animations: {
                self.transform = CGAffineTransform(scaleX: 0.95, y: 0.95)
            }
        ) { _ in
            self.impact.impactOccurred()
            UIView.animate(withDuration: 0.1) {
                self.transform = .identity
            }
        }
    }
}

// 模式 2: Spring 回弹结束 + soft impact
func snapBack(view: UIView) {
    let soft = UIImpactFeedbackGenerator(style: .soft)
    soft.prepare()

    UIView.animate(
        withDuration: 0.35, delay: 0,
        usingSpringWithDamping: 0.86,
        initialSpringVelocity: 0,
        animations: { view.transform = .identity },
        completion: { _ in soft.impactOccurred() }
    )
}

// 模式 3: 删除行 + notification
func deleteRow(at indexPath: IndexPath) {
    let notification = UINotificationFeedbackGenerator()
    notification.prepare()

    tableView.performBatchUpdates({
        dataSource.remove(at: indexPath.row)
        tableView.deleteRows(at: [indexPath], with: .automatic)
    }) { _ in
        notification.notificationOccurred(.success)
    }
}

// 时机原则：
// 1. 触觉在动画的"落点"触发（不是开始）
// 2. 按下时触觉 + 释放时动画，或动画结束时触觉
// 3. 不要在动画过程中连续触发触觉
// 4. prepare() 在可预见的触发前 ~0.1s 调用
```

---

## Selection 连续选择反馈

- Preview ID：`ios-haptic-selection`
- Tags：`.selection` (easing) · `Picker / Segmented` (duration)

### SwiftUI

```swift
// SwiftUI — Selection 反馈（连续离散选择）
// 每次选项变化时触发一次轻微的"刻度感"

// Segmented Control
@State private var selected = 0

Picker("Size", selection: $selected) {
    Text("S").tag(0)
    Text("M").tag(1)
    Text("L").tag(2)
    Text("XL").tag(3)
}
.pickerStyle(.segmented)
.sensoryFeedback(.selection, trigger: selected)

// Stepper
@State private var count = 0
Stepper("数量: \(count)", value: $count, in: 0...100)
    .sensoryFeedback(.selection, trigger: count)

// 自定义滑块刻度
@State private var sliderValue = 0.5
Slider(value: $sliderValue, in: 0...1, step: 0.1)
    .sensoryFeedback(.selection, trigger: sliderValue)

// .selection 的特征：
// 非常轻微的"咔哒"感
// 适合快速连续触发（不会造成干扰）
// 系统 Picker 滚轮自带此反馈
```

### UIKit

```swift
// UIKit — UISelectionFeedbackGenerator

class SegmentedController: UIViewController {
    private let selection = UISelectionFeedbackGenerator()
    private var currentIndex = 0

    func setupSegmentedControl() {
        let sc = UISegmentedControl(items: ["S", "M", "L", "XL"])
        sc.selectedSegmentIndex = 0
        sc.addTarget(self, action: #selector(changed), for: .valueChanged)
        selection.prepare()
    }

    @objc private func changed(_ sender: UISegmentedControl) {
        if sender.selectedSegmentIndex != currentIndex {
            selection.selectionChanged()
            currentIndex = sender.selectedSegmentIndex
        }
    }
}

// UIPickerView 自带 selection 反馈
// UIDatePicker 自带 selection 反馈
// 自定义 CollectionView 选择：
func collectionView(_ cv: UICollectionView, didSelectItemAt indexPath: IndexPath) {
    selection.selectionChanged()
    // 搭配选中动画：
    UIView.animate(
        withDuration: 0.2,
        delay: 0,
        usingSpringWithDamping: 0.8,
        initialSpringVelocity: 0,
        animations: {
            cell.transform = CGAffineTransform(scaleX: 0.95, y: 0.95)
        }
    ) { _ in
        UIView.animate(withDuration: 0.15) {
            cell.transform = .identity
        }
    }
}
```

---

## Increase / Decrease 数值反馈

- Preview ID：`ios-haptic-increase-decrease`
- Tags：`.increase / .decrease` (spring) · `iOS 17+` (easing)

### SwiftUI

```swift
// SwiftUI — 数值增减反馈
// 根据数值变化方向自动选择反馈类型

// 方式 1: 自动判断方向
@State private var volume = 50

Slider(value: .init(
    get: { Double(volume) },
    set: { volume = Int($0) }
), in: 0...100)
.sensoryFeedback(trigger: volume) { oldVal, newVal in
    if newVal > oldVal { return .increase }
    if newVal < oldVal { return .decrease }
    return nil
}

// 方式 2: 步进器
@State private var quantity = 1

Stepper("数量: \(quantity)", value: $quantity, in: 1...99)
    .sensoryFeedback(trigger: quantity) { old, new in
        new > old ? .increase : .decrease
    }

// 方式 3: 点赞计数
@State private var likes = 0

Button("♥ \(likes)") {
    withAnimation(.bouncy) { likes += 1 }
}
.sensoryFeedback(.increase, trigger: likes)

// .increase — 上升感的触觉脉冲
// .decrease — 下降感的触觉脉冲
// .levelChange — 到达新档位（如音量从静音到有声）

// 适用场景：
// 滑块拖动、步进器增减、计数器、投票、评分
```

### UIKit

```swift
// UIKit — Increase/Decrease 没有直接等价
// 用 Impact + 不同强度模拟

class StepperView: UIView {
    private let impactLight = UIImpactFeedbackGenerator(style: .light)
    private let impactMedium = UIImpactFeedbackGenerator(style: .medium)

    func increment() {
        impactLight.impactOccurred()
        // 搭配缩放弹跳动画
        animateBounce(scale: 1.05)
    }

    func decrement() {
        impactLight.impactOccurred(intensity: 0.5)
        animateBounce(scale: 0.97)
    }

    func reachLimit() {
        // 到达边界用 notification
        let notification = UINotificationFeedbackGenerator()
        notification.notificationOccurred(.warning)
        animateShake()
    }

    private func animateBounce(scale: CGFloat) {
        UIView.animate(
            withDuration: 0.15,
            delay: 0,
            usingSpringWithDamping: 0.5,
            initialSpringVelocity: 0,
            animations: {
                self.label.transform = CGAffineTransform(scaleX: scale, y: scale)
            }
        ) { _ in
            UIView.animate(
                withDuration: 0.2,
                delay: 0,
                usingSpringWithDamping: 0.8,
                initialSpringVelocity: 0,
                animations: {
                    self.label.transform = .identity
                }
            )
        }
    }
}
```

