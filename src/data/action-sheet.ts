import type { CardsSection } from "@/types/motion";

export const actionSheetSection: CardsSection = {
  type: "cards",
  title: "Action Sheet",
  description: "底部弹出操作菜单的滑入/滑出动画。",
  cards: [
    {
      title: "Action Sheet",
      tags: [
        { text: "0.4s", variant: "duration" },
        { text: ".spring", variant: "spring" },
      ],
      previewId: "ios-action-sheet",
      codes: {
        swift: `// SwiftUI — .confirmationDialog (Action Sheet)
struct ActionSheetDemo: View {
    @State private var showSheet = false

    var body: some View {
        Button("显示操作菜单") {
            showSheet = true
        }
        .confirmationDialog(
            "选择操作",
            isPresented: $showSheet,
            titleVisibility: .visible
        ) {
            Button("拍照") { takePhoto() }
            Button("从相册选择") { pickFromLibrary() }
            Button("选择文件") { pickFile() }
            Button("取消", role: .cancel) { }
        }
    }
}
// 系统 Action Sheet 动画:
// 弹出: 从底部滑入, ~0.4s spring
// 背景: 暗色遮罩 opacity 0 → 0.4
// 收起: 向下滑出, ~0.3s

// 自定义 Action Sheet
struct CustomActionSheet: View {
    @State private var isPresented = false

    var body: some View {
        ZStack(alignment: .bottom) {
            if isPresented {
                Color.black.opacity(0.4)
                    .ignoresSafeArea()
                    .onTapGesture {
                        withAnimation(.spring(
                            response: 0.35,
                            dampingFraction: 0.85
                        )) {
                            isPresented = false
                        }
                    }

                VStack(spacing: 8) {
                    ActionGroup {
                        ActionButton("拍照", icon: "camera")
                        ActionButton("相册", icon: "photo")
                    }

                    ActionButton("取消", role: .cancel)
                }
                .padding()
                .transition(.move(edge: .bottom))
            }
        }
        .animation(
            .spring(response: 0.4, dampingFraction: 0.85),
            value: isPresented
        )
    }
}`,
        uikit: `// UIKit — UIAlertController .actionSheet
class ActionSheetVC: UIViewController {
    func showActionSheet() {
        let sheet = UIAlertController(
            title: "选择操作",
            message: nil,
            preferredStyle: .actionSheet
        )

        sheet.addAction(UIAlertAction(
            title: "拍照",
            style: .default,
            handler: { _ in self.takePhoto() }
        ))

        sheet.addAction(UIAlertAction(
            title: "从相册选择",
            style: .default,
            handler: { _ in self.pickFromLibrary() }
        ))

        sheet.addAction(UIAlertAction(
            title: "删除",
            style: .destructive,
            handler: { _ in self.delete() }
        ))

        sheet.addAction(UIAlertAction(
            title: "取消",
            style: .cancel
        ))

        // iPad 需要设置 popoverPresentationController
        if let popover = sheet.popoverPresentationController {
            popover.sourceView = self.view
            popover.sourceRect = CGRect(
                x: view.bounds.midX,
                y: view.bounds.midY,
                width: 0, height: 0
            )
        }

        present(sheet, animated: true)
        // animated: true → 系统 spring 动画
        // 从底部滑入, ~0.4s
        // damping ≈ 0.85, 轻微回弹
    }
}`,
      },
    },
  ],
};
