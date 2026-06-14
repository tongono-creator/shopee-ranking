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

  return (
    <article className="max-w-3xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <nav className="text-[12px] font-semibold text-slate-400">
        <Link href={`/${category}`} className="hover:text-[#2d6a4f]">
          {lang === "en" ? cat.nameEn : cat.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-600">{p.brand || p.name}</span>
      </nav>

      {/* Header */}
      <header className="flex flex-col sm:flex-row gap-6 items-start border-b border-slate-100 pb-8">
        {p.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.image}
            alt={p.name}
            className="w-40 h-40 object-contain bg-slate-50 rounded-2xl p-3 flex-shrink-0"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="bg-[#2d6a4f] text-white text-[11px] font-black px-2.5 py-1 rounded-full">
              อันดับ {p.rank}
            </span>
            <span className="bg-amber-100 text-amber-800 text-[11px] font-black px-2.5 py-1 rounded-full">
              {p.score}/10
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-rubik font-black text-slate-900 leading-tight">
            {p.name}
          </h1>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              ฿{p.price.toLocaleString()}
            </span>
            {p.originalPrice > p.price && (
              <span className="text-sm line-through text-slate-400">
                ฿{p.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          {p.rating > 0 && (
            <p className="text-[13px] text-slate-500 font-semibold">
              ⭐ {p.rating} · จาก {p.reviewCount || 0} รีวิวจริง
              {p.reviewSources && p.reviewSources.length > 0 && (
                <span className="text-slate-400">
                  {" "}
                  ({p.reviewSources.join(", ")})
                </span>
              )}
            </p>
          )}
        </div>
      </header>

      {/* No-sponsor trust banner */}
      <div className="bg-green-50 border border-green-100 rounded-2xl px-4 py-3 text-[13px] text-[#2d6a4f] font-semibold">
        ✓ จัดอันดับจากรีวิวผู้ใช้จริง ไม่รับสปอนเซอร์
        {p.lastReviewed && (
          <span className="text-slate-400 font-normal">
            {" "}
            · อัพเดท {p.lastReviewed}
          </span>
        )}
      </div>

      {/* Summary */}
      {p.reviewSummary && (
        <section className="space-y-2">
          <h2 className="text-lg font-rubik font-black text-slate-900">สรุปรีวิว</h2>
          <p className="text-slate-600 leading-relaxed">{p.reviewSummary}</p>
        </section>
      )}

      {/* Best for */}
      {p.bestFor && (
        <section className="bg-slate-50 rounded-2xl p-5">
          <h2 className="text-[13px] font-black uppercase tracking-wider text-slate-400 mb-1">
            เหมาะกับใคร
          </h2>
          <p className="text-slate-800 font-semibold">{p.bestFor}</p>
        </section>
      )}

      {/* Pros / Cons */}
      <section className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white border border-green-100 rounded-2xl p-5">
          <h2 className="text-base font-rubik font-black text-green-700 mb-3">
            ข้อดี
          </h2>
          <ul className="space-y-2">
            {pros.map((pt, i) => (
              <li key={i} className="flex items-start gap-2 text-[14px] text-slate-700">
                <span className="text-green-500 mt-0.5">+</span>
                <span>
                  {pt.text}
                  {pt.mentions > 0 && (
                    <span className="text-slate-400 text-[12px]">
                      {" "}
                      ({pt.mentions} คนพูดถึง)
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
        {cons.length > 0 && (
          <div className="bg-white border border-red-100 rounded-2xl p-5">
            <h2 className="text-base font-rubik font-black text-red-600 mb-3">
              ข้อเสีย
            </h2>
            <ul className="space-y-2">
              {cons.map((pt, i) => (
                <li key={i} className="flex items-start gap-2 text-[14px] text-slate-700">
                  <span className="text-red-400 mt-0.5">−</span>
                  <span>
                    {pt.text}
                    {pt.mentions > 0 && (
                      <span className="text-slate-400 text-[12px]">
                        {" "}
                        ({pt.mentions} คนพูดถึง)
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
        <section className="space-y-3">
          <h2 className="text-lg font-rubik font-black text-slate-900">สเปค</h2>
          <table className="w-full text-[14px]">
            <tbody>
              {specs.map(([k, v]) => (
                <tr key={k} className="border-b border-slate-100">
                  <td className="py-2.5 text-slate-400 font-semibold w-2/5">{k}</td>
                  <td className="py-2.5 text-slate-800">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* CTA */}
      <div className="sticky bottom-4">
        <a
          href={p.shopeeUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="block w-full text-center bg-[#ee4d2d] text-white font-black text-lg py-4 rounded-2xl shadow-lg hover:bg-[#d73211] transition-colors"
        >
          ดูราคาล่าสุดบน Shopee →
        </a>
      </div>
    </article>
  );
}
