# Card

卡片展开、翻转与堆叠切换。

## Flash Card Stack

- Preview ID：`ios-card-flash-stack`
- Tags：`0.36s` (duration) · `.smooth` (spring)

### AI Motion Spec

当前生产版 Flash Card Stack：做题流程（答对自动左飞移除）+ 结算态（0~3 分）+ Review Quiz 回退重做；按钮切卡轨迹与线上网站保持一致。

#### Trigger & State

| Key | Value |
|---|---|
| answer_flow | 点击选项；错误保持错误态；正确后显示反馈并在 0.5s 后自动左飞移除当前卡 |
| stack_order | left 按钮：顶卡入底（next）；right 按钮：底卡回顶（prev） |
| settlement | 3 题结束后进入结算卡，分数范围 0/3~3/3；Review Quiz 重置回初始三题 |
| button_visibility_after_review | 点击 Review Quiz 后，等待容器展开完成再显示左右按钮 |

#### Layout

| Key | Value |
|---|---|
| frame_panel_stage | Frame 393×852；Panel x20 y152 w353；Stage 321×460；Top card 321×440 |
| stack_slots | 后两张按等比缩放 + 居中堆叠；露出间距 = 10；按钮区与牌堆间距 = 16 |
| settlement_layout_base | 结算容器内布局以 Figma 1407:7232 / 1407:7235 为基准，内容文案以 1407:7251 四状态为基准 |
| button_style | 结算按钮高度 44；Review Quiz 文字盒 94×16，Inter 600/16/16，tracking -1% |

#### Motion

| Key | Value |
|---|---|
| reorder_duration | 360ms（左右按钮切卡） |
| reorder_curve | cubic-bezier(0.4, 0, 0.2, 1) |
| reorder_keyframe_lock | prev/next 关键帧中点保留 49.9% / 50.1% 的 z-index 切换，不可改 |
| auto_dismiss | 答对后 500ms 等待，再用 320ms 左飞移除（与 flip swipe-away 左飞参数一致） |
| panel_resize | 做题→结算 / 结算→做题 的容器高度过渡 = 200ms |
| settlement_stagger | 结算内容按 得分牌→文案→按钮 逐项出现；duration 220ms，stagger 70ms |

#### Constraints

| Key | Value |
|---|---|
| motion_lock | 禁止单独修改 FLASH_STACK_DURATION / FLASH_STACK_EASE / enter-prev & exit-next 关键帧；改动必须同步设计与验收 |
| reuse_rule | 团队内复用优先直接使用 FlashCardTransitionPreview，避免拷贝后再改一份动画实现 |
| scope_rule | 需要新玩法时创建新 previewId，不在 ios-card-flash-stack 现有实现上叠加破坏式改动 |

#### Acceptance

- 右箭头（prev）从底卡回顶的过渡必须连续顺滑，不出现瞬间缩小或跳帧。
- 答对后卡片左飞并从堆中移除；三题完成后进入结算态。
- 点击 Review Quiz 后，先展开容器，再出现左右按钮。
- 结算内容按得分牌、文案、按钮逐项丝滑出现。

### Code

```tsx
"use client";

import { FlashCardTransitionPreview } from "@/components/preview/card-flip-preview";

/**
 * Team Reuse Entry (LOCKED)
 * - 直接复用仓库里的标准实现，保证动效与网站 1:1 一致。
 * - 不要在业务页面里重写 keyframes / duration / easing。
 * - 如需新玩法，请新建 previewId，而不是改这份实现。
 */
export function FlashCardStackLockedDemo() {
  return <FlashCardTransitionPreview />;
}
```

---

## Card Expand

- Preview ID：`ios-card-expand`
- Tags：`0.4s` (duration) · `.spring` (spring)

### AI Motion Spec

同一张卡片在容器内从紧凑小卡展开为完整内容卡，再原路收回；重点是 geometry、clip-path 和内容显隐时序同步。

