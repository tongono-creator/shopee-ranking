import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/products";
import BestsellerTabs from "@/components/BestsellerTabs";
import { dict } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

const statIcons = [
  (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
      <path d="M21 4v5h-5" />
    </svg>
  ),
];

export default async function HomePage() {
  const bestsellers = await getProducts("bestsellers");
  const homeGoods = await getProducts("home-goods");
  const womenFashion = await getProducts("women-fashion");
  const pets = await getProducts("pets");
  const foodDrinks = await getProducts("food-drinks");
  const homeAppliances = await getProducts("home-appliances");

  const productsData = {
    bestsellers,
    "home-goods": homeGoods,
    "women-fashion": womenFashion,
    pets,
    "food-drinks": foodDrinks,
    "home-appliances": homeAppliances,
  };

  const lang = await getLang();
  const t = dict[lang];

  const featured = bestsellers[0];
  // Floating cover tiles — 1-2 per category for variety, positions avoid rating(top-right) & score(bottom-left)
  const coverTiles = [
    { src: bestsellers[1]?.image, pos: "left-0 top-4", size: "w-24 h-24", rot: "rotate-[-8deg]" },
    { src: homeGoods[0]?.image, pos: "top-0 left-[42%]", size: "w-16 h-16", rot: "rotate-[5deg]" },
    { src: womenFashion[0]?.image, pos: "right-4 bottom-[22%]", size: "w-20 h-20", rot: "rotate-[7deg]" },
    { src: pets[0]?.image, pos: "bottom-0 right-[28%]", size: "w-20 h-20", rot: "rotate-[-5deg]" },
    { src: homeAppliances[0]?.image, pos: "right-0 top-[36%]", size: "w-14 h-14", rot: "rotate-[6deg]" },
    { src: foodDrinks[0]?.image, pos: "left-2 top-[60%]", size: "w-14 h-14", rot: "rotate-[-6deg]" },
  ].filter((tile): tile is { src: string; pos: string; size: string; rot: string } => Boolean(tile.src));

  const stats = [
    { label: t.statCategoriesLabel, value: t.statCategoriesValue, icon: statIcons[0] },
    { label: t.statProductsLabel, value: t.statProductsValue, icon: statIcons[1] },
    { label: t.statUpdateLabel, value: t.statUpdateValue, icon: statIcons[2] },
  ];

  const SITE = "https://shopee-ranking.vercel.app";
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "ShopeeTop",
        alternateName: "สินค้าขายดีใน Shopee",
        url: `${SITE}/`,
        description:
          "รวมสินค้าขายดีใน Shopee ไทย Top 20 ทุกหมวด คัดจากยอดขายจริง อัพเดททุกเดือน",
        inLanguage: "th-TH",
      },
      {
        "@type": "ItemList",
        name: "สินค้าขายดีใน Shopee — Top 20 ประจำเดือน",
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        numberOfItems: bestsellers.length,
        itemListElement: bestsellers.slice(0, 10).map((p) => ({
          "@type": "ListItem",
          position: p.rank,
          name: p.name,
          url: p.shopeeUrl,
        })),
      },
    ],
  };

  return (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Banner — full width */}
      <section className="relative overflow-hidden bg-[#08130d] text-white rounded-[2rem] min-h-[460px] sm:min-h-[540px] flex items-center p-8 sm:p-14 shadow-md">
          {/* Atmospheric background */}
          <Image
            src="/hero-bg.png"
            alt=""
            fill
            priority
            sizes="(max-w-1024px) 100vw, 1000px"
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c2419]/70 via-[#08130d]/80 to-[#02080a]/95" />
          <div className="absolute -top-32 -left-20 w-[24rem] h-[24rem] bg-emerald-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-12rem] right-[-4rem] w-[24rem] h-[24rem] bg-emerald-400/10 rounded-full blur-[100px]" />
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />

          <div className="relative z-10 grid md:grid-cols-[1fr_1fr] gap-10 items-center w-full max-w-[1500px] mx-auto">
            {/* Copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md ring-1 ring-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-100/80 mb-5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                {t.heroBadge}
              </div>
              <h1 className="font-rubik font-black leading-[1.04] tracking-tight text-4xl sm:text-6xl lg:text-[5rem]">
                <span className="block text-white/95">{t.heroTitle1}</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-[#52b788] to-amber-200">
                  {t.heroTitle2}
                </span>
              </h1>
              <p className="mt-5 text-emerald-50/60 text-sm sm:text-base font-medium leading-relaxed max-w-md">
                {t.heroSubtitle}
              </p>
              <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href="#showcase"
                  className="group inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-[#06120c] font-rubik font-black px-6 py-3 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-xs"
                >
                  {t.heroCtaPrimary}
                  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 transition-transform group-hover:translate-x-0.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
                <Link
                  href="/bestsellers"
                  className="inline-flex items-center justify-center gap-2 text-white/85 font-bold px-6 py-3 rounded-2xl ring-1 ring-white/15 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-pointer text-xs"
                >
                  {t.heroCtaSecondary}
                </Link>
              </div>

              {/* Trust row */}
              <div className="mt-8 flex items-center justify-between sm:justify-start gap-4 sm:gap-6">
                <div>
                  <p className="text-lg sm:text-xl font-rubik font-black text-white">120+</p>
                  <p className="text-[9px] text-emerald-100/50 font-bold uppercase tracking-wider">{t.trustProducts}</p>
                </div>
                <span className="h-8 w-px bg-white/10" />
                <div>
                  <p className="text-lg sm:text-xl font-rubik font-black text-white">6</p>
                  <p className="text-[9px] text-emerald-100/50 font-bold uppercase tracking-wider">{t.trustCategories}</p>
                </div>
                <span className="h-8 w-px bg-white/10" />
                <div>
                  <p className="text-lg sm:text-xl font-rubik font-black text-emerald-300 flex items-center gap-1">
                    <svg viewBox="0 0 24 24" fill="#fbbf24" className="w-4 h-4"><path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" /></svg>
                    4.8
                  </p>
                  <p className="text-[9px] text-emerald-100/50 font-bold uppercase tracking-wider">{t.trustRating}</p>
                </div>
              </div>
            </div>

            {/* Featured product badge inside hero */}
            {featured && (
              <div className="relative hidden md:flex items-center justify-center h-[360px] sm:h-[420px] lg:h-[480px] w-full">
                {/* Glow ring */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[26rem] h-[26rem] rounded-full bg-emerald-400/25 blur-[90px]" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[22rem] h-[22rem] rounded-full ring-1 ring-emerald-300/25" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[27rem] h-[27rem] rounded-full ring-1 ring-white/5" />

                {/* Main image */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[19rem] h-[19rem] lg:w-[21rem] lg:h-[21rem] rounded-[2rem] overflow-hidden ring-1 ring-white/15 shadow-2xl shadow-black/50 bg-white/5">
                  <Image
                    src={featured.image}
                    alt={featured.name}
                    fill
                    sizes="360px"
                    priority
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                {/* Rank badge */}
                <div className="absolute left-1/2 top-1/2 -translate-x-[9.5rem] -translate-y-[9.5rem] flex items-center gap-1 bg-gradient-to-r from-amber-400 to-yellow-300 text-[#3a2a00] text-xs font-black px-3 py-1 rounded-full shadow-lg shadow-amber-500/30">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" /></svg>
                  {t.rankBadge}
                </div>

                {/* Ratings overlay */}
                <div className="absolute right-0 top-4 flex items-center gap-2">
                  <div className="bg-white/8 backdrop-blur-md ring-1 ring-white/15 rounded-xl px-3 py-2">
                    <p className="text-[10px] text-emerald-100/60 font-bold uppercase tracking-wider">{t.annRating}</p>
                    <p className="text-base font-rubik font-black text-white flex items-center gap-1">
                      <svg viewBox="0 0 24 24" fill="#fbbf24" className="w-4 h-4"><path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" /></svg>
                      {featured.rating}
                    </p>
                  </div>
                  <span className="h-px w-10 bg-gradient-to-r from-white/40 to-transparent" />
                </div>

                {/* Score overlay */}
                <div className="absolute left-0 bottom-6 flex items-center gap-2">
                  <span className="h-px w-10 bg-gradient-to-l from-white/40 to-transparent order-2" />
                  <div className="bg-white/8 backdrop-blur-md ring-1 ring-white/15 rounded-xl px-3 py-2 order-1">
                    <p className="text-[10px] text-emerald-100/60 font-bold uppercase tracking-wider">{t.annScore}</p>
                    <p className="text-base font-rubik font-black text-emerald-300">{featured.score}/10</p>
                  </div>
                </div>

                {/* Floating cover cards — variety from each category */}
                {coverTiles.map((tile, i) => (
                  <div key={i} className={`absolute ${tile.pos} ${tile.size} ${tile.rot} rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-xl shadow-black/40 bg-white/5`}>
                    <Image src={tile.src} alt="" fill sizes="96px" className="object-cover" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
            )}
          </div>
      </section>

      {/* Stats Bar */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="group bg-white/85 backdrop-blur-sm p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-[#2d6a4f]/20 transition-all"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-green-50 to-emerald-100 text-[#2d6a4f] rounded-xl flex items-center justify-center ring-1 ring-green-100 group-hover:scale-105 transition-transform">
              {stat.icon}
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
              <p className="text-slate-900 font-rubik font-black text-base leading-tight mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </section>



      {/* Bestsellers Showcase Section (Tabs + 5 Column Grid) */}
      <section id="showcase" className="pt-4 border-t border-slate-100">
        <BestsellerTabs productsData={productsData} lang={lang} />
      </section>

      {/* Affiliate Disclaimer */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <div className="text-2xl">ℹ️</div>
        <div>
          <p className="text-slate-900 font-bold text-xs mb-0.5">{t.disclaimerTitle}</p>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            {t.disclaimerBody}
          </p>
        </div>
      </div>
    </div>
  );
}
