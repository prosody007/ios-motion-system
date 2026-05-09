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

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
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

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
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

