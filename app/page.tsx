import Link from "next/link";
import { categories } from "@/data/categories";
import { getProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default async function HomePage() {
  const bestsellers = await getProducts("bestsellers");

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1b4332] via-[#2d6a4f] to-[#52b788] p-8 sm:p-12 text-white min-h-[300px] flex items-center shadow-2xl shadow-green-100">
        {/* Decorative Patterns */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-green-400/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 grid sm:grid-cols-2 gap-8 items-center w-full">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest mb-4">
              <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
              อัพเดทพฤษภาคม 2026
            </div>
            <h1 className="text-4xl sm:text-5xl font-rubik font-black leading-[1.1] mb-6 tracking-tight">
              เจาะลึก <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-100">Shopee Top 20</span> สินค้าขายดีที่สุด
            </h1>
            <p className="text-green-50/80 text-lg font-medium mb-8 max-w-md leading-relaxed">
              เรารวบรวมข้อมูลยอดขายจริงจาก Shopee คัดสรรเฉพาะของดี รีวิวเยี่ยม มาให้คุณตัดสินใจง่ายๆ ในที่เดียว
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#bestsellers" className="bg-[#f97316] hover:bg-[#ea6c0a] text-white font-rubik font-black px-8 py-4 rounded-2xl shadow-lg shadow-orange-900/20 transition-all hover:-translate-y-1 active:translate-y-0">
                🚀 ดูสินค้าแนะนำ
              </a>
            </div>
          </div>
          <div className="hidden sm:flex justify-center relative">
            <div className="text-[180px] leading-none select-none drop-shadow-2xl animate-bounce-slow">
              🏆
            </div>
            <div className="absolute inset-0 bg-green-400/20 blur-[100px] rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: "📦", label: "หมวดหมู่ยอดฮิต", value: "6 หมวดหมู่" },
          { icon: "✨", label: "สินค้าที่ผ่านการคัดเลือก", value: "120+ รายการ" },
          { icon: "✅", label: "อัพเดทข้อมูลล่าสุด", value: "อัพเดทสม่ำเสมอ" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl">
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
              <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300 transform-gpu">{cat.icon}</div>
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
