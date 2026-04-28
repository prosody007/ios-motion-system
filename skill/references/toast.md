# Toast

轻提示与短暂通知反馈。

## Top Toast

- Preview ID：`ios-toast`
- Tags：`0.4s` (duration) · `.snappy` (spring)

### SwiftUI

```swift
// SwiftUI — 顶部 Toast
// overlay + .transition(.move(edge: .top))

struct ToastOverlay: ViewModifier {
    @Binding var show: Bool
    let message: String
    let icon: String

    func body(content: Content) -> some View {
        content.overlay(alignment: .top) {
            if show {
                HStack(spacing: 10) {
                    Image(systemName: icon)
                        .foregroundStyle(.green)
                    Text(message)
                        .font(.subheadline.weight(.medium))
                }
                .padding(.horizontal, 20)
                .padding(.vertical, 12)
                .background(.ultraThinMaterial, in: Capsule())
                .shadow(color: .black.opacity(0.08), radius: 8, y: 4)
                .transition(.move(edge: .top).combined(with: .opacity))
                .onAppear {
                    DispatchQueue.main.asyncAfter(deadline: .now() + 2.5) {
                        withAnimation(.snappy) { show = false }
                    }
                }
            }
        }
        .animation(.snappy(duration: 0.4), value: show)
    }
}

// 使用：
.modifier(ToastOverlay(show: $showToast, message: "已保存", icon: "checkmark.circle.fill"))

// 动画参数：
// 入场: .snappy(duration: 0.4) — 从顶部 move + opacity
// 退场: 同曲线，反向
// 自动消失: 2.5s
```

### UIKit

```swift
// UIKit — 顶部 Toast
class ToastManager {
    static func show(_ message: String, in vc: UIViewController) {
        let toast = makeBanner(message)
        vc.view.addSubview(toast)

        // 初始位置（屏幕外）
        toast.transform = CGAffineTransform(translationX: 0, y: -80)
        toast.alpha = 0

        // 入场
        UIView.animate(
            withDuration: 0.4,
            delay: 0,
            usingSpringWithDamping: 0.86,
            initialSpringVelocity: 0,
            animations: {
                toast.transform = .identity
                toast.alpha = 1
            }
        )

        // 2.5s 后退场
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.5) {
            UIView.animate(
                withDuration: 0.3,
                delay: 0,
                options: .curveEaseIn,
                animations: {
                    toast.transform = CGAffineTransform(translationX: 0, y: -80)
                    toast.alpha = 0
                },
                completion: { _ in toast.removeFromSuperview() }
            )
        }
    }
}

// 入场: 0.4s, dampingRatio 0.86 ≈ .snappy
// 退场: 0.3s, .curveEaseIn（加速离场）
```

---

## Bottom Snackbar with Action

- Preview ID：`ios-snackbar`
- Tags：`0.35s` (duration) · `.spring` (spring)

### SwiftUI

```swift
// SwiftUI — 底部 Snackbar
// 从底部弹出，带 Undo 操作按钮

struct Snackbar: View {
    @Binding var show: Bool
    let message: String
    var action: (() -> Void)?

    var body: some View {
        if show {
            HStack(spacing: 12) {
                Text(message)
                    .font(.subheadline)
                    .foregroundStyle(.white)
                Spacer()
                if let action {
                    Button("Undo") { action() }
                        .font(.subheadline.weight(.semibold))
                        .foregroundStyle(.blue)
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 14)
            .background(Color(.systemGray6), in: RoundedRectangle(cornerRadius: 14))
            .shadow(color: .black.opacity(0.1), radius: 10, y: 5)
            .padding(.horizontal, 16)
            .transition(.move(edge: .bottom).combined(with: .opacity))
        }
    }
}

// 容器：
VStack {
    Spacer()
    Snackbar(show: $showSnack, message: "已删除") {
        // undo logic
    }
}
.animation(.spring(response: 0.35, dampingFraction: 0.86), value: showSnack)

// 入场: .spring(response: 0.35, dampingFraction: 0.86)
// 退场: 同曲线反向
// 支持手势 dismiss: .gesture(DragGesture().onEnded { if $0.translation.height > 20 { dismiss } })
```

### UIKit

```swift
// UIKit — 底部 Snackbar
class SnackbarView: UIView {
    let label = UILabel()
    let actionButton = UIButton(type: .system)

    func present(in view: UIView) {
        frame = CGRect(x: 16, y: view.bounds.height,
                       width: view.bounds.width - 32, height: 52)
        layer.cornerRadius = 14
        view.addSubview(self)

        // 入场
        UIView.animate(
            withDuration: 0.35,
            delay: 0,
            usingSpringWithDamping: 0.86,
            initialSpringVelocity: 0,
            animations: {
                self.frame.origin.y = view.bounds.height - 52 - view.safeAreaInsets.bottom - 8
            }
        )

        // 3s 后自动退场
        DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
            self.dismiss()
        }
    }

    func dismiss() {
        UIView.animate(
            withDuration: 0.25,
            delay: 0,
            options: .curveEaseIn,
            animations: {
                self.frame.origin.y = self.superview?.bounds.height ?? 800
                self.alpha = 0
            },
            completion: { _ in self.removeFromSuperview() }
        )
    }
}

// 入场: 0.35s, dampingRatio 0.86
// 退场: 0.25s, .curveEaseIn
// 支持 UIPanGestureRecognizer 下滑 dismiss
```

