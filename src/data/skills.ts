import type { DocsSection } from "@/types/motion";

export const skillsSection: DocsSection = {
  type: "docs",
  title: "Skills",
  description:
    "Give your AI assistant deep knowledge of this animation library. Once installed, Cursor / Claude Code / Codex can drop the right SwiftUI / UIKit implementation straight into your iOS project.",
  sections: [
    {
      title: "Install",
      paragraphs: [
        "一行装好，自动 clone 仓库并软链到 Cursor / Claude Code / Codex 的 Skills 目录。",
      ],
      codeBlocks: [
        {
          language: "bash",
          code: "curl -fsSL https://ios-motion-system.vercel.app/install.sh | bash",
        },
      ],
    },
    {
      title: "What's Inside",
      bullets: [
        "**SKILL.md** —— 触发条件、使用步骤、命名约定（AI 客户端入口）",
        "**references/_catalog.md** —— 所有分类索引（slug / 标题 / 用途）",
        "**references/&lt;slug&gt;.md** —— 单个分类下全部 cards 的完整 SwiftUI + UIKit 代码",
        "**templates/dynamic-params.md** —— spring / carousel / border-glow 的可调参数表与默认值",
      ],
    },
    {
      title: "How It Works",
      bullets: [
        "**触发**：用户提到 iOS 动画需求时，AI 客户端自动加载 SKILL.md，按需读对应 reference 文件。",
        "**模板注入**：AI 把代码模板贴进项目对应的 SwiftUI / UIKit 文件，按用户的命名 / 状态绑定调整。",
        "**参数替换**：含 `{{param}}` 占位符的代码（如 spring playground）会按 templates/dynamic-params.md 的默认值或用户偏好填值。",
        "**版本同步**：仓库 git pull 后，本地 skill 自动更新，无需重装。",
      ],
    },
    {
      title: "Try It",
      paragraphs: [
        "重启客户端后，在对话里直接表达需求，AI 会从本库挑对应的 demo 给出代码：",
      ],
      bullets: [
        '"实现 iOS 风格的按钮按压反馈，要 spring"',
        '"我要一个底部弹出 Sheet，可以拖拽缩放"',
        '"卡片翻转效果，要真 3D 透视"',
        '"Spring 参数怎么选？我想要轻微回弹"',
        '"给我一段流光边框 CSS"',
        '"Tab 切换有 badge 弹跳效果"',
      ],
    },
    {
      title: "Manual Install",
      paragraphs: [
        "不想用 install.sh 也行：clone 仓库后手动软链到对应客户端的 Skills 目录。",
      ],
      codeBlocks: [
        {
          title: "Cursor",
          language: "bash",
          code: 'git clone https://github.com/prosody007/ios-motion-system.git\nmkdir -p ~/.cursor/skills-cursor\nln -s "$(pwd)/ios-motion-system/skill" ~/.cursor/skills-cursor/ios-motion-system',
        },
        {
          title: "Claude Code",
          language: "bash",
          code: 'mkdir -p ~/.claude/skills\nln -s "$(pwd)/ios-motion-system/skill" ~/.claude/skills/ios-motion-system',
        },
        {
          title: "Codex",
          language: "bash",
          code: 'mkdir -p ~/.codex/skills\nln -s "$(pwd)/ios-motion-system/skill" ~/.codex/skills/ios-motion-system',
        },
      ],
    },
    {
      title: "Project-Local",
      paragraphs: [
        "只在某个项目里启用，把 skill 放进项目内的 .cursor/skills/，不影响其它项目。",
      ],
      codeBlocks: [
        {
          language: "bash",
          code: 'mkdir -p .cursor/skills\ngit clone --depth 1 https://github.com/prosody007/ios-motion-system.git /tmp/ims\ncp -r /tmp/ims/skill .cursor/skills/ios-motion-system',
        },
      ],
    },
    {
      title: "Update",
      codeBlocks: [
        {
          language: "bash",
          code: "cd ~/.local/share/ios-motion-system && git pull",
        },
      ],
    },
    {
      title: "Customize",
      paragraphs: [
        "fork 仓库后改 src/data/*.ts，跑一次 npm run export-skill 就重新生成 skill/。",
      ],
      codeBlocks: [
        {
          language: "bash",
          code: "npm install\nnpm run export-skill",
        },
      ],
    },
  ],
};
