import { categories } from "@/data/categories";
import { sectionMap } from "@/data";
import { docsNavGroups, getDocsNavMeta } from "@/data/navigation";
import type { AnimationCard, CardsSection, SectionData } from "@/types/motion";
import { substituteParams, type TemplateParams } from "@/lib/template-params";

export type Platform = "swift" | "uikit";

export type CategorySummary = {
  slug: string;
  title: string;
  description: string;
  group: string | null;
  path: string;
};

export type CardSummary = {
  id: string;
  previewId: string;
  title: string;
  category: string;
  categoryTitle: string;
  sectionTitle: string;
  description: string;
  tags: string[];
  controlsId?: string;
  path: string;
  codePlatforms: Platform[];
};

type SearchResult = CardSummary & {
  score: number;
  matchedOn: string[];
};

export type MotionRecommendation = {
  id: string;
  previewId: string;
  title: string;
  category: string;
  categoryTitle: string;
  path: string;
  platforms: Platform[];
  score: number;
  why: string[];
  matchedOn: string[];
  nextAction: {
    tool: "get_code";
    previewId: string;
    suggestedPlatform: Platform;
  };
};

function getCategoryGroupMap() {
  const map = new Map<string, string>();
  for (const group of docsNavGroups) {
    for (const slug of group.slugs) map.set(slug, group.label);
  }
  return map;
}

const categoryGroupMap = getCategoryGroupMap();

export function listCategories(): CategorySummary[] {
  return categories.map((category) => ({
    slug: category.slug,
    title: category.title,
    description: category.description,
    group: categoryGroupMap.get(category.slug) ?? null,
    path: `/${category.slug}`,
  }));
}

export function getNavigationTree() {
  return docsNavGroups.map((group) => ({
    label: group.label,
    items: group.slugs
      .map((slug) => {
        const category = categories.find((item) => item.slug === slug);
        if (!category) return null;
        return {
          slug: category.slug,
          title: category.title,
          description: category.description,
          path: `/${category.slug}`,
        };
      })
      .filter(Boolean),
  }));
}

export function getSection(slug: string): SectionData | null {
  return sectionMap[slug] ?? null;
}

function getCategoryDescription(slug: string) {
  return categories.find((item) => item.slug === slug)?.description ?? "";
}

function normalizeCard(slug: string, section: CardsSection, card: AnimationCard): CardSummary {
  return {
    id: card.previewId,
    previewId: card.previewId,
    title: card.title,
    category: slug,
    categoryTitle: section.title,
    sectionTitle: section.title,
    description: getCategoryDescription(slug),
    tags: card.tags.map((tag) => tag.text),
    controlsId: card.controlsId,
    path: `/${slug}`,
    codePlatforms: ["swift", "uikit"],
  };
}

export function getAllCards(): CardSummary[] {
  const result: CardSummary[] = [];
  for (const [slug, section] of Object.entries(sectionMap)) {
    if (section.type !== "cards") continue;
    result.push(...section.cards.map((card) => normalizeCard(slug, section, card)));
  }
  return result;
}

export function listCards(slug: string): CardSummary[] {
  const section = sectionMap[slug];
  if (!section || section.type !== "cards") return [];
  return section.cards.map((card) => normalizeCard(slug, section, card));
}

export function findCard(previewId: string) {
  for (const [slug, section] of Object.entries(sectionMap)) {
    if (section.type !== "cards") continue;
    const card = section.cards.find((item) => item.previewId === previewId);
    if (card) {
      return {
        slug,
        section,
        card,
        summary: normalizeCard(slug, section, card),
      };
    }
  }
  return null;
}

function parseNumber(value: string | undefined, fallback: number) {
  if (!value) return fallback;
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
}

function parseBoolean(value: string | undefined, fallback: boolean) {
  if (value == null) return fallback;
  const normalized = value.trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
  return fallback;
}

function formatTemplateParams(params: Record<string, number | string>) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => [key, String(value)]),
  );
}

