import type { CardsSection } from "@/types/motion";

export const scrollDrivenSection: CardsSection = {
  type: "cards",
  title: "Scroll-Driven",
  description: "滚动驱动的位移、缩放与视差。",
  cards: [
    {
      title: "Header Scale",
      tags: [
        { text: "实时跟随", variant: "easing" },
        { text: "无 duration", variant: "duration" },
      ],
      previewId: "ios-scroll-header",
      code: `// React — TODO: replace with the React implementation that mirrors the preview.
struct ScrollHeaderView: View {
    @State private var scrollOffset: CGFloat = 0

    var headerScale: CGFloat {
        let scale = 1.0 + max(0, -scrollOffset) / 500.0
        return min(scale, 1.5)
    }
    var headerOpacity: CGFloat {
        let opacity = 1.0 - max(0, scrollOffset) / 200.0
        return max(opacity, 0)
    }

    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                Image("header")
                    .resizable()
                    .scaledToFill()
                    .frame(height: 250)
                    .scaleEffect(headerScale)
                    .opacity(headerOpacity)
                    .clipped()

                LazyVStack {
                    ForEach(0..<30, id: \\.self) { i in
                        Text("Item \\(i)")
                            .frame(maxWidth: .infinity, minHeight: 60)
                    }
                }
            }
        }
        .onScrollGeometryChange(for: CGFloat.self) { geo in
            geo.contentOffset.y
        } action: { _, newOffset in
            scrollOffset = newOffset
        }
    }
}

// Fallback: GeometryReader (iOS 16)
struct ScrollHeaderFallback: View {
    var body: some View {
        ScrollView {
            GeometryReader { geo in
                let offset = geo.frame(in: .named("scroll")).minY
                Image("header")
                    .resizable()
                    .scaledToFill()
                    .scaleEffect(1.0 + max(0, -offset) / 500.0)
                    .opacity(1.0 - max(0, offset) / 200.0)
            }
            .frame(height: 250)
        }
        .coordinateSpace(name: "scroll")
    }
}`,
    },
    {
      title: "Parallax",
      tags: [
        { text: "0.5x 系数", variant: "easing" },
        { text: "实时", variant: "duration" },
      ],
      previewId: "ios-scroll-parallax",
      code: `// React — TODO: replace with the React implementation that mirrors the preview.
struct ParallaxScrollView: View {
    let parallaxFactor: CGFloat = 0.5

    var body: some View {
        ScrollView {
            LazyVStack(spacing: 16) {
                ForEach(0..<10, id: \\.self) { index in
                    GeometryReader { geo in
                        let midY = geo.frame(in: .global).midY
                        let screenMid = UIScreen.main.bounds.height / 2
                        let offset = (midY - screenMid) * parallaxFactor

                        Image("photo_\\(index)")
                            .resizable()
                            .scaledToFill()
                            .offset(y: offset)
                            .clipped()
                    }
                    .frame(height: 240)
                    .clipShape(RoundedRectangle(cornerRadius: 16))
                }
            }
            .padding()
        }
    }
}`,
    },
  ],
};
