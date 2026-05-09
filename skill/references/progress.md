# Progress

线性与环形进度反馈。

## Linear Progress Bar

- Preview ID：`ios-progress-bar`
- Tags：`0.3s` (duration) · `.snappy` (spring)

### AI Motion Spec

线性进度条通过填充宽度连续增长表达完成度。

#### Trigger & State

| Key | Value |
|---|---|
| trigger | progress value changes |
| states | 0..1 continuous value |

#### Motion

| Key | Value |
|---|---|
| fill | 前景条宽度随 value 连续插值 |
| direction | 从左向右增长，不回抽 |

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
struct ProgressBarView: View {
    @State private var progress: Double = 0.0

    var body: some View {
        VStack(spacing: 20) {
            ProgressView(value: progress)
                .progressViewStyle(.linear)
                .tint(.accentColor)

            // 自定义进度条
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: 4)
                        .fill(Color(.systemGray5))

                    RoundedRectangle(cornerRadius: 4)
                        .fill(Color.accentColor)
                        .frame(
                            width: geo.size.width * progress
                        )
                }
            }
            .frame(height: 8)
        }
    }

    func updateProgress(to value: Double) {
        withAnimation(.snappy(duration: 0.3)) {
            progress = value
        }
    }
}
// .snappy(duration: 0.3) — 无回弹, 快速到位
```

---

## Circular Progress Ring

- Preview ID：`ios-progress-ring`
- Tags：`1.0s` (duration) · `.easeOut` (easing)

### AI Motion Spec

环形进度通过圆弧 sweep 增长表达完成度，保持端点干净。

#### Trigger & State

| Key | Value |
|---|---|
| trigger | progress value changes |
| states | 0..1 continuous value |

#### Motion

| Key | Value |
|---|---|
| arc | trim / strokeEnd 连续增长 |
| cap | 圆头端点时要避免抖动 |

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
struct ProgressRingView: View {
    @State private var progress: Double = 0.0
    let lineWidth: CGFloat = 8

    var body: some View {
        ZStack {
            // 背景环
            Circle()
                .stroke(
                    Color(.systemGray5),
                    lineWidth: lineWidth
                )

            // 进度环
            Circle()
                .trim(from: 0, to: progress)
                .stroke(
                    Color.accentColor,
                    style: StrokeStyle(
                        lineWidth: lineWidth,
                        lineCap: .round
                    )
                )
                .rotationEffect(.degrees(-90))
                .animation(
                    .easeOut(duration: 1.0),
                    value: progress
                )

            Text("\(Int(progress * 100))%")
                .font(.system(.title2, design: .rounded))
                .fontWeight(.semibold)
        }
        .frame(width: 120, height: 120)
    }

    func setProgress(_ value: Double) {
        progress = value
    }
}
```