function getSpringPlaygroundParams(overrides: TemplateParams = {}): TemplateParams {
  const response = parseNumber(overrides.response, 0.5);
  const damping = parseNumber(overrides.damping, 0.7);
  const translate = parseNumber(overrides.translate, 180);
  const scale = parseNumber(overrides.scale, 1.2);
  const rotate = parseNumber(overrides.rotate, 10);
  const translateOn = parseBoolean(overrides.translateEnabled, true);
  const scaleOn = parseBoolean(overrides.scaleEnabled, true);
  const rotateOn = parseBoolean(overrides.rotateEnabled, false);

  const omega = (2 * Math.PI) / response;
  const stiffness = Math.round(omega * omega);
  const dampingCoef = Math.round(2 * damping * omega * 10) / 10;
  const bounce = Math.max(0, 1 - damping);
  const duration = Math.min(2.8, Math.max(0.7, response * 2.6 + 0.3));

  const swiftLines: string[] = [];
  if (translateOn) swiftLines.push(`    .offset(x: moved ? ${translate.toFixed(0)} : 0)`);
  if (scaleOn) swiftLines.push(`    .scaleEffect(moved ? ${scale.toFixed(2)} : 1.0)`);
  if (rotateOn) {
    swiftLines.push(`    .rotationEffect(.degrees(moved ? ${rotate.toFixed(0)} : 0))`);
  }

  const uikitOps: string[] = [];
  if (translateOn) {
    uikitOps.push(`        .translatedBy(x: ${translate.toFixed(0)}, y: 0)`);
  }
  if (scaleOn) {
    uikitOps.push(`        .scaledBy(x: ${scale.toFixed(2)}, y: ${scale.toFixed(2)})`);
  }
  if (rotateOn) {
    uikitOps.push(`        .rotated(by: .pi * ${rotate.toFixed(0)} / 180)`);
  }

  return formatTemplateParams({
    response: response.toFixed(2),
    damping: damping.toFixed(2),
    bounce: bounce.toFixed(2),
    stiffness,
    dampingCoef: dampingCoef.toFixed(1),
    duration: duration.toFixed(2),
    swiftProps: swiftLines.join("\n"),
    uikitProps:
      uikitOps.length > 0
        ? `    self.box.transform = CGAffineTransform.identity\n${uikitOps.join("\n")}`
        : "    // 无勾选的属性",
  });
}

function getCarouselParams(overrides: TemplateParams = {}) {
  const speedSec = parseNumber(overrides.speedSec, 2.5);
  return formatTemplateParams({ speedSec: speedSec.toFixed(1) });
}

export function getDefaultTemplateParams(previewId: string, overrides: TemplateParams = {}) {
  switch (previewId) {
    case "ios-spring-playground":
      return getSpringPlaygroundParams(overrides);
    case "ios-carousel":
    case "ios-carousel-peek":
    case "ios-carousel-scale":
    case "ios-carousel-coverflow":
      return getCarouselParams(overrides);
    default:
      return overrides;
  }
}

export function getCode(
  previewId: string,
  platform: Platform,
  overrides: TemplateParams = {},
) {
  const found = findCard(previewId);
  if (!found) return null;
  const template = found.card.codes[platform];
  const defaultParams = getDefaultTemplateParams(previewId, overrides);
  const mergedParams = { ...defaultParams, ...overrides };

  return {
    ...found.summary,
    platform,
    template,
    params: mergedParams,
    code: substituteParams(template, mergedParams),
  };
}

