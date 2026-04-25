import type { CardsSection } from "@/types/motion";

export const tooltipSection: CardsSection = {
  type: "cards",
  title: "Tooltip / Popover",
  description: "提示层与 Popover 过渡。",
  cards: [
    {
      title: "Popover 弹出",
      tags: [
        { text: "0.25s", variant: "duration" },
        { text: ".spring", variant: "spring" },
      ],
      previewId: "ios-tooltip",
      codes: {
        swift: `// SwiftUI — .popover 系统弹出
struct PopoverDemo: View {
    @State private var showPopover = false

    var body: some View {
        Button("显示 Popover") {
            showPopover = true
        }
        .popover(isPresented: $showPopover) {
            VStack(spacing: 12) {
                Text("提示信息")
                    .font(.headline)
                Text("这是一个 Popover 弹出内容")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
            .padding()
            .presentationCompactAdaptation(.popover)
        }
    }
}
// 系统 popover 动画: scale + opacity, ~0.25s spring

// 自定义 Tooltip
struct TooltipView: View {
    @State private var showTooltip = false

    var body: some View {
        Text("长按查看提示")
            .onLongPressGesture {
                withAnimation(
                    .spring(response: 0.25, dampingFraction: 0.8)
                ) {
                    showTooltip = true
                }
            }
            .overlay(alignment: .top) {
                if showTooltip {
                    TooltipBubble(text: "这是提示内容")
                        .offset(y: -50)
                        .transition(
                            .scale(scale: 0.8, anchor: .bottom)
                            .combined(with: .opacity)
                        )
                }
            }
    }
}

struct TooltipBubble: View {
    let text: String

    var body: some View {
        Text(text)
            .font(.caption)
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(Color(.systemGray6))
            .clipShape(RoundedRectangle(cornerRadius: 8))
            .shadow(radius: 4)
    }
}`,
        uikit: `// UIKit — UIPopoverPresentationController
class PopoverDemoVC: UIViewController {
    func showPopover(from sourceView: UIView) {
        let contentVC = TooltipContentVC()
        contentVC.modalPresentationStyle = .popover
        contentVC.preferredContentSize = CGSize(
            width: 240,
            height: 100
        )

        if let popover =
            contentVC.popoverPresentationController {
            popover.sourceView = sourceView
            popover.sourceRect = sourceView.bounds
            popover.permittedArrowDirections = [.up, .down]
            popover.delegate = self
        }

        present(contentVC, animated: true)
        // 系统动画: scale + opacity, ~0.25s spring
    }
}

extension PopoverDemoVC:
    UIPopoverPresentationControllerDelegate {
    func adaptivePresentationStyle(
        for controller: UIPresentationController
    ) -> UIModalPresentationStyle {
        .none // iPhone 上也保持 popover 样式
    }
}

// 自定义 Tooltip 动画
class CustomTooltip: UIView {
    func show(from anchor: UIView) {
        transform = CGAffineTransform(scaleX: 0.8, y: 0.8)
        alpha = 0

        // 设置锚点到底部中心
        layer.anchorPoint = CGPoint(x: 0.5, y: 1.0)

        UIView.animate(
            withDuration: 0.25,
            delay: 0,
            usingSpringWithDamping: 0.8,
            initialSpringVelocity: 0,
            options: [],
            animations: {
                self.transform = .identity
                self.alpha = 1
            }
        )
    }

    func dismiss() {
        UIView.animate(
            withDuration: 0.15,
            delay: 0,
            options: .curveEaseIn,
            animations: {
                self.alpha = 0
                self.transform =
                    CGAffineTransform(scaleX: 0.9, y: 0.9)
            },
            completion: { _ in self.removeFromSuperview() }
        )
    }
}`,
      },
    },
  ],
};
