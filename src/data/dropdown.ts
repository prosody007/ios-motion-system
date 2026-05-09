import type { CardsSection } from "@/types/motion";

export const dropdownSection: CardsSection = {
  type: "cards",
  title: "Dropdown",
  description: "下拉菜单展开与收起过渡。",
  cards: [
    {
      title: "Dropdown Menu",
      tags: [
        { text: "0.2s", variant: "duration" },
        { text: "系统 spring", variant: "spring" },
      ],
      previewId: "ios-dropdown",
      code: `// React — TODO: replace with the React implementation that mirrors the preview.
struct DropdownDemo: View {
    var body: some View {
        Menu {
            Button(action: { edit() }) {
                Label("编辑", systemImage: "pencil")
            }
            Button(action: { duplicate() }) {
                Label("复制", systemImage: "doc.on.doc")
            }
            Button(action: { share() }) {
                Label("分享", systemImage: "square.and.arrow.up")
            }

            Divider()

            Button(role: .destructive, action: { delete() }) {
                Label("删除", systemImage: "trash")
            }
        } label: {
            Image(systemName: "ellipsis.circle")
                .font(.title2)
        }
    }
}
// 系统 Menu 动画参数:
// 弹出: scale 0.9 → 1.0 + opacity 0 → 1, ~0.2s spring
// 背景: 模糊材质 + shadow
// 收起: opacity 1 → 0, ~0.15s
// 选中: 高亮背景闪烁 → 收起

// 带 primaryAction 的 Menu
Menu {
    Button("选项 A") { }
    Button("选项 B") { }
} label: {
    Text("长按显示菜单")
} primaryAction: {
    // 点击触发主操作
    primaryAction()
}`,
    },
  ],
};
