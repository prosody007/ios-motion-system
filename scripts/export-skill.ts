/**
 * Export the catalog data into an installable Claude / Cursor / Codex Skill.
 *
 * Usage:  npx tsx scripts/export-skill.ts
 *
 * Output: skill/
 *   SKILL.md                       - skill front matter & navigation index
 *   README.md                      - install instructions
 *   references/_catalog.md         - 38 categories index
 *   references/<slug>.md           - per-category cards with full code
 *   templates/dynamic-params.md    - params substitution guide
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { agentSpecsByPreviewId } from "../src/data/agent-specs";
import { sectionMap } from "../src/data";
import { categories } from "../src/data/categories";
import { docsNavGroups } from "../src/data/navigation";
import type {
  AgentSpec,
  AnimationCard,
  CardsSection,
  DocsSection,
  SectionData,
  SpringCurveSection,
  TokenSection,
} from "../src/types/motion";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SKILL_DIR = path.join(ROOT, "skill");
const REF_DIR = path.join(SKILL_DIR, "references");
const TPL_DIR = path.join(SKILL_DIR, "templates");

/** 不写进 skill 的 slug —— 这些是给"人"看的安装文档，
 *  AI 读它们没用（甚至会误触发） */
const EXCLUDED_SLUGS_FOR_DOCS = new Set(["skills"]);

async function main() {
  await fs.rm(SKILL_DIR, { recursive: true, force: true });
  await fs.mkdir(REF_DIR, { recursive: true });
  await fs.mkdir(TPL_DIR, { recursive: true });

  await writeSkillMd();
  await writeReadme();
  await writeCatalogMd();
  await writeDynamicParamsMd();

  let writtenSections = 0;
  for (const cat of categories) {
    if (EXCLUDED_SLUGS_FOR_DOCS.has(cat.slug)) continue;
    const section = sectionMap[cat.slug];
    if (!section) continue;
    await writeSectionMd(cat.slug, section);
    writtenSections += 1;
  }

  console.log(
    `[skill] exported ${writtenSections} sections + index + dynamic-params to ${path.relative(
      ROOT,
      SKILL_DIR,
    )}/`,
  );
}

/* -------------------------------------------------------------- *
 *  SKILL.md
 * -------------------------------------------------------------- */
