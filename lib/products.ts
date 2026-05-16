import { categories } from "@/data/categories";

export type Product = {
  rank: number;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: number;
  sold: string;
  rating: number;
  score: number;
  shopeeUrl: string;
  highlight: string;
  reason: string;
  pros: string[];
};

export async function getProducts(slug: string): Promise<Product[]> {
  try {
    const data = await import(`@/data/products/${slug}.json`);
    return data.default as Product[];
  } catch {
    return [];
  }
}

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}
