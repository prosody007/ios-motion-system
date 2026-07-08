import { notFound } from "next/navigation";
import { CardDemoGrid } from "@/components/card-demo-grid";
import { categories } from "@/data/categories";
import { LoadingDemoGrid } from "@/components/loading-demo-grid";
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

  if (category === "card") {
    return <CardDemoGrid />;
  }

  if (category === "loading") {
    return <LoadingDemoGrid />;
  }

  notFound();
}