async function writeSkillMd() {
  const groupsList = docsNavGroups
    .map((g) => {
      const slugs = g.slugs
        .filter((slug) => !EXCLUDED_SLUGS_FOR_DOCS.has(slug))
        .map((slug) => {
          const cat = categories.find((c) => c.slug === slug);
          return cat ? `\`${slug}\`` : null;
        })
        .filter(Boolean)
        .join(" · ");
      if (!slugs) return null;
      return `- **${g.label}**：${slugs}`;
    })
    .filter(Boolean)
    .join("\n");

  const visibleCount = categories.filter(
    (c) => !EXCLUDED_SLUGS_FOR_DOCS.has(c.slug),
  ).length;

  const md = `---
name: ios-motion-system
description: iOS 风格动效的 React 实现库 —— Spring、Sheet、Tab Bar、Toast、Card、Border Glow、骨架屏、转场、手势等 80+ 标准动效的 React/TSX 代码模板。预览与代码统一使用 React，方便在 Web 项目里直接落地与测试。
---

# iOS Motion System

iOS 风格的动效实现库，覆盖 Apple HIG 推荐的常用动画、Spring 弹性、转场、手势、加载态等 ${visibleCount} 个分类的 **React/TSX** 代码模板。预览与实现代码统一使用 React。

## 触发条件

当用户提出以下需求时使用本 Skill：

- 在 Web/React 项目里实现 iOS 风格动效（按钮按压、Sheet 展开、Tab 切换、卡片翻转、骨架屏等）
- 询问 React 里如何还原某个 iOS 动画
- 询问 Spring 参数、转场曲线、动画时长怎么选
- 需要可粘贴的 React 动画代码片段
- 中文或英文表述，例如「卡片展开」「pull to refresh」「rotateY 翻转」「toast 通知」

## 使用步骤

### Step 1：浏览索引

读 \`references/_catalog.md\`，里面按使用场景分组列了所有 ${visibleCount} 个分类的 slug、标题、用途。根据用户需求定位到对应分类的 slug。

### Step 2：加载分类详情

读取 \`references/<slug>.md\`，里面包含该分类下所有 cards：

- 标题（中英）
- Tags（duration / easing / spring）
- Preview ID（与在线网站一一对应）
- 结构化 AI Motion Spec（如该 card 已补齐）
- 单一的 React/TSX 代码块（与在线预览实现一致）

### Step 3：处理动态参数（如有）

部分卡片代码含 \`{{paramName}}\` 占位符（例如 \`ios-spring-playground\`、\`ios-carousel\`）。
读 \`templates/dynamic-params.md\` 获取每个参数的类型与默认值，按用户需求替换占位符再返回。

### Step 4：锁定动画优先复用（团队协作）

对于已锁定的生产动效（例如 \`ios-card-flash-stack\`），优先复用仓库中的标准组件入口，不要复制 keyframes 后在业务页面里改一份。

- 推荐复用：\`FlashCardTransitionPreview\`
- 不建议：复制一份动画实现并私自改 \`duration / easing / keyframes\`

## 分类导航

${groupsList}

## 落地到用户项目

不是只回一段代码，而是**直接动手**：

1. **定位目标文件**：扫一遍当前 workspace，找到合适落地的 React/TSX 文件（页面或组件目录）。如果不存在，新建一个客户端组件。
2. **粘贴模板，按项目命名调整**：示例组件名要改成符合用户项目命名约定的名字；状态绑定如果用户已有 store / context，要接进去而不是新建。
3. **保留代码注释里的中文**——那些是给最终用户看的设计说明，不要翻译或删除。
4. **不要凭空发明 API**：本库代码已验证过；要扩展时显式说明"基于本库的 X 模板，新加 Y"，让用户能追溯。

## 实现风格

- 统一使用 **React + TypeScript**，client component（\`"use client"\`）。
- 优先使用 **CSS transition / keyframes** 表达动画；交互逻辑用 React state 控制。
- Tailwind / 内联 style 都可以，按项目现有风格选择。
- Spring 参数对应 \`cubic-bezier\`、\`framer-motion\` 或 \`react-spring\` 都可以，按 \`Spring & Timing\` 分类选合适曲线。

## Motion Lock（团队防改坏）

以下规则用于保证多人协作时动画手感不漂移：

- \`ios-card-flash-stack\` 的按钮切卡关键帧（尤其 \`enter-prev\` / \`exit-next\`）与对应时序属于锁定参数。
- 做题→结算、结算→重做的容器过渡时序属于锁定参数。
- 结算内容逐项出现（得分牌→文案→按钮）的时序属于锁定参数。
- 若要改动以上参数，先新增 card / previewId 做实验，通过评审后再替换默认实现。
- 接入验收至少覆盖：初始、答错、答对左飞、结算、Review Quiz 回退、右箭头 prev 平滑回顶。

## 在线预览与原始仓库

- 在线 demo：https://ios-motion-system.vercel.app
- 源码仓库：https://github.com/prosody007/ios-motion-system
- 本 Skill 由仓库的 \`scripts/export-skill.ts\` 自动从 \`src/data/*.ts\` 生成。
`;

  await fs.writeFile(path.join(SKILL_DIR, "SKILL.md"), md, "utf8");
}

/* -------------------------------------------------------------- *
 *  README.md (install instructions)
 * -------------------------------------------------------------- */
