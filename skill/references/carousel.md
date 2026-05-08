# Carousel

分页轮播与焦点切换效果。

## Full-Screen Pager

- Preview ID：`ios-carousel`
- Tags：`0.4s` (duration) · `easeOutQuint` (easing)

### AI Motion Spec

全屏 pager 轮播：每页完整占满视口宽度，图片化 slide，无阴影，底部只保留数量锚点。

#### Trigger & State

| Key | Value |
|---|---|
| trigger | horizontal swipe or dot click |
| states | logical page index in infinite loop |

#### Layout

| Key | Value |
|---|---|
| slide_content | 用真实图片而不是纯色块 |
| shadow | 去掉 slide 投影 |
| nav | 不显示左右按钮，只保留 dots |

#### Motion

| Key | Value |
|---|---|
| paging | 整页水平切换 |
| looping | 允许无限循环时要做无缝复位 |
| duration | 约 0.4s，ease-out 风格 |

### SwiftUI

```swift
// SwiftUI — TabView pager（最经典）
struct PagerView: View {
    @State private var current = 0
    // 自动播放：每 {{speedSec}} 秒翻一页（无限循环）
    let timer = Timer.publish(every: {{speedSec}}, on: .main, in: .common)
        .autoconnect()

    var body: some View {
        TabView(selection: $current) {
            ForEach(0..<pages.count, id: \.self) { i in
                PageCard(index: i).tag(i)
            }
        }
        .tabViewStyle(.page(indexDisplayMode: .always))
        .animation(.snappy(duration: 0.4), value: current)
        .onReceive(timer) { _ in
            withAnimation(.snappy(duration: 0.4)) {
                current = (current + 1) % pages.count
            }
        }
    }
}
```

### UIKit

```swift
// UIKit — UIPageViewController + 自动播放定时器
class PagerVC: UIPageViewController {
    private var autoplayTimer: Timer?

    init() {
        super.init(
            transitionStyle: .scroll,
            navigationOrientation: .horizontal,
            options: [.interPageSpacing: 16]
        )
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        // 自动循环：每 {{speedSec}} 秒翻一页
        autoplayTimer = Timer.scheduledTimer(
            withTimeInterval: {{speedSec}},
            repeats: true
        ) { [weak self] _ in
            self?.advanceToNextPage()
        }
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        autoplayTimer?.invalidate()
    }
}
```

---

## Peek Carousel

- Preview ID：`ios-carousel-peek`
- Tags：`0.45s` (duration) · `spring` (spring)

### AI Motion Spec

居中主卡 + 两侧露边的轮播，当前项最清晰，相邻项只露出一部分。

#### Trigger & State

| Key | Value |
|---|---|
| trigger | swipe or dot click |
| states | active centered card index |

#### Layout

| Key | Value |
|---|---|
| peek_rule | 两侧要露出相邻卡的一部分 |
| slide_content | 使用图片卡，不用纯色块 |
| shadow | 去掉卡片投影 |

#### Motion

| Key | Value |
|---|---|
| focus | 当前卡 opacity 最高，相邻卡略弱 |
| translation | 整个轨道连续滑动，active 始终回到中心 |

### SwiftUI

```swift
// iOS 17+ — ScrollView paging + 露出相邻卡片
struct PeekCarousel: View {
    @State private var index = 0
    let timer = Timer.publish(every: {{speedSec}}, on: .main, in: .common)
        .autoconnect()

    var body: some View {
        ScrollView(.horizontal) {
            LazyHStack(spacing: 12) {
                ForEach(items.indices, id: \.self) { i in
                    CardView(item: items[i])
                        .containerRelativeFrame(.horizontal,
                            count: 1,
                            span: 1,
                            spacing: 12
                        )
                        .id(i)
                }
            }
            .scrollTargetLayout()
        }
        .contentMargins(.horizontal, 32, for: .scrollContent)
        .scrollTargetBehavior(.viewAligned)
        .scrollIndicators(.hidden)
        .scrollPosition(id: .init(get: { index }, set: { index = $0 ?? 0 }))
        // 自动播放：每 {{speedSec}} 秒推进一张
        .onReceive(timer) { _ in
            withAnimation(.snappy(duration: 0.45)) {
                index = (index + 1) % items.count
            }
        }
    }
}
```

### UIKit

```swift
// UIKit — UICollectionView + 自动播放
let layout = UICollectionViewFlowLayout()
layout.scrollDirection = .horizontal
layout.minimumLineSpacing = 12
layout.itemSize = CGSize(
    width: view.bounds.width - 64, // 两边留 32 露出
    height: 120
)
collectionView.contentInset = UIEdgeInsets(
    top: 0, left: 32, bottom: 0, right: 32
)
collectionView.decelerationRate = .fast

// 自动循环：每 {{speedSec}} 秒滚动到下一张
autoplayTimer = Timer.scheduledTimer(
    withTimeInterval: {{speedSec}},
    repeats: true
) { [weak self] _ in
    guard let self else { return }
    let next = (currentIndex + 1) % items.count
    let path = IndexPath(item: next, section: 0)
    collectionView.scrollToItem(
        at: path, at: .centeredHorizontally, animated: true
    )
    currentIndex = next
}
```

---

## Scale Fade (scrollTransition)

- Preview ID：`ios-carousel-scale`
- Tags：`iOS 18+` (duration) · `scale + opacity` (easing)

### AI Motion Spec

中间卡最大最清晰，边缘卡等比缩小并淡化；卡面使用图片，不要纯色和投影。

#### Trigger & State

| Key | Value |
|---|---|
| trigger | swipe or dot click |
| states | distance from active index drives scale and opacity |

#### Motion

