import type { CardsSection } from "@/types/motion";

export const sheetSection: CardsSection = {
  type: "cards",
  title: "Sheet",
  description: "Sheet 与模态面板过渡。",
  cards: [
    {
      title: "Bottom Sheet",
      tags: [{ text: "0.45s", variant: "duration" }, { text: "interactiveSpring", variant: "spring" }],
      previewId: "ios-sheet-bottom",
      code: `// React — TODO: replace with the React implementation that mirrors the preview.
@State private var showSheet = false

Button("Show Sheet") { showSheet = true }
    .sheet(isPresented: $showSheet) {
        SheetContent()
            .presentationDetents([.medium, .large])
            .presentationDragIndicator(.visible)
            .presentationCornerRadius(20)
    }

// iOS 16+ Sheet 参数：
// .presentationDetents — 停靠高度
// .presentationBackgroundInteraction(.enabled) — 背景可交互
// 动画曲线: 系统默认 ~0.45s interactiveSpring`,
    },
    {
      title: "Sheet Flow (A → B)",
      tags: [
        { text: "dismiss + present", variant: "duration" },
        { text: "open: 0.6s", variant: "duration" },
        { text: "close: 0.3s", variant: "duration" },
      ],
      previewId: "ios-sheet-switch",
      code: `// React — TODO: replace with the React implementation that mirrors the preview.
enum ActiveSheet: Identifiable {
    case picker
    case detail(String)

    var id: String {
        switch self {
        case .picker: return "picker"
        case .detail(let value): return "detail-\\(value)"
        }
    }
}

@State private var activeSheet: ActiveSheet?
@State private var pendingSelection: String?

Button("Show Flow") {
    activeSheet = .picker
}
.sheet(item: $activeSheet, onDismiss: {
    guard let pendingSelection else { return }
    // 等 A 完全收起，再弹出 B，避免系统 sheet 冲突
    DispatchQueue.main.asyncAfter(deadline: .now() + 0.30) {
        activeSheet = .detail(pendingSelection)
        self.pendingSelection = nil
    }
}) { route in
    switch route {
    case .picker:
        PickerSheet { choice in
            pendingSelection = choice
            activeSheet = nil
        }
        .presentationDetents([.medium])
        .presentationCornerRadius(20)

    case .detail(let choice):
        DetailSheet(choice: choice)
            .presentationDetents([.medium, .large])
            .presentationCornerRadius(20)
    }
}

struct PickerSheet: View {
    var onSelect: (String) -> Void

    var body: some View {
        VStack(spacing: 12) {
            Button("Family") { onSelect("Family") }
            Button("Friends") { onSelect("Friends") }
            Button("Work") { onSelect("Work") }
        }
        .padding()
    }
}`,
    },
  ],
};
