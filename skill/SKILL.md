---
name: ios-motion-system
description: iOS 动效实现库 —— SwiftUI / UIKit 的 Spring、Sheet、Tab Bar、Toast、Card、Border Glow、骨架屏、转场、手势等 80+ 标准动效代码模板。当用户需要实现 iOS 风格动画（按钮按压、底部弹层、卡片展开/翻转、转场、回弹效果等）时使用。
---

# iOS Motion System

完整的 iOS 动效实现库，覆盖 Apple HIG 推荐的标准动画、Spring 弹性、转场、手势、加载态等 40 个分类的 SwiftUI 与 UIKit 代码模板。

## 触发条件

当用户提出以下需求时使用本 Skill：

- 实现某个 iOS 动效（按钮按压、Sheet 展开、Tab 切换、卡片翻转、骨架屏等）
- 询问 SwiftUI / UIKit 中如何做特定动画
- 询问 Spring 参数、转场曲线、动画时长怎么选
- 需要可粘贴的 iOS 动画代码片段
- 中文或英文表述，例如「卡片展开」「pull to refresh」「rotateY 翻转」「toast 通知」

## 使用步骤

### Step 1：浏览索引

读 `references/_catalog.md`，里面按使用场景分组列了所有 40 个分类的 slug、标题、用途。根据用户需求定位到对应分类的 slug。

### Step 2：加载分类详情

读取 `references/<slug>.md`，里面包含该分类下所有 cards：

- 标题（中英）
- Tags（duration / easing / spring）
- Preview ID（与在线网站一一对应）
- 完整 SwiftUI 代码
- 完整 UIKit 代码

### Step 3：处理动态参数（如有）

部分卡片代码含 `{{paramName}}` 占位符（例如 `ios-spring-playground`、`ios-carousel`）。
读 `templates/dynamic-params.md` 获取每个参数的类型与默认值，按用户需求替换占位符再返回。

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

## 重要约定

- **平台**：每张卡都同时提供 SwiftUI（iOS 16+）和 UIKit 两套实现。优先 SwiftUI，除非用户明确要 UIKit。
- **iOS 17+ 推荐**：Spring 优先用 `.smooth` / `.snappy` / `.bouncy` 三个预设。
- **Spring 参数语义**：response（周期，越大越慢）+ damping（阻尼比，1.0=无过冲，越小越弹）。
- **不要改代码注释里的中文**——那些是给最终用户看的设计说明。
- **不要凭空发明 API**——本库的代码已经过验证；如用户要扩展，明确告知"基于本库的 X 模板增加 Y 修改"。

## 在线预览与原始仓库

- 在线 demo：https://ios-motion-system.vercel.app
- 源码仓库：https://github.com/prosody007/ios-motion-system
- 本 Skill 由仓库的 `scripts/export-skill.ts` 自动从 `src/data/*.ts` 生成。
