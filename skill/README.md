# iOS Motion System Skill

把这个文件夹放进你的 AI 编程客户端的 Skills 目录，让 AI 在写 iOS 动画代码时直接引用本库的标准实现。

## 内容

- `SKILL.md` —— Skill 元信息与使用指引（AI 客户端的入口）
- `references/_catalog.md` —— 所有分类索引
- `references/<slug>.md` —— 各分类详情（含 SwiftUI + UIKit 完整代码）
- `templates/dynamic-params.md` —— 动态参数（spring / carousel 等）说明

## 安装

### 方式 A：从 GitHub 直接 clone

```bash
# 1. 克隆仓库
git clone https://github.com/prosody007/ios-motion-system.git

# 2. 链接到对应客户端的 skills 目录（任选）
# Cursor:
mkdir -p ~/.cursor/skills-cursor
ln -s "$(pwd)/ios-motion-system/skill" ~/.cursor/skills-cursor/ios-motion-system

# Claude Code:
mkdir -p ~/.claude/skills
ln -s "$(pwd)/ios-motion-system/skill" ~/.claude/skills/ios-motion-system

# Codex:
mkdir -p ~/.codex/skills
ln -s "$(pwd)/ios-motion-system/skill" ~/.codex/skills/ios-motion-system
```

### 方式 B：直接复制 skill 文件夹

```bash
git clone https://github.com/prosody007/ios-motion-system.git /tmp/ims
cp -r /tmp/ims/skill ~/.cursor/skills-cursor/ios-motion-system
```

### 方式 C：项目内 Skills（仅当前项目可用）

```bash
# 在你的 iOS 项目根目录下
mkdir -p .cursor/skills
git clone --depth 1 https://github.com/prosody007/ios-motion-system.git /tmp/ims
cp -r /tmp/ims/skill .cursor/skills/ios-motion-system
```

安装完成后**重启客户端**。

## 触发示例

在 Cursor / Claude Code 内对话：

- "实现 iOS 风格的按钮按压反馈，要求 spring"
- "我要一个底部弹出 Sheet，可以拖拽缩放"
- "卡片翻转效果，要真 3D 透视"
- "Spring 参数怎么选？我想要轻微回弹"
- "给我一段流光边框 CSS"
- "iOS 17 的 .snappy 和 .smooth 有什么区别"
- "tab 切换有 badge 弹跳效果"

AI 会自动加载本 Skill 并引用对应的 SwiftUI / UIKit 实现。

## 更新

```bash
cd ios-motion-system && git pull
```

软链方式无需任何额外操作，复制方式需要重新执行复制命令。

## 自定义 / 二次生成

```bash
git clone https://github.com/prosody007/ios-motion-system.git
cd ios-motion-system
npm install
npm run export-skill   # 重新从 src/data/*.ts 生成 skill/
```
