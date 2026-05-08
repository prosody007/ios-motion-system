import type { AgentSpec, AgentSpecSection } from "@/types/motion";

const sec = (
  title: string,
  entries: Array<[string, string]>,
): AgentSpecSection => ({
  title,
  entries: entries.map(([key, value]) => ({ key, value })),
});

const spec = (
  summary: string,
  sections: AgentSpecSection[],
  acceptance?: string[],
): AgentSpec => ({
  summary,
  sections,
  acceptance,
});

export const agentSpecsByPreviewId: Record<string, AgentSpec> = {
  "ios-reorder": spec(
    "列表项长按抬起后进入拖拽重排，目标位置出现占位反馈，释放时平滑落位。",
    [
      sec("Trigger & State", [
        ["trigger", "long press or drag handle starts reorder"],
        ["states", "idle / lifted / dragging / settle"],
      ]),
      sec("Motion", [
        ["lift_feedback", "被拖拽项轻微放大并抬高，显示浮起感"],
        ["sibling_reflow", "其他项根据目标位置让位，不要整列闪跳"],
        ["settle", "release 后平滑落到最终位置"],
      ]),
      sec("Constraints", [
        ["do_not_change", "不要退化成数据瞬移；必须保留占位让位过程"],
        ["axis", "主要沿列表主轴移动，避免多余旋转"],
      ]),
    ],
    [
      "拖动项始终跟手移动。",
      "其他项会连续让位，而不是 release 后才整体重排。",
    ],
  ),
  "ios-stagger": spec(
    "一组列表/内容按固定节奏分段入场，重点是统一方向、稳定间隔和整体节奏。",
    [
      sec("Trigger & State", [
        ["trigger", "on first appear or data reveal"],
        ["states", "hidden -> staggering -> visible"],
      ]),
      sec("Motion", [
        ["entry_order", "按视觉顺序依次进入"],
        ["base_motion", "每项通常是 opacity + translateY 小位移"],
        ["delay_rule", "相邻项有固定 delay，不要随机"],
      ]),
      sec("Constraints", [
        ["do_not_change", "不要把 stagger 做成所有项同时淡入"],
        ["rhythm", "间隔要足够短，整体像一个序列而不是单独动画集合"],
      ]),
    ],
  ),
  "ios-expandable": spec(
    "内容区在同一容器内展开/折叠，高度、透明度和图标状态同步变化。",
    [
      sec("Trigger & State", [
        ["trigger", "tap header toggles expanded"],
        ["states", "collapsed / expanded"],
      ]),
      sec("Layout", [
        ["collapsed", "只显示标题和摘要行"],
        ["expanded", "显示完整正文或子内容"],
      ]),
      sec("Motion", [
        ["height", "容器高度连续展开/收起"],
        ["content", "正文 opacity 或 small translate 同步进入"],
        ["indicator", "chevron / plus-minus 与内容状态同步变化"],
      ]),
    ],
    ["展开和收起都在同一块容器内完成，不是切页面。"],
  ),
  "ios-carousel": spec(
    "全屏 pager 轮播：每页完整占满视口宽度，图片化 slide，无阴影，底部只保留数量锚点。",
    [
      sec("Trigger & State", [
        ["trigger", "horizontal swipe or dot click"],
        ["states", "logical page index in infinite loop"],
      ]),
      sec("Layout", [
        ["slide_content", "用真实图片而不是纯色块"],
        ["shadow", "去掉 slide 投影"],
        ["nav", "不显示左右按钮，只保留 dots"],
      ]),
      sec("Motion", [
        ["paging", "整页水平切换"],
        ["looping", "允许无限循环时要做无缝复位"],
        ["duration", "约 0.4s，ease-out 风格"],
      ]),
    ],
  ),
  "ios-carousel-peek": spec(
    "居中主卡 + 两侧露边的轮播，当前项最清晰，相邻项只露出一部分。",
    [
      sec("Trigger & State", [
        ["trigger", "swipe or dot click"],
        ["states", "active centered card index"],
      ]),
      sec("Layout", [
        ["peek_rule", "两侧要露出相邻卡的一部分"],
        ["slide_content", "使用图片卡，不用纯色块"],
        ["shadow", "去掉卡片投影"],
      ]),
      sec("Motion", [
        ["focus", "当前卡 opacity 最高，相邻卡略弱"],
        ["translation", "整个轨道连续滑动，active 始终回到中心"],
      ]),
    ],
  ),
  "ios-carousel-scale": spec(
    "中间卡最大最清晰，边缘卡等比缩小并淡化；卡面使用图片，不要纯色和投影。",
    [
      sec("Trigger & State", [
        ["trigger", "swipe or dot click"],
        ["states", "distance from active index drives scale and opacity"],
      ]),
      sec("Motion", [
        ["active", "center card scale 1 / opacity 1"],
        ["side_cards", "根据离中心的距离连续缩小并淡化"],
        ["curve", "平移与缩放同一时间线"],
      ]),
      sec("Constraints", [
        ["scale_mode", "只做等比缩放，不挤压内容"],
        ["shadow", "去掉阴影，靠图片和层级表达焦点"],
      ]),
    ],
  ),
  "ios-carousel-coverflow": spec(
    "Cover Flow 依赖透视和 Y 轴旋转：中心卡正对用户，两侧卡向外翻转。",
    [
      sec("Trigger & State", [
        ["trigger", "swipe or dot click"],
        ["states", "offset from active index determines angle and depth"],
      ]),
      sec("Motion", [
        ["perspective", "必须有 3D perspective"],
        ["rotation", "边缘卡 rotateY，中心卡 angle = 0"],
        ["scale", "非中心卡略缩小"],
      ]),
      sec("Constraints", [
        ["slide_content", "用图片卡面，不要纯色块"],
        ["shadow", "去掉投影，靠 translateZ/rotation 表达空间"],
      ]),
    ],
  ),
  "ios-loading-spinner": spec(
    "标准加载指示器保持纯转圈：整圈连续旋转，不带生长弧线变化。",
    [
      sec("Trigger & State", [
        ["trigger", "loading starts"],
        ["states", "indeterminate loop until complete"],
      ]),
      sec("Motion", [
        ["rotation", "匀速整圈连续旋转"],
        ["continuity", "首尾闭环，不能卡顿"],
      ]),
    ],
  ),
  "ios-loading-grow": spec(
    "新增的生长式 loading：灰色底环固定不动，深灰色弧线在 3 秒内从 0 -> 1 生长，长满后停住，点击 Reset 才重新播放。",
    [
      sec("Trigger & State", [
        ["trigger", "loading starts"],
        ["states", "idle / growing / completed"],
      ]),
      sec("Layout", [
        ["track", "灰色底环固定不变"],
        ["foreground", "深灰色进度弧覆盖在底环之上"],
      ]),
      sec("Motion", [
        ["growth", "foreground arc 用 3.0s 从 0 -> 1 生长"],
        ["origin", "从顶部 -90deg 起始更像系统进度环"],
        ["reset", "完成后出现 Reset；只有点击 Reset 才重新从 0 播放"],
        ["constraint", "不要让灰色底环一起转动或变化；不要自动循环"],
      ]),
    ],
  ),
  "ios-skeleton": spec(
    "骨架屏以占位结构 + shimmer 横向扫光组成，重点是版式像真实内容。",
    [
      sec("Layout", [
        ["placeholder", "骨架块尺寸接近真实内容布局"],
        ["shape", "文字用圆角短条，头像/封面按真实比例"],
      ]),
      sec("Motion", [
        ["shimmer", "高光从一侧扫到另一侧"],
        ["loop", "低存在感循环，不抢主体"],
      ]),
      sec("Constraints", [
        ["do_not_change", "不要改成单纯 pulse opacity"],
      ]),
    ],
  ),
  "ios-progress-bar": spec(
    "线性进度条通过填充宽度连续增长表达完成度。",
    [
      sec("Trigger & State", [
        ["trigger", "progress value changes"],
        ["states", "0..1 continuous value"],
      ]),
      sec("Motion", [
        ["fill", "前景条宽度随 value 连续插值"],
        ["direction", "从左向右增长，不回抽"],
      ]),
    ],
  ),
  "ios-progress-ring": spec(
    "环形进度通过圆弧 sweep 增长表达完成度，保持端点干净。",
    [
      sec("Trigger & State", [
        ["trigger", "progress value changes"],
        ["states", "0..1 continuous value"],
      ]),
      sec("Motion", [
        ["arc", "trim / strokeEnd 连续增长"],
        ["cap", "圆头端点时要避免抖动"],
      ]),
    ],
  ),
  "ios-success-check": spec(
    "成功反馈通常是圆形容器先出现，再绘制 check。",
    [
      sec("Motion", [
        ["sequence", "container appears -> check draws"],
        ["timing", "符号绘制略晚于容器"],
      ]),
      sec("Constraints", [
        ["do_not_change", "不要只做静态图标淡入"],
      ]),
    ],
  ),
  "ios-error-shake": spec(
    "错误反馈以短促水平 shake 为主，强调拒绝感而不是夸张弹跳。",
    [
      sec("Motion", [
        ["axis", "x-axis shake only"],
        ["beats", "2~4 次衰减式来回位移"],
        ["duration", "整体偏短，不能拖泥带水"],
      ]),
      sec("Constraints", [
        ["do_not_change", "不要混入大幅缩放、旋转或纵向跳动"],
      ]),
    ],
  ),
  "ios-toast": spec(
    "顶部 toast 短暂出现再离开，强调轻量通知。",
    [
      sec("Layout", [
        ["placement", "top overlay"],
      ]),
      sec("Motion", [
        ["entry", "从顶部小位移进入 + opacity"],
        ["exit", "停留后按相反方向离开"],
      ]),
    ],
  ),
  "ios-snackbar": spec(
    "底部 snackbar 贴近安全区出现，可带操作按钮，停留后离开。",
    [
      sec("Layout", [
        ["placement", "bottom overlay near safe area"],
        ["action", "可带一个 clear action button"],
      ]),
      sec("Motion", [
        ["entry_exit", "底部上移进入、下移退出"],
      ]),
    ],
  ),
  "ios-sheet-bottom": spec(
    "底部 sheet 从底部上拉进入，支持背景 dim 和阻尼回落。",
    [
      sec("Trigger & State", [
        ["trigger", "tap open / drag close"],
        ["states", "closed / open / dragging"],
      ]),
      sec("Motion", [
        ["entry", "sheet 从底部上移进入"],
        ["drag", "支持跟手拖拽和阈值决定关闭/回弹"],
        ["backdrop", "背景 dim 与 sheet 进度同步"],
      ]),
    ],
  ),
  "ios-sheet-switch": spec(
    "在一个 sheet 内从 A 内容切到 B 内容，容器保持稳定，内容做阶段切换。",
    [
      sec("Trigger & State", [
        ["trigger", "button or step action switches sheet content"],
        ["states", "sheet A / sheet B"],
      ]),
      sec("Motion", [
        ["container", "外层 sheet 不消失，只切内部内容"],
        ["content", "旧内容退场，新内容进场"],
      ]),
    ],
  ),
  "ios-alert": spec(
    "居中 alert 以缩放 + opacity 入场，背景 dim，同步出场。",
    [
      sec("Layout", [
        ["placement", "centered modal dialog"],
        ["backdrop", "full-screen dim background"],
      ]),
      sec("Motion", [
        ["entry", "scale up + fade in"],
        ["exit", "scale down + fade out"],
      ]),
    ],
  ),
  "ios-action-sheet": spec(
    "Action Sheet 从底部整体上移，动作列表保持分组感。",
    [
      sec("Layout", [
        ["placement", "bottom anchored grouped list"],
        ["actions", "destructive / cancel visual hierarchy clear"],
      ]),
      sec("Motion", [
        ["entry_exit", "bottom-up enter and reverse exit"],
      ]),
    ],
  ),
  "ios-tooltip": spec(
    "Tooltip / Popover 围绕锚点出现，位置与锚点关系必须稳定。",
    [
      sec("Layout", [
        ["anchor", "tooltip is anchored to target element"],
        ["arrow", "如有箭头，方向与锚点关系一致"],
      ]),
      sec("Motion", [
        ["entry", "small scale + opacity"],
        ["origin", "transform origin should feel anchored to trigger"],
      ]),
    ],
  ),
  "ios-dropdown": spec(
    "Dropdown 菜单围绕按钮展开，菜单项以统一容器出现而不是逐项乱飞。",
    [
      sec("Trigger & State", [
        ["trigger", "tap trigger button toggles open/close"],
        ["states", "closed / open"],
      ]),
      sec("Motion", [
        ["container", "menu container scales/fades from trigger edge"],
        ["items", "items can stagger slightly but remain within one menu panel"],
      ]),
    ],
  ),
  "ios-notification": spec(
    "顶部 banner 像系统通知一样从顶部滑入，短暂停留后离开。",
    [
      sec("Layout", [
        ["placement", "top edge / below status area"],
      ]),
      sec("Motion", [
        ["entry_exit", "slide down in, slide up out"],
        ["content", "banner body keeps shape stable during motion"],
      ]),
    ],
  ),
  "ios-swipe-dismiss": spec(
    "卡片或浮层可向下/横向滑动关闭，未过阈值时回弹。",
    [
      sec("Trigger & State", [
        ["trigger", "drag on dismissible surface"],
        ["states", "idle / dragging / dismissed or rebound"],
      ]),
      sec("Motion", [
        ["follow", "拖动时组件跟手位移"],
        ["threshold", "达到阈值后离场，否则 spring 回位"],
      ]),
    ],
  ),
  "ios-swipe-cards": spec(
    "Tinder 式卡片堆栈：顶层卡滑走后，下层卡前移补位。",
    [
      sec("Trigger & State", [
        ["trigger", "horizontal drag on top card"],
        ["states", "stack order updates when top card exits"],
      ]),
      sec("Motion", [
        ["top_card", "跟手位移 + 轻微旋转"],
        ["stack", "下层卡按顺序放大/前移补位"],
      ]),
      sec("Constraints", [
        ["only_top_interactive", "只有顶层卡可拖动"],
      ]),
    ],
  ),
  "ios-nav-push": spec(
    "标准导航 Push / Pop：新页面从右进入，返回时向右退出。",
    [
      sec("Motion", [
        ["push", "incoming view from right, current view shifts left/back"],
        ["pop", "reverse direction on back"],
      ]),
      sec("Constraints", [
        ["do_not_change", "不要做 crossfade 代替 push/pop spatial transition"],
      ]),
    ],
  ),
  "ios-page-nav-transition": spec(
    "页面级 zoom transition：缩放感比普通 push 更强，但仍有明确前后层级。",
    [
      sec("Motion", [
        ["entry", "destination zooms in while source recedes"],
        ["continuity", "shared source point or focal element helps orientation"],
      ]),
    ],
  ),
  "ios-page-matched-geometry": spec(
    "页面级 matched geometry：至少一个共享元素在两个页面之间连续过渡。",
    [
      sec("Motion", [
        ["shared_element", "same element interpolates frame/shape between pages"],
        ["page_content", "rest of content fades or slides around the shared element"],
      ]),
      sec("Constraints", [
        ["do_not_change", "不要丢掉 shared element，单纯 fade 不算 matched geometry"],
      ]),
    ],
  ),
  "ios-page-fullscreen": spec(
    "fullScreenCover / fullscreen modal：整页从底部或前景覆盖进入。",
    [
      sec("Layout", [
        ["placement", "full screen overlay above current page"],
      ]),
      sec("Motion", [
        ["entry_exit", "cover enters as a whole, exits as a whole"],
      ]),
    ],
  ),
  "ios-custom-any-transition": spec(
    "内建 AnyTransition 组合示例：多个基础 transition 叠加，但主视觉要清晰。",
    [
      sec("Motion", [
        ["composition", "combine opacity / move / scale in one transition"],
        ["symmetry", "define clear insertion and removal behavior"],
      ]),
    ],
  ),
  "ios-custom-modifier": spec(
    "自定义 ViewModifier Transition：插入和移除遵循同一套自定义样式规则。",
    [
      sec("Motion", [
        ["modifier_rule", "transition driven by custom modifier values"],
        ["phase", "insertion/removal states must be explicit"],
      ]),
    ],
  ),
  "ios-custom-vc-transition": spec(
    "UIViewControllerAnimatedTransitioning 自定义转场：容器、截图层级和终点 frame 需要明确。",
    [
      sec("Trigger & State", [
        ["trigger", "present / dismiss or push / pop via custom animator"],
      ]),
      sec("Motion", [
        ["container", "all animated views live in transition containerView"],
        ["geometry", "origin and final frames are explicit and continuous"],
      ]),
    ],
  ),
  "ios-hero": spec(
    "Hero 图片转场：同一张图片在列表和详情之间做大尺度连续放大。",
    [
      sec("Motion", [
        ["shared_image", "hero image frame interpolates between source and destination"],
        ["rest_content", "supporting text/UI fades around the hero image"],
      ]),
      sec("Constraints", [
        ["do_not_change", "不要把 hero image 断成两张不同图片淡入淡出"],
      ]),
    ],
  ),
  "ios-haptic-impact": spec(
    "单次 impact haptic 要与视觉瞬间对齐，通常发生在接触/完成时刻。",
    [
      sec("Trigger & State", [
        ["trigger", "button press or impact moment"],
      ]),
      sec("Motion", [
        ["sync", "haptic fires on the exact visual impact frame"],
      ]),
    ],
  ),
  "ios-haptic-notification": spec(
    "动画 + notification haptic 配对：成功/警告/失败触感要和视觉结果一致。",
    [
      sec("Motion", [
        ["pairing", "haptic type matches outcome semantics"],
        ["sync", "trigger on result confirmation, not too early"],
      ]),
    ],
  ),
  "ios-haptic-selection": spec(
    "selection feedback 用于轻量切换或滚动停靠，每次变化给一个轻触感。",
    [
      sec("Trigger & State", [
        ["trigger", "selection index changes"],
      ]),
      sec("Motion", [
        ["frequency", "每次离散切换触发一次，不能连续狂震"],
      ]),
    ],
  ),
  "ios-haptic-increase-decrease": spec(
    "Increase / Decrease 触感用于数值或强度变化，方向感要明确。",
    [
      sec("Trigger & State", [
        ["trigger", "value increases or decreases"],
      ]),
      sec("Motion", [
        ["semantic", "increase 和 decrease 使用不同语义反馈"],
      ]),
    ],
  ),
  "ios-counter-text": spec(
    "数字文本过渡：数字更新时做内容替换动画，而不是整块闪烁。",
    [
      sec("Trigger & State", [
        ["trigger", "numeric value changes"],
      ]),
      sec("Motion", [
        ["content_transition", "仅数字内容变化，容器尽量稳定"],
      ]),
    ],
  ),
  "ios-counter-custom": spec(
    "自定义 counter：按位或分段处理数字变化，强调可控的数字滚动/替换。",
    [
      sec("Motion", [
        ["digit_rule", "数字变化按位或按片段执行，不整块抖动"],
        ["continuity", "旧值到新值的方向感明确"],
      ]),
    ],
  ),
  "ios-scroll-header": spec(
    "滚动驱动 header 缩放/压缩：滚动越深，头部越收敛，但信息层级仍清晰。",
    [
      sec("Trigger & State", [
        ["trigger", "vertical scroll offset"],
      ]),
      sec("Motion", [
        ["mapping", "header scale/height maps continuously to scroll progress"],
        ["clamp", "到达最小状态后停止继续缩小"],
      ]),
    ],
  ),
  "ios-scroll-parallax": spec(
    "视差滚动：前后景移动速度不同，形成空间层次。",
    [
      sec("Motion", [
        ["parallax", "background and foreground move at different rates"],
        ["continuity", "scroll progress is continuous, not stepped"],
      ]),
    ],
  ),
  "ios-keyframe": spec(
    "关键帧动画由多个阶段组成，每个阶段定义明确属性目标。",
    [
      sec("Trigger & State", [
        ["trigger", "tap or state change starts timeline"],
      ]),
      sec("Motion", [
        ["timeline", "animation split into ordered keyframe segments"],
        ["properties", "different properties can peak at different times"],
      ]),
    ],
  ),
  "ios-phase": spec(
    "Phase Animator 通过离散 phase 切换驱动一组样式变化，强调阶段感。",
    [
      sec("Trigger & State", [
        ["trigger", "phase value changes over time or interaction"],
        ["states", "multiple named phases rather than one continuous float"],
      ]),
      sec("Motion", [
        ["per_phase_style", "each phase defines a distinct visual treatment"],
      ]),
    ],
  ),
  "ios-lottie": spec(
    "Lottie 集成重点在于播放、暂停、循环和状态触发的准确性。",
    [
      sec("Trigger & State", [
        ["trigger", "playback starts on appear or explicit action"],
        ["states", "idle / playing / paused / completed"],
      ]),
      sec("Motion", [
        ["asset_rule", "use provided lottie asset, not a hand-rebuilt approximation"],
      ]),
    ],
  ),
  "ios-border-glow": spec(
    "Border Glow 通过 conic-gradient + 旋转光晕表现高光边框，重点是边框本身在转，不是整卡旋转。",
    [
      sec("Layout", [
        ["host", "content card stays still; glow lives on border/halo layers"],
        ["shape", "follow card radius exactly"],
      ]),
      sec("Motion", [
        ["rotation", "animated conic gradient or angle variable rotates continuously"],
        ["glow", "outer blur halo should feel soft, not neon block"],
      ]),
      sec("Constraints", [
        ["do_not_change", "不要把整个卡片本体转起来"],
      ]),
    ],
  ),
};