#### Trigger & State

| Key | Value |
|---|---|
| trigger | tap collapsed card => expand；tap expanded card => collapse |
| states | collapsed / expanded only；不做中间持久状态 |
| interaction_scope | 整张卡都可点击；不要额外加按钮触发 |

#### Layout

| Key | Value |
|---|---|
| collapsed_geometry | top/left/right/bottom = calc(50% - 40px)；视觉上是居中的小卡 |
| expanded_geometry | top/left/right/bottom = 12px |
| radius | collapsed 18px -> expanded 20px |
| content_structure | collapsed 只显示头像；expanded 显示头像、关闭符号、标题、正文、底部说明 |

#### Motion

| Key | Value |
|---|---|
| expand_duration | 320ms |
| expand_easing | cubic-bezier(0.32, 1.10, 0.5, 1) |
| collapse_duration | 380ms |
| collapse_easing | cubic-bezier(0.32, 0.72, 0, 1) |
| content_entry | expanded 内容层用 clip-path 同步打开；标题/正文 translateY(20px -> 0) |
| content_visibility | 头像与 expanded 内容都用 immediate visibility 切换，不做额外延迟 hidden/show |

#### Constraints

| Key | Value |
|---|---|
| do_not_change | 不要改成 modal、page push 或淡入淡出替代；必须保留同容器展开感 |
| layout_rule | 内容层固定在 inset 12 的内部区域，不靠整卡重排撑布局 |
| sync_rule | geometry、radius、clip-path、title/body motion 要在同一条时间线上 |

#### Acceptance

- 折叠态只看到居中头像，而不是缩略正文。
- 展开时卡片轮廓和内容裁切同步打开，不出现内容先露出或被裁错位。
- 收起时内容立即不可交互，卡片按原路径回到中心小卡。

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
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
// dampingFraction: 0.85 — 轻微回弹
```

---

## Matched Geometry

- Preview ID：`ios-spring-matched-geometry`
- Tags：`open: 0.40s` (spring) · `close: 0.24s` (spring)

### AI Motion Spec

共享元素式卡片折叠/展开：标题和主容器在两种状态之间连续过渡，正文根据状态切换为 preview 或 full content。

#### Trigger & State

| Key | Value |
|---|---|
| trigger | tap card toggles expanded |
| states | collapsed / expanded |
| shared_elements | 标题与主容器是连续过渡的核心；正文按状态替换 |

#### Layout

| Key | Value |
|---|---|
| collapsed_content | 标题 + 单行 previewText；stack spacing = 16 |
| expanded_content | 标题 + 两段完整正文；stack spacing = 32 |
| container | 白底圆角卡，最大宽度 528，对齐方式 leading |

#### Motion

| Key | Value |
|---|---|
| open_motion | 0.40s smooth / spring，给用户看清新内容 |
| close_motion | 0.24s smooth / spring，速度更快 |
| collapsed_text | previewText 只保留一行，truncationMode = tail |
| content_transition | full content 用 opacity delayed easeOut 进入；preview text 用更快 opacity 退出 |

#### Constraints

| Key | Value |
|---|---|
| do_not_change | 不要把它改成普通 accordion；必须保留 shared-element 的连续性 |
| copy_rule | collapsed 是摘要，expanded 是完整信息；不要两边都显示相同正文块 |

#### Acceptance

- 展开和收起的时长不同：展开更慢，收起更快。
- 标题位置连续过渡，不出现跳变。
- collapsed 状态只保留一行摘要，不出现完整正文。

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
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
}
```

---

## 3D Flip

- Preview ID：`ios-card-flip`
- Tags：`0.5s` (duration) · `.easeInOut` (easing)

### AI Motion Spec

单张卡片在同一位置做真实 3D 翻转；前后两面共用同一张卡的几何区域，通过 rotateY / rotation3DEffect 切面。

#### Trigger & State

