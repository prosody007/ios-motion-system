# Duration & Curve

标准时长、曲线与参数基线。

## Tokens

| Name | Value | 描述 |
|---|---|---|
| `ultraFast` | `0.1s` | 即时反馈（按下高亮） |
| `fast` | `0.2s` | 小元素切换（toggle、checkbox） |
| `normal` | `0.3s` | 通用动画（fade、slide） |
| `slow` | `0.45s` | 大面积转场（sheet、modal） |
| `spring` | `0.5s` | 弹性动画（回弹、拖拽释放） |
| `page` | `0.35s` | 页面导航转场 |

## 代码片段

```swift
// MARK: - Motion Tokens (iOS 17+)

enum Motion {
    static let ultraFast: Double = 0.1   // 按下高亮
    static let fast:      Double = 0.2   // toggle, checkbox
    static let normal:    Double = 0.3   // fade, slide
    static let slow:      Double = 0.45  // sheet, modal
    static let page:      Double = 0.35  // navigation push/pop
}

// MARK: - Spring Presets (推荐优先使用)
extension Animation {
    // iOS 17+ 系统预设
    static let motionSmooth  = Animation.smooth        // 无过冲，丝滑
    static let motionSnappy  = Animation.snappy        // 快速响应（推荐默认）
    static let motionBouncy  = Animation.bouncy        // 明显弹跳

    // 场景化预设
    static let motionSheet   = Animation.spring(response: 0.45, dampingFraction: 0.9)
    static let motionDrag    = Animation.interactiveSpring(response: 0.35, dampingFraction: 0.86)
    static let motionPop     = Animation.spring(response: 0.4, dampingFraction: 0.55)
}
```
