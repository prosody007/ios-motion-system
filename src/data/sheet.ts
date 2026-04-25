import type { CardsSection } from "@/types/motion";

export const sheetSection: CardsSection = {
  type: "cards",
  title: "Sheet / Modal",
  description: "底部弹出面板，iOS 标准交互模式。",
  cards: [
    {
      title: "Bottom Sheet",
      tags: [{ text: "0.45s", variant: "duration" }, { text: "interactiveSpring", variant: "spring" }],
      previewId: "ios-sheet-bottom",
      codes: {
        swift: `// SwiftUI — 标准 Sheet
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
        uikit: `// UIKit — 标准 Sheet
let vc = SheetViewController()

// iOS 15+ Sheet 配置
if let sheet = vc.sheetPresentationController {
    sheet.detents = [.medium(), .large()]
    sheet.prefersGrabberVisible = true
    sheet.preferredCornerRadius = 20
    sheet.prefersScrollingExpandsWhenScrolledToEdge = true
    sheet.largestUndimmedDetentIdentifier = .medium
}

present(vc, animated: true)

// 系统动画参数：
// duration ≈ 0.45s
// curve ≈ cubic-bezier(0.32, 0.72, 0, 1)`,
      },
    },
  ],
};
