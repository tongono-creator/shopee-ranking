import Link from "next/link";
import { categories } from "@/data/categories";
import { getProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default async function HomePage() {
  const bestsellers = await getProducts("bestsellers");

  return (
    <div className="space-y-10">
      {/* Hero */}
      <div
        className="rounded-2xl p-6 text-white"
        style={{ background: "linear-gradient(135deg, #1b4332 0%, #40916c 100%)" }}
      >
        <p className="text-green-200 text-sm font-medium mb-1">🔥 อัพเดทเดือนพฤษภาคม 2026</p>
        <h2 className="text-2xl font-black leading-tight mb-2">
          Top 10 สินค้าขายดี<br />บน Shopee ไทย
        </h2>
        <p className="text-green-100 text-sm">
          คัดมาแล้ว · ราคาดี · ส่งเร็ว · รีวิวจริง
        </p>
      </div>

      {/* Bestsellers preview */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
            🔥 ขายดีประจำเดือน
          </h2>
          <Link
            href="/bestsellers"
            className="text-[#2d6a4f] text-sm font-semibold hover:underline"
          >
            ดูทั้งหมด 10 อันดับ →
          </Link>
        </div>
        <div className="space-y-3">
          {bestsellers.slice(0, 3).map((product) => (
            <ProductCard key={product.rank} product={product} />
          ))}
        </div>
        <Link
          href="/bestsellers"
          className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-[#2d6a4f] text-[#2d6a4f] font-semibold hover:bg-[#d8f3dc] transition-colors"
        >
          ดูครบ 10 อันดับ →
        </Link>
      </section>

      {/* Categories grid */}
      <section>
        <h2 className="text-lg font-black text-gray-900 mb-4">หมวดหมู่ทั้งหมด</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="group bg-white rounded-2xl p-4 border border-gray-100 hover:border-[#52b788] hover:shadow-md transition-all text-center"
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <p className="font-bold text-gray-800 text-sm group-hover:text-[#2d6a4f] transition-colors leading-snug">
                {cat.name}
              </p>
              <p className="text-xs text-gray-400 mt-1">Top 10</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Affiliate disclaimer */}
      <div className="bg-[#f0faf3] border border-[#d8f3dc] rounded-xl px-4 py-3 text-xs text-[#40916c]">
        <span className="font-semibold">หมายเหตุ:</span> เว็บนี้มีลิงก์ affiliate จาก Shopee — เมื่อซื้อผ่านลิงก์นี้ เราได้รับค่าคอมมิชชั่นเล็กน้อยโดยไม่มีผลต่อราคาที่คุณจ่าย
      </div>
    </div>
  );
}
