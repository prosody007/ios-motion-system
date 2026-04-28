import { notFound } from "next/navigation";
import { categories } from "@/data/categories";
import { sectionMap } from "@/data";
import { DocsSectionView } from "@/components/docs-section";
import { TokenSectionView } from "@/components/token-table";
import { SpringCurveSectionView } from "@/components/spring-section";
import { CardsSectionView } from "@/components/cards-section";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const section = sectionMap[category];
  if (!section) notFound();

  return (
    <div>
      <h1 className="text-[38px] font-semibold leading-[1.2] tracking-[-0.02em] text-[rgba(0,0,0,0.88)]">
        {section.title}
      </h1>
      <p className="mt-4 text-[14px] leading-7 text-[rgba(0,0,0,0.65)]">
        {section.description}
      </p>

      <div className="mt-9">
        {section.type === "docs" && <DocsSectionView section={section} />}
        {section.type === "tokens" && <TokenSectionView section={section} />}
        {section.type === "spring-curves" && <SpringCurveSectionView section={section} />}
        {section.type === "cards" && <CardsSectionView section={section} />}
      </div>
    </div>
  );
}
