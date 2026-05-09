---
name: ios-motion-system
description: iOS 风格动效的 React 实现库 —— Spring、Sheet、Tab Bar、Toast、Card、Border Glow、骨架屏、转场、手势等 80+ 标准动效的 React/TSX 代码模板。预览与代码统一使用 React，方便在 Web 项目里直接落地与测试。
---

# iOS Motion System

iOS 风格的动效实现库，覆盖 Apple HIG 推荐的常用动画、Spring 弹性、转场、手势、加载态等 40 个分类的 **React/TSX** 代码模板。预览与实现代码统一使用 React。

## 触发条件

当用户提出以下需求时使用本 Skill：

- 在 Web/React 项目里实现 iOS 风格动效（按钮按压、Sheet 展开、Tab 切换、卡片翻转、骨架屏等）
- 询问 React 里如何还原某个 iOS 动画
- 询问 Spring 参数、转场曲线、动画时长怎么选
- 需要可粘贴的 React 动画代码片段
- 中文或英文表述，例如「卡片展开」「pull to refresh」「rotateY 翻转」「toast 通知」

## 使用步骤

### Step 1：浏览索引

读 `references/_catalog.md`，里面按使用场景分组列了所有 40 个分类的 slug、标题、用途。根据用户需求定位到对应分类的 slug。

### Step 2：加载分类详情

读取 `references/<slug>.md`，里面包含该分类下所有 cards：

- 标题（中英）
- Tags（duration / easing / spring）
- Preview ID（与在线网站一一对应）
- 结构化 AI Motion Spec（如该 card 已补齐）
- 单一的 React/TSX 代码块（与在线预览实现一致）

### Step 3：处理动态参数（如有）

部分卡片代码含 `{{paramName}}` 占位符（例如 `ios-spring-playground`、`ios-carousel`）。
读 `templates/dynamic-params.md` 获取每个参数的类型与默认值，按用户需求替换占位符再返回。

### Step 4：锁定动画优先复用（团队协作）

对于已锁定的生产动效（例如 `ios-card-flash-stack`），优先复用仓库中的标准组件入口，不要复制 keyframes 后在业务页面里改一份。

- 推荐复用：`FlashCardTransitionPreview`
- 不建议：复制一份动画实现并私自改 `duration / easing / keyframes`

## 分类导航

- **基础**：`tokens` · `spring-curves`
- **组件微交互**：`button` · `toggle` · `checkbox` · `segmented` · `slider` · `textfield` · `tabbar` · `pull-refresh`
- **弹性动画**：`spring-animations`
- **列表 & 内容**：`reorder` · `stagger` · `expandable` · `card-flip` · `carousel`
- **加载 & 状态**：`loading` · `skeleton` · `progress` · `success-error` · `toast`
- **弹层 & 浮层**：`sheet` · `alert` · `action-sheet` · `tooltip` · `dropdown` · `notification-banner`
- **手势**：`swipe-dismiss` · `swipe-cards`
- **转场**：`navigation` · `page-transitions` · `custom-transitions` · `hero-transition`
- **触觉**：`haptics`
- **高级动效**：`counter` · `scroll-driven` · `keyframe` · `phase` · `lottie` · `border-glow`

## 落地到用户项目

不是只回一段代码，而是**直接动手**：

1. **定位目标文件**：扫一遍当前 workspace，找到合适落地的 React/TSX 文件（页面或组件目录）。如果不存在，新建一个客户端组件。
2. **粘贴模板，按项目命名调整**：示例组件名要改成符合用户项目命名约定的名字；状态绑定如果用户已有 store / context，要接进去而不是新建。
3. **保留代码注释里的中文**——那些是给最终用户看的设计说明，不要翻译或删除。
4. **不要凭空发明 API**：本库代码已验证过；要扩展时显式说明"基于本库的 X 模板，新加 Y"，让用户能追溯。

## 实现风格

- 统一使用 **React + TypeScript**，client component（`"use client"`）。
- 优先使用 **CSS transition / keyframes** 表达动画；交互逻辑用 React state 控制。
- Tailwind / 内联 style 都可以，按项目现有风格选择。
- Spring 参数对应 `cubic-bezier`、`framer-motion` 或 `react-spring` 都可以，按 `Spring & Timing` 分类选合适曲线。

## Motion Lock（团队防改坏）

以下规则用于保证多人协作时动画手感不漂移：

- `ios-card-flash-stack` 的按钮切卡关键帧（尤其 `enter-prev` / `exit-next`）与对应时序属于锁定参数。
- 做题→结算、结算→重做的容器过渡时序属于锁定参数。
- 结算内容逐项出现（得分牌→文案→按钮）的时序属于锁定参数。
- 若要改动以上参数，先新增 card / previewId 做实验，通过评审后再替换默认实现。
- 接入验收至少覆盖：初始、答错、答对左飞、结算、Review Quiz 回退、右箭头 prev 平滑回顶。

## 在线预览与原始仓库

- 在线 demo：https://ios-motion-system.vercel.app
- 源码仓库：https://github.com/prosody007/ios-motion-system
- 本 Skill 由仓库的 `scripts/export-skill.ts` 自动从 `src/data/*.ts` 生成。
