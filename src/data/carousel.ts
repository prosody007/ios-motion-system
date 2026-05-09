import type { CardsSection } from "@/types/motion";

export const carouselSection: CardsSection = {
  type: "cards",
  title: "Carousel",
  description:
    "分页轮播与焦点切换效果。",
  cards: [
    {
      title: "Full-Screen Pager",
      tags: [
        { text: "0.4s", variant: "duration" },
        { text: "easeOutQuint", variant: "easing" },
      ],
      previewId: "ios-carousel",
      code: `// React — TODO: replace with the React implementation that mirrors the preview.
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
    },
    {
      title: "Peek Carousel",
      tags: [
        { text: "0.45s", variant: "duration" },
        { text: "spring", variant: "spring" },
      ],
      previewId: "ios-carousel-peek",
      code: `// React — TODO: replace with the React implementation that mirrors the preview.
// iOS 17+ — ScrollView paging + 露出相邻卡片
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
    },
    {
      title: "Scale Fade (scrollTransition)",
      tags: [
        { text: "iOS 18+", variant: "duration" },
        { text: "scale + opacity", variant: "easing" },
      ],
      previewId: "ios-carousel-scale",
      code: `// React — TODO: replace with the React implementation that mirrors the preview.
// iOS 18+ — scrollTransition 让边缘卡片缩放并淡化
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
    },
    {
      title: "Cover Flow",
      tags: [
        { text: "0.5s", variant: "duration" },
        { text: "rotate3D + perspective", variant: "easing" },
      ],
      previewId: "ios-carousel-coverflow",
      code: `// React — TODO: replace with the React implementation that mirrors the preview.
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
    },
  ],
};
