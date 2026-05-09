# Custom Transitions

自定义过渡与视图控制器转场。

## Built-in AnyTransition

- Preview ID：`ios-custom-any-transition`
- Tags：`.combined` (easing) · `.asymmetric` (easing)

### AI Motion Spec

内建 AnyTransition 组合示例：多个基础 transition 叠加，但主视觉要清晰。

#### Motion

| Key | Value |
|---|---|
| composition | combine opacity / move / scale in one transition |
| symmetry | define clear insertion and removal behavior |

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.

@State private var show = false

// 基础用法：
if show {
    CardView()
        .transition(.opacity)  // 淡入淡出
}

// 组合多个 transition：
if show {
    CardView()
        .transition(
            .move(edge: .trailing)
            .combined(with: .opacity)
        )
}

// 入场/退场使用不同动画：
if show {
    CardView()
        .transition(.asymmetric(
            insertion: .move(edge: .bottom).combined(with: .opacity),
            removal: .move(edge: .top).combined(with: .opacity)
        ))
}

Button("Toggle") {
    withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
        show.toggle()
    }
}

// 全部内置 AnyTransition：
// .opacity           — 淡入/淡出
// .scale             — 从中心缩放
// .scale(scale:anchor:) — 指定缩放比和锚点
// .slide             — 从前导/尾随边缘滑入
// .move(edge:)       — 从指定边缘滑入
// .offset(x:y:)      — 从指定偏移位置
// .push(from:)       — 推入效果（iOS 16+）
// .blurReplace       — 模糊替换（iOS 17+）

// 组合方式：
// .combined(with:) — 两个同时生效
// .asymmetric(insertion:removal:) — 入场/退场不同
// .animation(_:) — 附加独立动画曲线（覆盖外部 withAnimation）
```

---

## Custom ViewModifier Transition

- Preview ID：`ios-custom-modifier`
- Tags：`自定义` (spring) · `.modifier(active:identity:)` (easing)

### AI Motion Spec

自定义 ViewModifier Transition：插入和移除遵循同一套自定义样式规则。

#### Motion

| Key | Value |
|---|---|
| modifier_rule | transition driven by custom modifier values |
| phase | insertion/removal states must be explicit |

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
// active: 元素不可见时的状态
// identity: 元素可见时的状态（通常是正常态）

// 示例 1: 滑动 + 淡出 + 轻微缩放
struct SlideAndFade: ViewModifier {
    let isActive: Bool

    func body(content: Content) -> some View {
        content
            .offset(y: isActive ? 0 : 30)
            .opacity(isActive ? 1 : 0)
            .scaleEffect(isActive ? 1 : 0.95)
    }
}

extension AnyTransition {
    static var slideAndFade: AnyTransition {
        .modifier(
            active: SlideAndFade(isActive: false),
            identity: SlideAndFade(isActive: true)
        )
    }
}

// 使用：
if show {
    CardView()
        .transition(.slideAndFade)
}

// 示例 2: 3D 翻转
struct FlipModifier: ViewModifier {
    let angle: Double

    func body(content: Content) -> some View {
        content
            .rotation3DEffect(.degrees(angle), axis: (x: 0, y: 1, z: 0))
            .opacity(abs(angle) < 90 ? 1 : 0)
    }
}

extension AnyTransition {
    static var flip: AnyTransition {
        .asymmetric(
            insertion: .modifier(
                active: FlipModifier(angle: -90),
                identity: FlipModifier(angle: 0)
            ),
            removal: .modifier(
                active: FlipModifier(angle: 90),
                identity: FlipModifier(angle: 0)
            )
        )
    }
}

// 推荐搭配的动画：
// 滑动类: .spring(response: 0.4, dampingFraction: 0.8)
// 翻转类: .easeInOut(duration: 0.5)
```

---

## UIViewControllerAnimatedTransitioning

- Preview ID：`ios-custom-vc-transition`
- Tags：`UIKit 完全控制` (spring) · `交互式` (easing)

### AI Motion Spec

UIViewControllerAnimatedTransitioning 自定义转场：容器、截图层级和终点 frame 需要明确。

#### Trigger & State

| Key | Value |
|---|---|
| trigger | present / dismiss or push / pop via custom animator |

#### Motion

| Key | Value |
|---|---|
| container | all animated views live in transition containerView |
| geometry | origin and final frames are explicit and continuous |

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
// SwiftUI 没有直接等价 UIViewControllerAnimatedTransitioning 的 API
// 推荐方案：

// 方案 1: matchedGeometryEffect（覆盖大部分场景）
@Namespace var ns
@State var expanded = false

ZStack {
    if !expanded {
        MiniCard()
            .matchedGeometryEffect(id: "card", in: ns)
            .onTapGesture {
                withAnimation(.spring(response: 0.4, dampingFraction: 0.85)) {
                    expanded = true
                }
            }
    } else {
        ExpandedCard()
            .matchedGeometryEffect(id: "card", in: ns)
            .onTapGesture {
                withAnimation(.spring(response: 0.35, dampingFraction: 0.9)) {
                    expanded = false
                }
            }
    }
}

// 方案 2: iOS 18+ zoom transition（前一张卡片已介绍）

// 方案 3: UIViewControllerRepresentable 桥接
// 当 matchedGeometryEffect 无法满足时
// 用 UIViewControllerRepresentable 包装 UIKit VC
// 在 UIKit 侧实现完整的转场动画
```

