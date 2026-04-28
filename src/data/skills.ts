import type { DocsSection } from "@/types/motion";

export const skillsSection: DocsSection = {
  type: "docs",
  title: "Skills · 技能接入",
  description:
    "通过 Agent Skill 把整个动效库直接装进你的 AI 编程客户端。Cursor / Claude Code / Codex 都支持，零服务、零安装、纯 markdown 文件夹。",
  sections: [
    {
      title: "Quick Start",
      paragraphs: [
        "安装只需 clone 仓库 + 软链到客户端 Skills 目录。完成后重启客户端，AI 写 iOS 动画代码时会自动引用本库的 SwiftUI / UIKit 实现。",
      ],
      codeBlocks: [
        {
          title: "1. Clone 仓库",
          language: "bash",
          code: "git clone https://github.com/prosody007/ios-motion-system.git\ncd ios-motion-system",
        },
        {
          title: "2A. 链到 Cursor",
          language: "bash",
          code: 'mkdir -p ~/.cursor/skills-cursor\nln -s "$(pwd)/skill" ~/.cursor/skills-cursor/ios-motion-system',
        },
        {
          title: "2B. 链到 Claude Code",
          language: "bash",
          code: 'mkdir -p ~/.claude/skills\nln -s "$(pwd)/skill" ~/.claude/skills/ios-motion-system',
        },
        {
          title: "2C. 链到 Codex",
          language: "bash",
          code: 'mkdir -p ~/.codex/skills\nln -s "$(pwd)/skill" ~/.codex/skills/ios-motion-system',
        },
        {
          title: "3. 重启客户端",
          language: "bash",
          code: "# Cursor / Claude Code / Codex 重启后 Skill 自动生效",
        },
      ],
    },
    {
      title: "项目内安装（仅当前项目可用）",
      paragraphs: [
        "如果只想在某个 iOS 项目里启用，把 skill 放进项目内的 .cursor/skills/ 即可，无需全局软链。",
      ],
      codeBlocks: [
        {
          title: "项目级安装",
          language: "bash",
          code: 'mkdir -p .cursor/skills\ngit clone --depth 1 https://github.com/prosody007/ios-motion-system.git /tmp/ims\ncp -r /tmp/ims/skill .cursor/skills/ios-motion-system',
        },
      ],
    },
    {
      title: "如何触发",
      paragraphs: [
        "重启客户端后，在对话里直接描述需求。AI 会读 skill 里的 SKILL.md，根据需求加载对应分类的 references/<slug>.md，然后给出该库的标准 SwiftUI / UIKit 代码。",
      ],
      bullets: [
        "「实现 iOS 风格的按钮按压反馈，要 spring」",
        "「我要一个底部弹出 Sheet，可以拖拽缩放」",
        "「卡片翻转效果，要真 3D 透视」",
        "「Spring 参数怎么选？我想要轻微回弹」",
        "「给我一段流光边框 CSS」",
        "「iOS 17 的 .snappy 和 .smooth 区别」",
        "「Tab 切换有 badge 弹跳效果」",
      ],
    },
    {
      title: "Skill 内容",
      bullets: [
        "`SKILL.md` —— Skill 元信息与触发指引（AI 客户端入口）",
        "`references/_catalog.md` —— 分类索引（slug / 标题 / 用途）",
        "`references/<slug>.md` —— 各分类下全部 cards 的完整 SwiftUI + UIKit 代码",
        "`templates/dynamic-params.md` —— spring playground、carousel 等动态参数说明",
      ],
    },
    {
      title: "更新",
      paragraphs: [
        "用软链方式安装的话，仓库 git pull 就自动同步。复制方式则需要重新执行复制命令。",
      ],
      codeBlocks: [
        {
          title: "拉取最新",
          language: "bash",
          code: "cd ios-motion-system && git pull",
        },
      ],
    },
    {
      title: "本地二次生成",
      paragraphs: [
        "如果你 fork 了仓库或自己改了 src/data/*.ts，可以重新生成 skill 内容。",
      ],
      codeBlocks: [
        {
          title: "重新生成 skill/",
          language: "bash",
          code: "npm install\nnpm run export-skill",
        },
      ],
    },
    {
      title: "为什么用 Agent Skill",
      bullets: [
        "**零服务**：纯 markdown 文件夹，不用跑进程、不用配 URL、不用装包",
        "**离线可用**：装完即可用，不依赖网络",
        "**多客户端通用**：Cursor / Claude Code / Codex 一份文件全适配",
        "**透明可读**：直接打开 markdown 看里面是什么，所见即所得",
        "**易自定义**：改任何 reference 文件立即生效",
      ],
    },
    {
      title: "Troubleshooting",
      bullets: [
        "Skill 没触发：检查软链路径是否在客户端正确的 skills 目录，且包含 `SKILL.md`",
        "代码示例不准：本 skill 由 src/data/*.ts 自动导出，仓库 main 分支为最新，pull 后再生成",
        "客户端不识别 Skill：升级到支持 Agent Skills 的版本（Cursor 0.45+ / Claude Code）",
      ],
    },
  ],
};
