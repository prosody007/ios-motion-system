import fs from "node:fs/promises";
import path from "node:path";
import type { DocsContentSection, DocsSection } from "@/types/motion";

type SkillsPageContent = {
  title: string;
  description: string;
  section: DocsSection;
};

function stripFrontMatter(markdown: string): string {
  if (!markdown.startsWith("---")) return markdown;
  const end = markdown.indexOf("\n---", 3);
  if (end === -1) return markdown;
  return markdown.slice(end + 4).trimStart();
}

function ensureSection(
  current: DocsContentSection | null,
  sections: DocsContentSection[],
): DocsContentSection {
  if (current) return current;
  const fallback: DocsContentSection = { title: "Overview" };
  sections.push(fallback);
  return fallback;
}

function pushParagraph(
  current: DocsContentSection | null,
  sections: DocsContentSection[],
  introParagraphs: string[],
  value: string,
) {
  if (!value) return;
  if (!current) {
    introParagraphs.push(value);
    return;
  }
  const section = ensureSection(current, sections);
  section.paragraphs = [...(section.paragraphs ?? []), value];
}

function parseReadmeMarkdown(markdown: string): SkillsPageContent {
  const content = stripFrontMatter(markdown);
  const lines = content.split(/\r?\n/);

  const sections: DocsContentSection[] = [];
  const introParagraphs: string[] = [];

  let title = "Skills";
  let current: DocsContentSection | null = null;

  let inCode = false;
  let codeLanguage = "text";
  let codeLines: string[] = [];
  let paragraphLines: string[] = [];

  const flushParagraph = () => {
    const value = paragraphLines.join(" ").trim();
    paragraphLines = [];
    pushParagraph(current, sections, introParagraphs, value);
  };

  const flushCode = () => {
    const section = ensureSection(current, sections);
    section.codeBlocks = [
      ...(section.codeBlocks ?? []),
      { language: codeLanguage, code: codeLines.join("\n").trimEnd() },
    ];
    codeLines = [];
    codeLanguage = "text";
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (inCode) {
      if (trimmed.startsWith("```")) {
        inCode = false;
        flushCode();
      } else {
        codeLines.push(line);
      }
      continue;
    }

    if (trimmed.startsWith("```")) {
      flushParagraph();
      inCode = true;
      codeLanguage = trimmed.slice(3).trim() || "text";
      continue;
    }

    if (trimmed.startsWith("# ")) {
      flushParagraph();
      title = trimmed.slice(2).trim() || title;
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushParagraph();
      current = { title: trimmed.slice(3).trim() };
      sections.push(current);
      continue;
    }

    if (trimmed.startsWith("### ")) {
      flushParagraph();
      const section = ensureSection(current, sections);
      section.paragraphs = [
        ...(section.paragraphs ?? []),
        `**${trimmed.slice(4).trim()}**`,
      ];
      continue;
    }

    if (trimmed.startsWith("- ")) {
      flushParagraph();
      const section = ensureSection(current, sections);
      section.bullets = [...(section.bullets ?? []), trimmed.slice(2).trim()];
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      flushParagraph();
      const section = ensureSection(current, sections);
      section.bullets = [
        ...(section.bullets ?? []),
        trimmed.replace(/^\d+\.\s+/, "").trim(),
      ];
      continue;
    }

    if (!trimmed) {
      flushParagraph();
      continue;
    }

    paragraphLines.push(trimmed);
  }

  flushParagraph();

  const description =
    introParagraphs[0] ??
    "通过技能文件统一接入 iOS Motion System 动画规范与 React 实现。";
  const introRest = introParagraphs.slice(1);
  if (introRest.length) {
    if (sections[0]?.title === "Overview") {
      sections[0].paragraphs = [...introRest, ...(sections[0].paragraphs ?? [])];
    } else {
      sections.unshift({ title: "Overview", paragraphs: introRest });
    }
  }

  return {
    title,
    description,
    section: {
      type: "docs",
      title,
      description,
      sections,
    },
  };
}

export async function loadSkillsPageContent(): Promise<SkillsPageContent> {
  const readmePath = path.join(process.cwd(), "skill", "README.md");
  const readme = await fs.readFile(readmePath, "utf8");
  return parseReadmeMarkdown(readme);
}