function sectionKeywords(slug: string, section: SectionData) {
  const base = [slug, section.title, section.description];
  if (section.type === "docs") {
    return base.concat(
      section.sections.flatMap((item) => [
        item.title,
        ...(item.paragraphs ?? []),
        ...(item.bullets ?? []),
        ...(item.codeBlocks?.map((block) => `${block.title ?? ""} ${block.code}`) ?? []),
      ]),
    );
  }
  if (section.type === "cards") {
    return base.concat(section.cards.flatMap((card) => [card.title, ...card.tags.map((tag) => tag.text)]));
  }
  if (section.type === "tokens") {
    return base.concat(section.tokens.map((token) => token.name));
  }
  return base.concat(
    section.springs.flatMap((spring) => [spring.name, spring.description]),
    section.timingCurves.flatMap((curve) => [curve.name, curve.desc]),
  );
}

function tokenize(text: string) {
  const normalized = text.toLowerCase();
  const base = normalized
    .toLowerCase()
    .split(/[\s/·,，。:：()（）\-+_]+/)
    .map((item) => item.trim())
    .filter(Boolean);
  const cjkChunks = normalized.match(/[\p{Script=Han}]{2,}/gu) ?? [];
  const cjkTerms = cjkChunks.flatMap((chunk) => {
    const terms = [chunk];
    for (let i = 0; i < chunk.length - 1; i += 1) {
      terms.push(chunk.slice(i, i + 2));
    }
    return terms;
  });
  return [...new Set([...base, ...cjkTerms])];
}

