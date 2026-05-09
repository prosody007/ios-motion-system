# Page Transitions

页面级缩放、共享元素与全屏过渡。

## Zoom Transition (iOS 18+)

- Preview ID：`ios-page-nav-transition`
- Tags：`iOS 18+` (easing) · `系统 spring` (spring)

### AI Motion Spec

页面级 zoom transition：缩放感比普通 push 更强，但仍有明确前后层级。

#### Motion

| Key | Value |
|---|---|
| entry | destination zooms in while source recedes |
| continuity | shared source point or focal element helps orientation |

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
// 从源视图放大展开到目标页面，系统自动处理动画

@Namespace private var namespace

NavigationStack {
    ScrollView {
        LazyVGrid(columns: columns) {
            ForEach(items) { item in
                NavigationLink(value: item) {
                    ItemCard(item: item)
                        // 标记源视图
                        .matchedTransitionSource(id: item.id, in: namespace)
                }
            }
        }
    }
    .navigationDestination(for: Item.self) { item in
        DetailView(item: item)
            // 标记目标页，系统自动从源 frame 放大到全屏
            .navigationTransition(.zoom(sourceID: item.id, in: namespace))
    }
}

// 也适用于 Sheet：
.sheet(isPresented: $showDetail) {
    DetailView()
        .navigationTransition(.zoom(sourceID: selectedID, in: namespace))
}

// 系统控制的动画参数（不可自定义）：
// duration: ~0.4s
// curve: 系统 spring
// 自动插值: frame, cornerRadius, shadow
// 自动处理手势返回的交互式动画

// 注意事项：
// 1. sourceID 必须在两端匹配
// 2. 只有 .zoom(sourceID:in:) 一种转场类型
// 3. 默认 push 动画仍然是 .automatic（左右滑动）
// 4. dismiss 时自动反转回源位置
```

---

## matchedGeometryEffect

- Preview ID：`ios-page-matched-geometry`
- Tags：`iOS 14+` (easing) · `.spring(response:0.35)` (spring)

### AI Motion Spec

页面级 matched geometry：至少一个共享元素在两个页面之间连续过渡。

#### Motion

| Key | Value |
|---|---|
| shared_element | same element interpolates frame/shape between pages |
| page_content | rest of content fades or slides around the shared element |

#### Constraints

| Key | Value |
|---|---|
| do_not_change | 不要丢掉 shared element，单纯 fade 不算 matched geometry |

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
// 同一个 @Namespace + 相同 id → 系统自动插值 frame 和形状

@Namespace private var animation
@State private var showDetail = false
@State private var selectedItem: Item?

ZStack {
    // 列表态
    if !showDetail {
        LazyVGrid(columns: columns) {
            ForEach(items) { item in
                ItemCard(item: item)
                    .matchedGeometryEffect(id: item.id, in: animation)
                    .onTapGesture {
                        withAnimation(.spring(response: 0.35, dampingFraction: 0.86)) {
                            selectedItem = item
                            showDetail = true
                        }
                    }
            }
        }
    }

    // 详情态
    if showDetail, let item = selectedItem {
        DetailView(item: item)
            .matchedGeometryEffect(id: item.id, in: animation)
            .onTapGesture {
                withAnimation(.spring(response: 0.35, dampingFraction: 0.86)) {
                    showDetail = false
                    selectedItem = nil
                }
            }
    }
}

// 推荐动画参数：
// .spring(response: 0.35, dampingFraction: 0.86) — 快速、几乎无过冲
// 不要用 .easeInOut — spring 在 frame 插值时更自然

// 关键约束：
// 1. 源和目标必须用 if/else 切换，不能同时存在
// 2. id 必须是 Hashable 且在两态中匹配
// 3. frame 和 cornerRadius 自动插值
// 4. 背景色不会插值（需要手动处理）
```

---

## fullScreenCover / Sheet

- Preview ID：`ios-page-fullscreen`
- Tags：`~0.5s` (duration) · `系统 spring` (spring)

### AI Motion Spec

fullScreenCover / fullscreen modal：整页从底部或前景覆盖进入。

#### Layout

| Key | Value |
|---|---|
| placement | full screen overlay above current page |

#### Motion

| Key | Value |
|---|---|
| entry_exit | cover enters as a whole, exits as a whole |

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.

// Sheet（半屏）
@State private var showSheet = false

Button("Show Sheet") { showSheet = true }
    .sheet(isPresented: $showSheet) {
        SheetContent()
            .presentationDetents([.medium, .large])
            .presentationDragIndicator(.visible)
    }

// fullScreenCover（全屏）
@State private var showFull = false

Button("Full Screen") { showFull = true }
    .fullScreenCover(isPresented: $showFull) {
        FullScreenContent()
    }

// 系统默认动画参数（sheet 和 fullScreenCover 共用）：
// animation: .spring(response: 0.5, dampingFraction: 0.825)
// 等价 .spring(duration: 0.5, bounce: 0.0)
// 从底部向上滑入

// sheet 支持下拉手势关闭（系统自带交互式动画）
// fullScreenCover 不支持下拉关闭

// 自定义 Sheet 的 present/dismiss 动画不被官方支持
// 但可以通过 .transaction 修改：
.sheet(isPresented: $show) {
    content
        .transaction { transaction in
            transaction.animation = .spring(response: 0.3, dampingFraction: 0.8)
        }
}
```

