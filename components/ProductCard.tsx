import { Product } from "@/lib/products";

const rankAccents: Record<number, string> = {
  1: "border-l-[6px] border-l-amber-400",
  2: "border-l-[6px] border-l-slate-300",
  3: "border-l-[6px] border-l-orange-300",
};

const rankBadges: Record<number, string> = {
  1: "bg-gradient-to-br from-amber-300 to-amber-500 text-amber-900",
  2: "bg-gradient-to-br from-slate-200 to-slate-400 text-slate-800",
  3: "bg-gradient-to-br from-orange-200 to-orange-400 text-orange-900",
};

export default function ProductCard({ product }: { product: Product }) {
  const accentClass = rankAccents[product.rank] || "border-l-transparent";
  const badgeClass = rankBadges[product.rank] || "bg-slate-800 text-white";

  return (
    <div className={`group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden ${accentClass}`}>
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        {/* Image Container */}
        <div className="relative flex-shrink-0">
          <div className="w-full sm:w-40 h-48 sm:h-40 rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
          
          {/* Rank Badge Overlay */}
          <div className={`absolute -top-2 -left-2 w-10 h-10 rounded-full flex items-center justify-center font-rubik font-black text-lg shadow-lg z-10 ${badgeClass}`}>
            {product.rank}
          </div>

          {product.highlight && (
            <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm text-[#2d6a4f] text-[10px] font-black uppercase tracking-wider text-center py-1 rounded-lg border border-green-100 shadow-sm">
              {product.highlight}
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Row: Score & Rating */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 bg-green-50 text-[#2d6a4f] px-2.5 py-1 rounded-full border border-green-100">
              <span className="text-[10px] font-black uppercase tracking-tighter">Score</span>
              <span className="font-rubik font-black text-sm">{product.score}</span>
              <span className="text-[10px] opacity-60 font-bold">/10</span>
            </div>
            <div className="flex items-center gap-2 text-[13px] font-bold text-slate-400">
              <span className="flex items-center gap-0.5 text-amber-400">⭐ {product.rating}</span>
              <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
              <span>ขายแล้ว {product.sold}</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-rubik font-bold text-slate-900 leading-snug line-clamp-2 text-[17px] group-hover:text-[#2d6a4f] transition-colors mb-2">
            {product.name}
          </h3>

          {/* Price Section */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-rubik font-black text-slate-900 tracking-tight">
              ฿{product.price.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-sm line-through text-slate-400 font-semibold">
                  ฿{product.originalPrice.toLocaleString()}
                </span>
                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-md font-black uppercase tracking-wider">
                  -{product.discount}%
                </span>
              </>
            )}
          </div>

          {/* Pros Chips */}
          {product.pros?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {product.pros.map((pro, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2d6a4f] bg-green-50/50 px-2 py-1 rounded-lg border border-green-100/50"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                  {pro}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-auto flex gap-3">
            <a
              href={product.shopeeUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="flex-1 flex items-center justify-center gap-2 bg-[#f97316] hover:bg-[#ea6c0a] text-white font-rubik font-black text-sm px-4 py-3 rounded-xl shadow-lg shadow-orange-100 transition-all active:scale-[0.98]"
            >
              <span>🛒</span>
              <span>ไปที่ Shopee</span>
            </a>
            {product.lazadaUrl && (
              <a
                href={product.lazadaUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="w-14 sm:w-auto sm:px-4 flex items-center justify-center gap-2 bg-[#0f1923] hover:bg-[#1a2530] text-white font-rubik font-black text-sm py-3 rounded-xl transition-all active:scale-[0.98]"
                title="Lazada"
              >
                <span>🛍️</span>
                <span className="hidden sm:inline">Lazada</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
