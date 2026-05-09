import type { CardsSection } from "@/types/motion";

export const swipeDismissSection: CardsSection = {
  type: "cards",
  title: "Swipe to Dismiss",
  description: "滑动关闭与回弹反馈。",
  cards: [
    {
      title: "Swipe to Dismiss",
      tags: [
        { text: "0.35s", variant: "duration" },
        { text: ".interactiveSpring", variant: "spring" },
      ],
      previewId: "ios-swipe-dismiss",
      code: `// React — TODO: replace with the React implementation that mirrors the preview.
struct SwipeDismissView: View {
    @Environment(\\.dismiss) private var dismiss
    @State private var offsetY: CGFloat = 0

    var body: some View {
        VStack {
            RoundedRectangle(cornerRadius: 2.5)
                .fill(.secondary)
                .frame(width: 36, height: 5)
                .padding(.top, 8)
            Spacer()
            Text("内容区域")
            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(.regularMaterial)
        .cornerRadius(16)
        .offset(y: offsetY)
        .gesture(
            DragGesture()
                .onChanged { value in
                    if value.translation.height > 0 {
                        offsetY = value.translation.height
                    }
                }
                .onEnded { value in
                    if value.translation.height > 100 {
                        withAnimation(
                            .spring(response: 0.35, dampingFraction: 0.86)
                        ) {
                            offsetY = UIScreen.main.bounds.height
                        }
                        DispatchQueue.main.asyncAfter(deadline: .now() + 0.35) {
                            dismiss()
                        }
                    } else {
                        withAnimation(
                            .interactiveSpring(
                                response: 0.35,
                                dampingFraction: 0.86
                            )
                        ) {
                            offsetY = 0
                        }
                    }
                }
        )
    }
}`,
    },
  ],
};
