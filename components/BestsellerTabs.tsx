"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { categories } from "@/data/categories";
import { Product } from "@/lib/products";
import { Lang, dict } from "@/lib/i18n";
import ProductCard from "./ProductCard";

type BestsellerTabsProps = {
  productsData: Record<string, Product[]>;
  lang: Lang;
};

export default function BestsellerTabs({ productsData, lang }: BestsellerTabsProps) {
  const [activeSlug, setActiveSlug] = useState("bestsellers");
  const t = dict[lang];

  const activeCategory = categories.find((c) => c.slug === activeSlug) || categories[0];
  const products = productsData[activeSlug] || [];

  return (
    <div className="space-y-6">
      {/* Tab Header & Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-150 pb-4">
        <div>
          <h2 className="text-2xl font-rubik font-black text-slate-900 tracking-tight">
            {lang === "en" ? "Best Sellers Showcase" : "ตู้โชว์สินค้าขายดี"}
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">
            {lang === "en" 
              ? "Select a category to instantly view top ranking items" 
              : "เลือกหมวดหมู่เพื่อดูอันดับสินค้าขายดียอดนิยมได้ทันที"}
          </p>
        </div>
        <Link
          href={`/${activeSlug}`}
          className="inline-flex items-center gap-1 text-[#2d6a4f] hover:text-[#1b4332] font-black text-sm transition-transform hover:translate-x-1"
        >
          {t.bestSeeAll} <span className="text-lg">→</span>
        </Link>
      </div>

      {/* Tabs Row (Pills) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        {categories.map((cat) => {
          const isActive = cat.slug === activeSlug;
          return (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setActiveSlug(cat.slug)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer ${
                isActive
                  ? "bg-[#2d6a4f] text-white ring-2 ring-[#2d6a4f]/20 scale-[1.02]"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-[#2d6a4f] hover:text-[#2d6a4f]"
              }`}
            >
              <span className="text-sm">{cat.icon}</span>
              <span>{lang === "en" ? cat.nameEn : cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Products Grid - Space-efficient 5 columns */}
      {products.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-200 py-16 text-center">
          <p className="text-4xl mb-4 grayscale opacity-50">📦</p>
          <h3 className="text-lg font-rubik font-bold text-slate-900 mb-1">{t.emptyCategoryTitle}</h3>
          <p className="text-slate-400 text-xs font-medium">{t.emptyCategorySubtitle}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.slice(0, 10).map((product) => (
            <ProductCard key={product.rank} product={product} lang={lang} />
          ))}
        </div>
      )}

      {/* View More Callout */}
      <div className="pt-2 text-center">
        <Link
          href={`/${activeSlug}`}
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-white border-2 border-[#2d6a4f] text-[#2d6a4f] font-rubik font-black text-sm hover:bg-green-50 transition-all shadow-sm hover:shadow-md active:scale-[0.99] cursor-pointer"
        >
          {lang === "en" 
            ? `View All 20 Ranks for ${lang === "en" ? activeCategory.nameEn : activeCategory.name}` 
            : `ดูอันดับที่ 11 - 20 ในหมวด ${activeCategory.name} ต่อ`}
          <span className="text-base">⚡</span>
        </Link>
      </div>
    </div>
  );
}
