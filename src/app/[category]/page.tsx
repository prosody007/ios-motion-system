import { notFound } from "next/navigation";
import { categories } from "@/data/categories";
import { UiverseButtonDemo } from "@/components/uiverse-button-demo";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const exists = categories.some((item) => item.slug === category);

  if (!exists) notFound();

  if (category === "button") {
    return <UiverseButtonDemo />;
  }

  return <div />;
}
