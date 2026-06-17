import { notFound } from "next/navigation";
import { categories } from "@/data/categories";

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

  return <div />;
}
