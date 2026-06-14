import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { categories } from "@/data/categories";
import { getProducts, getCategoryBySlug, productSlug } from "@/lib/products";
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
  return {
    title: `เทียบสเปค ${cat.name} — เลือกรุ่นไหนดี?`,
    description: `ตารางเทียบสเปคและคะแนนรีวิว ${cat.name} แบบเคียงข้างกัน`,
  };
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) notFound();

  const lang = await getLang();
  const all = await getProducts(category);
  // Compare the top contenders that actually have specs.
  const products = all.filter((p) => p.specs && Object.keys(p.specs).length > 0).slice(0, 4);

  if (products.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center">
        <p className="text-6xl mb-6 opacity-50">📊</p>
        <h1 className="text-xl font-rubik font-black text-slate-900 mb-2">
          ยังไม่มีข้อมูลสเปคให้เทียบ
        </h1>
        <Link href={`/${category}`} className="text-[#2d6a4f] font-semibold">
          ← กลับไปดูอันดับ
        </Link>
      </div>
    );
  }

  // Union of all spec keys, preserving first-seen order.
  const specKeys: string[] = [];
  for (const p of products) {
    for (const k of Object.keys(p.specs!)) {
      if (!specKeys.includes(k)) specKeys.push(k);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl sm:text-3xl font-rubik font-black text-slate-900">
          เทียบสเปค {lang === "en" ? cat.nameEn : cat.name}
        </h1>
        <p className="text-slate-500 font-medium mt-2">
          เทียบ {products.length} รุ่นเด่นแบบเคียงข้างกัน — คะแนนจากรีวิวจริง
        </p>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-slate-100">
        <table className="w-full text-[13px] min-w-[640px]">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left p-3 text-slate-400 font-black uppercase text-[11px] tracking-wider w-40">
                รุ่น
              </th>
              {products.map((p) => (
                <th key={p.rank} className="p-3 text-center align-top">
                  <Link
                    href={`/review/${category}/${productSlug(p)}`}
                    className="font-rubik font-black text-slate-900 hover:text-[#2d6a4f] line-clamp-2 block"
                  >
                    {p.brand || p.name}
                  </Link>
                  <div className="text-[11px] text-slate-400 mt-1">{p.model}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-slate-100">
              <td className="p-3 text-slate-400 font-semibold">คะแนนรวม</td>
              {products.map((p) => (
                <td key={p.rank} className="p-3 text-center font-black text-[#2d6a4f]">
                  {p.score}/10
                </td>
              ))}
            </tr>
            <tr className="border-t border-slate-100">
              <td className="p-3 text-slate-400 font-semibold">เรตติ้ง</td>
              {products.map((p) => (
                <td key={p.rank} className="p-3 text-center">
                  ⭐ {p.rating}
                </td>
              ))}
            </tr>
            <tr className="border-t border-slate-100">
              <td className="p-3 text-slate-400 font-semibold">ราคา</td>
              {products.map((p) => (
                <td key={p.rank} className="p-3 text-center font-black">
                  ฿{p.price.toLocaleString()}
                </td>
              ))}
            </tr>
            {specKeys.map((k) => (
              <tr key={k} className="border-t border-slate-100">
                <td className="p-3 text-slate-400 font-semibold">{k}</td>
                {products.map((p) => (
                  <td key={p.rank} className="p-3 text-center text-slate-700">
                    {p.specs?.[k] || "—"}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t border-slate-100">
              <td className="p-3"></td>
              {products.map((p) => (
                <td key={p.rank} className="p-3 text-center">
                  <a
                    href={p.shopeeUrl}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="inline-block bg-[#ee4d2d] text-white font-bold text-[12px] px-4 py-2 rounded-lg hover:bg-[#d73211]"
                  >
                    ซื้อ
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <Link href={`/${category}`} className="inline-block text-[#2d6a4f] font-semibold">
        ← กลับไปดูอันดับทั้งหมด
      </Link>
    </div>
  );
}
