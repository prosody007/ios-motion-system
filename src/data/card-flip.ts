import type { CardsSection } from "@/types/motion";

export const cardFlipSection: CardsSection = {
  type: "cards",
  title: "Card",
  description: "卡片展开、翻转与堆叠切换。",
  cards: [
    {
      title: "Card Expand",
      tags: [
        { text: "0.4s", variant: "duration" },
        { text: ".spring", variant: "spring" },
      ],
      previewId: "ios-card-expand",
      agentSpec: {
        summary:
          "同一张卡片在容器内从紧凑小卡展开为完整内容卡，再原路收回；重点是 geometry、clip-path 和内容显隐时序同步。",
        sections: [
          {
            title: "Trigger & State",
            entries: [
              { key: "trigger", value: "tap collapsed card => expand；tap expanded card => collapse" },
              { key: "states", value: "collapsed / expanded only；不做中间持久状态" },
              { key: "interaction_scope", value: "整张卡都可点击；不要额外加按钮触发" },
            ],
          },
          {
            title: "Layout",
            entries: [
              { key: "collapsed_geometry", value: "top/left/right/bottom = calc(50% - 40px)；视觉上是居中的小卡" },
              { key: "expanded_geometry", value: "top/left/right/bottom = 12px" },
              { key: "radius", value: "collapsed 18px -> expanded 20px" },
              { key: "content_structure", value: "collapsed 只显示头像；expanded 显示头像、关闭符号、标题、正文、底部说明" },
            ],
          },
          {
            title: "Motion",
            entries: [
              { key: "expand_duration", value: "320ms" },
              { key: "expand_easing", value: "cubic-bezier(0.32, 1.10, 0.5, 1)" },
              { key: "collapse_duration", value: "380ms" },
              { key: "collapse_easing", value: "cubic-bezier(0.32, 0.72, 0, 1)" },
              { key: "content_entry", value: "expanded 内容层用 clip-path 同步打开；标题/正文 translateY(20px -> 0)" },
              { key: "content_visibility", value: "头像与 expanded 内容都用 immediate visibility 切换，不做额外延迟 hidden/show" },
            ],
          },
          {
            title: "Constraints",
            entries: [
              { key: "do_not_change", value: "不要改成 modal、page push 或淡入淡出替代；必须保留同容器展开感" },
              { key: "layout_rule", value: "内容层固定在 inset 12 的内部区域，不靠整卡重排撑布局" },
              { key: "sync_rule", value: "geometry、radius、clip-path、title/body motion 要在同一条时间线上" },
            ],
          },
        ],
        acceptance: [
          "折叠态只看到居中头像，而不是缩略正文。",
          "展开时卡片轮廓和内容裁切同步打开，不出现内容先露出或被裁错位。",
          "收起时内容立即不可交互，卡片按原路径回到中心小卡。",
        ],
      },
      codes: {
        swift: `// SwiftUI — matchedGeometryEffect 卡片展开
struct CardExpandView: View {
    @Namespace private var namespace
    @State private var selectedCard: String?

    var body: some View {
        ZStack {
            if let selected = selectedCard {
                // 展开后的详情
                DetailView(id: selected)
                    .matchedGeometryEffect(
                        id: selected,
                        in: namespace
                    )
                    .onTapGesture {
                        withAnimation(
                            .spring(
                                response: 0.4,
                                dampingFraction: 0.85
                            )
                        ) {
                            selectedCard = nil
                        }
                    }
            } else {
                // 卡片列表
                ScrollView {
                    LazyVGrid(columns: columns, spacing: 16) {
                        ForEach(cards) { card in
                            CardView(card: card)
                                .matchedGeometryEffect(
                                    id: card.id,
                                    in: namespace
                                )
                                .onTapGesture {
                                    withAnimation(
                                        .spring(
                                            response: 0.4,
                                            dampingFraction: 0.85
                                        )
                                    ) {
                                        selectedCard = card.id
                                    }
                                }
                        }
                    }
                }
            }
        }
    }
}
// response: 0.4 — 快速但不突兀
// dampingFraction: 0.85 — 轻微回弹`,
        uikit: `// UIKit — 卡片展开过渡 (Hero-style)
class CardTransitionAnimator: NSObject, UIViewControllerAnimatedTransitioning {
    let isPresenting: Bool
    let originFrame: CGRect

    func transitionDuration(
        using context: UIViewControllerContextTransitioning?
    ) -> TimeInterval { 0.4 }

    func animateTransition(
        using context: UIViewControllerContextTransitioning
    ) {
        let container = context.containerView
        guard let toView = context.view(forKey: .to) else { return }

        if isPresenting {
            toView.frame = originFrame
            toView.layer.cornerRadius = 16
            toView.clipsToBounds = true
            container.addSubview(toView)

            let finalFrame = context.finalFrame(
                for: context.viewController(forKey: .to)!
            )

            UIView.animate(
                withDuration: 0.4,
                delay: 0,
                usingSpringWithDamping: 0.85,
                initialSpringVelocity: 0,
                options: [],
                animations: {
                    toView.frame = finalFrame
                    toView.layer.cornerRadius = 0
                },
                completion: { _ in
                    context.completeTransition(true)
                }
            )
        }
    }
}`,
      },
    },
    /* Matched Geometry 卡片折叠/展开 — 共享元素式的展开/折叠 */
    {
      title: "Matched Geometry",
      tags: [
        { text: "open: 0.40s", variant: "spring" },
        { text: "close: 0.24s", variant: "spring" },
      ],
      previewId: "ios-spring-matched-geometry",
      agentSpec: {
        summary:
          "共享元素式卡片折叠/展开：标题和主容器在两种状态之间连续过渡，正文根据状态切换为 preview 或 full content。",
        sections: [
          {
            title: "Trigger & State",
            entries: [
              { key: "trigger", value: "tap card toggles expanded" },
              { key: "states", value: "collapsed / expanded" },
              { key: "shared_elements", value: "标题与主容器是连续过渡的核心；正文按状态替换" },
            ],
          },
          {
            title: "Layout",
            entries: [
              { key: "collapsed_content", value: "标题 + 单行 previewText；stack spacing = 16" },
              { key: "expanded_content", value: "标题 + 两段完整正文；stack spacing = 32" },
              { key: "container", value: "白底圆角卡，最大宽度 528，对齐方式 leading" },
            ],
          },
          {
            title: "Motion",
            entries: [
              { key: "open_motion", value: "0.40s smooth / spring，给用户看清新内容" },
              { key: "close_motion", value: "0.24s smooth / spring，速度更快" },
              { key: "collapsed_text", value: "previewText 只保留一行，truncationMode = tail" },
              { key: "content_transition", value: "full content 用 opacity delayed easeOut 进入；preview text 用更快 opacity 退出" },
            ],
          },
          {
            title: "Constraints",
            entries: [
              { key: "do_not_change", value: "不要把它改成普通 accordion；必须保留 shared-element 的连续性" },
              { key: "copy_rule", value: "collapsed 是摘要，expanded 是完整信息；不要两边都显示相同正文块" },
            ],
          },
        ],
        acceptance: [
          "展开和收起的时长不同：展开更慢，收起更快。",
          "标题位置连续过渡，不出现跳变。",
          "collapsed 状态只保留一行摘要，不出现完整正文。",
        ],
      },
      codes: {
        swift: `// SwiftUI — 标题 matched，正文从截断 → 完整两段
// 动画规则：入场 0.40s 让眼睛看清新内容；出场 0.24s 用 Apple 招牌的柔和曲线收掉
@State private var expanded = false

struct HabitCard: View {
    @Binding var expanded: Bool

    private var animation: Animation {
        expanded
            ? .smooth(duration: 0.40, extraBounce: 0)
            // (0.32, 0.72, 0, 1) → SwiftUI 没有内置同名预设，最接近的是 .smooth
            : .smooth(duration: 0.24, extraBounce: 0)
    }

    var body: some View {
        VStack(alignment: .leading, spacing: expanded ? 32 : 16) {
            Text("小さな習慣が、人生の輪郭をつくる")
                .font(.system(size: 24, weight: .semibold))
                .foregroundStyle(.black)

            if expanded {
                VStack(alignment: .leading, spacing: 24) {
                    Text(paragraph1)
                    Text(paragraph2)
                }
                .font(.system(size: 16, weight: .light))
                .foregroundStyle(.black)
                .transition(.opacity.animation(.easeOut(duration: 0.24).delay(0.16)))
            } else {
                Text(previewText)
                    .font(.system(size: 16, weight: .light))
                    .foregroundStyle(.black)
                    .lineLimit(1)
                    .truncationMode(.tail)
                    .transition(.opacity.animation(.easeIn(duration: 0.10).delay(0.08)))
            }
        }
        .padding(.horizontal, 24)
        .padding(.vertical, 32)
        .frame(maxWidth: 528, alignment: .leading)
        .background(
            RoundedRectangle(cornerRadius: 20)
                .fill(.white)
                .shadow(color: .black.opacity(0.06), radius: 12, y: 4)
        )
        .onTapGesture {
            withAnimation(animation) { expanded.toggle() }
        }
    }
}`,
        uikit: `// UIKit — 入场 0.40s / 出场 0.24s，出场用 Apple 柔和曲线 (0.32, 0.72, 0, 1)
@IBAction func toggle() {
    expanded.toggle()

    let duration: TimeInterval = expanded ? 0.40 : 0.24
    let timing: UICubicTimingParameters = expanded
        ? UICubicTimingParameters(controlPoint1: CGPoint(x: 0.22, y: 1),
                                  controlPoint2: CGPoint(x: 0.36, y: 1))
        : UICubicTimingParameters(controlPoint1: CGPoint(x: 0.32, y: 0.72),
                                  controlPoint2: CGPoint(x: 0, y: 1))

    let anim = UIViewPropertyAnimator(duration: duration, timingParameters: timing)
    anim.addAnimations {
        self.previewLabel.alpha = self.expanded ? 0 : 1
        self.fullStack.alpha = self.expanded ? 1 : 0
        self.previewLabel.isHidden = self.expanded
        self.fullStack.isHidden = !self.expanded
        self.stackView.spacing = self.expanded ? 32 : 16
        self.view.layoutIfNeeded()
    }
    anim.startAnimation()
}

// 关键：所有变化放在同一个 animate block + layoutIfNeeded()，
// 让 AutoLayout 的约束变化、alpha、isHidden 共享同一条曲线。`,
      },
    },
    {
      title: "3D Flip",
      tags: [
        { text: "0.5s", variant: "duration" },
        { text: ".easeInOut", variant: "easing" },
      ],
      previewId: "ios-card-flip",
      agentSpec: {
        summary:
          "单张卡片在同一位置做真实 3D 翻转；前后两面共用同一张卡的几何区域，通过 rotateY / rotation3DEffect 切面。",
        sections: [
          {
            title: "Trigger & State",
            entries: [
              { key: "trigger", value: "tap top card toggles front/back" },
              { key: "states", value: "front / back" },
              { key: "interaction_scope", value: "整张卡点击即可翻；不要额外拆成单独按钮区触发" },
            ],
          },
          {
            title: "Layout",
            entries: [
              { key: "card_size", value: "321 × 325" },
              { key: "front_face", value: "顶部 index，中部题干，底部 'Tap to reveal'" },
              { key: "back_face", value: "顶部 'Answer'，中部答案文本，右下 quote icon，底部 'Tap to flip back'" },
            ],
          },
          {
            title: "Motion",
            entries: [
              { key: "duration", value: "0.5s" },
              { key: "easing", value: "easeInOut" },
              { key: "axis", value: "Y-axis only；不要混入 X/Z 倾斜主运动" },
              { key: "perspective", value: "保留透视（如 m34 / perspective: 1000），否则会退化成假翻面" },
              { key: "face_visibility", value: "front 在 0deg 可见；back 预先 rotateY(180deg)，随容器翻转显现" },
            ],
          },
          {
            title: "Constraints",
            entries: [
              { key: "do_not_change", value: "不要改成 crossfade、slide 或 scale；必须是真 3D card flip" },
              { key: "stacking_rule", value: "仅当前卡翻转；背景卡或其他容器不参与" },
            ],
          },
        ],
        acceptance: [
          "翻转时正反两面共用同一张卡的位置和尺寸。",
          "前后文案切换依赖 3D 旋转，不是简单透明度交叉淡入。",
          "透视存在，翻面过程中能明显看到空间感。",
        ],
      },
      codes: {
        swift: `// SwiftUI — 3D 翻转效果
struct FlipCardView: View {
    @State private var isFlipped = false
    @State private var rotation: Double = 0

    var body: some View {
        ZStack {
            // 正面
            CardFront()
                .opacity(rotation < 90 ? 1 : 0)
                .rotation3DEffect(
                    .degrees(rotation),
                    axis: (x: 0, y: 1, z: 0)
                )

            // 背面
            CardBack()
                .opacity(rotation >= 90 ? 1 : 0)
                .rotation3DEffect(
                    .degrees(rotation - 180),
                    axis: (x: 0, y: 1, z: 0)
                )
        }
        .onTapGesture {
            withAnimation(.easeInOut(duration: 0.5)) {
                rotation += 180
                isFlipped.toggle()
            }
        }
    }
}
// .easeInOut(duration: 0.5)
// 中间速度最快, 两端减速, 翻转自然`,
        uikit: `// UIKit — UIView.transition 翻转
class FlipCardVC: UIViewController {
    let containerView = UIView()
    let frontView = UIView()
    let backView = UIView()
    var showingFront = true

    func flipCard() {
        let fromView = showingFront ? frontView : backView
        let toView = showingFront ? backView : frontView

        UIView.transition(
            from: fromView,
            to: toView,
            duration: 0.5,
            options: [
                .transitionFlipFromRight,
                .showHideTransitionViews
            ],
            completion: { _ in
                self.showingFront.toggle()
            }
        )
    }

    // 手动 CATransform3D 版本
    func flipWithTransform() {
        var transform = CATransform3DIdentity
        transform.m34 = -1.0 / 500.0 // 透视
        containerView.layer.sublayerTransform = transform

        UIView.animate(
            withDuration: 0.5,
            delay: 0,
            options: .curveEaseInOut,
            animations: {
                self.containerView.layer.transform =
                    CATransform3DRotate(transform, .pi, 0, 1, 0)
            }
        )
    }
}`,
      },
    },
    {
      title: "Flash Card Stack",
      tags: [
        { text: "0.36s", variant: "duration" },
        { text: ".smooth", variant: "spring" },
      ],
      previewId: "ios-card-flash-stack",
      agentSpec: {
        summary:
          "经典三张闪卡牌堆轮换：三张卡始终保留在堆里，左右按钮只改变顺序，不删除卡片、不出现 swipe-away 文案或 intent 提示。",
        sections: [
          {
            title: "Trigger & State",
            entries: [
              { key: "trigger", value: "left/right chevron buttons only" },
              { key: "states", value: "order = [0,1,2] 的循环重排；卡片总数恒为 3" },
              { key: "next_prev", value: "next = [1,2,0]；prev = [2,0,1]" },
            ],
          },
          {
            title: "Layout",
            entries: [
              { key: "card_count", value: "3 cards always visible" },
              { key: "stack_shape", value: "后两张逐级缩小并向下堆叠，不做拖拽抛出或删除" },
              { key: "scales", value: "1.00 / 0.95 / 0.90" },
              { key: "offset_y", value: "0 / 12 / 24" },
              { key: "buttons", value: "底部是胶囊底板 + 两个圆形 chevron 按钮，不是 Need to Review / Mastered pills" },
            ],
          },
          {
            title: "Motion",
            entries: [
              { key: "duration", value: "0.42s" },
              { key: "curve", value: "smooth / spring-like reorder" },
              { key: "card_behavior", value: "所有卡片在同一段动画里交换位置；没有单张卡飞出舞台" },
            ],
          },
          {
            title: "Constraints",
            entries: [
              { key: "do_not_change", value: "不要改成 swipe-away、pill buttons、drag intent labels 或 reset 流程" },
              { key: "visual_rule", value: "三张卡是牌堆参考视图；重点是稳定轮换，不是手势实验场" },
            ],
          },
        ],
        acceptance: [
          "无论切多少次，始终保留 3 张卡。",
          "底部控制是 chevron 样式，而不是文字 pills。",
          "切换后新的顶层卡会放大到最前，其余两张回到堆叠位。",
        ],
      },
      codes: {
        swift: `// SwiftUI — 3 张卡片堆叠轮换
struct FlashCardStackView: View {
    struct FlashCard: Identifiable {
        let id: String
        let indexLabel: String
        let title: String
        let accent: Color
        let image: LinearGradient
    }

    @State private var order = [0, 1, 2]

    let cards: [FlashCard] = [
        .init(
            id: "scan",
            indexLabel: "1/3",
            title: "The sum of two negative integers is always negative.",
            accent: Color(hex: 0x007AFF),
            image: .init(colors: [Color(hex: 0xE3EEFF), Color(hex: 0xBCD7FF)], startPoint: .topLeading, endPoint: .bottomTrailing)
        ),
        .init(
            id: "study",
            indexLabel: "2/3",
            title: "Choose the correct verb form to complete the sentence.",
            accent: Color(hex: 0xAF52DE),
            image: .init(colors: [Color(hex: 0xF4E8FF), Color(hex: 0xDEC3FF)], startPoint: .topLeading, endPoint: .bottomTrailing)
        ),
        .init(
            id: "focus",
            indexLabel: "3/3",
            title: "Review the highlighted term before moving to the next card.",
            accent: Color(hex: 0x34C759),
            image: .init(colors: [Color(hex: 0xE5F8EB), Color(hex: 0xBFE9CB)], startPoint: .topLeading, endPoint: .bottomTrailing)
        ),
    ]

    private let stack = [
        (offsetY: 0.0,  scale: 1.00, z: 3.0),
        (offsetY: 12.0, scale: 0.95, z: 2.0),
        (offsetY: 24.0, scale: 0.90, z: 1.0),
    ]

    var body: some View {
        VStack(spacing: 20) {
            ZStack(alignment: .top) {
                ForEach(Array(order.enumerated()), id: \\.offset) { stackIndex, cardIndex in
                    let item = cards[cardIndex]
                    let style = stack[stackIndex]

                    VStack(spacing: 0) {
                        Rectangle()
                            .fill(item.image)
                            .frame(height: 140)

                        VStack(spacing: 12) {
                            Text(item.indexLabel)
                                .font(.system(size: 14, weight: .regular))
                                .foregroundStyle(Color(hex: 0x595C60))

                            Text(item.title)
                                .font(.system(size: 14, weight: .semibold))
                                .multilineTextAlignment(.center)
                                .foregroundStyle(.black)

                            Text("Tap to reveal")
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundStyle(item.accent)
                        }
                        .padding(.horizontal, 16)
                        .padding(.top, 16)
                        .padding(.bottom, 20)
                    }
                    .frame(width: 210)
                    .background(.white)
                    .clipShape(RoundedRectangle(cornerRadius: 20))
                    .shadow(color: .black.opacity(0.08), radius: 12, y: 8)
                    .frame(width: 321, height: 325, alignment: .top)
                    .scaleEffect(style.scale)
                    .offset(y: style.offsetY)
                    .zIndex(style.z)
                }
            }
            .frame(width: 321, height: 280)

            HStack(spacing: 8) {
                Button {
                    withAnimation(.smooth(duration: 0.42)) {
                        order = [order[2], order[0], order[1]]
                    }
                } label: {
                    Image(systemName: "chevron.left")
                        .frame(width: 40, height: 40)
                        .background(Color(hex: 0xE9ECF5), in: Circle())
                }

                Button {
                    withAnimation(.smooth(duration: 0.42)) {
                        order = [order[1], order[2], order[0]]
                    }
                } label: {
                    Image(systemName: "chevron.right")
                        .frame(width: 40, height: 40)
                        .background(Color(hex: 0xE9ECF5), in: Circle())
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(Color(hex: 0xEDEEF3), in: Capsule())
        }
    }
}

// 交互规则：
// • 共 3 张卡片，后两张逐级缩小并向下堆叠
// • Next  = 第一张移到最后，第二张放大到最前
// • Prev  = 最后一张移到最前，第一张退到第二位
// • 全部卡片在同一段 smooth 动画中交换位置`,
        uikit: `// UIKit — Flash Card 堆叠轮换
final class FlashCardStackView: UIView {
    private let cards: [UIView] = [UIView(), UIView(), UIView()]
    private var order = [0, 1, 2]

    private let stack: [(y: CGFloat, scale: CGFloat, z: CGFloat)] = [
        (0, 1.00, 3),
        (12, 0.95, 2),
        (24, 0.90, 1),
    ]

    func moveForward() {
        order = [order[1], order[2], order[0]]
        applyStack(animated: true)
    }

    func moveBackward() {
        order = [order[2], order[0], order[1]]
        applyStack(animated: true)
    }

    private func applyStack(animated: Bool) {
        for (stackIndex, cardIndex) in order.enumerated() {
            let view = cards[cardIndex]
            let style = stack[stackIndex]

            let updates = {
                view.transform = CGAffineTransform(translationX: 0, y: style.y)
                    .scaledBy(x: style.scale, y: style.scale)
                view.layer.zPosition = style.z
            }

            guard animated else {
                updates()
                continue
            }

            let timing = UISpringTimingParameters(dampingRatio: 1.0)
            let animator = UIViewPropertyAnimator(duration: 0.42, timingParameters: timing)
            animator.addAnimations(updates)
            animator.startAnimation()
        }
    }
}

// 交互规则：
// • 3 张卡片保持堆叠
// • 后两张逐级缩小并向下露出
// • Next  = 顶层卡片移到最后
// • Prev  = 底层卡片提到最前
// • 所有卡片在同一段动画中交换位置`,
      },
    },
    {
      title: "Flash Card Flip Swipe Away",
      tags: [
        { text: "0.5s", variant: "duration" },
        { text: ".easeInOut", variant: "easing" },
      ],
      previewId: "ios-card-flip-swipe-away",
      agentSpec: {
        summary:
          "融合案例：以 swipe-away 牌堆为基础，顶层卡可轻点 3D 翻转；横向拖拽或按钮触发时，当前卡滑走并从堆中移除，全部移除后显示 Reset。",
        sections: [
          {
            title: "Trigger & State",
            entries: [
              { key: "tap", value: "轻点顶层卡片 => 3D flip" },
              { key: "drag", value: "横向拖动顶层卡片；位移达到阈值后 swipe away" },
              { key: "buttons", value: "Need to Review / Mastered 也可触发左右滑走" },
              { key: "reset", value: "cards 全部移除后才显示 Reset；点击恢复 3 张并清空 flipped 状态" },
            ],
          },
          {
            title: "Gesture Arbitration",
            entries: [
              { key: "tap_vs_drag", value: "轻点翻转；一旦指针移动超过小阈值，就抑制 flip，仅保留 drag/swipe" },
              { key: "swipe_threshold", value: "水平位移阈值 60px" },
              { key: "button_during_exit", value: "卡片飞出过程中按钮保持原样；不要提前切成 Reset" },
            ],
          },
          {
            title: "Layout & Stack",
            entries: [
              { key: "card_count", value: "初始 3 cards；每次 swipe/remove 后 -1" },
              { key: "top_card", value: "顶层卡支持 3D flip；背景两张只显示 front face" },
              { key: "background_scale", value: "背景卡必须等比缩小，不允许横纵分别压缩导致内容变形" },
              { key: "background_alignment", value: "背景卡按中心线对齐，需要保留横向居中补偿，不能出现左右错位" },
              { key: "intent_label", value: "Need to Review 显示在 1/3 左侧；Mastered 显示在 1/3 右侧" },
            ],
          },
          {
            title: "Motion",
            entries: [
              { key: "flip_duration", value: "0.5s" },
              { key: "flip_curve", value: "easeInOut" },
              { key: "swipe_duration", value: "0.32s" },
              { key: "swipe_curve", value: "easeIn" },
              { key: "swipe_distance", value: "约 480px" },
              { key: "swipe_rotation", value: "约 18deg" },
            ],
          },
          {
            title: "Constraints",
            entries: [
              { key: "do_not_change", value: "不要把它退化成普通 flash stack，也不要删掉 3D flip 行为" },
              { key: "remove_rule", value: "卡片滑走后直接从数组移除，不回到堆尾" },
              { key: "face_rule", value: "只有当前顶层卡允许翻转；背景卡固定 front face" },
            ],
          },
        ],
        acceptance: [
          "轻点能翻转，横拖能滑走，两者不会互相抢事件。",
          "背景卡不变形，并且左右保持居中。",
          "三张都移除后只显示 Reset，不再显示原来的两个按钮。",
        ],
      },
      codes: {
        swift: `// SwiftUI — 顶层卡片可 3D 翻转，左右滑走后直接移除
struct FlashCardFlipSwipeAwayView: View {
    @State private var cards = ["card-1", "card-2", "card-3"]
    @State private var flipped: Set<String> = []
    @State private var dragOffset: CGSize = .zero

    private let slots: [(tx: CGFloat, ty: CGFloat, s: CGFloat)] = [
        (0,   0,   1.000),
        (14,  66,  0.913),
        (28, 101,  0.826),
    ]

    var body: some View {
        VStack(spacing: 16) {
            ZStack(alignment: .topLeading) {
                ForEach(Array(cards.enumerated()), id: \.element) { stackIndex, card in
                    let slot = slots[stackIndex]
                    let isTop = stackIndex == 0
                    let isFlipped = flipped.contains(card)

                    Group {
                        if isTop {
                            ZStack {
                                CardFront()
                                    .opacity(isFlipped ? 0 : 1)
                                    .rotation3DEffect(.degrees(isFlipped ? 180 : 0),
                                                      axis: (x: 0, y: 1, z: 0))
                                CardBack()
                                    .opacity(isFlipped ? 1 : 0)
                                    .rotation3DEffect(.degrees(isFlipped ? 0 : -180),
                                                      axis: (x: 0, y: 1, z: 0))
                            }
                            .onTapGesture {
                                withAnimation(.easeInOut(duration: 0.5)) {
                                    if isFlipped { flipped.remove(card) } else { flipped.insert(card) }
                                }
                            }
                        } else {
                            CardFront()
                        }
                    }
                    .frame(width: 321, height: 325)
                    .offset(x: isTop ? dragOffset.width : 0,
                            y: isTop ? dragOffset.height * 0.4 : 0)
                    .rotationEffect(isTop ? .degrees(dragOffset.width * 0.06) : .zero)
                    .scaleEffect(slot.s)
                    .offset(x: slot.tx, y: slot.ty)
                }
            }
            .frame(width: 321, height: 345)

            if cards.isEmpty {
                Button("Reset") {
                    cards = ["card-1", "card-2", "card-3"]
                    flipped.removeAll()
                }
                .frame(width: 321, height: 40)
            }
        }
    }
}`,
        uikit: `// UIKit — 顶层卡片可翻转，滑走后直接移除
final class FlashCardFlipSwipeAwayView: UIView {
    private var cards: [UIView] = (0..<3).map { _ in UIView() }
    private var showingBack = false

    func flipTopCard() {
        // 顶层卡片 front/back 做 UIView.transition flip
    }

    func dismissTopCard(sign: CGFloat) {
        // 左右滑走后 removeFirst()，剩余卡片前移
    }

    func resetStack() {
        // 重新创建 3 张卡，并把顶层恢复到正面
    }
}`,
      },
    },
  ],
};
