import type { CardsSection } from "@/types/motion";

export const alertSection: CardsSection = {
  type: "cards",
  title: "Alert · 对话框",
  description: "Alert 对话框过渡与反馈。",
  cards: [
    {
      title: "Alert 弹窗",
      tags: [
        { text: "0.25s", variant: "duration" },
        { text: "系统 spring", variant: "spring" },
      ],
      previewId: "ios-alert",
      codes: {
        swift: `// SwiftUI — .alert 系统弹窗
struct AlertDemo: View {
    @State private var showAlert = false

    var body: some View {
        Button("显示 Alert") {
            showAlert = true
        }
        .alert("提示", isPresented: $showAlert) {
            Button("取消", role: .cancel) { }
            Button("确定") { confirm() }
        } message: {
            Text("确定要执行此操作吗？")
        }
    }
}
// 系统 Alert 动画参数:
// 弹出: scale 1.1 → 1.0 + opacity 0 → 1, ~0.25s spring
// 背景: 同步添加暗色遮罩 opacity 0 → 0.4
// 收起: scale 1.0 → 0.95 + opacity 1 → 0, ~0.2s

// 自定义 Alert 复现系统效果
struct CustomAlert: View {
    @State private var isPresented = false

    var alertContent: some View {
        VStack(spacing: 0) {
            Text("标题")
                .font(.headline)
                .padding(.top, 20)

            Text("描述信息")
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .padding(.vertical, 12)
                .padding(.horizontal, 16)

            Divider()

            HStack(spacing: 0) {
                Button("取消") { dismiss() }
                    .frame(maxWidth: .infinity)
                Divider()
                Button("确定") { confirm() }
                    .fontWeight(.semibold)
                    .frame(maxWidth: .infinity)
            }
            .frame(height: 44)
        }
        .background(.regularMaterial)
        .clipShape(RoundedRectangle(cornerRadius: 14))
        .frame(width: 270)
        .scaleEffect(isPresented ? 1.0 : 1.1)
        .opacity(isPresented ? 1.0 : 0)
        .animation(
            .spring(response: 0.25, dampingFraction: 0.9),
            value: isPresented
        )
    }
}`,
        uikit: `// UIKit — UIAlertController 系统弹窗
class AlertDemoVC: UIViewController {
    func showAlert() {
        let alert = UIAlertController(
            title: "提示",
            message: "确定要执行此操作吗？",
            preferredStyle: .alert
        )

        alert.addAction(UIAlertAction(
            title: "取消",
            style: .cancel
        ))

        alert.addAction(UIAlertAction(
            title: "确定",
            style: .default,
            handler: { _ in self.confirm() }
        ))

        present(alert, animated: true)
        // animated: true → 系统 spring 动画
        // 弹出: scale 1.1 → 1.0 + opacity, ~0.25s
        // 收起: scale 1.0 → 0.95 + opacity, ~0.2s
    }

    // 自定义 Alert 过渡动画
    func presentCustomAlert(_ vc: UIViewController) {
        vc.modalPresentationStyle = .custom
        vc.transitioningDelegate = self

        let animator = AlertAnimator()
        // animator 参数:
        // scale: 1.1 → 1.0
        // alpha: 0 → 1
        // duration: 0.25
        // spring damping: 0.9

        present(vc, animated: true)
    }
}

class AlertAnimator: NSObject,
    UIViewControllerAnimatedTransitioning {
    func transitionDuration(
        using context: UIViewControllerContextTransitioning?
    ) -> TimeInterval { 0.25 }

    func animateTransition(
        using context: UIViewControllerContextTransitioning
    ) {
        guard let toView = context.view(forKey: .to) else { return }
        toView.transform = CGAffineTransform(scaleX: 1.1, y: 1.1)
        toView.alpha = 0
        context.containerView.addSubview(toView)

        UIView.animate(
            withDuration: 0.25,
            delay: 0,
            usingSpringWithDamping: 0.9,
            initialSpringVelocity: 0,
            options: [],
            animations: {
                toView.transform = .identity
                toView.alpha = 1
            },
            completion: { _ in
                context.completeTransition(true)
            }
        )
    }
}`,
      },
    },
  ],
};