export function searchMotions(query: string, limit = 8): SearchResult[] {
  const terms = tokenize(query);
  if (terms.length === 0) return [];

  const results: SearchResult[] = [];

  for (const [slug, section] of Object.entries(sectionMap)) {
    const category = categories.find((item) => item.slug === slug);
    if (!category) continue;

    if (section.type === "cards") {
      for (const card of section.cards) {
        const haystack = [
          slug,
          category.title,
          category.description,
          section.title,
          section.description,
          card.title,
          ...card.tags.map((tag) => tag.text),
          getDocsNavMeta(slug).primary,
          getDocsNavMeta(slug).secondary,
        ];
        const matchedOn = haystack.filter((item) =>
          terms.some((term) => item.toLowerCase().includes(term)),
        );
        if (matchedOn.length === 0) continue;

        let score = matchedOn.length;
        if (terms.some((term) => card.title.toLowerCase().includes(term))) score += 4;
        if (terms.some((term) => section.title.toLowerCase().includes(term))) score += 2;
        if (terms.some((term) => slug.includes(term))) score += 2;

        results.push({
          ...normalizeCard(slug, section, card),
          score,
          matchedOn,
        });
      }
      continue;
    }

    const matchedOn = sectionKeywords(slug, section).filter((item) =>
      terms.some((term) => item.toLowerCase().includes(term)),
    );
    if (matchedOn.length === 0) continue;

    results.push({
      id: slug,
      previewId: slug,
      title: section.title,
      category: slug,
      categoryTitle: section.title,
      sectionTitle: section.title,
      description: section.description,
      tags: [],
      path: `/${slug}`,
      codePlatforms: section.type === "tokens" ? ["swift"] : ["swift", "uikit"],
      score: matchedOn.length,
      matchedOn,
    });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

type RecommendProfile = {
  id: string;
  terms: string[];
  targetPreviewIds?: string[];
  targetCategories?: string[];
  why: string[];
};

const recommendProfiles: RecommendProfile[] = [
  {
    id: "button-press",
    terms: ["按钮", "按压", "点击", "tap", "button", "press", "反馈"],
    targetPreviewIds: ["ios-btn-scale", "ios-btn-highlight", "ios-btn-depth"],
    targetCategories: ["button"],
    why: ["命中按钮按压/点击反馈场景", "优先推荐 Button / Tap 反馈章节"],
  },
  {
    id: "spring-motion",
    terms: ["spring", "弹性", "bounce", "过冲", "damping", "response"],
    targetPreviewIds: ["ios-spring-playground"],
    targetCategories: ["spring-animations", "spring-curves"],
    why: ["命中 spring / 弹性参数场景", "优先推荐可调参的 Spring Playground"],
  },
  {
    id: "pull-refresh",
    terms: ["下拉", "刷新", "pull", "refresh"],
    targetPreviewIds: ["ios-pull-refresh"],
    targetCategories: ["pull-refresh"],
    why: ["命中下拉刷新场景"],
  },
  {
    id: "expand-collapse",
    terms: ["展开", "折叠", "accordion", "expand", "collapse", "卡片展开"],
    targetPreviewIds: ["ios-spring-matched-geometry", "ios-expandable", "ios-card-expand"],
    targetCategories: ["expandable", "card-flip"],
    why: ["命中展开/折叠场景", "优先推荐共享元素和内容展开两类实现"],
  },
  {
    id: "carousel-pager",
    terms: ["轮播", "pager", "carousel", "翻页", "cover flow", "peek"],
    targetPreviewIds: [
      "ios-carousel",
      "ios-carousel-peek",
      "ios-carousel-scale",
      "ios-carousel-coverflow",
    ],
    targetCategories: ["carousel", "swipe-cards"],
    why: ["命中轮播 / Pager 场景"],
  },
  {
    id: "tab-badge",
    terms: ["tab", "标签栏", "badge", "角标", "tabbar"],
    targetPreviewIds: ["ios-tabbar-bounce", "ios-tabbar-badge"],
    targetCategories: ["tabbar"],
    why: ["命中 Tab Bar / Badge 场景"],
  },
  {
    id: "input-validation",
    terms: ["输入框", "textfield", "focus", "校验", "shake", "错误输入"],
    targetPreviewIds: ["ios-textfield-focus", "ios-textfield-shake"],
    targetCategories: ["textfield"],
    why: ["命中文本输入与校验反馈场景"],
  },
  {
    id: "sheet-dialog",
    terms: ["sheet", "modal", "dialog", "alert", "弹窗", "抽屉", "action sheet"],
    targetPreviewIds: ["ios-sheet-bottom", "ios-alert", "ios-action-sheet"],
    targetCategories: ["sheet", "alert", "action-sheet"],
    why: ["命中弹层 / 对话框场景"],
  },
  {
    id: "toast-notification",
    terms: ["toast", "snackbar", "notification", "banner", "通知", "提示"],
    targetPreviewIds: ["ios-toast", "ios-snackbar", "ios-notification"],
    targetCategories: ["toast", "notification-banner"],
    why: ["命中提示与通知反馈场景"],
  },
  {
    id: "haptics",
    terms: ["haptic", "触觉", "震动", "feedback"],
    targetPreviewIds: [
      "ios-haptic-impact",
      "ios-haptic-notification",
      "ios-haptic-selection",
      "ios-haptic-increase-decrease",
    ],
    targetCategories: ["haptics"],
    why: ["命中触觉反馈场景"],
  },
  {
    id: "loading-state",
    terms: ["loading", "skeleton", "progress", "spinner", "骨架屏", "加载", "进度"],
    targetPreviewIds: [
      "ios-loading-spinner",
      "ios-skeleton",
      "ios-progress-bar",
      "ios-progress-ring",
    ],
    targetCategories: ["loading", "skeleton", "progress"],
    why: ["命中加载与状态反馈场景"],
  },
];

function normalizeIntent(intent: string) {
  return intent.trim().toLowerCase();
}

function expandIntent(intent: string) {
  const normalized = normalizeIntent(intent);
  const parts = new Set(tokenize(normalized));
  for (const profile of recommendProfiles) {
    if (profile.terms.some((term) => normalized.includes(term.toLowerCase()))) {
      for (const term of profile.terms) {
        for (const token of tokenize(term)) parts.add(token);
      }
    }
  }
  return [...parts].join(" ");
}

function getMatchedProfiles(intent: string) {
  const normalized = normalizeIntent(intent);
  return recommendProfiles.filter((profile) =>
    profile.terms.some((term) => normalized.includes(term.toLowerCase())),
  );
}

export function recommendMotion(
  intent: string,
  options: {
    platform?: Platform;
    category?: string;
    limit?: number;
  } = {},
) {
  const expandedIntent = expandIntent(intent);
  const matchedProfiles = getMatchedProfiles(intent);
  const limit = options.limit ?? 5;

  const candidates = searchMotions(expandedIntent, 40).filter((item) => findCard(item.previewId));
  const allCards = getAllCards();

  const scored = new Map<string, MotionRecommendation>();

  function upsert(summary: CardSummary, baseScore: number, why: string[], matchedOn: string[]) {
    if (options.category && summary.category !== options.category) return;
    const previous = scored.get(summary.previewId);
    const nextScore = previous ? Math.max(previous.score, baseScore) : baseScore;
    const nextWhy = [...new Set([...(previous?.why ?? []), ...why])];
    const nextMatchedOn = [...new Set([...(previous?.matchedOn ?? []), ...matchedOn])];
    scored.set(summary.previewId, {
      id: summary.id,
      previewId: summary.previewId,
      title: summary.title,
      category: summary.category,
      categoryTitle: summary.categoryTitle,
      path: summary.path,
      platforms: summary.codePlatforms,
      score: nextScore,
      why: nextWhy,
      matchedOn: nextMatchedOn,
      nextAction: {
        tool: "get_code",
        previewId: summary.previewId,
        suggestedPlatform: options.platform ?? "swift",
      },
    });
  }

  for (const candidate of candidates) {
    const why = ["基于 search_motions 命中标题、标签或说明"];
    upsert(candidate, candidate.score, why, candidate.matchedOn);
  }

  for (const profile of matchedProfiles) {
    for (const previewId of profile.targetPreviewIds ?? []) {
      const summary = allCards.find((item) => item.previewId === previewId);
      if (!summary) continue;
      upsert(summary, 10, profile.why, profile.terms);
    }
    for (const category of profile.targetCategories ?? []) {
      for (const summary of allCards.filter((item) => item.category === category)) {
        upsert(summary, 7, profile.why, profile.terms);
      }
    }
  }

  const recommendations = [...scored.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return {
    intent,
    normalizedIntent: expandedIntent,
    platform: options.platform ?? null,
    category: options.category ?? null,
    matchedProfiles: matchedProfiles.map((profile) => profile.id),
    count: recommendations.length,
    recommendations,
  };
}

export function summarizeSection(section: SectionData) {
  if (section.type === "docs") {
    return {
      kind: "docs" as const,
      title: section.title,
      description: section.description,
      docSectionCount: section.sections.length,
    };
  }
  if (section.type === "cards") {
    return {
      kind: "cards" as const,
      title: section.title,
      description: section.description,
      cardCount: section.cards.length,
    };
  }
  if (section.type === "tokens") {
    return {
      kind: "tokens" as const,
      title: section.title,
      description: section.description,
      tokenCount: section.tokens.length,
    };
  }
  return {
    kind: "spring-curves" as const,
    title: section.title,
    description: section.description,
    springCount: section.springs.length,
    timingCurveCount: section.timingCurves.length,
  };
}

export function getSectionForMcp(slug: string) {
  const section = getSection(slug);
  if (!section) return null;

  if (section.type === "cards") {
    return {
      ...summarizeSection(section),
      cards: section.cards.map((card) => ({
        id: card.previewId,
        title: card.title,
        previewId: card.previewId,
        controlsId: card.controlsId,
        tags: card.tags.map((tag) => tag.text),
        platforms: ["swift", "uikit"] as Platform[],
      })),
    };
  }

  if (section.type === "docs") {
    return {
      ...summarizeSection(section),
      sections: section.sections,
    };
  }

  if (section.type === "tokens") {
    return {
      ...summarizeSection(section),
      tokens: section.tokens,
      codeSnippet: section.codeSnippet,
    };
  }

  return {
    ...summarizeSection(section),
    springs: section.springs,
    timingCurves: section.timingCurves,
  };
}
