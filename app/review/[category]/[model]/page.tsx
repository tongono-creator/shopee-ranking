import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { categories } from "@/data/categories";
import {
  getProducts,
  getCategoryBySlug,
  getProductByModelSlug,
  productSlug,
} from "@/lib/products";
import { getLang } from "@/lib/i18n-server";

export async function generateStaticParams() {
  const params: { category: string; model: string }[] = [];
  for (const cat of categories) {
    const products = await getProducts(cat.slug);
    for (const p of products) {
      params.push({ category: cat.slug, model: productSlug(p) });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; model: string }>;
}): Promise<Metadata> {
  const { category, model } = await params;
  const p = await getProductByModelSlug(category, model);
  if (!p) return {};
  const title = `${p.name} รีวิว — ดีจริงไหม? สรุปจากผู้ใช้จริง`;
  return {
    title,
    description: p.reviewSummary || p.reason || p.name,
    openGraph: { title, description: p.reviewSummary || p.name, type: "article" },
  };
}

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ category: string; model: string }>;
}) {
  const { category, model } = await params;
  const cat = getCategoryBySlug(category);
  const p = await getProductByModelSlug(category, model);
  if (!cat || !p) notFound();

  const lang = await getLang();
  const pros =
    p.prosDetailed && p.prosDetailed.length > 0
      ? p.prosDetailed
      : (p.pros || []).map((text) => ({ text, mentions: 0 }));
  const cons = p.consDetailed || [];
  const specs = p.specs ? Object.entries(p.specs) : [];
  const scorePct = Math.round((p.score / 10) * 100);

  return (
    <article className="max-w-4xl mx-auto space-y-10">
      {/* Breadcrumb */}
      <nav className="text-[12px] font-semibold text-slate-400 flex items-center gap-2">
        <Link href={`/${category}`} className="hover:text-[#2d6a4f] transition-colors">
          {lang === "en" ? cat.nameEn : cat.name}
        </Link>
        <span>›</span>
        <span className="text-slate-600 truncate">{p.brand || p.name}</span>
      </nav>

      {/* HERO */}
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f3d2e] via-[#1c5240] to-[#2d6a4f] text-white p-6 sm:p-10">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute -left-10 -bottom-20 w-72 h-72 rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="relative flex flex-col sm:flex-row gap-8 items-center sm:items-start">
          {p.image && (
            <div className="flex-shrink-0 bg-white rounded-3xl p-4 shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image}
                alt={p.name}
                className="w-44 h-44 sm:w-52 sm:h-52 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          <div className="flex-1 space-y-4 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="bg-amber-400 text-amber-950 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wide">
                อันดับ {p.rank}
              </span>
              {p.brand && (
                <span className="bg-white/15 backdrop-blur text-white text-[11px] font-bold px-3 py-1 rounded-full">
                  {p.brand}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-rubik font-black leading-tight">
              {p.name}
            </h1>

            {/* Score + price row */}
            <div className="flex items-center justify-center sm:justify-start gap-6 pt-2">
              {/* Score ring */}
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="16" fill="none" stroke="#fbbf24" strokeWidth="3"
                    strokeDasharray={`${scorePct} 100`} strokeLinecap="round"
                    pathLength={100}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-black leading-none">{p.score}</span>
                  <span className="text-[9px] text-white/60 font-semibold">/ 10</span>
                </div>
              </div>
              <div className="text-left">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-rubik font-black">฿{p.price.toLocaleString()}</span>
                  {p.originalPrice > p.price && (
                    <span className="text-sm line-through text-white/50">
                      ฿{p.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                {p.rating > 0 && (
                  <p className="text-[13px] text-white/70 font-semibold mt-1">
                    ⭐ {p.rating} · {p.reviewCount || 0} รีวิวจริง
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* No-sponsor trust */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 bg-green-50 border border-green-100 rounded-2xl px-5 py-3 text-[13px] text-[#2d6a4f] font-semibold">
        <span>✓ จัดอันดับจากรีวิวผู้ใช้จริง</span>
        <span>✓ ไม่รับสปอนเซอร์</span>
        {p.reviewSources && p.reviewSources.length > 0 && (
          <span className="text-slate-400 font-normal">แหล่ง: {p.reviewSources.join(", ")}</span>
        )}
        {p.lastReviewed && (
          <span className="text-slate-400 font-normal ml-auto">อัพเดท {p.lastReviewed}</span>
        )}
      </div>

      {/* Verdict / summary */}
      {p.reviewSummary && (
        <section className="relative bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="absolute top-6 left-6 text-6xl text-slate-100 font-serif leading-none select-none">“</div>
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#2d6a4f] mb-3 relative">
            สรุปรีวิว
          </h2>
          <p className="text-slate-700 text-lg leading-relaxed relative">{p.reviewSummary}</p>
          {p.bestFor && (
            <div className="mt-5 pt-5 border-t border-slate-100 flex items-start gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">เหมาะกับใคร</div>
                <p className="text-slate-800 font-bold">{p.bestFor}</p>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Pros / Cons */}
      <section className="grid sm:grid-cols-2 gap-5">
        <div className="bg-white border-2 border-green-100 rounded-3xl overflow-hidden">
          <div className="bg-green-50 px-6 py-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center font-black">+</span>
            <h2 className="text-base font-rubik font-black text-green-800">ข้อดี</h2>
          </div>
          <ul className="p-6 space-y-3">
            {pros.map((pt, i) => (
              <li key={i} className="flex items-start gap-3 text-[14px] text-slate-700">
                <span className="text-green-500 font-black mt-0.5">✓</span>
                <span className="flex-1">
                  {pt.text}
                  {pt.mentions > 0 && (
                    <span className="ml-2 inline-block bg-green-100 text-green-700 text-[11px] font-bold px-2 py-0.5 rounded-full">
                      {pt.mentions} คนพูดถึง
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
        {cons.length > 0 && (
          <div className="bg-white border-2 border-red-100 rounded-3xl overflow-hidden">
            <div className="bg-red-50 px-6 py-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-red-400 text-white flex items-center justify-center font-black">−</span>
              <h2 className="text-base font-rubik font-black text-red-700">ข้อเสีย</h2>
            </div>
            <ul className="p-6 space-y-3">
              {cons.map((pt, i) => (
                <li key={i} className="flex items-start gap-3 text-[14px] text-slate-700">
                  <span className="text-red-400 font-black mt-0.5">✕</span>
                  <span className="flex-1">
                    {pt.text}
                    {pt.mentions > 0 && (
                      <span className="ml-2 inline-block bg-red-100 text-red-700 text-[11px] font-bold px-2 py-0.5 rounded-full">
                        {pt.mentions} คนพูดถึง
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Specs */}
      {specs.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-rubik font-black text-slate-900">สเปคโดยละเอียด</h2>
          <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden">
            <table className="w-full text-[14px]">
              <tbody>
                {specs.map(([k, v], i) => (
                  <tr key={k} className={i % 2 ? "bg-slate-50/50" : ""}>
                    <td className="py-3.5 px-6 text-slate-400 font-semibold w-2/5">{k}</td>
                    <td className="py-3.5 px-6 text-slate-800 font-medium">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Compare link */}
      <Link
        href={`/compare/${category}`}
        className="block text-center text-[#2d6a4f] font-bold hover:underline"
      >
        เทียบกับรุ่นอื่น →
      </Link>

      {/* Sticky CTA */}
      <div className="sticky bottom-4 z-10">
        <a
          href={p.shopeeUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="block w-full text-center bg-[#ee4d2d] text-white font-black text-lg py-4 rounded-2xl shadow-xl shadow-orange-500/20 hover:bg-[#d73211] transition-colors"
        >
          ดูราคาล่าสุดบน Shopee →
        </a>
      </div>
    </article>
  );
}
