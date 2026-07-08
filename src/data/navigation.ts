export type DocsNavGroup = {
  label: string;
  slugs: string[];
};

export type DocsNavMeta = {
  primary: string;
  secondary: string;
  badge?: string;
};

export const docsNavGroups: DocsNavGroup[] = [
  { label: "基础", slugs: ["button", "card", "loading"] },
  {
    label: "转场",
    slugs: [
      "navigation",
      "page-transitions",
      "custom-transitions",
      "hero-transition",
    ],
  },
  {
    label: "高级动效",
    slugs: [
      "counter",
      "scroll-driven",
      "keyframe",
      "phase",
      "lottie",
      "border-glow",
    ],
  },
];

export const docsNavMetaMap: Record<string, DocsNavMeta> = {
  button: { primary: "Button", secondary: "" },
  card: { primary: "Card", secondary: "" },
  loading: { primary: "Loading", secondary: "" },
  navigation: { primary: "Navigation", secondary: "" },
  "page-transitions": { primary: "Page Transitions", secondary: "" },
  "custom-transitions": { primary: "Custom Transitions", secondary: "" },
  "hero-transition": { primary: "Hero Transition", secondary: "" },
  counter: { primary: "Counter", secondary: "" },
  "scroll-driven": { primary: "Scroll-Driven", secondary: "" },
  keyframe: { primary: "Keyframes", secondary: "" },
  phase: { primary: "Phase Animator", secondary: "" },
  lottie: { primary: "Lottie", secondary: "" },
  "border-glow": { primary: "Border Glow", secondary: "" },
};

export function getDocsNavMeta(slug: string): DocsNavMeta {
  return docsNavMetaMap[slug] ?? { primary: slug, secondary: "" };
}
