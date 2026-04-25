import type { CardsSection } from "@/types/motion";
import { AnimationCardView } from "@/components/animation-card";

export function CardsSectionView({ section }: { section: CardsSection }) {
  const singleCard = section.cards.length === 1;
  return (
    <div
      className={
        singleCard
          ? "grid grid-cols-1 gap-x-5 gap-y-10"
          : "grid grid-cols-1 xl:grid-cols-2 gap-x-5 gap-y-10"
      }
    >
      {section.cards.map((card) => (
        <AnimationCardView key={card.title} card={card} />
      ))}
    </div>
  );
}
