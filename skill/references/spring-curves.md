# Spring & Timing · 弹簧与曲线

Spring 预设与 timing 曲线参考。

## Spring 预设

### .smooth _(iOS 17+)_

- response：`0.5` · damping：`1`
- 无过冲，丝滑停止
- SwiftUI：`.smooth`
- SwiftUI Legacy：`.spring(response: 0.5, dampingFraction: 1.0)`
- UIKit：`dampingRatio: 1.0`

### .smooth (extraBouncy) _(iOS 17+)_

- response：`0.5` · damping：`0.7`
- 轻微过冲后平滑
- SwiftUI：`.smooth(extraBounce: 0.3)`
- SwiftUI Legacy：`.spring(response: 0.5, dampingFraction: 0.7)`
- UIKit：`dampingRatio: 0.7`

### .snappy _(iOS 17+ 推荐)_

- response：`0.35` · damping：`0.86`
- 快速响应、几乎无过冲
- SwiftUI：`.snappy`
- SwiftUI Legacy：`.spring(response: 0.35, dampingFraction: 0.86)`
- UIKit：`dampingRatio: 0.86`

### .snappy (extraBouncy) _(iOS 17+)_

- response：`0.35` · damping：`0.6`
- 快速 + 明显弹跳
- SwiftUI：`.snappy(extraBounce: 0.3)`
- SwiftUI Legacy：`.spring(response: 0.35, dampingFraction: 0.6)`
- UIKit：`dampingRatio: 0.6`

### .bouncy _(iOS 17+)_

- response：`0.5` · damping：`0.55`
- 明显弹跳，活泼感
- SwiftUI：`.bouncy`
- SwiftUI Legacy：`.spring(response: 0.5, dampingFraction: 0.55)`
- UIKit：`dampingRatio: 0.55`

### .bouncy (extraBouncy) _(iOS 17+)_

- response：`0.5` · damping：`0.35`
- 强烈弹跳，游戏感
- SwiftUI：`.bouncy(extraBounce: 0.25)`
- SwiftUI Legacy：`.spring(response: 0.5, dampingFraction: 0.35)`
- UIKit：`dampingRatio: 0.35`

### .interactiveSpring _(手势场景)_

- response：`0.35` · damping：`0.86`
- 跟手交互释放（手势拖拽后）
- SwiftUI：`.interactiveSpring(response: 0.35, dampingFraction: 0.86)`
- SwiftUI Legacy：`.interactiveSpring(response: 0.35, dampingFraction: 0.86)`
- UIKit：`UISpringTimingParameters(dampingRatio: 0.86)`

### Sheet Spring _(系统 Sheet)_

- response：`0.45` · damping：`0.9`
- 底部 Sheet 弹出
- SwiftUI：`.spring(response: 0.45, dampingFraction: 0.9)`
- SwiftUI Legacy：`.spring(response: 0.45, dampingFraction: 0.9)`
- UIKit：`dampingRatio: 0.9, duration: 0.45`

## Timing Curves

### .easeIn

- CSS：`cubic-bezier(0.42, 0, 1, 1)`
- SwiftUI：`.easeIn`
- 加速离场（元素退出时用）

### .easeOut

- CSS：`cubic-bezier(0, 0, 0.58, 1)`
- SwiftUI：`.easeOut`
- 减速入场（罕用，优先用 spring）

### .easeInOut

- CSS：`cubic-bezier(0.42, 0, 0.58, 1)`
- SwiftUI：`.easeInOut`
- 对称过渡（淡入淡出等简单场景）

### .linear

- CSS：`cubic-bezier(0, 0, 1, 1)`
- SwiftUI：`.linear`
- 匀速（仅用于无限循环动画如 spinner）

