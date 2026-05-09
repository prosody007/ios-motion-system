# Loading

加载指示与等待反馈。

## Activity Indicator

- Preview ID：`ios-loading-spinner`
- Tags：`1.0s` (duration) · `linear repeat` (easing)

### AI Motion Spec

标准加载指示器保持纯转圈：整圈连续旋转，不带生长弧线变化。

#### Trigger & State

| Key | Value |
|---|---|
| trigger | loading starts |
| states | indeterminate loop until complete |

#### Motion

| Key | Value |
|---|---|
| rotation | 匀速整圈连续旋转 |
| continuity | 首尾闭环，不能卡顿 |

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
ProgressView()
    .progressViewStyle(.circular)
    .tint(.white)
    .scaleEffect(1.5)

// 自定义 Spinner:
struct SpinnerView: View {
    @State private var rotation: Double = 0

    var body: some View {
        Circle()
            .trim(from: 0.2, to: 1.0)
            .stroke(style: StrokeStyle(lineWidth: 3, lineCap: .round))
            .frame(width: 30, height: 30)
            .rotationEffect(.degrees(rotation))
        .frame(width: 30, height: 30)
        .onAppear {
            withAnimation(
                .linear(duration: 1.0).repeatForever(autoreverses: false)
            ) {
                rotation = 360
            }
        }
    }
}
// duration 1.0s, linear, infinite repeat
```

---

## Grow Ring

- Preview ID：`ios-loading-grow`
- Tags：`3.0s` (duration) · `grow 0→1` (easing)

### AI Motion Spec

新增的生长式 loading：灰色底环固定不动，深灰色弧线在 3 秒内从 0 -> 1 生长，长满后停住，点击 Reset 才重新播放。

#### Trigger & State

| Key | Value |
|---|---|
| trigger | loading starts |
| states | idle / growing / completed |

#### Layout

| Key | Value |
|---|---|
| track | 灰色底环固定不变 |
| foreground | 深灰色进度弧覆盖在底环之上 |

#### Motion

| Key | Value |
|---|---|
| growth | foreground arc 用 3.0s 从 0 -> 1 生长 |
| origin | 从顶部 -90deg 起始更像系统进度环 |
| reset | 完成后出现 Reset；只有点击 Reset 才重新从 0 播放 |
| constraint | 不要让灰色底环一起转动或变化；不要自动循环 |

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
struct GrowRingView: View {
    @State private var progress: CGFloat = 0
    @State private var completed = false

    var body: some View {
        VStack(spacing: 12) {
            ZStack {
                Circle()
                    .stroke(Color.black.opacity(0.10), lineWidth: 3)

                Circle()
                    .trim(from: 0, to: progress)
                    .stroke(style: StrokeStyle(lineWidth: 3, lineCap: .round))
                    .rotationEffect(.degrees(-90))
            }
            .frame(width: 30, height: 30)

            if completed {
                Button("Reset") {
                    progress = 0
                    completed = false
                    play()
                }
            }
        }
        .onAppear {
            play()
        }
    }

    private func play() {
        withAnimation(.timingCurve(0.32, 0.72, 0, 1, duration: 3.0)) {
            progress = 1
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) {
            completed = true
        }
    }
}
// 灰色底环保持不变；深色弧线 3 秒长到 1 后停住
```

