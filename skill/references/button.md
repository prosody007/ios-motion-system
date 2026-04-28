# Button / Tap · 按钮反馈

按钮按压反馈与点击状态。

## Scale Down Press

- Preview ID：`ios-btn-scale`
- Tags：`0.1s` (duration) · `.easeInOut` (easing)

### SwiftUI

```swift
// SwiftUI — Button 按下缩放
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
}
```

### UIKit

```swift
// UIKit — Button 按下缩放
class ScaleButton: UIButton {
    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        super.touchesBegan(touches, with: event)
        UIView.animate(
            withDuration: 0.1,
            delay: 0,
            options: [.curveEaseInOut, .allowUserInteraction],
            animations: {
                self.transform = CGAffineTransform(scaleX: 0.95, y: 0.95)
                self.alpha = 0.9
            }
        )
    }

    override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent?) {
        super.touchesEnded(touches, with: event)
        UIView.animate(
            withDuration: 0.1,
            delay: 0,
            options: [.curveEaseInOut, .allowUserInteraction],
            animations: {
                self.transform = .identity
                self.alpha = 1.0
            }
        )
    }
}
```

---

## Highlight + Haptic

- Preview ID：`ios-btn-highlight`
- Tags：`0.08s` (duration) · `.easeOut` (easing)

### SwiftUI

```swift
// SwiftUI — 高亮 + 触觉反馈（无缩放）
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
}
```

### UIKit

```swift
// UIKit — 高亮 + 触觉反馈（无缩放）
let btn = UIButton(type: .custom)
btn.backgroundColor = UIColor(hex: 0x007AFF)
btn.setTitleColor(.white, for: .normal)
btn.addTarget(self, action: #selector(down), for: [.touchDown, .touchDragEnter])
btn.addTarget(self, action: #selector(up), for: [.touchUpInside, .touchUpOutside, .touchDragExit, .touchCancel])

@objc func down() {
    let generator = UIImpactFeedbackGenerator(style: .medium)
    generator.impactOccurred()
    UIView.animate(withDuration: 0.08, delay: 0, options: .curveEaseOut) {
        self.btn.backgroundColor = UIColor(hex: 0x0051D5)
    }
}

@objc func up() {
    UIView.animate(withDuration: 0.08, delay: 0, options: .curveEaseOut) {
        self.btn.backgroundColor = UIColor(hex: 0x007AFF)
    }
}
```

---

## Depth Press

- Preview ID：`ios-btn-depth`
- Tags：`0.1s` (duration) · `5pt depth` (easing)

### SwiftUI

```swift
// SwiftUI — 带厚度的按压按钮
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
    .buttonStyle(DepthButtonStyle())
```

### UIKit

```swift
// UIKit — 带厚度的按压按钮
class DepthButton: UIButton {
    private let depth: CGFloat = 5
    private let darkLayer = CALayer()

    override func layoutSubviews() {
        super.layoutSubviews()
        darkLayer.frame = CGRect(
            x: 0, y: depth,
            width: bounds.width, height: bounds.height
        )
        darkLayer.backgroundColor = UIColor(hex: 0x0060C8).cgColor
        darkLayer.cornerRadius = 12
        layer.insertSublayer(darkLayer, at: 0)
    }

    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        super.touchesBegan(touches, with: event)
        UIView.animate(withDuration: 0.1, delay: 0, options: .curveEaseOut) {
            self.transform = CGAffineTransform(translationX: 0, y: self.depth)
            self.darkLayer.frame.origin.y = 0
        }
    }

    override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent?) {
        super.touchesEnded(touches, with: event)
        UIView.animate(withDuration: 0.1, delay: 0, options: .curveEaseOut) {
            self.transform = .identity
            self.darkLayer.frame.origin.y = self.depth
        }
    }
}
```