async function writeReadme() {
  const md = `# iOS Motion System Skill

让 Cursor / Claude Code / Codex 在 React 项目里写 iOS 风格动效时直接引用本库的标准 React 实现。

## Install

通过 [skills.sh](https://skills.sh) 的官方 CLI 一行装好：

\`\`\`bash
npx skills add prosody007/ios-motion-system
\`\`\`

或者用我们自己的 curl 脚本（功能等价）：

\`\`\`bash
curl -fsSL https://ios-motion-system.vercel.app/install.sh | bash
\`\`\`

装完**重启客户端**即可生效。

## What's Inside

- \`SKILL.md\` —— Skill 元信息与触发指引（AI 入口）
- \`references/_catalog.md\` —— 所有分类索引
- \`references/<slug>.md\` —— 各分类详情（含 AI Motion Spec + React 完整实现代码）
- \`templates/dynamic-params.md\` —— spring / carousel / border-glow 等可调参数

## Try It

在客户端对话里直接表达需求：

- "实现 iOS 风格的按钮按压反馈，要 spring"
- "我要一个底部弹出 Sheet，可以拖拽缩放"
- "卡片翻转效果，要真 3D 透视"
- "Spring 参数怎么选？我想要轻微回弹"
- "给我一段流光边框 CSS"
- "Tab 切换有 badge 弹跳效果"

AI 会自动加载本 Skill 并引用对应的代码模板。

## Team Reuse Guardrails

- 优先复用锁定组件入口，不在业务页复制动画后再“微调”。
- 同一个动画只保留一个权威实现文件，避免多份实现漂移。
- 变更后至少做一次人工验收：切卡平滑性 + 结算流程完整性 + 字体一致性。

## Update

\`\`\`bash
npx skills update ios-motion-system
\`\`\`

或：

\`\`\`bash
cd ~/.local/share/ios-motion-system && git pull
\`\`\`

## Customize

fork 仓库后改 \`src/data/*.ts\`，跑一次 \`npm run export-skill\` 重新生成 skill/，
然后让自己 / 团队从你的 fork 装：\`npx skills add <your-username>/ios-motion-system\`。
`;

  await fs.writeFile(path.join(SKILL_DIR, "README.md"), md, "utf8");
}

/* -------------------------------------------------------------- *
 *  references/_catalog.md
 * -------------------------------------------------------------- */
async function writeCatalogMd() {
  const visibleCats = categories.filter(
    (c) => !EXCLUDED_SLUGS_FOR_DOCS.has(c.slug),
  );
  let md = `# Catalog · 分类索引\n\n以下 ${visibleCats.length} 个分类按使用场景分组。每个分类对应 \`references/<slug>.md\`，里面是该分类下全部 cards 的完整 React/TSX 代码。\n\n`;

  for (const group of docsNavGroups) {
    const groupSlugs = group.slugs.filter(
      (slug) => !EXCLUDED_SLUGS_FOR_DOCS.has(slug),
    );
    if (!groupSlugs.length) continue;
    md += `## ${group.label}\n\n`;
    md += `| Slug | 标题 | 描述 |\n|---|---|---|\n`;
    for (const slug of groupSlugs) {
      const cat = categories.find((c) => c.slug === slug);
      if (!cat) continue;
      md += `| \`${slug}\` | ${cat.title} | ${cat.description} |\n`;
    }
    md += `\n`;
  }

  await fs.writeFile(path.join(REF_DIR, "_catalog.md"), md, "utf8");
}

/* -------------------------------------------------------------- *
 *  templates/dynamic-params.md
 * -------------------------------------------------------------- */
