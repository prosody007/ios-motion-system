# Haptics

触觉反馈与动画配合方式。

## .sensoryFeedback (iOS 17+)

- Preview ID：`ios-haptic-impact`
- Tags：`iOS 17+` (easing) · `声明式` (spring)

### AI Motion Spec

单次 impact haptic 要与视觉瞬间对齐，通常发生在接触/完成时刻。

#### Trigger & State

| Key | Value |
|---|---|
| trigger | button press or impact moment |

#### Motion

| Key | Value |
|---|---|
| sync | haptic fires on the exact visual impact frame |

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
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

---

## Animation + Haptic Pairing

- Preview ID：`ios-haptic-notification`
- Tags：`最佳实践` (duration) · `配对参考` (easing)

### AI Motion Spec

动画 + notification haptic 配对：成功/警告/失败触感要和视觉结果一致。

#### Motion

| Key | Value |
|---|---|
| pairing | haptic type matches outcome semantics |
| sync | trigger on result confirmation, not too early |

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.

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

---

## Selection Feedback

- Preview ID：`ios-haptic-selection`
- Tags：`.selection` (easing) · `Picker / Segmented` (duration)

### AI Motion Spec

selection feedback 用于轻量切换或滚动停靠，每次变化给一个轻触感。

#### Trigger & State

| Key | Value |
|---|---|
| trigger | selection index changes |

#### Motion

| Key | Value |
|---|---|
| frequency | 每次离散切换触发一次，不能连续狂震 |

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
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

---

## Increase / Decrease

- Preview ID：`ios-haptic-increase-decrease`
- Tags：`.increase / .decrease` (spring) · `iOS 17+` (easing)

### AI Motion Spec

Increase / Decrease 触感用于数值或强度变化，方向感要明确。

#### Trigger & State

| Key | Value |
|---|---|
| trigger | value increases or decreases |

#### Motion

| Key | Value |
|---|---|
| semantic | increase 和 decrease 使用不同语义反馈 |

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
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

