# Border Glow

基于 CSS @property + conic-gradient 旋转角度的彩色流光边框，无需 JS，自动播放。所有视觉参数可实时调节。

## Border Glow

- Preview ID：`ios-border-glow`
- Controls ID：`ios-border-glow` (含动态参数，见 `templates/dynamic-params.md`)
- Tags：`{{duration}}s` (duration) · `linear` (easing)

### AI Motion Spec

Border Glow 通过 conic-gradient + 旋转光晕表现高光边框，重点是边框本身在转，不是整卡旋转。

#### Layout

| Key | Value |
|---|---|
| host | content card stays still; glow lives on border/halo layers |
| shape | follow card radius exactly |

#### Motion

| Key | Value |
|---|---|
| rotation | animated conic gradient or angle variable rotates continuously |
| glow | outer blur halo should feel soft, not neon block |

#### Constraints

| Key | Value |
|---|---|
| do_not_change | 不要把整个卡片本体转起来 |

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
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

