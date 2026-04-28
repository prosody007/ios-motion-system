import type { CardsSection } from "@/types/motion";

export const carouselSection: CardsSection = {
  type: "cards",
  title: "Carousel · 轮播",
  description:
    "分页轮播与焦点切换效果。",
  cards: [
    {
      title: "全屏 Pager 翻页",
      tags: [
        { text: "0.4s", variant: "duration" },
        { text: "easeOutQuint", variant: "easing" },
      ],
      previewId: "ios-carousel",
      codes: {
        swift: `// SwiftUI — TabView pager（最经典）
struct PagerView: View {
    @State private var current = 0
    // 自动播放：每 {{speedSec}} 秒翻一页（无限循环）
    let timer = Timer.publish(every: {{speedSec}}, on: .main, in: .common)
        .autoconnect()

    var body: some View {
        TabView(selection: $current) {
            ForEach(0..<pages.count, id: \\.self) { i in
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
}`,
        uikit: `// UIKit — UIPageViewController + 自动播放定时器
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
}`,
      },
    },
    {
      title: "卡片露边轮播 (Peek)",
      tags: [
        { text: "0.45s", variant: "duration" },
        { text: "spring", variant: "spring" },
      ],
      previewId: "ios-carousel-peek",
      codes: {
        swift: `// iOS 17+ — ScrollView paging + 露出相邻卡片
struct PeekCarousel: View {
    @State private var index = 0
    let timer = Timer.publish(every: {{speedSec}}, on: .main, in: .common)
        .autoconnect()

    var body: some View {
        ScrollView(.horizontal) {
            LazyHStack(spacing: 12) {
                ForEach(items.indices, id: \\.self) { i in
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
}`,
        uikit: `// UIKit — UICollectionView + 自动播放
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
}`,
      },
    },
    {
      title: "缩放渐隐 (scrollTransition)",
      tags: [
        { text: "iOS 18+", variant: "duration" },
        { text: "scale + opacity", variant: "easing" },
      ],
      previewId: "ios-carousel-scale",
      codes: {
        swift: `// iOS 18+ — scrollTransition 让边缘卡片缩放并淡化
struct ScaleCarousel: View {
    @State private var index = 0
    let timer = Timer.publish(every: {{speedSec}}, on: .main, in: .common)
        .autoconnect()

    var body: some View {
        ScrollView(.horizontal) {
            LazyHStack(spacing: 16) {
                ForEach(items.indices, id: \\.self) { i in
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
}`,
        uikit: `// UIKit — UIScrollViewDelegate 中根据偏移量计算
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
}`,
      },
    },
    {
      title: "Cover Flow 3D 旋转",
      tags: [
        { text: "0.5s", variant: "duration" },
        { text: "rotate3D + perspective", variant: "easing" },
      ],
      previewId: "ios-carousel-coverflow",
      codes: {
        swift: `// SwiftUI — Cover Flow（rotation3DEffect）
struct CoverFlowCarousel: View {
    @State private var index = 0
    let timer = Timer.publish(every: {{speedSec}}, on: .main, in: .common)
        .autoconnect()

    var body: some View {
        ScrollView(.horizontal) {
            HStack(spacing: 0) {
                ForEach(items.indices, id: \\.self) { i in
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
}`,
        uikit: `// UIKit — CATransform3D + CALayer
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
}`,
      },
    },
  ],
};
