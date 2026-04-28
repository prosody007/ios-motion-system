# Slider / Stepper

Slider 与 Stepper 交互反馈。

## Slider Drag

- Preview ID：`ios-slider`
- Tags：`跟手` (duration) · `.selection` (easing)

### SwiftUI

```swift
// SwiftUI — Slider + 触觉反馈
@State private var value: Double = 0.5
let steps = stride(from: 0, through: 1, by: 0.25)

Slider(value: $value, in: 0...1, step: 0.25)
    .sensoryFeedback(.selection, trigger: value)
// 拖拽跟手，无额外动画
// 到达刻度时触发 .selection 触觉

// 自定义 Slider thumb 按下缩放：
@State private var isDragging = false

Circle()
    .frame(width: 28, height: 28)
    .scaleEffect(isDragging ? 1.15 : 1)
    .animation(.spring(duration: 0.2, bounce: 0.3), value: isDragging)
    .gesture(
        DragGesture(minimumDistance: 0)
            .onChanged { _ in isDragging = true }
            .onEnded { _ in isDragging = false }
    )
```

### UIKit

```swift
// UIKit — UISlider + 触觉反馈
let slider = UISlider()
slider.minimumValue = 0
slider.maximumValue = 1
slider.addTarget(self, action: #selector(sliderChanged), for: .valueChanged)

let haptic = UISelectionFeedbackGenerator()
haptic.prepare()

var lastDetent: Float = 0
@objc func sliderChanged(_ sender: UISlider) {
    let step: Float = 0.25
    let nearest = (sender.value / step).rounded() * step
    if nearest != lastDetent {
        lastDetent = nearest
        haptic.selectionChanged()
    }
}
```

---

## Stepper

- Preview ID：`ios-stepper`
- Tags：`长按加速` (duration)

### SwiftUI

```swift
// SwiftUI — 左 − 中数字 右 + 布局，到边界自动置灰
@State private var count = 1
let range = 0...99

HStack(spacing: 16) {
    Button { count = max(count - 1, range.lowerBound) } label: {
        Image(systemName: "minus")
            .frame(width: 36, height: 36)
            .background(Color(.systemGray6), in: .rect(cornerRadius: 12))
    }
    .disabled(count <= range.lowerBound)
    .opacity(count <= range.lowerBound ? 0.35 : 1)

    Text("\(count)")
        .font(.title2.weight(.semibold))
        .monospacedDigit()
        .frame(minWidth: 44)

    Button { count = min(count + 1, range.upperBound) } label: {
        Image(systemName: "plus")
            .frame(width: 36, height: 36)
            .background(Color(.systemGray6), in: .rect(cornerRadius: 12))
    }
    .disabled(count >= range.upperBound)
    .opacity(count >= range.upperBound ? 0.35 : 1)
}
// 系统 Stepper 默认支持长按自动加速（autorepeat）
// 首次 420ms 延迟后开始重复，间隔从 140ms 递减到 40ms
```

### UIKit

```swift
// UIKit — 自定义 − / + 按钮 + 长按加速
let minusBtn = UIButton(type: .system)
let plusBtn  = UIButton(type: .system)
let label    = UILabel()
label.font = .monospacedDigitSystemFont(ofSize: 22, weight: .semibold)

var count = 1 {
    didSet {
        minusBtn.isEnabled = count > 0
        plusBtn.isEnabled  = count < 99
        minusBtn.alpha = minusBtn.isEnabled ? 1 : 0.35
        plusBtn.alpha  = plusBtn.isEnabled  ? 1 : 0.35
        label.text = "\(count)"
    }
}

// 长按加速：420ms 后进入 140→40ms 的递减间隔
var holdTimer: Timer?
func startHold(_ delta: Int) {
    step(delta)
    holdTimer = Timer.scheduledTimer(withTimeInterval: 0.42,
                                     repeats: false) { _ in
        var interval: TimeInterval = 0.14
        let tick = Timer(timeInterval: interval, repeats: true) { t in
            step(delta)
            interval = max(0.04, interval * 0.92)
            t.invalidate()
            holdTimer = Timer.scheduledTimer(withTimeInterval: interval,
                                             repeats: false) { _ in tick.fire() }
        }
        RunLoop.main.add(tick, forMode: .common)
    }
}
```

