# Counter

数字过渡与计数变化效果。

## ContentTransition Counter

- Preview ID：`ios-counter-text`
- Tags：`0.3s` (duration) · `.snappy` (spring)

### AI Motion Spec

数字文本过渡：数字更新时做内容替换动画，而不是整块闪烁。

#### Trigger & State

| Key | Value |
|---|---|
| trigger | numeric value changes |

#### Motion

| Key | Value |
|---|---|
| content_transition | 仅数字内容变化，容器尽量稳定 |

### SwiftUI

```swift
// SwiftUI — .contentTransition(.numericText())
struct NumericCounterView: View {
    @State private var count = 0

    var body: some View {
        VStack(spacing: 20) {
            Text("\(count)")
                .font(.system(size: 64, weight: .bold, design: .rounded))
                .monospacedDigit()
                .contentTransition(.numericText())

            Button("增加") {
                withAnimation(.snappy) {
                    count += 1
                }
            }
        }
    }
}
```

### UIKit

```swift
// UIKit — CATransition push 模拟数字滚动
class NumericCounterViewController: UIViewController {
    private let label = UILabel()
    private var count = 0

    override func viewDidLoad() {
        super.viewDidLoad()
        label.font = .monospacedDigitSystemFont(ofSize: 64, weight: .bold)
        label.textAlignment = .center
        label.text = "0"
        view.addSubview(label)

        let button = UIButton(type: .system)
        button.setTitle("增加", for: .normal)
        button.addTarget(self, action: #selector(increment), for: .touchUpInside)
        view.addSubview(button)
    }

    @objc private func increment() {
        count += 1

        let transition = CATransition()
        transition.type = .push
        transition.subtype = .fromTop
        transition.duration = 0.3
        transition.timingFunction = CAMediaTimingFunction(name: .easeInEaseOut)
        label.layer.add(transition, forKey: "numericTransition")
        label.text = "\(count)"
    }
}
```

---

## Custom Counter

- Preview ID：`ios-counter-custom`
- Tags：`1.0s` (duration) · `easeOutCubic` (easing)

### AI Motion Spec

自定义 counter：按位或分段处理数字变化，强调可控的数字滚动/替换。

#### Motion

| Key | Value |
|---|---|
| digit_rule | 数字变化按位或按片段执行，不整块抖动 |
| continuity | 旧值到新值的方向感明确 |

### SwiftUI

```swift
// SwiftUI — TimelineView + 自定义插值
struct CustomCounterView: View {
    @State private var targetValue: Double = 0
    @State private var displayValue: Double = 0
    @State private var animationStart: Date = .now

    let duration: Double = 1.0

    var body: some View {
        TimelineView(.animation) { context in
            let elapsed = context.date.timeIntervalSince(animationStart)
            let progress = min(elapsed / duration, 1.0)
            let eased = 1.0 - pow(1.0 - progress, 3) // easeOutCubic

            let current = displayValue + (targetValue - displayValue) * eased

            Text("\(Int(current))")
                .font(.system(size: 64, weight: .bold, design: .rounded))
                .monospacedDigit()
        }

        Button("设为 1000") {
            displayValue = targetValue
            targetValue = 1000
            animationStart = .now
        }
    }
}
```

### UIKit

```swift
// UIKit — CADisplayLink + easeOutCubic 插值
class CustomCounterViewController: UIViewController {
    private let label = UILabel()
    private var displayLink: CADisplayLink?
    private var startTime: CFTimeInterval = 0
    private var fromValue: Double = 0
    private var toValue: Double = 0
    private let duration: CFTimeInterval = 1.0

    override func viewDidLoad() {
        super.viewDidLoad()
        label.font = .monospacedDigitSystemFont(ofSize: 64, weight: .bold)
        label.textAlignment = .center
        label.text = "0"
        view.addSubview(label)
    }

    func animateTo(_ value: Double) {
        fromValue = Double(Int(label.text ?? "0") ?? 0)
        toValue = value
        startTime = CACurrentMediaTime()

        displayLink?.invalidate()
        displayLink = CADisplayLink(
            target: self,
            selector: #selector(tick)
        )
        displayLink?.add(to: .main, forMode: .common)
    }

    @objc private func tick(_ link: CADisplayLink) {
        let elapsed = CACurrentMediaTime() - startTime
        let progress = min(elapsed / duration, 1.0)

        // easeOutCubic: 1 - (1 - t)^3
        let eased = 1.0 - pow(1.0 - progress, 3)
        let current = fromValue + (toValue - fromValue) * eased

        label.text = "\(Int(current))"

        if progress >= 1.0 {
            displayLink?.invalidate()
            displayLink = nil
        }
    }
}
```

