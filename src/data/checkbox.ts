import type { CardsSection } from "@/types/motion";

export const checkboxSection: CardsSection = {
  type: "cards",
  title: "Checkbox",
  description: "勾选、单选与列表选择反馈。",
  cards: [
    {
      title: "Todo Checkbox",
      tags: [
        { text: "0.3s", variant: "duration" },
        { text: ".bouncy", variant: "spring" },
      ],
      previewId: "ios-checkbox",
      code: `// React — TODO: replace with the React implementation that mirrors the preview.
@State private var done = false

HStack(spacing: 12) {
    ZStack {
        Circle()
            .stroke(done ? Color.accentColor : Color.secondary.opacity(0.3), lineWidth: 1.5)
            .background(
                Circle().fill(done ? Color.accentColor : .clear)
            )
            .frame(width: 22, height: 22)

        // 对勾生长动画：用 .trim 实现描边从 0 到 1
        Path { p in
            p.move(to: CGPoint(x: 4, y: 9.5))
            p.addLine(to: CGPoint(x: 7.8, y: 13))
            p.addLine(to: CGPoint(x: 14, y: 5.5))
        }
        .trim(from: 0, to: done ? 1 : 0)
        .stroke(.white, style: StrokeStyle(lineWidth: 2.2, lineCap: .round, lineJoin: .round))
        .frame(width: 18, height: 18)
        .animation(.easeOut(duration: 0.32).delay(done ? 0.05 : 0), value: done)
    }
    .scaleEffect(done ? 1 : 0.95)
    .animation(.spring(duration: 0.3, bounce: 0.25), value: done)

    Text("Buy groceries")
        .strikethrough(done, color: .secondary)
        .foregroundStyle(done ? .secondary : .primary)
        .animation(.easeOut(duration: 0.25), value: done)
}
.contentShape(Rectangle())
.onTapGesture { done.toggle() }`,
    },
    {
      title: "Consent Checkbox",
      tags: [
        { text: "0.32s", variant: "duration" },
        { text: "stroke draw", variant: "easing" },
      ],
      previewId: "ios-consent-check",
      code: `// React — TODO: replace with the React implementation that mirrors the preview.
@State private var agreed = false

VStack(alignment: .leading, spacing: 12) {
    HStack(alignment: .top, spacing: 10) {
        ZStack {
            RoundedRectangle(cornerRadius: 6)
                .stroke(agreed ? Color.accentColor : Color.secondary.opacity(0.35), lineWidth: 1.5)
                .background(
                    RoundedRectangle(cornerRadius: 6)
                        .fill(agreed ? Color.accentColor : .clear)
                )
                .frame(width: 20, height: 20)

            Path { p in
                p.move(to: CGPoint(x: 4, y: 9.5))
                p.addLine(to: CGPoint(x: 7.8, y: 13))
                p.addLine(to: CGPoint(x: 14, y: 5.5))
            }
            .trim(from: 0, to: agreed ? 1 : 0)
            .stroke(.white, style: StrokeStyle(lineWidth: 2.4, lineCap: .round, lineJoin: .round))
            .frame(width: 18, height: 18)
            .animation(.easeOut(duration: 0.32).delay(agreed ? 0.05 : 0), value: agreed)
        }
        .scaleEffect(agreed ? 1 : 0.95)
        .animation(.spring(duration: 0.25, bounce: 0.3), value: agreed)

        (
            Text("我已阅读并同意") +
            Text("《服务协议》").foregroundColor(.accentColor).underline() +
            Text("和") +
            Text("《隐私政策》").foregroundColor(.accentColor).underline()
        )
        .font(.footnote)
        .foregroundStyle(.secondary)
    }
    .contentShape(Rectangle())
    .onTapGesture { agreed.toggle() }

    Button("下一步") { /* ... */ }
        .buttonStyle(.borderedProminent)
        .disabled(!agreed)
        .animation(.easeOut(duration: 0.25), value: agreed)
}`,
    },
    {
      title: "List Selection",
      tags: [
        { text: "0.32s", variant: "duration" },
        { text: "stroke draw", variant: "easing" },
      ],
      previewId: "ios-radio",
      code: `// React — TODO: replace with the React implementation that mirrors the preview.
// iOS 不使用 Radio Button，而是用 List + checkmark
// 对勾使用 Path + .trim 实现"生长"绘制动画

@State private var selected: String = "Wi-Fi"
let options = ["Wi-Fi", "蓝牙", "蜂窝网络"]

List {
    ForEach(options, id: \\.self) { option in
        HStack {
            Text(option)
            Spacer()
            Path { p in
                p.move(to: CGPoint(x: 4, y: 9.5))
                p.addLine(to: CGPoint(x: 7.8, y: 13))
                p.addLine(to: CGPoint(x: 14, y: 5.5))
            }
            .trim(from: 0, to: selected == option ? 1 : 0)
            .stroke(
                Color.accentColor,
                style: StrokeStyle(lineWidth: 2.2, lineCap: .round, lineJoin: .round)
            )
            .frame(width: 18, height: 18)
            .opacity(selected == option ? 1 : 0)
            .animation(
                selected == option
                    ? .easeOut(duration: 0.32).delay(0.05)
                    : .easeIn(duration: 0.15),
                value: selected
            )
        }
        .contentShape(Rectangle())
        .onTapGesture { selected = option }
    }
}

// 关键动画参数：
// trim(from:to:) — 控制描边完成度，从 0 到 1 即"生长"绘制
// 0.32s easeOut + 0.05s 延迟（等上一个淡出后再开始绘制）`,
    },
  ],
};
