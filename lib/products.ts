import { categories } from "@/data/categories";

// A pro/con point synthesized from real reviews.
// `mentions` = how many distinct reviewers raised it (credibility signal, anti-hallucination).
export type ReviewPoint = {
  text: string;
  mentions: number;
};

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
  lazadaUrl: string;
  highlight: string;
  reason: string;
  pros: string[];

  // --- Review-site fields (optional; legacy categories omit these) ---
  brand?: string;
  model?: string;
  // Key specs as label -> value, rendered in the comparison table.
  specs?: Record<string, string>;
  // AI-synthesized 2-3 sentence summary, grounded strictly in raw reviews.
  reviewSummary?: string;
  // Structured pros/cons with mention counts (preferred over plain `pros`).
  prosDetailed?: ReviewPoint[];
  consDetailed?: ReviewPoint[];
  // "Who should buy this" — one line.
  bestFor?: string;
  // Provenance for transparency / "no sponsor" trust.
  reviewCount?: number;
  reviewSources?: string[];
  lastReviewed?: string; // ISO date
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

// Stable url slug for a product within a category (based on brand+model or name).
export function productSlug(p: Product): string {
  const base = [p.brand, p.model].filter(Boolean).join(" ") || p.name;
  return base
    .toLowerCase()
    .replace(/[^a-z0-9ก-๙]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function getProductByModelSlug(
  category: string,
  modelSlug: string
): Promise<Product | undefined> {
  const products = await getProducts(category);
  return products.find((p) => productSlug(p) === modelSlug);
}
