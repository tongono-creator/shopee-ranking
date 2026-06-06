import { notFound } from "next/navigation";
import { categories } from "@/data/categories";
import { getProducts, getCategoryBySlug } from "@/lib/products";
import { Fragment } from "react";
import ProductCard from "@/components/ProductCard";
import AdBanner from "@/components/AdBanner";
import type { Metadata } from "next";
import { dict } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

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
  const lang = await getLang();
  
  const catName = lang === "en" ? cat.nameEn : cat.name;
  const catDesc = lang === "en" ? (cat.descriptionEn || cat.description) : cat.description;
  
  return {
    title: lang === "en"
      ? `Top 20 Best ${catName} on Shopee Thailand`
      : `Top 20 ${catName} บน Shopee ไทย`,
    description: catDesc,
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
  const lang = await getLang();
  const t = dict[lang];

  const catName = lang === "en" ? cat.nameEn : cat.name;
  const catDesc = lang === "en" ? (cat.descriptionEn || cat.description) : cat.description;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: lang === "en" ? `Top 20 Best ${catName}` : `Top 20 ${catName}`,
            description: catDesc,
            numberOfItems: products.length,
            itemListElement: products.map((p) => ({
              '@type': 'ListItem',
              position: p.rank,
              item: {
                '@type': 'Product',
                name: p.name,
                image: p.image,
                offers: {
                  '@type': 'Offer',
                  price: p.price,
                  priceCurrency: 'THB',
                  availability: 'https://schema.org/InStock',
                  url: p.shopeeUrl
                },
                ...(p.rating > 0 ? {
                  aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: p.rating,
                    bestRating: 5,
                    reviewCount: 100
                  }
                } : {})
              }
            }))
          })
        }}
      />
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-8">
          <div>
            <div className="flex items-center gap-2 text-[#2d6a4f] font-black text-[10px] uppercase tracking-[0.2em] mb-3">
              <span className="w-8 h-[2px] bg-[#2d6a4f]"></span>
              Product Ranking
            </div>
            <h1 className="text-3xl sm:text-4xl font-rubik font-black text-slate-900 flex items-center gap-3">
              <span className="drop-shadow-sm">{cat.icon}</span>
              <span>
                {lang === "en" ? `${t.categoryTitlePrefix} ${catName}` : `${t.categoryTitlePrefix} ${catName}`}
              </span>
            </h1>
            <p className="text-slate-500 font-medium mt-3 max-w-2xl leading-relaxed">{catDesc}</p>
          </div>
          <div className="flex-shrink-0">
            <div className="bg-white border-2 border-slate-100 px-4 py-2 rounded-2xl shadow-sm flex items-center gap-3">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-[#2d6a4f] font-black">
                {products.length}
              </div>
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                {t.curatedBadgeLine1}<br />{t.curatedBadgeLine2}
              </div>
            </div>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-200 py-24 text-center">
            <p className="text-6xl mb-6 grayscale opacity-50">📦</p>
            <h3 className="text-xl font-rubik font-black text-slate-900 mb-2">{t.emptyCategoryTitle}</h3>
            <p className="text-slate-400 font-medium">{t.emptyCategorySubtitle}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <Fragment key={product.rank}>
                <div className="relative">
                  <ProductCard product={product} lang={lang} />
                </div>
                {product.rank % 5 === 0 && (
                  <div className="col-span-full py-4">
                    <AdBanner />
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
