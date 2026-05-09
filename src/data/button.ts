import type { CardsSection } from "@/types/motion";

export const buttonSection: CardsSection = {
  type: "cards",
  title: "Button / Tap",
  description: "按钮按压反馈与点击状态。",
  cards: [
    {
      title: "Scale Down Press",
      tags: [{ text: "0.1s", variant: "duration" }, { text: ".easeInOut", variant: "easing" }],
      previewId: "ios-btn-scale",
      code: `// React — TODO: replace with the React implementation that mirrors the preview.
Button(action: { }) {
    Text("按钮")
        .padding(.horizontal, 36)
        .padding(.vertical, 14)
        .background(Color.accentColor)
        .cornerRadius(12)
}
.buttonStyle(ScaleButtonStyle())

struct ScaleButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
            .opacity(configuration.isPressed ? 0.9 : 1.0)
            .animation(.easeInOut(duration: 0.1), value: configuration.isPressed)
    }
}`,
    },
    {
      title: "Highlight + Haptic",
      tags: [{ text: "0.08s", variant: "duration" }, { text: ".easeOut", variant: "easing" }],
      previewId: "ios-btn-highlight",
      code: `// React — TODO: replace with the React implementation that mirrors the preview.
Button(action: {
    let impact = UIImpactFeedbackGenerator(style: .medium)
    impact.impactOccurred()
}) {
    Text("Tap Me")
        .padding(.horizontal, 36)
        .padding(.vertical, 14)
}
.buttonStyle(HighlightButtonStyle())

struct HighlightButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .foregroundStyle(.white)
            .background(
                configuration.isPressed
                    ? Color(hex: 0x0051D5)
                    : Color(hex: 0x007AFF)
            )
            .cornerRadius(12)
            .animation(.easeOut(duration: 0.08), value: configuration.isPressed)
    }
}`,
    },
    {
      title: "Depth Press",
      tags: [{ text: "0.1s", variant: "duration" }, { text: "5pt depth", variant: "easing" }],
      previewId: "ios-btn-depth",
      code: `// React — TODO: replace with the React implementation that mirrors the preview.
// 通过下方实色阴影模拟"按键厚度"，按下时下沉消失
struct DepthButtonStyle: ButtonStyle {
    let depth: CGFloat = 5

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .foregroundStyle(.white)
            .padding(.horizontal, 36)
            .padding(.vertical, 14)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color(hex: 0x007AFF))
            )
            .offset(y: configuration.isPressed ? depth : 0)
            .background(alignment: .bottom) {
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color(hex: 0x0060C8))
                    .frame(height: 44 + (configuration.isPressed ? 0 : depth))
                    .offset(y: configuration.isPressed ? 0 : depth)
            }
            .animation(.easeOut(duration: 0.1), value: configuration.isPressed)
    }
}

Button("Press") { }
    .buttonStyle(DepthButtonStyle())`,
    },
  ],
};
