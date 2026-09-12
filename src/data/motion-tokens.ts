export type MotionCurveKind = "timing" | "spring";

export type MotionCurveToken = {
  id: string;
  name: string;
  kind: MotionCurveKind;
  cssVar: string;
  easing: string;
  durationMs: number;
  use: string;
  note: string;
  boundary: string;
  spring?: {
    stiffness: number;
    damping: number;
    mass: number;
  };
};

export const motionCurveTokens: MotionCurveToken[] = [
  {
    id: "linear",
    name: "Linear",
    kind: "timing",
    cssVar: "--motion-ease-linear",
    easing: "linear",
    durationMs: 800,
    use: "匀速反馈",
    note: "匀速旋转、扫光、进度变化。",
    boundary: "不要用于入场、退场或响应用户点击；匀速会显得机械。",
  },
  {
    id: "standard",
    name: "Standard",
    kind: "timing",
    cssVar: "--motion-ease-standard",
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    durationMs: 240,
    use: "通用状态切换",
    note: "不强调方向的移动、颜色和透明度变化。",
    boundary: "不要用于需要跟手或需要回弹的交互。",
  },
  {
    id: "enter",
    name: "Enter",
    kind: "timing",
    cssVar: "--motion-ease-enter",
    easing: "cubic-bezier(0, 0, 0.2, 1)",
    durationMs: 260,
    use: "入场",
    note: "元素出现、菜单展开、内容浮现。",
    boundary: "只表达出现，不负责退出；退出请用 Exit。",
  },
  {
    id: "exit",
    name: "Exit",
    kind: "timing",
    cssVar: "--motion-ease-exit",
    easing: "cubic-bezier(0.4, 0, 1, 1)",
    durationMs: 180,
    use: "退场",
    note: "元素离开、关闭、删除反馈。",
    boundary: "退出应更快更直接，不要加回弹。",
  },
  {
    id: "ease-in",
    name: "Ease In",
    kind: "timing",
    cssVar: "--motion-ease-in",
    easing: "cubic-bezier(0.42, 0, 1, 1)",
    durationMs: 240,
    use: "加速离场",
    note: "速度从慢到快，适合元素离开视线。",
    boundary: "不要用于大面积入场，起步会显得拖沓。",
  },
  {
    id: "ease-out",
    name: "Ease Out",
    kind: "timing",
    cssVar: "--motion-ease-out",
    easing: "cubic-bezier(0, 0, 0.58, 1)",
    durationMs: 260,
    use: "减速入场",
    note: "快速开始、柔和停下，适合轻量内容浮现。",
    boundary: "需要跟手或回弹时，优先使用 Spring。",
  },
  {
    id: "ease-in-out",
    name: "Ease In Out",
    kind: "timing",
    cssVar: "--motion-ease-in-out",
    easing: "cubic-bezier(0.42, 0, 0.58, 1)",
    durationMs: 320,
    use: "对称过渡",
    note: "前后节奏对称，适合淡入淡出和颜色变化。",
    boundary: "不要用于强调方向的移动，容易缺少重点。",
  },
  {
    id: "smooth",
    name: "Spring Smooth",
    kind: "spring",
    cssVar: "--motion-spring-smooth",
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    durationMs: 360,
    use: "稳定展开",
    note: "模拟临界阻尼，基本无过冲。",
    boundary: "适合大多数默认 Spring；情绪反馈不足时再换 Bouncy。",
    spring: { stiffness: 220, damping: 30, mass: 1 },
  },
  {
    id: "snappy",
    name: "Spring Snappy",
    kind: "spring",
    cssVar: "--motion-spring-snappy",
    easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    durationMs: 180,
    use: "快速反馈",
    note: "按钮、开关、tab 指示器、小菜单。",
    boundary: "位移距离不宜过长，长距离会显得急促。",
    spring: { stiffness: 420, damping: 34, mass: 1 },
  },
  {
    id: "settle",
    name: "Spring Settle",
    kind: "spring",
    cssVar: "--motion-spring-settle",
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    durationMs: 420,
    use: "高级感位移",
    note: "卡片、浮层、页面局部转场。",
    boundary: "默认用于内容容器；不建议叠加强烈 scale。",
    spring: { stiffness: 300, damping: 32, mass: 1 },
  },
  {
    id: "bouncy",
    name: "Spring Bouncy",
    kind: "spring",
    cssVar: "--motion-spring-bouncy",
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    durationMs: 560,
    use: "轻微庆祝",
    note: "成功态、徽标弹出、局部强调。",
    boundary: "只给局部反馈使用，避免多个元素同时弹。",
    spring: { stiffness: 320, damping: 18, mass: 1 },
  },
  {
    id: "playful",
    name: "Spring Playful",
    kind: "spring",
    cssVar: "--motion-spring-playful",
    easing: "cubic-bezier(0.18, 1.7, 0.32, 1)",
    durationMs: 680,
    use: "强弹性",
    note: "游戏化、彩蛋、强情绪反馈。",
    boundary: "默认不进生产主流程；需要明确的游戏化语境。",
    spring: { stiffness: 260, damping: 12, mass: 1 },
  },
  {
    id: "interactive",
    name: "Spring Interactive",
    kind: "spring",
    cssVar: "--motion-spring-interactive",
    easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    durationMs: 240,
    use: "手势释放",
    note: "拖拽松手、滑动回弹、跟手交互收尾。",
    boundary: "适合 JS 物理弹簧；CSS 只能作为视觉近似。",
    spring: { stiffness: 500, damping: 36, mass: 1 },
  },
];

export const motionDurations = {
  instant: 100,
  fast: 160,
  normal: 240,
  slow: 420,
  slower: 560,
} as const;

export const motionSprings = {
  smooth: { stiffness: 220, damping: 30, mass: 1 },
  snappy: { stiffness: 420, damping: 34, mass: 1 },
  settle: { stiffness: 300, damping: 32, mass: 1 },
  bouncy: { stiffness: 320, damping: 18, mass: 1 },
  playful: { stiffness: 260, damping: 12, mass: 1 },
  interactive: { stiffness: 500, damping: 36, mass: 1 },
} as const;

export const motionPrinciples = [
  {
    title: "少动",
    description: "只有状态变化、层级变化或用户操作需要动画；静态信息不要自己动。",
  },
  {
    title: "短动",
    description: "反馈类 100-240ms，容器类 360-560ms；强回弹尽量控制在 680ms 内。",
  },
  {
    title: "单点动",
    description: "一次交互只让主对象运动，辅助元素用 opacity 或轻位移配合。",
  },
  {
    title: "可打断",
    description: "拖拽、滑动、切换类交互优先用 JS Spring，避免 CSS transition 锁死过程。",
  },
] as const;
