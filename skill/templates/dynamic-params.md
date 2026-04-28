# 动态参数模板

部分 cards 的代码里含 `{{paramName}}` 占位符。返回给用户时，根据需求**先替换**再返回。

---

## ios-spring-playground

代码模板里出现的所有占位符：

| param | 类型 | 默认 | 范围 | 说明 |
|---|---|---|---|---|
| `response` | number, s | 0.50 | 0.15 – 0.90 | spring 周期，越大越慢、振幅越大 |
| `damping` | number | 0.70 | 0.30 – 1.20 | 阻尼比 ζ；=1.0 临界（无过冲），越小越弹 |
| `bounce` | number | 0.30 | 0 – 1 | iOS 17+ 写法的过冲量 = 1 − damping |
| `stiffness` | int | derived | — | = (2π / response)² |
| `dampingCoef` | number | derived | — | = 2 · damping · (2π / response) |
| `duration` | number, s | derived | 0.7 – 2.8 | ≈ response × 2.6 + 0.3 |
| `swiftProps` | string | "" | — | 额外属性链拼接，例 `.scaleEffect(...)` |
| `uikitProps` | string | "" | — | UIKit transform 表达式 |

### 常见组合速查

| 用户描述 | 推荐参数 |
|---|---|
| "丝滑、无回弹" | response: 0.50, damping: 1.0, bounce: 0 → 等价 `.smooth` |
| "快速响应、几乎无过冲" | response: 0.35, damping: 0.86, bounce: 0.14 → `.snappy` |
| "轻微回弹" | response: 0.45, damping: 0.75, bounce: 0.25 |
| "明显弹跳、活泼" | response: 0.50, damping: 0.55, bounce: 0.45 → `.bouncy` |
| "强烈弹跳、游戏感" | response: 0.50, damping: 0.35, bounce: 0.65 |
| "手势跟随" | response: 0.35, damping: 0.86 → `.interactiveSpring` |

---

## ios-carousel / ios-carousel-peek / ios-carousel-scale / ios-carousel-coverflow

| param | 类型 | 默认 | 说明 |
|---|---|---|---|
| `speedSec` | number, s | 3.5 | 自动翻页周期（越小越快） |

---

## ios-border-glow

代码片段里所有占位符（CSS / React 双形态）：

| param | 类型 | 默认 | 说明 |
|---|---|---|---|
| `duration` | number, s | 4.0 | 一周完整旋转时长 |
| `borderWidth` | number, px | 2 | 锐利边框厚度 |
| `glowSize` | number, px | 48 | 外晕模糊半径 |
| `glowOpacity` | number, 0–1 | 0.35 | 外晕透明度 |
| `borderRadius` | number, px | 20 | 卡片圆角 |
| `colors` | string | aurora 4 色 | conic-gradient 色标列表 |
| `colorsArray` | string | "..." | React 端的字符串数组（带引号） |
| `direction` | "normal"/"reverse" | normal | 顺/逆时针 |

---

## 替换约定

- **不要**保留 `{{}}`，必须替换成具体值。
- **保留**类型与单位（例如 `0.5s` 别写成 `0.5`，`0.75` 别写成 `75%`）。
- 如果用户没说明具体值，**用默认值**；并在返回里**简短提示**用户可以调哪些参数。
- `derived` 字段不需要让用户填，按公式计算后填进去即可。

