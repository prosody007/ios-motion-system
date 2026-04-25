export interface Category {
  slug: string;
  title: string;
  icon: string;
  description: string;
}

export interface TokenItem {
  name: string;
  value: string;
  bar: number;
  desc: string;
}

export interface SpringCurve {
  name: string;
  response: number;
  damping: number;
  description: string;
  swift: string;
  swiftLegacy: string;
  uikit: string;
  badge: string;
}

export interface TimingCurve {
  name: string;
  css: string;
  swift: string;
  cp: [number, number, number, number];
  desc: string;
}

export interface AnimationCard {
  title: string;
  tags: { text: string; variant: "duration" | "easing" | "spring" }[];
  previewId: string;
  /** 可选：在预览和标题之间渲染独立的参数控制面板 */
  controlsId?: string;
  codes: {
    swift: string;
    uikit: string;
  };
}

export interface TokenSection {
  type: "tokens";
  title: string;
  description: string;
  tokens: TokenItem[];
  codeSnippet: string;
}

export interface SpringCurveSection {
  type: "spring-curves";
  title: string;
  description: string;
  springs: SpringCurve[];
  timingCurves: TimingCurve[];
}

export interface CardsSection {
  type: "cards";
  title: string;
  description: string;
  cards: AnimationCard[];
}

export interface DocsCodeBlock {
  title?: string;
  language: string;
  code: string;
}

export interface DocsContentSection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  codeBlocks?: DocsCodeBlock[];
}

export interface DocsSection {
  type: "docs";
  title: string;
  description: string;
  sections: DocsContentSection[];
}

export type SectionData =
  | TokenSection
  | SpringCurveSection
  | CardsSection
  | DocsSection;
