import { notFound } from "next/navigation";
import { categories } from "@/data/categories";
import { getProducts, getCategoryBySlug } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return categories.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) return {};
  return {
    title: `Top 10 ${cat.name} บน Shopee ไทย`,
    description: cat.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) notFound();

  const products = await getProducts(category);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span>{cat.icon}</span>
          <span>Top 10 {cat.name}</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">{cat.description}</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📦</p>
          <p>ยังไม่มีสินค้าในหมวดนี้</p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <ProductCard key={product.rank} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
