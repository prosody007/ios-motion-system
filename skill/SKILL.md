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

## 落地到用户项目

不是只回一段代码，而是**直接动手**：

1. **定位目标文件**：扫一遍当前 workspace，找到合适落地的 SwiftUI / UIKit 文件（比如用户提到的视图、最近编辑的、或者 `Views/` 目录下的对应文件）。如果不存在，新建。
2. **粘贴模板，按项目命名调整**：模板里 `struct CardExpandView: View` 这类示例名要改成符合用户项目命名约定的名字；`@State` 绑定如果用户已有 model / store 要接进去而不是新建。
3. **保留代码注释里的中文**——那些是给最终用户看的设计说明，不要翻译或删除。
4. **不要凭空发明 API**：本库代码已验证过；要扩展时显式说明"基于本库的 X 模板，新加 Y"，让用户能追溯。

## 平台与 API 选择

- **优先 SwiftUI**（iOS 16+ 已是主流）。除非用户项目是纯 UIKit 或明确指定。
- **iOS 17+ 推荐**：Spring 优先用 `.smooth` / `.snappy` / `.bouncy` 三个预设而不是 `.spring(response:dampingFraction:)`。
- **Spring 语义**：response（周期，越大越慢）+ damping（阻尼比，1.0=无过冲，越小越弹）。
- **deployment target 检测**：能看到 `Package.swift` / `.xcodeproj` 时，优先匹配项目实际的 iOS 版本；不确定时默认 iOS 17+。

## 在线预览与原始仓库

- 在线 demo：https://ios-motion-system.vercel.app
- 源码仓库：https://github.com/prosody007/ios-motion-system
- 本 Skill 由仓库的 `scripts/export-skill.ts` 自动从 `src/data/*.ts` 生成。
