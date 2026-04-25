import type { CardsSection } from "@/types/motion";

export const expandableSection: CardsSection = {
  type: "cards",
  title: "展开/折叠",
  description: "内容展开与折叠过渡。",
  cards: [
    /* Matched Geometry 卡片折叠/展开 — 共享元素式的展开/折叠 */
    {
      title: "Matched Geometry · 卡片折叠展开",
      tags: [
        { text: "open: 0.40s", variant: "spring" },
        { text: "close: 0.24s", variant: "spring" },
      ],
      previewId: "ios-spring-matched-geometry",
      codes: {
        swift: `// SwiftUI — 标题 matched，正文从截断 → 完整两段
// 动画规则：入场 0.40s 让眼睛看清新内容；出场 0.24s 用 Apple 招牌的柔和曲线收掉
@State private var expanded = false

struct HabitCard: View {
    @Binding var expanded: Bool

    private var animation: Animation {
        expanded
            ? .smooth(duration: 0.40, extraBounce: 0)
            // (0.32, 0.72, 0, 1) → SwiftUI 没有内置同名预设，最接近的是 .smooth
            : .smooth(duration: 0.24, extraBounce: 0)
    }

    var body: some View {
        VStack(alignment: .leading, spacing: expanded ? 32 : 16) {
            Text("小さな習慣が、人生の輪郭をつくる")
                .font(.system(size: 24, weight: .semibold))
                .foregroundStyle(.black)

            if expanded {
                VStack(alignment: .leading, spacing: 24) {
                    Text(paragraph1)
                    Text(paragraph2)
                }
                .font(.system(size: 16, weight: .light))
                .foregroundStyle(.black)
                .transition(.opacity.animation(.easeOut(duration: 0.24).delay(0.16)))
            } else {
                Text(previewText)
                    .font(.system(size: 16, weight: .light))
                    .foregroundStyle(.black)
                    .lineLimit(1)
                    .truncationMode(.tail)
                    .transition(.opacity.animation(.easeIn(duration: 0.10).delay(0.08)))
            }
        }
        .padding(.horizontal, 24)
        .padding(.vertical, 32)
        .frame(maxWidth: 528, alignment: .leading)
        .background(
            RoundedRectangle(cornerRadius: 20)
                .fill(.white)
                .shadow(color: .black.opacity(0.06), radius: 12, y: 4)
        )
        .onTapGesture {
            withAnimation(animation) { expanded.toggle() }
        }
    }
}`,
        uikit: `// UIKit — 入场 0.40s / 出场 0.24s，出场用 Apple 柔和曲线 (0.32, 0.72, 0, 1)
@IBAction func toggle() {
    expanded.toggle()

    let duration: TimeInterval = expanded ? 0.40 : 0.24
    let timing: UICubicTimingParameters = expanded
        ? UICubicTimingParameters(controlPoint1: CGPoint(x: 0.22, y: 1),
                                  controlPoint2: CGPoint(x: 0.36, y: 1))
        : UICubicTimingParameters(controlPoint1: CGPoint(x: 0.32, y: 0.72),
                                  controlPoint2: CGPoint(x: 0, y: 1))

    let anim = UIViewPropertyAnimator(duration: duration, timingParameters: timing)
    anim.addAnimations {
        self.previewLabel.alpha = self.expanded ? 0 : 1
        self.fullStack.alpha = self.expanded ? 1 : 0
        self.previewLabel.isHidden = self.expanded
        self.fullStack.isHidden = !self.expanded
        self.stackView.spacing = self.expanded ? 32 : 16
        self.view.layoutIfNeeded()
    }
    anim.startAnimation()
}

// 关键：所有变化放在同一个 animate block + layoutIfNeeded()，
// 让 AutoLayout 的约束变化、alpha、isHidden 共享同一条曲线。`,
      },
    },
    {
      title: "Expandable Content",
      tags: [
        { text: "0.3s", variant: "duration" },
        { text: ".snappy", variant: "spring" },
      ],
      previewId: "ios-expandable",
      codes: {
        swift: `// SwiftUI — DisclosureGroup 展开/折叠
struct ExpandableView: View {
    @State private var isExpanded = false

    var body: some View {
        DisclosureGroup("详细信息", isExpanded: $isExpanded) {
            VStack(alignment: .leading, spacing: 8) {
                Text("展开内容行 1")
                Text("展开内容行 2")
                Text("展开内容行 3")
            }
            .padding(.top, 8)
        }
        .animation(.snappy(duration: 0.3), value: isExpanded)
        .padding()
    }
}

// 自定义展开/折叠
struct CustomExpandable: View {
    @State private var showContent = false

    var body: some View {
        VStack(spacing: 0) {
            Button {
                withAnimation(.snappy(duration: 0.3)) {
                    showContent.toggle()
                }
            } label: {
                HStack {
                    Text("展开更多")
                    Image(systemName: "chevron.down")
                        .rotationEffect(.degrees(showContent ? 180 : 0))
                }
            }

            if showContent {
                DetailContent()
                    .transition(.opacity.combined(with: .move(edge: .top)))
            }
        }
        .clipped()
    }
}`,
        uikit: `// UIKit — UITableView cell 展开/折叠
class ExpandableCell: UITableViewCell {
    var isExpanded = false
    let detailLabel = UILabel()
    var heightConstraint: NSLayoutConstraint!
}

class ExpandableTableVC: UITableViewController {
    var expandedIndexPaths: Set<IndexPath> = []

    override func tableView(
        _ tableView: UITableView,
        didSelectRowAt indexPath: IndexPath
    ) {
        tableView.deselectRow(at: indexPath, animated: true)

        if expandedIndexPaths.contains(indexPath) {
            expandedIndexPaths.remove(indexPath)
        } else {
            expandedIndexPaths.insert(indexPath)
        }

        tableView.beginUpdates()
        tableView.endUpdates()

        UIView.animate(
            withDuration: 0.3,
            delay: 0,
            usingSpringWithDamping: 1.0,
            initialSpringVelocity: 0,
            options: .curveEaseInOut,
            animations: {
                if let cell = tableView.cellForRow(at: indexPath)
                    as? ExpandableCell {
                    cell.detailLabel.alpha =
                        self.expandedIndexPaths.contains(indexPath) ? 1 : 0
                }
                tableView.layoutIfNeeded()
            }
        )
    }

    override func tableView(
        _ tableView: UITableView,
        heightForRowAt indexPath: IndexPath
    ) -> CGFloat {
        expandedIndexPaths.contains(indexPath) ? 120 : 52
    }
}`,
      },
    },
  ],
};
