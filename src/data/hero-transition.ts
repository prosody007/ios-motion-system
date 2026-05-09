import type { CardsSection } from "@/types/motion";

export const heroTransitionSection: CardsSection = {
  type: "cards",
  title: "Hero Transition",
  description: "共享元素与图片转场。",
  cards: [
    {
      title: "Hero Image Transition",
      tags: [
        { text: "iOS 18+", variant: "easing" },
        { text: "0.4s", variant: "duration" },
      ],
      previewId: "ios-hero",
      code: `// React — TODO: replace with the React implementation that mirrors the preview.
struct HeroTransitionDemo: View {
    @Namespace private var heroNamespace

    var body: some View {
        NavigationStack {
            ScrollView {
                LazyVGrid(columns: [GridItem(.adaptive(minimum: 120))]) {
                    ForEach(photos) { photo in
                        NavigationLink(value: photo) {
                            Image(photo.name)
                                .resizable()
                                .scaledToFill()
                                .frame(width: 120, height: 120)
                                .clipShape(RoundedRectangle(cornerRadius: 12))
                                .matchedTransitionSource(
                                    id: photo.id,
                                    in: heroNamespace
                                )
                        }
                    }
                }
            }
            .navigationDestination(for: Photo.self) { photo in
                Image(photo.name)
                    .resizable()
                    .scaledToFit()
                    .navigationTransition(
                        .zoom(sourceID: photo.id, in: heroNamespace)
                    )
            }
        }
    }
}

// Fallback: matchedGeometryEffect (iOS 16)
struct HeroFallbackView: View {
    @Namespace private var ns
    @State private var showDetail = false
    let photoId = "hero-photo"

    var body: some View {
        ZStack {
            if !showDetail {
                Image("thumbnail")
                    .matchedGeometryEffect(id: photoId, in: ns)
                    .onTapGesture {
                        withAnimation(.spring(response: 0.4, dampingFraction: 0.85)) {
                            showDetail = true
                        }
                    }
            } else {
                Image("thumbnail")
                    .resizable()
                    .scaledToFit()
                    .matchedGeometryEffect(id: photoId, in: ns)
                    .onTapGesture {
                        withAnimation(.spring(response: 0.4, dampingFraction: 0.85)) {
                            showDetail = false
                        }
                    }
            }
        }
    }
}`,
    },
  ],
};
