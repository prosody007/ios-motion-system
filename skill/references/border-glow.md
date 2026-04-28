# Border Glow · 流光边框

基于 CSS @property + conic-gradient 旋转角度的彩色流光边框，无需 JS，自动播放。所有视觉参数可实时调节。

## Border Glow · 流光边框

- Preview ID：`ios-border-glow`
- Controls ID：`ios-border-glow` (含动态参数，见 `templates/dynamic-params.md`)
- Tags：`{{duration}}s` (duration) · `linear` (easing)

### SwiftUI

```swift
/* CSS — 流光边框 (auto-play, 当前参数)
   palette       渐变色环
   duration      {{duration}}s · 一周时长
   borderWidth   {{borderWidth}}px
   glowSize      {{glowSize}}px
   glowOpacity   {{glowOpacity}}
   borderRadius  {{borderRadius}}px
   direction     {{direction}}
*/

/* 1. 注册可插值的角度自定义属性 */
@property --bg-angle {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}

/* 2. 通过关键帧驱动这个角度 */
@keyframes border-glow-spin {
  to { --bg-angle: 360deg; }
}

/* 3. 使用伪元素铺设彩色 conic-gradient
      .card::before  锐利彩环
      .card::after   外晕（同色 + blur） */
.card {
  position: relative;
  border-radius: {{borderRadius}}px;
  background: #ffffff;
  z-index: 0;
}

.card::before,
.card::after {
  content: "";
  position: absolute;
  inset: -{{borderWidth}}px;
  border-radius: calc({{borderRadius}}px + {{borderWidth}}px);
  background: conic-gradient(from var(--bg-angle),
    {{colors}});
  animation: border-glow-spin {{duration}}s linear {{direction}} infinite;
  z-index: -1;
}

.card::after {
  filter: blur({{glowSize}}px);
  opacity: {{glowOpacity}};
}
```

### UIKit

```swift
// React — 流光边框组件 (auto-play)
import { type CSSProperties } from "react";

interface BorderGlowProps {
  /** 一周完整旋转的时长（秒） */
  duration?: number;          // default 4
  /** 锐利边框厚度（px） */
  borderWidth?: number;       // default 2
  /** 外晕模糊半径（px），0 = 无外晕 */
  glowSize?: number;          // default 24
  /** 外晕不透明度 0-1 */
  glowOpacity?: number;       // default 0.7
  /** 卡片圆角 */
  borderRadius?: number;      // default 20
  /** 渐变色板 */
  colors?: string[];          // default Aurora
  /** 旋转方向 */
  direction?: "normal" | "reverse"; // default "normal"
  /** 是否暂停（默认自动播放） */
  paused?: boolean;           // default false
  children?: React.ReactNode;
}

export function BorderGlow({
  duration = {{duration}},
  borderWidth = {{borderWidth}},
  glowSize = {{glowSize}},
  glowOpacity = {{glowOpacity}},
  borderRadius = {{borderRadius}},
  colors = [{{colors}}],
  direction = "{{direction}}",
  paused = false,
  children,
}: BorderGlowProps) {
  const gradient = `conic-gradient(from var(--bg-angle), ${colors.join(", ")})`;
  const animation = `border-glow-spin ${duration}s linear ${direction} infinite`;
  const playState = paused ? "paused" : "running";

  const ringBase: CSSProperties = {
    position: "absolute",
    inset: -borderWidth,
    borderRadius: borderRadius + borderWidth,
    background: gradient,
    animation,
    animationPlayState: playState,
  };

  return (
    <div style={{ position: "relative" }}>
      {/* halo */}
      <div aria-hidden style={{
        ...ringBase,
        filter: `blur(${glowSize}px)`,
        opacity: glowOpacity,
        zIndex: 0,
      }} />
      {/* sharp ring */}
      <div aria-hidden style={{ ...ringBase, zIndex: 1 }} />
      {/* content */}
      <div style={{
        position: "relative",
        background: "#fff",
        borderRadius,
        zIndex: 2,
      }}>
        {children}
      </div>
    </div>
  );
}

// 全局 CSS 中需要注册一次：
//   @property --bg-angle { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
//   @keyframes border-glow-spin { to { --bg-angle: 360deg; } }
```