| Key | Value |
|---|---|
| trigger | tap top card toggles front/back |
| states | front / back |
| interaction_scope | 整张卡点击即可翻；不要额外拆成单独按钮区触发 |

#### Layout

| Key | Value |
|---|---|
| card_size | 321 × 325 |
| front_face | 顶部 index，中部题干，底部 'Tap to reveal' |
| back_face | 顶部 'Answer'，中部答案文本，右下 quote icon，底部 'Tap to flip back' |

#### Motion

| Key | Value |
|---|---|
| duration | 0.5s |
| easing | easeInOut |
| axis | Y-axis only；不要混入 X/Z 倾斜主运动 |
| perspective | 保留透视（如 m34 / perspective: 1000），否则会退化成假翻面 |
| face_visibility | front 在 0deg 可见；back 预先 rotateY(180deg)，随容器翻转显现 |

#### Constraints

| Key | Value |
|---|---|
| do_not_change | 不要改成 crossfade、slide 或 scale；必须是真 3D card flip |
| stacking_rule | 仅当前卡翻转；背景卡或其他容器不参与 |

#### Acceptance

- 翻转时正反两面共用同一张卡的位置和尺寸。
- 前后文案切换依赖 3D 旋转，不是简单透明度交叉淡入。
- 透视存在，翻面过程中能明显看到空间感。

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
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
// 中间速度最快, 两端减速, 翻转自然
```

---

## Flash Card Flip Swipe Away

- Preview ID：`ios-card-flip-swipe-away`
- Tags：`0.5s` (duration) · `.easeInOut` (easing)

### AI Motion Spec

融合案例：以 swipe-away 牌堆为基础，顶层卡可轻点 3D 翻转；横向拖拽或按钮触发时，当前卡滑走并从堆中移除，全部移除后显示 Reset。

#### Trigger & State

| Key | Value |
|---|---|
| tap | 轻点顶层卡片 => 3D flip |
| drag | 横向拖动顶层卡片；位移达到阈值后 swipe away |
| buttons | Need to Review / Mastered 也可触发左右滑走 |
| reset | cards 全部移除后才显示 Reset；点击恢复 3 张并清空 flipped 状态 |

#### Gesture Arbitration

| Key | Value |
|---|---|
| tap_vs_drag | 轻点翻转；一旦指针移动超过小阈值，就抑制 flip，仅保留 drag/swipe |
| swipe_threshold | 水平位移阈值 60px |
| button_during_exit | 卡片飞出过程中按钮保持原样；不要提前切成 Reset |

#### Layout & Stack

| Key | Value |
|---|---|
| card_count | 初始 3 cards；每次 swipe/remove 后 -1 |
| top_card | 顶层卡支持 3D flip；背景两张只显示 front face |
| background_scale | 背景卡必须等比缩小，不允许横纵分别压缩导致内容变形 |
| background_alignment | 背景卡按中心线对齐，需要保留横向居中补偿，不能出现左右错位 |
| intent_label | Need to Review 显示在 1/3 左侧；Mastered 显示在 1/3 右侧 |

#### Motion

| Key | Value |
|---|---|
| flip_duration | 0.5s |
| flip_curve | easeInOut |
| swipe_duration | 0.32s |
| swipe_curve | easeIn |
| swipe_distance | 约 480px |
| swipe_rotation | 约 18deg |

#### Constraints

| Key | Value |
|---|---|
| do_not_change | 不要把它退化成普通 flash stack，也不要删掉 3D flip 行为 |
| remove_rule | 卡片滑走后直接从数组移除，不回到堆尾 |
| face_rule | 只有当前顶层卡允许翻转；背景卡固定 front face |

#### Acceptance

- 轻点能翻转，横拖能滑走，两者不会互相抢事件。
- 背景卡不变形，并且左右保持居中。
- 三张都移除后只显示 Reset，不再显示原来的两个按钮。

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
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
                ForEach(Array(cards.enumerated()), id: .element) { stackIndex, card in
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
}
```