async function writeDynamicParamsMd() {
  const md = `# 动态参数模板

部分 cards 的代码里含 \`{{paramName}}\` 占位符。返回给用户时，根据需求**先替换**再返回。

---

## ios-spring-playground

代码模板里出现的所有占位符：

| param | 类型 | 默认 | 范围 | 说明 |
|---|---|---|---|---|
| \`response\` | number, s | 0.50 | 0.15 – 0.90 | spring 周期，越大越慢、振幅越大 |
| \`damping\` | number | 0.70 | 0.30 – 1.20 | 阻尼比 ζ；=1.0 临界（无过冲），越小越弹 |
| \`bounce\` | number | 0.30 | 0 – 1 | iOS 17+ 写法的过冲量 = 1 − damping |
| \`stiffness\` | int | derived | — | = (2π / response)² |
| \`dampingCoef\` | number | derived | — | = 2 · damping · (2π / response) |
| \`duration\` | number, s | derived | 0.7 – 2.8 | ≈ response × 2.6 + 0.3 |
| \`swiftProps\` | string | "" | — | 额外属性链拼接，例 \`.scaleEffect(...)\` |
| \`uikitProps\` | string | "" | — | UIKit transform 表达式 |

### 常见组合速查

| 用户描述 | 推荐参数 |
|---|---|
| "丝滑、无回弹" | response: 0.50, damping: 1.0, bounce: 0 → 等价 \`.smooth\` |
| "快速响应、几乎无过冲" | response: 0.35, damping: 0.86, bounce: 0.14 → \`.snappy\` |
| "轻微回弹" | response: 0.45, damping: 0.75, bounce: 0.25 |
| "明显弹跳、活泼" | response: 0.50, damping: 0.55, bounce: 0.45 → \`.bouncy\` |
| "强烈弹跳、游戏感" | response: 0.50, damping: 0.35, bounce: 0.65 |
| "手势跟随" | response: 0.35, damping: 0.86 → \`.interactiveSpring\` |

---

## ios-carousel / ios-carousel-peek / ios-carousel-scale / ios-carousel-coverflow

| param | 类型 | 默认 | 说明 |
|---|---|---|---|
| \`speedSec\` | number, s | 3.5 | 自动翻页周期（越小越快） |

---

## ios-border-glow

代码片段里所有占位符（CSS / React 双形态）：

| param | 类型 | 默认 | 说明 |
|---|---|---|---|
| \`duration\` | number, s | 4.0 | 一周完整旋转时长 |
| \`borderWidth\` | number, px | 2 | 锐利边框厚度 |
| \`glowSize\` | number, px | 48 | 外晕模糊半径 |
| \`glowOpacity\` | number, 0–1 | 0.35 | 外晕透明度 |
| \`borderRadius\` | number, px | 20 | 卡片圆角 |
| \`colors\` | string | aurora 4 色 | conic-gradient 色标列表 |
| \`colorsArray\` | string | "..." | React 端的字符串数组（带引号） |
| \`direction\` | "normal"/"reverse" | normal | 顺/逆时针 |

---

## 替换约定

- **不要**保留 \`{{}}\`，必须替换成具体值。
- **保留**类型与单位（例如 \`0.5s\` 别写成 \`0.5\`，\`0.75\` 别写成 \`75%\`）。
- 如果用户没说明具体值，**用默认值**；并在返回里**简短提示**用户可以调哪些参数。
- \`derived\` 字段不需要让用户填，按公式计算后填进去即可。

`;

  await fs.writeFile(path.join(TPL_DIR, "dynamic-params.md"), md, "utf8");
}

/* -------------------------------------------------------------- *
 *  references/<slug>.md
 * -------------------------------------------------------------- */
async function writeSectionMd(slug: string, section: SectionData) {
  let md = `# ${section.title}\n\n${section.description}\n\n`;

  if (section.type === "cards") {
    md += renderCardsSection(section);
  } else if (section.type === "tokens") {
    md += renderTokensSection(section);
  } else if (section.type === "spring-curves") {
    md += renderSpringSection(section);
  } else if (section.type === "docs") {
    md += renderDocsSection(section);
  }

  await fs.writeFile(path.join(REF_DIR, `${slug}.md`), md, "utf8");
}

