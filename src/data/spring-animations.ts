import type { CardsSection } from "@/types/motion";

export const springAnimationsSection: CardsSection = {
  type: "cards",
  title: "Spring Animations",
  description:
    "Spring 预设、参数与运动反馈。",
  cards: [
    /* Spring Playground — 合并 presets / critical / physics / overshoot / gentle / bouncy / duration+bounce / choreography */
    {
      title: "Spring Playground",
      tags: [
        { text: "preset", variant: "spring" },
        { text: "custom", variant: "spring" },
        { text: "physics", variant: "spring" },
        { text: "choreography", variant: "spring" },
      ],
      previewId: "ios-spring-playground",
      controlsId: "ios-spring-playground",
      code: `// React — TODO: replace with the React implementation that mirrors the preview.
//   response {{response}}s · damping {{damping}} · bounce {{bounce}}
//   等价物理量：stiffness {{stiffness}} · damping coef {{dampingCoef}}
// 所有勾选中的属性共享同一条 spring 曲线（这就是 Choreography）
@State private var moved = false

RoundedRectangle(cornerRadius: 16)
    .fill(Color.blue)
    .frame(width: 56, height: 56)
{{swiftProps}}
    .animation(
        .spring(response: {{response}}, dampingFraction: {{damping}}),
        value: moved
    )
    .onTapGesture { moved.toggle() }

// ───── 三种等价写法（同一条弹簧，挑顺手的）─────

// A. 经典：response + dampingFraction
// .spring(response: {{response}}, dampingFraction: {{damping}})

// B. iOS 17+ 新参数（更直观）
// .spring(duration: {{response}}, bounce: {{bounce}})

// C. 直接给物理参数（精确控制）
// .interpolatingSpring(
//     mass: 1,
//     stiffness: {{stiffness}},
//     damping: {{dampingCoef}},
//     initialVelocity: 0
// )

// ───── 系统预设对照（SwiftUI 内建）─────
//   .smooth      ≈ response 0.6,  damping 1.0  （无过冲）
//   .snappy      ≈ response 0.35, damping 0.85 （短促、小过冲）
//   .bouncy      ≈ response 0.5,  damping 0.7  （日常弹跳）
//   .interactive ≈ response 0.28, damping 0.86 （跟手势）
//   临界阻尼     ≈ damping 1.0                （视觉似 easeOut，更自然）
//   剧烈过冲     ≈ damping 0.3                （庆祝/彩蛋才用）

// 速查：
//   dampingFraction ↑ → 越快收敛，1.0 时刚好无过冲
//   response        ↑ → 整体变慢，振幅变大
//   bounce = 1 - dampingFraction`,
    },
  ],
};
