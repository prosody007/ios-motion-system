# Scroll-Driven

滚动驱动的位移、缩放与视差。

## Header Scale

- Preview ID：`ios-scroll-header`
- Tags：`实时跟随` (easing) · `无 duration` (duration)

### SwiftUI

```swift
// SwiftUI — 滚动驱动 Header 缩放 (iOS 18+)
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
                    ForEach(0..<30, id: \.self) { i in
                        Text("Item \(i)")
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
}
```

### UIKit

```swift
// UIKit — UIScrollViewDelegate 驱动 Header
class ScrollHeaderViewController: UIViewController,
    UIScrollViewDelegate {

    private var headerView: UIImageView!
    private var scrollView: UIScrollView!

    override func viewDidLoad() {
        super.viewDidLoad()

        scrollView = UIScrollView()
        scrollView.delegate = self
        view.addSubview(scrollView)

        headerView = UIImageView(image: UIImage(named: "header"))
        headerView.contentMode = .scaleAspectFill
        headerView.clipsToBounds = true
        headerView.frame = CGRect(x: 0, y: 0, width: view.bounds.width, height: 250)
        scrollView.addSubview(headerView)
    }

    func scrollViewDidScroll(_ scrollView: UIScrollView) {
        let offsetY = scrollView.contentOffset.y

        // 下拉放大
        if offsetY < 0 {
            let scale = 1.0 + abs(offsetY) / 500.0
            headerView.transform = CGAffineTransform(
                scaleX: min(scale, 1.5),
                y: min(scale, 1.5)
            )
        } else {
            headerView.transform = .identity
        }

        // 上滑渐隐
        let opacity = 1.0 - max(0, offsetY) / 200.0
        headerView.alpha = max(opacity, 0)
    }
}
```

---

## Parallax

- Preview ID：`ios-scroll-parallax`
- Tags：`0.5x 系数` (easing) · `实时` (duration)

### SwiftUI

```swift
// SwiftUI — 视差滚动
struct ParallaxScrollView: View {
    let parallaxFactor: CGFloat = 0.5

    var body: some View {
        ScrollView {
            LazyVStack(spacing: 16) {
                ForEach(0..<10, id: \.self) { index in
                    GeometryReader { geo in
                        let midY = geo.frame(in: .global).midY
                        let screenMid = UIScreen.main.bounds.height / 2
                        let offset = (midY - screenMid) * parallaxFactor

                        Image("photo_\(index)")
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
}
```

### UIKit

```swift
// UIKit — scrollViewDidScroll 视差
class ParallaxViewController: UIViewController,
    UITableViewDelegate, UITableViewDataSource {

    private let parallaxFactor: CGFloat = 0.5
    private var tableView: UITableView!

    override func viewDidLoad() {
        super.viewDidLoad()
        tableView = UITableView()
        tableView.delegate = self
        tableView.dataSource = self
        tableView.register(ParallaxCell.self, forCellReuseIdentifier: "cell")
        view.addSubview(tableView)
    }

    func scrollViewDidScroll(_ scrollView: UIScrollView) {
        for cell in tableView.visibleCells {
            guard let parallaxCell = cell as? ParallaxCell else { continue }
            let cellFrame = tableView.convert(cell.frame, to: view)
            let centerY = cellFrame.midY
            let screenMid = view.bounds.height / 2
            let offset = (centerY - screenMid) * parallaxFactor
            parallaxCell.imageOffset = offset
        }
    }
}

class ParallaxCell: UITableViewCell {
    private let parallaxImage = UIImageView()

    var imageOffset: CGFloat = 0 {
        didSet {
            parallaxImage.transform = CGAffineTransform(
                translationX: 0,
                y: imageOffset
            )
        }
    }
}
```

