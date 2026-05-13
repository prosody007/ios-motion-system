import type { CardsSection } from "@/types/motion";
import { cardFlipSection } from "./card-flip";

// 直接复用 cardFlipSection 内 Flash Card Stack 卡，避免维护两份配置
const cards = cardFlipSection.cards.filter(
  (card) => card.title === "Flash Card Stack",
);

export const exampleFlashCardStackSection: CardsSection = {
  type: "cards",
  title: "Flash Card Stack",
  description: "实例 · 复用自 Card 分组下的 Flash Card Stack。",
  cards,
};
