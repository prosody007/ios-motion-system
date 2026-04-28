# iOS Motion System Skill

让 Cursor / Claude Code / Codex 在写 iOS 动画代码时直接引用本库的 SwiftUI / UIKit 标准实现。

## Install

通过 [skills.sh](https://skills.sh) 的官方 CLI 一行装好：

```bash
npx skills add prosody007/ios-motion-system
```

或者用我们自己的 curl 脚本（功能等价）：

```bash
curl -fsSL https://ios-motion-system.vercel.app/install.sh | bash
```

装完**重启客户端**即可生效。

## What's Inside

- `SKILL.md` —— Skill 元信息与触发指引（AI 入口）
- `references/_catalog.md` —— 所有分类索引
- `references/<slug>.md` —— 各分类详情（含 SwiftUI + UIKit 完整代码）
- `templates/dynamic-params.md` —— spring / carousel / border-glow 等可调参数

## Try It

在客户端对话里直接表达需求：

- "实现 iOS 风格的按钮按压反馈，要 spring"
- "我要一个底部弹出 Sheet，可以拖拽缩放"
- "卡片翻转效果，要真 3D 透视"
- "Spring 参数怎么选？我想要轻微回弹"
- "给我一段流光边框 CSS"
- "Tab 切换有 badge 弹跳效果"

AI 会自动加载本 Skill 并引用对应的代码模板。

## Update

```bash
npx skills update ios-motion-system
```

或：

```bash
cd ~/.local/share/ios-motion-system && git pull
```

## Customize

fork 仓库后改 `src/data/*.ts`，跑一次 `npm run export-skill` 重新生成 skill/，
然后让自己 / 团队从你的 fork 装：`npx skills add <your-username>/ios-motion-system`。
