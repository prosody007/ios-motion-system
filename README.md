# iOS Motion System

iOS 交互动效参考库 —— 40 个分类、80+ 标准动效，每个都附完整可粘贴的 SwiftUI / UIKit 代码。在线预览：[ios-motion-system.vercel.app](https://ios-motion-system.vercel.app)

## 给最终用户：装进 AI 编程客户端

通过 [skills.sh](https://skills.sh) 的官方 CLI，一行装好（自动 clone + 软链到 Cursor / Claude Code / Codex）：

```bash
npx skills add prosody007/ios-motion-system
```

或者用我们自己的 curl 脚本：

```bash
curl -fsSL https://ios-motion-system.vercel.app/install.sh | bash
```

重启客户端即可生效。完整安装选项 / 触发示例见站内 [Skills](https://ios-motion-system.vercel.app/skills) 页面或 [`skill/README.md`](./skill/README.md)。

## 给开发者：本地预览

```bash
npm install
npm run dev   # http://localhost:3000
```

## 给开发者：自定义 / 二次生成 Skill

`skill/` 内容由 `scripts/export-skill.ts` 自动从 `src/data/*.ts` 生成。改了 cards 后跑一下：

```bash
npm run export-skill
```

会重新生成 `skill/SKILL.md`、`skill/references/*.md`、`skill/templates/dynamic-params.md`。

## 项目结构

```
src/
├── app/                    Next.js App Router 页面
├── components/preview/     各 demo 的预览组件
└── data/
    ├── categories.ts       分类清单
    ├── navigation.ts       侧栏导航分组
    ├── skills.ts           站内 Skills 接入文档
    ├── <slug>.ts           各分类 cards 数据（标题 / 标签 / 完整代码）
    └── index.ts            sectionMap 汇总
scripts/
└── export-skill.ts         skill/ 生成脚本
skill/                      给 AI 客户端用的 Agent Skill（已 commit）
```

## License

MIT
