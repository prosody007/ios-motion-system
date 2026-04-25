import type { CardsSection } from "@/types/motion";

export const segmentedSection: CardsSection = {
  type: "cards",
  title: "Segmented Control",
  description: "分段控件切换动画：点击 tab 切换。",
  cards: [
    {
      title: "Segmented Control",
      tags: [
        { text: "0.34s", variant: "duration" },
        { text: ".snappy", variant: "spring" },
      ],
      previewId: "ios-segmented",
      codes: {
        swift: `// SwiftUI — 系统 Picker
@State private var selection = 0

Picker("Mode", selection: $selection) {
    Text("Daily").tag(0)
    Text("Weekly").tag(1)
    Text("Monthly").tag(2)
}
.pickerStyle(.segmented)
// 系统内部使用 ~0.34s snappy 曲线

// 自定义滑动指示器（文字样式保持不变）：
@Namespace private var ns
@State private var active = 0
let items = ["Daily", "Weekly", "Monthly"]

HStack(spacing: 0) {
    ForEach(Array(items.enumerated()), id: \\.offset) { i, item in
        Text(item)
            .font(.footnote.weight(.medium))
            .foregroundStyle(.primary)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 6)
            .background {
                if active == i {
                    Capsule()
                        .fill(.white)
                        .matchedGeometryEffect(id: "seg", in: ns)
                        .shadow(color: .black.opacity(0.12), radius: 2, y: 1)
                }
            }
            .contentShape(Rectangle())
            .onTapGesture {
                withAnimation(.snappy(duration: 0.34)) { active = i }
            }
    }
}
.padding(2)
.background(Color(.systemFill), in: Capsule())`,
        uikit: `// UIKit — 自定义 Segmented Control（点击切换，文字样式保持不变）
class SlidingSegmented: UIControl {
    private let thumb = UIView()
    private var labels: [UILabel] = []
    private(set) var selectedIndex = 0
    private let items: [String]

    init(items: [String]) {
        self.items = items
        super.init(frame: .zero)
        backgroundColor = UIColor.systemFill
        layer.cornerCurve = .continuous

        thumb.backgroundColor = .systemBackground
        thumb.layer.cornerCurve = .continuous
        thumb.layer.shadowColor = UIColor.black.cgColor
        thumb.layer.shadowOpacity = 0.12
        thumb.layer.shadowOffset = CGSize(width: 0, height: 3)
        thumb.layer.shadowRadius = 3
        addSubview(thumb)

        for item in items {
            let l = UILabel()
            l.text = item
            l.font = .systemFont(ofSize: 13, weight: .medium)
            l.textColor = .label
            l.textAlignment = .center
            addSubview(l)
            labels.append(l)
        }

        let tap = UITapGestureRecognizer(target: self, action: #selector(handleTap))
        addGestureRecognizer(tap)
    }
    required init?(coder: NSCoder) { fatalError() }

    override func layoutSubviews() {
        super.layoutSubviews()
        layer.cornerRadius = bounds.height / 2
        thumb.layer.cornerRadius = max(0, (bounds.height - 4) / 2)
    }

    @objc private func handleTap(_ g: UITapGestureRecognizer) {
        let segW = bounds.width / CGFloat(items.count)
        let idx = Int(g.location(in: self).x / segW)
        select(min(max(0, idx), items.count - 1))
    }

    func select(_ index: Int) {
        selectedIndex = index
        UIView.animate(
            withDuration: 0.34, delay: 0,
            usingSpringWithDamping: 0.86, initialSpringVelocity: 0
        ) {
            let segW = self.bounds.width / CGFloat(self.items.count)
            self.thumb.frame.origin.x = CGFloat(index) * segW + 2
        }
        sendActions(for: .valueChanged)
    }
}

// 系统 UISegmentedControl：
let seg = UISegmentedControl(items: ["Daily", "Weekly", "Monthly"])
seg.selectedSegmentIndex = 0
// 系统 ~0.34s snappy 滑块过渡动画`,
      },
    },
  ],
};
