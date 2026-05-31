import { Product } from "@/lib/products";

const rankBadges: Record<number, string> = {
  1: "bg-gradient-to-br from-amber-300 to-amber-500 text-amber-900",
  2: "bg-gradient-to-br from-slate-200 to-slate-400 text-slate-700",
  3: "bg-gradient-to-br from-orange-200 to-orange-400 text-orange-900",
};

const cardAccents: Record<number, string> = {
  1: "ring-2 ring-amber-300",
  2: "ring-2 ring-slate-300",
  3: "ring-2 ring-orange-300",
};

export default function ProductCard({ product }: { product: Product }) {
  const badgeClass = rankBadges[product.rank] || "bg-slate-800 text-white";
  const accentClass = cardAccents[product.rank] || "";

  return (
    <div className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ${accentClass}`}>
      {/* IMAGE - large, full width, square */}
      <div className="relative w-full aspect-square overflow-hidden bg-slate-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        {/* Rank badge - top left */}
        <div className={`absolute top-2 left-2 w-9 h-9 rounded-full flex items-center justify-center font-rubik font-black text-base shadow-lg ${badgeClass}`}>
          {product.rank}
        </div>
        {/* Score badge - top right */}
        <div className="absolute top-2 right-2 bg-[#2d6a4f] text-white text-[10px] font-black px-2 py-1 rounded-full shadow">
          {product.score}/10
        </div>
        {/* Highlight badge */}
        {product.highlight && (
          <div className="absolute bottom-0 left-0 right-0 bg-[#f97316] text-white text-[10px] font-black text-center py-1.5 uppercase tracking-wider">
            {product.highlight}
          </div>
        )}
        {/* Discount badge */}
        {product.discount > 0 && (
          <div className="absolute bottom-0 right-2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-t-lg">
            -{product.discount}%
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-3 flex flex-col gap-2">
        {/* Rating + sold */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold">
          <span className="text-amber-400">⭐</span>
          <span>{product.rating}</span>
          <span className="text-slate-200">|</span>
          <span>ขายแล้ว {product.sold}</span>
        </div>

        {/* Name */}
        <h3 className="font-rubik font-bold text-slate-900 text-[13px] leading-snug line-clamp-2 group-hover:text-[#2d6a4f] transition-colors min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="font-rubik font-black text-lg text-slate-900">฿{product.price.toLocaleString()}</span>
          {product.originalPrice > product.price && (
            <span className="text-[11px] line-through text-slate-400">฿{product.originalPrice.toLocaleString()}</span>
          )}
        </div>

        {/* CTA */}
        <div className="flex gap-2 mt-1">
          <a
            href={product.shopeeUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex-1 flex items-center justify-center gap-1 bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-semibold text-[11px] py-2 rounded-lg transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            Shopee
          </a>
          {product.lazadaUrl && (
            <a
              href={product.lazadaUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="flex-1 flex items-center justify-center text-[11px] font-semibold py-2 rounded-lg border border-slate-200 text-slate-600 hover:border-slate-400 transition-colors"
            >
              Lazada
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
