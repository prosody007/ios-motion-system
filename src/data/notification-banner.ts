import type { CardsSection } from "@/types/motion";

export const notificationBannerSection: CardsSection = {
  type: "cards",
  title: "通知横幅",
  description: "顶部横幅通知过渡。",
  cards: [
    {
      title: "Notification Banner",
      tags: [
        { text: "0.4s", variant: "duration" },
        { text: ".spring", variant: "spring" },
      ],
      previewId: "ios-notification",
      codes: {
        swift: `// SwiftUI — 通知横幅顶部滑入
struct NotificationBanner: View {
    @Binding var isPresented: Bool
    let title: String
    let subtitle: String
    let icon: String

    var body: some View {
        if isPresented {
            HStack(spacing: 12) {
                Image(systemName: icon)
                    .font(.title2)
                    .foregroundStyle(.white)
                    .frame(width: 40, height: 40)
                    .background(Color.accentColor)
                    .clipShape(RoundedRectangle(cornerRadius: 8))

                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(.subheadline)
                        .fontWeight(.semibold)
                    Text(subtitle)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                        .lineLimit(2)
                }

                Spacer()
            }
            .padding(14)
            .background(.ultraThinMaterial)
            .clipShape(RoundedRectangle(cornerRadius: 20))
            .shadow(color: .black.opacity(0.15), radius: 12, y: 4)
            .padding(.horizontal, 8)
            .transition(.move(edge: .top))
            .gesture(
                DragGesture()
                    .onEnded { value in
                        if value.translation.height < -20 {
                            dismiss()
                        }
                    }
            )
            .onAppear {
                DispatchQueue.main.asyncAfter(
                    deadline: .now() + 4.0
                ) {
                    dismiss()
                }
            }
        }
    }

    func dismiss() {
        withAnimation(
            .spring(response: 0.35, dampingFraction: 0.85)
        ) {
            isPresented = false
        }
    }
}

// 使用方式
struct ContentView: View {
    @State private var showBanner = false

    var body: some View {
        ZStack(alignment: .top) {
            MainContent()
            NotificationBanner(
                isPresented: $showBanner,
                title: "新消息",
                subtitle: "你收到了一条新消息",
                icon: "message.fill"
            )
        }
        .animation(
            .spring(response: 0.4, dampingFraction: 0.8),
            value: showBanner
        )
    }
}`,
        uikit: `// UIKit — 通知横幅顶部滑入
class NotificationBannerView: UIView {
    private let iconView = UIImageView()
    private let titleLabel = UILabel()
    private let subtitleLabel = UILabel()

    func show(
        in window: UIWindow,
        title: String,
        subtitle: String,
        autoDismissAfter: TimeInterval = 4.0
    ) {
        titleLabel.text = title
        subtitleLabel.text = subtitle

        translatesAutoresizingMaskIntoConstraints = false
        window.addSubview(self)

        NSLayoutConstraint.activate([
            leadingAnchor.constraint(
                equalTo: window.leadingAnchor, constant: 8
            ),
            trailingAnchor.constraint(
                equalTo: window.trailingAnchor, constant: -8
            ),
            topAnchor.constraint(
                equalTo: window.safeAreaLayoutGuide.topAnchor
            )
        ])

        // 初始位置: 屏幕外
        transform = CGAffineTransform(
            translationX: 0,
            y: -200
        )

        // spring 滑入
        UIView.animate(
            withDuration: 0.4,
            delay: 0,
            usingSpringWithDamping: 0.8,
            initialSpringVelocity: 0,
            options: [],
            animations: {
                self.transform = .identity
            }
        )

        // 自动消失
        DispatchQueue.main.asyncAfter(
            deadline: .now() + autoDismissAfter
        ) {
            self.dismiss()
        }

        // 上滑手势关闭
        let pan = UIPanGestureRecognizer(
            target: self,
            action: #selector(handlePan)
        )
        addGestureRecognizer(pan)
    }

    func dismiss() {
        UIView.animate(
            withDuration: 0.35,
            delay: 0,
            usingSpringWithDamping: 0.85,
            initialSpringVelocity: 0,
            options: [],
            animations: {
                self.transform = CGAffineTransform(
                    translationX: 0, y: -200
                )
            },
            completion: { _ in
                self.removeFromSuperview()
            }
        )
    }

    @objc func handlePan(_ gesture: UIPanGestureRecognizer) {
        let translation = gesture.translation(in: self)
        if gesture.state == .changed {
            if translation.y < 0 {
                transform = CGAffineTransform(
                    translationX: 0, y: translation.y
                )
            }
        } else if gesture.state == .ended {
            if translation.y < -20 {
                dismiss()
            } else {
                UIView.animate(
                    withDuration: 0.3,
                    delay: 0,
                    usingSpringWithDamping: 0.8,
                    initialSpringVelocity: 0,
                    animations: {
                        self.transform = .identity
                    }
                )
            }
        }
    }
}
// 入场: 0.4s, spring(damping: 0.8)
// 退场: 0.35s, spring(damping: 0.85)
// 支持上滑手势关闭`,
      },
    },
  ],
};