function renderCardsSection(section: CardsSection): string {
  let md = "";
  section.cards.forEach((card: AnimationCard, i: number) => {
    md += `## ${card.title}\n\n`;
    const meta: string[] = [];
    meta.push(`Preview ID：\`${card.previewId}\``);
    if (card.controlsId) {
      meta.push(`Controls ID：\`${card.controlsId}\` (含动态参数，见 \`templates/dynamic-params.md\`)`);
    }
    if (card.tags.length) {
      meta.push(
        `Tags：${card.tags.map((t) => `\`${t.text}\` (${t.variant})`).join(" · ")}`,
      );
    }
    md += meta.map((line) => `- ${line}`).join("\n") + "\n\n";

    const agentSpec = card.agentSpec ?? agentSpecsByPreviewId[card.previewId];
    if (agentSpec) {
      md += renderAgentSpec(agentSpec);
    }

    md += `### Code\n\n\`\`\`tsx\n${stripHtml(card.code)}\n\`\`\`\n\n`;

    if (i < section.cards.length - 1) md += `---\n\n`;
  });
  return md;
}

function renderAgentSpec(spec: AgentSpec): string {
  let md = `### AI Motion Spec\n\n${spec.summary}\n\n`;

  for (const section of spec.sections) {
    md += `#### ${section.title}\n\n`;
    md += `| Key | Value |\n|---|---|\n`;
    for (const entry of section.entries) {
      md += `| ${escapeTableCell(entry.key)} | ${escapeTableCell(entry.value)} |\n`;
    }
    md += `\n`;
  }

  if (spec.acceptance?.length) {
    md += `#### Acceptance\n\n`;
    for (const item of spec.acceptance) {
      md += `- ${item}\n`;
    }
    md += `\n`;
  }

  return md;
}

function renderTokensSection(section: TokenSection): string {
  let md = `## Tokens\n\n`;
  md += `| Name | Value | 描述 |\n|---|---|---|\n`;
  for (const t of section.tokens) {
    md += `| \`${t.name}\` | \`${t.value}\` | ${t.desc} |\n`;
  }
  md += `\n## 代码片段\n\n\`\`\`swift\n${stripHtml(section.codeSnippet)}\n\`\`\`\n`;
  return md;
}

function renderSpringSection(section: SpringCurveSection): string {
  let md = `## Spring 预设\n\n`;
  for (const s of section.springs) {
    md += `### ${s.name}${s.badge ? ` _(${s.badge})_` : ""}\n\n`;
    md += `- response：\`${s.response}\` · damping：\`${s.damping}\`\n`;
    md += `- ${s.description}\n`;
    md += `- SwiftUI：\`${s.swift}\`\n`;
    md += `- SwiftUI Legacy：\`${s.swiftLegacy}\`\n`;
    md += `- UIKit：\`${s.uikit}\`\n\n`;
  }
  md += `## Timing Curves\n\n`;
  for (const c of section.timingCurves) {
    md += `### ${c.name}\n\n`;
    md += `- CSS：\`${c.css}\`\n`;
    md += `- SwiftUI：\`${c.swift}\`\n`;
    md += `- ${c.desc}\n\n`;
  }
  return md;
}

function renderDocsSection(section: DocsSection): string {
  let md = "";
  for (const sub of section.sections) {
    md += `## ${sub.title}\n\n`;
    if (sub.paragraphs) {
      for (const p of sub.paragraphs) md += `${p}\n\n`;
    }
    if (sub.bullets) {
      for (const b of sub.bullets) md += `- ${b}\n`;
      md += `\n`;
    }
    if (sub.codeBlocks) {
      for (const cb of sub.codeBlocks) {
        if (cb.title) md += `**${cb.title}**\n\n`;
        md += `\`\`\`${cb.language}\n${cb.code}\n\`\`\`\n\n`;
      }
    }
  }
  return md;
}

/* -------------------------------------------------------------- *
 *  Strip the <span class="..."> highlight wrappers used in the
 *  in-app code blocks. Skill markdown is consumed by LLMs; raw
 *  source is cleaner.
 * -------------------------------------------------------------- */
function stripHtml(input: string): string {
  return input
    .replace(/<span[^>]*>/g, "")
    .replace(/<\/span>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function escapeTableCell(input: string): string {
  return input.replace(/\|/g, "\\|").replace(/\n/g, "<br/>");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
