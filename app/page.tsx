import Link from "next/link";
import Image from "next/image";
import { categories } from "@/data/categories";
import { getProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

const stats = [
  {
    label: "หมวดหมู่ยอดฮิต",
    value: "6 หมวดหมู่",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <path d="M9 22V12h6v10" />
      </svg>
    ),
  },
  {
    label: "สินค้าที่ผ่านการคัดเลือก",
    value: "120+ รายการ",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
      </svg>
    ),
  },
  {
    label: "อัพเดทข้อมูลล่าสุด",
    value: "อัพเดทสม่ำเสมอ",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-2.64-6.36" />
        <path d="M21 4v5h-5" />
      </svg>
    ),
  },
];

export default async function HomePage() {
  const bestsellers = await getProducts("bestsellers");

  const featured = bestsellers[0];
  const sideTiles = bestsellers.slice(1, 4);

  return (
    <div className="space-y-14">
      {/* Hero Section — full-bleed dark cinematic + featured product + annotations */}
      <section className="relative overflow-hidden bg-[#08130d] text-white min-h-[560px] sm:min-h-[640px] flex items-center py-14 sm:py-20 -mt-8 left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
        {/* Generated atmospheric backdrop */}
        <Image
          src="/hero-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-80"
        />
        {/* Atmospheric layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c2419]/80 via-[#08130d]/85 to-[#02080a]/90" />
        <div className="absolute -top-32 -left-20 w-[34rem] h-[34rem] bg-emerald-500/20 rounded-full blur-[130px]" />
        <div className="absolute bottom-[-12rem] right-[-4rem] w-[32rem] h-[32rem] bg-emerald-400/10 rounded-full blur-[130px]" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-amber-400/10 rounded-full blur-[110px]" />
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />

        <div className="relative z-10 grid lg:grid-cols-[1fr_0.95fr] gap-12 items-center w-full max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-20">
          {/* Left — copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md ring-1 ring-white/10 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-100/80 mb-7">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              อัพเดทพฤษภาคม 2026
            </div>
            <h1 className="font-rubik font-black leading-[1.04] tracking-tight text-5xl sm:text-6xl lg:text-7xl">
              <span className="block text-white/95">สินค้าขายดี</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-[#52b788] to-amber-200">
                ตัวจริงเสียงจริง
              </span>
            </h1>
            <p className="mt-6 text-emerald-50/55 text-lg font-medium leading-relaxed max-w-md">
              รวมอันดับ Top 20 จากยอดขายจริงทุกหมวด คัดเฉพาะของดี รีวิวเยี่ยม ในที่เดียว
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#bestsellers"
                className="group inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-[#06120c] font-rubik font-black px-7 py-3.5 rounded-full shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                ดูสินค้าแนะนำ
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 transition-transform group-hover:translate-x-1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
              <Link
                href="/bestsellers"
                className="inline-flex items-center gap-2 text-white/85 font-bold px-6 py-3.5 rounded-full ring-1 ring-white/15 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-pointer"
              >
                ดู 20 อันดับ
              </Link>
            </div>
          </div>

          {/* Right — featured product with glow + annotations */}
          {featured && (
            <div className="relative hidden lg:block h-[420px]">
              {/* Neon ring glow */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-emerald-400/25 blur-[80px]" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full ring-1 ring-emerald-300/30" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full ring-1 ring-white/5" />

              {/* Featured image card */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-[1.5rem] overflow-hidden ring-1 ring-white/15 shadow-2xl shadow-black/50 bg-white/5">
                <Image
                  src={featured.image}
                  alt={featured.name}
                  fill
                  sizes="240px"
                  priority
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              {/* Rank badge */}
              <div className="absolute left-1/2 top-1/2 -translate-x-[6.5rem] -translate-y-[6.5rem] flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-300 text-[#3a2a00] text-xs font-black px-3 py-1.5 rounded-full shadow-lg shadow-amber-500/30">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" /></svg>
                อันดับ 1
              </div>

              {/* Annotation: rating (top-right) */}
              <div className="absolute right-2 top-8 flex items-center gap-2">
                <div className="bg-white/8 backdrop-blur-md ring-1 ring-white/15 rounded-xl px-3 py-2">
                  <p className="text-[10px] text-emerald-100/60 font-bold uppercase tracking-wider">เรตติ้ง</p>
                  <p className="text-base font-rubik font-black text-white flex items-center gap-1">
                    <svg viewBox="0 0 24 24" fill="#fbbf24" className="w-4 h-4"><path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" /></svg>
                    {featured.rating}
                  </p>
                </div>
                <span className="h-px w-8 bg-gradient-to-r from-white/40 to-transparent" />
              </div>

              {/* Annotation: score (bottom-left) */}
              <div className="absolute left-0 bottom-10 flex items-center gap-2">
                <span className="h-px w-8 bg-gradient-to-l from-white/40 to-transparent order-2" />
                <div className="bg-white/8 backdrop-blur-md ring-1 ring-white/15 rounded-xl px-3 py-2 order-1">
                  <p className="text-[10px] text-emerald-100/60 font-bold uppercase tracking-wider">คะแนนรวม</p>
                  <p className="text-base font-rubik font-black text-emerald-300">{featured.score}/10</p>
                </div>
              </div>

              {/* Annotation: highlight pill (bottom-right) */}
              {featured.highlight && (
                <div className="absolute right-6 bottom-2 bg-emerald-500/15 ring-1 ring-emerald-400/30 text-emerald-200 text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
                  {featured.highlight}
                </div>
              )}

              {/* Floating secondary product tiles */}
              {sideTiles[0] && (
                <div className="absolute -left-2 top-2 w-20 h-20 rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-xl shadow-black/40 bg-white/5 rotate-[-8deg]">
                  <Image src={sideTiles[0].image} alt="" fill sizes="80px" className="object-cover" referrerPolicy="no-referrer" />
                </div>
              )}
              {sideTiles[1] && (
                <div className="absolute right-8 bottom-16 w-16 h-16 rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-xl shadow-black/40 bg-white/5 rotate-[6deg]">
                  <Image src={sideTiles[1].image} alt="" fill sizes="64px" className="object-cover" referrerPolicy="no-referrer" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile featured */}
        {featured && (
          <div className="lg:hidden absolute -right-10 bottom-4 w-40 h-40 rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl shadow-black/50 opacity-40 rotate-6">
            <Image src={featured.image} alt="" fill sizes="160px" className="object-cover" referrerPolicy="no-referrer" />
          </div>
        )}
      </section>

      {/* Stats Bar */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 -mt-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-lg hover:shadow-green-900/5 hover:border-[#2d6a4f]/20 transition-all"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-emerald-100 text-[#2d6a4f] rounded-xl flex items-center justify-center ring-1 ring-green-100 group-hover:scale-105 transition-transform">
              {stat.icon}
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
              <p className="text-slate-900 font-rubik font-black text-lg leading-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Categories Grid */}
      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-rubik font-black text-slate-900 tracking-tight">เลือกหมวดหมู่ที่น่าสนใจ</h2>
            <p className="text-slate-500 font-medium">ค้นหาอันดับสินค้าขายดีในหมวดหมู่ที่คุณต้องการ</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#2d6a4f] hover:shadow-xl hover:shadow-green-900/5 transition-all text-center flex flex-col items-center"
            >
              <div className="mb-4 group-hover:scale-110 transition-transform duration-300 transform-gpu">
                <Image src={cat.image} alt={cat.name} width={72} height={72} className="w-[72px] h-[72px] object-contain drop-shadow-sm" />
              </div>
              <p className="font-rubik font-bold text-slate-800 text-sm group-hover:text-[#2d6a4f] transition-colors leading-tight mb-1">
                {cat.name}
              </p>
              <div className="mt-auto inline-flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-green-500 transition-colors">
                Top 20 →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bestsellers Preview */}
      <section id="bestsellers" className="pt-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-xl">🔥</div>
            <h2 className="text-2xl font-rubik font-black text-slate-900 tracking-tight">สินค้าขายดีประจำเดือน</h2>
          </div>
          <Link
            href="/bestsellers"
            className="hidden sm:flex items-center gap-1 text-[#2d6a4f] font-black text-sm hover:translate-x-1 transition-transform"
          >
            ดูทั้งหมด 20 อันดับ <span className="text-lg">→</span>
          </Link>
        </div>
        
        <div className="grid gap-6">
          {bestsellers.slice(0, 3).map((product) => (
            <ProductCard key={product.rank} product={product} />
          ))}
        </div>

        <Link
          href="/bestsellers"
          className="mt-8 flex items-center justify-center gap-2 w-full py-5 rounded-2xl bg-white border-2 border-[#2d6a4f] text-[#2d6a4f] font-rubik font-black text-lg hover:bg-green-50 transition-all shadow-sm hover:shadow-lg active:scale-[0.99]"
        >
          เปิดดูอันดับที่ 4 - 20 ต่อ <span className="text-2xl">⚡</span>
        </Link>
      </section>

      {/* Affiliate Disclaimer */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <div className="text-3xl">ℹ️</div>
        <div>
          <p className="text-slate-900 font-bold text-sm mb-1">ประกาศเกี่ยวกับการแนะนำสินค้า</p>
          <p className="text-slate-500 text-xs leading-relaxed">
            เนื้อหาในหน้านี้ถูกสร้างขึ้นเพื่อแนะนำสินค้าคุณภาพบน Shopee เท่านั้น เว็บไซต์ของเรามีการใช้ลิงก์ Affiliate 
            ซึ่งอาจทำให้เราได้รับค่าตอบแทนเล็กน้อยหากมีการสั่งซื้อผ่านลิงก์ โดยไม่มีการบวกราคาเพิ่มใดๆ กับผู้ซื้อ
          </p>
        </div>
      </div>
    </div>
  );
}
