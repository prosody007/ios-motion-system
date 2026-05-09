import { notFound } from "next/navigation";
import { categories } from "@/data/categories";
import { sectionMap } from "@/data";
import { DocsSectionView } from "@/components/docs-section";
import { TokenSectionView } from "@/components/token-table";
import { SpringCurveSectionView } from "@/components/spring-section";
import { CardsPlayground } from "@/components/cards-playground";
import { loadSkillsPageContent } from "@/lib/skills-docs";
import { skillsSection } from "@/data/skills";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  if (category === "skills") {
    const skillsContent = await loadSkillsPageContent().catch(() => ({
      title: skillsSection.title,
      description: skillsSection.description,
      section: skillsSection,
    }));

    return (
      <div>
        <h1 className="text-[38px] font-semibold leading-[1.2] tracking-[-0.02em] text-[rgba(0,0,0,0.88)]">
          {skillsContent.title}
        </h1>
        <p className="mt-4 text-[14px] leading-7 text-[rgba(0,0,0,0.65)]">
          {skillsContent.description}
        </p>
        <div className="mt-9">
          <DocsSectionView section={skillsContent.section} />
        </div>
      </div>
    );
  }

  const section = sectionMap[category];
  if (!section) notFound();

  // Cards 类别用全新的 phone-frame playground 布局，不再显示顶部标题/描述
  if (section.type === "cards") {
    return (
      <div className="h-full min-h-0">
        <CardsPlayground section={section} />
      </div>
    );
  }

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
        {section.type === "spring-curves" && (
          <SpringCurveSectionView section={section} />
        )}
      </div>
    </div>
  );
}
