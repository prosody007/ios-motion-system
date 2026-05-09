# Hero Transition

共享元素与图片转场。

## Hero Image Transition

- Preview ID：`ios-hero`
- Tags：`iOS 18+` (easing) · `0.4s` (duration)

### AI Motion Spec

Hero 图片转场：同一张图片在列表和详情之间做大尺度连续放大。

#### Motion

| Key | Value |
|---|---|
| shared_image | hero image frame interpolates between source and destination |
| rest_content | supporting text/UI fades around the hero image |

#### Constraints

| Key | Value |
|---|---|
| do_not_change | 不要把 hero image 断成两张不同图片淡入淡出 |

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
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
}
```

