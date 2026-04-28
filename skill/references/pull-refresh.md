# Pull to Refresh

下拉刷新与回弹过程。

## Pull to Refresh

- Preview ID：`ios-pull-refresh`
- Tags：`0.32s` (duration) · `.spring` (spring)

### SwiftUI

```swift
import SwiftUI

// ===== 方案 A：系统原生 .refreshable（推荐）=====
// 阻尼、spinner、归位全由系统接管，行为统一

struct RefreshableDemo: View {
    @State private var items = ["Today", "Yesterday", "Last Week", "Older"]

    var body: some View {
        List(items, id: \.self) { Text($0) }
            .refreshable { await loadData() }
    }

    private func loadData() async {
        try? await Task.sleep(for: .seconds(2.25))
    }
}

// ===== 方案 B：自定义 spinner（与本 demo 参数一致）=====
// • 72% 圆弧（恒定缺口，旋转肉眼可见）
// • 下拉阶段：opacity + scale 随进度
// • 刷新：0.75s × 3 圈 = 2.25s 线性旋转
// • 归位：spring(duration: 0.32, bounce: 0.15)

struct PullSpinner: View {
    let progress: Double       // 下拉进度 0...1
    let isRefreshing: Bool
    @State private var rotation: Double = 0

    var body: some View {
        ZStack {
            Circle()
                .stroke(.black.opacity(0.15), lineWidth: 2.2)
            Circle()
                .trim(from: 0, to: 0.72)
                .stroke(
                    .black.opacity(0.75),
                    style: .init(lineWidth: 2.2, lineCap: .round)
                )
                .rotationEffect(.degrees(-90 + rotation))
        }
        .frame(width: 22, height: 22)
        .scaleEffect(0.7 + progress * 0.3)
        .opacity(isRefreshing ? 1 : progress)
        .onChange(of: isRefreshing) { _, spinning in
            if spinning {
                rotation = 0
                withAnimation(.linear(duration: 0.75 * 3)) {
                    rotation = 360 * 3
                }
            } else {
                rotation = 0
            }
        }
    }
}

struct CustomPullToRefresh<Content: View>: View {
    @ViewBuilder var content: () -> Content
    var onRefresh: () async -> Void

    @State private var pullY: CGFloat = 0
    @State private var isRefreshing = false

    private let trigger: CGFloat = 55
    private let maxPull: CGFloat = 140
    private let rubberK: CGFloat = 70   // 橡皮筋收敛系数

    var body: some View {
        ZStack(alignment: .top) {
            PullSpinner(
                progress: min(1, pullY / trigger),
                isRefreshing: isRefreshing
            )
            .padding(.top, 10)

            content()
                .offset(y: pullY)
        }
        .gesture(
            DragGesture()
                .onChanged { v in
                    guard !isRefreshing else { return }
                    pullY = dampen(v.translation.height)
                }
                .onEnded { _ in
                    guard !isRefreshing else { return }
                    if pullY >= trigger {
                        Task { await startRefresh() }
                    } else {
                        withAnimation(.spring(duration: 0.32, bounce: 0.15)) {
                            pullY = 0
                        }
                    }
                }
        )
    }

    private func dampen(_ raw: CGFloat) -> CGFloat {
        guard raw > 0 else { return 0 }
        // 临界前：线性 0.55 阻尼；临界后：指数橡皮筋逼近 maxPull
        if raw * 0.55 <= trigger {
            return raw * 0.55
        }
        let past = raw - trigger / 0.55
        let span = maxPull - trigger
        let y = trigger + span * (1 - exp(-past / rubberK))
        return min(y, maxPull)
    }

    private func startRefresh() async {
        withAnimation(.spring(duration: 0.32, bounce: 0.15)) {
            pullY = trigger
            isRefreshing = true
        }
        await onRefresh()
        try? await Task.sleep(for: .seconds(2.25))
        withAnimation(.spring(duration: 0.32, bounce: 0.15)) {
            pullY = 0
            isRefreshing = false
        }
    }
}
```

### UIKit

```swift
import UIKit

// ===== 方案 A：UIRefreshControl（推荐）=====
final class ListVC: UITableViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        let rc = UIRefreshControl()
        rc.addTarget(self, action: #selector(onRefresh), for: .valueChanged)
        tableView.refreshControl = rc
    }

    @objc private func onRefresh() {
        Task {
            try? await Task.sleep(for: .seconds(2.25))
            await MainActor.run {
                self.tableView.refreshControl?.endRefreshing()
            }
        }
    }
}

// ===== 方案 B：自定义 spinner（与本 demo 参数一致）=====
// • 72% 圆弧 · 3 圈 × 0.75s 线性旋转
// • 下拉阶段 scale + alpha 随进度
final class PullSpinnerView: UIView {
    private let track = CAShapeLayer()
    private let arc   = CAShapeLayer()
    private let size: CGFloat = 22
    private let stroke: CGFloat = 2.2
    private let trigger: CGFloat = 55

    override init(frame: CGRect) {
        super.init(frame: .init(x: 0, y: 0, width: size, height: size))
        setup()
    }
    required init?(coder: NSCoder) { fatalError("not supported") }

    private func setup() {
        let path = UIBezierPath(
            arcCenter: .init(x: size / 2, y: size / 2),
            radius: (size - stroke) / 2,
            startAngle: -.pi / 2,
            endAngle: .pi * 1.5,
            clockwise: true
        ).cgPath

        [track, arc].forEach {
            $0.path = path
            $0.fillColor = UIColor.clear.cgColor
            $0.lineWidth = stroke
            $0.lineCap = .round
            layer.addSublayer($0)
        }
        track.strokeColor = UIColor.black.withAlphaComponent(0.15).cgColor
        arc.strokeColor   = UIColor.black.withAlphaComponent(0.75).cgColor
        arc.strokeStart = 0
        arc.strokeEnd   = 0.72     // 恒定 72% 圆弧
    }

    /// 下拉阶段调用，progress = min(1, pullY / 55)
    func update(pull: CGFloat) {
        let p = min(1, max(0, pull / trigger))
        CATransaction.begin()
        CATransaction.setDisableActions(true)
        let s = 0.7 + p * 0.3
        transform = CGAffineTransform(scaleX: s, y: s)
        alpha = p
        CATransaction.commit()
    }

    /// 进入刷新态：3 圈线性旋转
    func startSpin() {
        let r = CABasicAnimation(keyPath: "transform.rotation.z")
        r.fromValue = 0
        r.toValue   = CGFloat.pi * 2
        r.duration  = 0.75
        r.repeatCount = 3
        r.timingFunction = CAMediaTimingFunction(name: .linear)
        layer.add(r, forKey: "spin")
    }

    func stopSpin() { layer.removeAnimation(forKey: "spin") }
}

// 列表归位：等价于 web 的 cubic-bezier(0.32, 0.72, 0, 1)
// UIKit 用 spring 近似（damping 0.85 在视觉上非常接近 iOS 原生 snap）
UIView.animate(
    withDuration: 0.32,
    delay: 0,
    usingSpringWithDamping: 0.85,
    initialSpringVelocity: 0,
    options: [.beginFromCurrentState]
) {
    tableView.transform = .identity
}
```

