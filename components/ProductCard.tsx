import { Product } from "@/lib/products";
import Image from "next/image";

const rankColors: Record<number, string> = {
  1: "bg-yellow-400 text-yellow-900",
  2: "bg-gray-300 text-gray-700",
  3: "bg-amber-600 text-white",
};

const rankBg: Record<number, string> = {
  1: "border-yellow-300 bg-gradient-to-r from-yellow-50 to-white",
  2: "border-gray-200 bg-gradient-to-r from-gray-50 to-white",
  3: "border-amber-200 bg-gradient-to-r from-amber-50 to-white",
};

export default function ProductCard({ product }: { product: Product }) {
  const rankColorClass = rankColors[product.rank] ?? "bg-[#2d6a4f] text-white";
  const rankBgClass = rankBg[product.rank] ?? "border-gray-100 bg-white";

  return (
    <div className={`rounded-2xl border-2 ${rankBgClass} overflow-hidden shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex gap-0">
        {/* Rank column */}
        <div className="flex flex-col items-center justify-start pt-5 px-4 min-w-[60px]">
          <span className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${rankColorClass}`}>
            {product.rank}
          </span>
          {product.rank <= 3 && (
            <span className="text-xs text-gray-400 mt-1">
              {product.rank === 1 ? "อันดับ 1" : product.rank === 2 ? "อันดับ 2" : "อันดับ 3"}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 py-5 pr-4">
          {/* Top: image + info */}
          <div className="flex gap-4">
            {/* Image */}
            <div className="relative flex-shrink-0 w-28 h-28 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="112px"
              />
              {product.highlight && (
                <div className="absolute bottom-0 left-0 right-0 bg-[#2d6a4f] text-white text-[10px] text-center py-0.5 font-medium">
                  {product.highlight}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              {/* Score badge */}
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 bg-[#2d6a4f] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  <span className="text-[10px]">คะแนน</span>
                  <span className="text-sm">{product.score}</span>
                  <span className="text-[10px] opacity-75">/10</span>
                </span>
                <span className="text-xs text-gray-400">⭐ {product.rating} · ขายแล้ว {product.sold}</span>
              </div>

              <h3 className="font-bold text-gray-900 leading-snug line-clamp-2 text-[15px]">
                {product.name}
              </h3>

              <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                {product.reason}
              </p>
            </div>
          </div>

          {/* Pros */}
          {product.pros?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {product.pros.map((pro, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-xs text-[#2d6a4f] bg-[#d8f3dc] px-2.5 py-1 rounded-full font-medium"
                >
                  <span>✓</span> {pro}
                </span>
              ))}
            </div>
          )}

          {/* Price + CTA */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-[#2d6a4f]">
                ฿{product.price.toLocaleString()}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    ฿{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-md">
                    -{product.discount}%
                  </span>
                </>
              )}
            </div>
            <a
              href={product.shopeeUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="flex items-center gap-2 bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors"
            >
              <span>🛒</span>
              <span>ดูราคา Shopee</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
