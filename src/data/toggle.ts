import type { CardsSection } from "@/types/motion";

export const toggleSection: CardsSection = {
  type: "cards",
  title: "Toggle / Switch",
  description: "开关切换动画，iOS 系统风格及常见变体。",
  cards: [
    {
      title: "Standard Switch",
      tags: [{ text: "0.3s", variant: "duration" }, { text: ".spring", variant: "spring" }],
      previewId: "ios-toggle-demo",
      codes: {
        swift: `// SwiftUI — Toggle
@State private var isOn = false

Toggle(isOn: $isOn) {
    Text("Wi-Fi")
}
.toggleStyle(.switch)
.tint(.green)

// 系统 Toggle 动画参数：
// spring(response: 0.3, dampingFraction: 0.8)
// knob translateX: 20pt
// track color: gray → systemGreen`,
        uikit: `// UIKit — UISwitch
let toggle = UISwitch()
toggle.onTintColor = .systemGreen
toggle.addTarget(self, action: #selector(toggled), for: .valueChanged)

// 系统 UISwitch 内部 spring 动画 ~0.25s`,
      },
    },
    {
      title: "Icon Knob (Dark Mode)",
      tags: [{ text: "0.35s", variant: "duration" }, { text: ".spring", variant: "spring" }],
      previewId: "ios-toggle-icon",
      codes: {
        swift: `// SwiftUI — knob 内带图标
struct IconSwitch: View {
    @Binding var isOn: Bool

    var body: some View {
        Capsule()
            .fill(isOn ? Color(hex: 0x1e293b) : Color(hex: 0xfde68a))
            .frame(width: 51, height: 31)
            .overlay(alignment: .leading) {
                Circle()
                    .fill(.white).shadow(radius: 1)
                    .frame(width: 27)
                    .padding(2)
                    .overlay {
                        ZStack {
                            Image(systemName: "sun.max.fill")
                                .foregroundStyle(.orange)
                                .opacity(isOn ? 0 : 1)
                                .rotationEffect(.degrees(isOn ? 90 : 0))
                                .scaleEffect(isOn ? 0.5 : 1)
                            Image(systemName: "moon.fill")
                                .foregroundStyle(Color(hex: 0x1e293b))
                                .opacity(isOn ? 1 : 0)
                                .rotationEffect(.degrees(isOn ? 0 : -90))
                                .scaleEffect(isOn ? 1 : 0.5)
                        }
                    }
                    .offset(x: isOn ? 20 : 0)
            }
            .animation(.spring(response: 0.35, dampingFraction: 0.8), value: isOn)
            .onTapGesture { isOn.toggle() }
    }
}`,
        uikit: `// UIKit — 自定义 knob 内图标
class IconSwitchView: UIControl {
    private let knob = UIImageView()
    private let sunImage = UIImage(systemName: "sun.max.fill")
    private let moonImage = UIImage(systemName: "moon.fill")

    var isOn = false {
        didSet {
            UIView.transition(with: knob, duration: 0.3, options: .transitionCrossDissolve) {
                self.knob.image = self.isOn ? self.moonImage : self.sunImage
                self.knob.tintColor = self.isOn ? UIColor(hex: 0x1e293b) : .systemOrange
            }
            UIView.animate(
                withDuration: 0.35, delay: 0,
                usingSpringWithDamping: 0.8, initialSpringVelocity: 0
            ) {
                self.knob.transform = CGAffineTransform(translationX: self.isOn ? 20 : 0, y: 0)
                self.backgroundColor = self.isOn
                    ? UIColor(hex: 0x1e293b) : UIColor(hex: 0xfde68a)
            }
        }
    }
}`,
      },
    },
    {
      title: "Segmented Toggle",
      tags: [{ text: "0.4s", variant: "duration" }, { text: ".spring", variant: "spring" }],
      previewId: "ios-toggle-segmented",
      codes: {
        swift: `// SwiftUI — 两选项 segmented
enum AppTheme: String, CaseIterable { case light, dark }

@State private var theme: AppTheme = .light

Picker("Theme", selection: $theme) {
    Label("Light", systemImage: "sun.max.fill").tag(AppTheme.light)
    Label("Dark",  systemImage: "moon.fill").tag(AppTheme.dark)
}
.pickerStyle(.segmented)
.animation(.spring(response: 0.4, dampingFraction: 0.85), value: theme)

// 或者自定义：
HStack(spacing: 0) {
    ForEach(AppTheme.allCases, id: \\.self) { t in
        Button { theme = t } label: {
            HStack(spacing: 4) {
                Image(systemName: t == .light ? "sun.max.fill" : "moon.fill")
                Text(t == .light ? "Light" : "Dark")
            }
            .font(.caption.weight(.medium))
            .foregroundStyle(theme == t ? .primary : .secondary)
            .frame(maxWidth: .infinity, minHeight: 28)
        }
    }
}
.background(Color(.systemGray5), in: Capsule())
.overlay(alignment: .leading) {
    Capsule().fill(.white).shadow(radius: 2)
        .padding(4)
        .frame(width: 76)
        .offset(x: theme == .light ? 0 : 76)
}
.animation(.spring(response: 0.4, dampingFraction: 0.85), value: theme)`,
        uikit: `// UIKit — UISegmentedControl
let control = UISegmentedControl(items: ["Light", "Dark"])
control.selectedSegmentIndex = 0
control.selectedSegmentTintColor = .white
control.addTarget(self, action: #selector(changed), for: .valueChanged)

// 系统 segmented 切换动画 ~0.25s
// 自定义指示条滑动：
UIView.animate(
    withDuration: 0.4,
    delay: 0,
    usingSpringWithDamping: 0.85,
    initialSpringVelocity: 0
) {
    self.indicator.frame.origin.x = CGFloat(index) * self.segmentWidth
}`,
      },
    },
  ],
};
