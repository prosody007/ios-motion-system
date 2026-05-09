import type { CardsSection } from "@/types/motion";

export const toastSection: CardsSection = {
  type: "cards",
  title: "Toast",
  description: "轻提示与短暂通知反馈。",
  cards: [
    {
      title: "Top Toast",
      tags: [
        { text: "0.4s", variant: "duration" },
        { text: ".snappy", variant: "spring" },
      ],
      previewId: "ios-toast",
      code: `// React — TODO: replace with the React implementation that mirrors the preview.
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
// 自动消失: 2.5s`,
    },
    {
      title: "Bottom Snackbar with Action",
      tags: [
        { text: "0.35s", variant: "duration" },
        { text: ".spring", variant: "spring" },
      ],
      previewId: "ios-snackbar",
      code: `// React — TODO: replace with the React implementation that mirrors the preview.
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
// 支持手势 dismiss: .gesture(DragGesture().onEnded { if $0.translation.height > 20 { dismiss } })`,
    },
  ],
};