| Key | Value |
|---|---|
| active | center card scale 1 / opacity 1 |
| side_cards | 根据离中心的距离连续缩小并淡化 |
| curve | 平移与缩放同一时间线 |

#### Constraints

| Key | Value |
|---|---|
| scale_mode | 只做等比缩放，不挤压内容 |
| shadow | 去掉阴影，靠图片和层级表达焦点 |

### SwiftUI

```swift
// iOS 18+ — scrollTransition 让边缘卡片缩放并淡化
struct ScaleCarousel: View {
    @State private var index = 0
    let timer = Timer.publish(every: {{speedSec}}, on: .main, in: .common)
        .autoconnect()

    var body: some View {
        ScrollView(.horizontal) {
            LazyHStack(spacing: 16) {
                ForEach(items.indices, id: \.self) { i in
                    CardView(item: items[i])
                        .scrollTransition(
                            axis: .horizontal
                        ) { content, phase in
                            content
                                .scaleEffect(
                                    phase.isIdentity ? 1.0 : 0.85
                                )
                                .opacity(
                                    phase.isIdentity ? 1.0 : 0.5
                                )
                        }
                        .id(i)
                }
            }
            .scrollTargetLayout()
        }
        .scrollTargetBehavior(.viewAligned)
        .scrollPosition(id: .init(get: { index }, set: { index = $0 ?? 0 }))
        // 自动播放：每 {{speedSec}} 秒推进
        .onReceive(timer) { _ in
            withAnimation(.snappy(duration: 0.45)) {
                index = (index + 1) % items.count
            }
        }
    }
}
```

### UIKit

```swift
// UIKit — UIScrollViewDelegate 中根据偏移量计算
func scrollViewDidScroll(_ scrollView: UIScrollView) {
    let center = scrollView.bounds.midX
    for cell in collectionView.visibleCells {
        let cellCenter = cell.convert(
            CGPoint(x: cell.bounds.midX, y: 0),
            to: collectionView
        ).x
        let distance = abs(cellCenter - center)
        let maxDistance = scrollView.bounds.width
        let ratio = max(0, 1 - distance / maxDistance)
        let scale = 0.85 + 0.15 * ratio
        let alpha = 0.5 + 0.5 * ratio
        cell.transform = CGAffineTransform(
            scaleX: scale, y: scale
        )
        cell.alpha = alpha
    }
}

// 自动循环：每 {{speedSec}} 秒滚到下一张
autoplayTimer = Timer.scheduledTimer(
    withTimeInterval: {{speedSec}},
    repeats: true
) { [weak self] _ in
    self?.advanceToNextItem()
}
```

---

## Cover Flow

- Preview ID：`ios-carousel-coverflow`
- Tags：`0.5s` (duration) · `rotate3D + perspective` (easing)

### AI Motion Spec

Cover Flow 依赖透视和 Y 轴旋转：中心卡正对用户，两侧卡向外翻转。

#### Trigger & State

| Key | Value |
|---|---|
| trigger | swipe or dot click |
| states | offset from active index determines angle and depth |

#### Motion

| Key | Value |
|---|---|
| perspective | 必须有 3D perspective |
| rotation | 边缘卡 rotateY，中心卡 angle = 0 |
| scale | 非中心卡略缩小 |

#### Constraints

| Key | Value |
|---|---|
| slide_content | 用图片卡面，不要纯色块 |
| shadow | 去掉投影，靠 translateZ/rotation 表达空间 |

### SwiftUI

```swift
// SwiftUI — Cover Flow（rotation3DEffect）
struct CoverFlowCarousel: View {
    @State private var index = 0
    let timer = Timer.publish(every: {{speedSec}}, on: .main, in: .common)
        .autoconnect()

    var body: some View {
        ScrollView(.horizontal) {
            HStack(spacing: 0) {
                ForEach(items.indices, id: \.self) { i in
                    CoverCard(item: items[i])
                        .scrollTransition(
                            axis: .horizontal
                        ) { content, phase in
                            content
                                .rotation3DEffect(
                                    .degrees(phase.value * -45),
                                    axis: (x: 0, y: 1, z: 0),
                                    perspective: 0.5
                                )
                                .scaleEffect(
                                    phase.isIdentity ? 1.0 : 0.8
                                )
                        }
                        .id(i)
                }
            }
            .scrollTargetLayout()
        }
        .scrollTargetBehavior(.viewAligned)
        .scrollPosition(id: .init(get: { index }, set: { index = $0 ?? 0 }))
        // 自动循环：每 {{speedSec}} 秒切换一张
        .onReceive(timer) { _ in
            withAnimation(.snappy(duration: 0.5)) {
                index = (index + 1) % items.count
            }
        }
    }
}
```

### UIKit

```swift
// UIKit — CATransform3D + CALayer
func updateCoverFlow() {
    let center = scrollView.contentOffset.x +
                 scrollView.bounds.width / 2
    for cell in collectionView.visibleCells {
        let cellCenter = cell.center.x
        let offset = (cellCenter - center) /
                     scrollView.bounds.width
        let angle = -offset * .pi / 4 // ±45°

        var transform = CATransform3DIdentity
        transform.m34 = -1.0 / 500 // perspective
        transform = CATransform3DRotate(
            transform, angle, 0, 1, 0
        )
        let scale = 1 - abs(offset) * 0.2
        transform = CATransform3DScale(
            transform, scale, scale, 1
        )
        cell.layer.transform = transform
    }
}

// 自动循环：每 {{speedSec}} 秒推进一张
autoplayTimer = Timer.scheduledTimer(
    withTimeInterval: {{speedSec}},
    repeats: true
) { [weak self] _ in
    self?.advanceToNextItem()
}
```

