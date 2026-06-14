import Link from "next/link";
import { Product, productSlug } from "@/lib/products";
import { Lang } from "@/lib/i18n";

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

const getHighlightText = (highlight: string, lang: Lang) => {
  if (lang !== "en") return highlight;
  if (highlight === "ขายดีที่สุด") return "Best Seller";
  if (highlight === "แนะนำ") return "Recommended";
  if (highlight === "ยอดฮิต") return "Trending";
  return highlight;
};

export default function ProductCard({
  product,
  lang = "th",
  category,
}: {
  product: Product;
  lang?: Lang;
  category?: string;
}) {
  const badgeClass = rankBadges[product.rank] || "bg-slate-800 text-white";
  const accentClass = cardAccents[product.rank] || "";
  const displayHighlight = getHighlightText(product.highlight, lang);
  // Link to the in-depth review page only when this product has synthesized review data.
  const hasReview = Boolean(category && product.model);
  const reviewHref = hasReview ? `/review/${category}/${productSlug(product)}` : null;

  return (
    <div className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ${accentClass}`}>
      {/* IMAGE - large, full width, square */}
      <a href={product.shopeeUrl} target="_blank" rel="noopener noreferrer sponsored" className="relative block w-full aspect-square overflow-hidden bg-slate-50/50 p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
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
        {displayHighlight && (
          <div className="absolute bottom-0 left-0 right-0 bg-[#f97316] text-white text-[10px] font-black text-center py-1.5 uppercase tracking-wider">
            {displayHighlight}
          </div>
        )}
        {/* Discount badge */}
        {product.discount > 0 && (
          <div className="absolute bottom-0 right-2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-t-lg">
            -{product.discount}%
          </div>
        )}
      </a>

      {/* CONTENT */}
      <div className="p-3 flex flex-col gap-2">
        {/* Rating + sold */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold">
          <span className="text-amber-400">⭐</span>
          <span>{product.rating}</span>
          <span className="text-slate-200">|</span>
          <span>{lang === "en" ? "Sold" : "ขายแล้ว"} {product.sold}</span>
        </div>

        {/* Name */}
        <h3 className="font-rubik font-bold text-slate-900 text-[13px] leading-snug line-clamp-1 group-hover:text-[#2d6a4f] transition-colors">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="font-rubik font-black text-lg text-slate-900">฿{product.price.toLocaleString()}</span>
          {product.originalPrice > product.price && (
            <span className="text-[11px] line-through text-slate-400">฿{product.originalPrice.toLocaleString()}</span>
          )}
        </div>

        {/* Review link (review-site categories only) */}
        {reviewHref && (
          <Link
            href={reviewHref}
            className="w-full flex items-center justify-center text-[11px] font-bold py-2 rounded-lg bg-[#2d6a4f] text-white hover:bg-[#245741] transition-colors mt-1"
          >
            {lang === "en" ? "Read review →" : "อ่านรีวิวเต็ม →"}
          </Link>
        )}

        {/* CTA */}
        {product.lazadaUrl && (
          <a
            href={product.lazadaUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="w-full flex items-center justify-center text-[11px] font-semibold py-2 rounded-lg border border-slate-200 text-slate-600 hover:border-slate-400 transition-colors mt-1"
          >
            Lazada
          </a>
        )}
      </div>
    </div>
  );
}
