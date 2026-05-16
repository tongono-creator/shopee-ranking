import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import CategoryNav from "@/components/CategoryNav";

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Top 10 Shopee ไทย — สินค้าขายดีอันดับ 1",
  description:
    "รวม Top 10 สินค้าขายดีบน Shopee ไทย แยกตามหมวดหมู่ อัพเดทรายเดือน",
  keywords: "shopee, สินค้าขายดี, top10, ของดีราคาถูก",
  openGraph: {
    title: "Top 10 Shopee ไทย",
    description: "รวมสินค้าขายดีบน Shopee อัพเดทรายเดือน",
    locale: "th_TH",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className={`${notoSansThai.className} min-h-screen`} style={{background: "var(--background)"}}>
        <header style={{background: "linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)"}} className="text-white py-4 shadow-md">
          <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">
                🏆
              </div>
              <div>
                <h1 className="font-black text-xl leading-tight tracking-tight">Top 10 Shopee ไทย</h1>
                <p className="text-green-200 text-xs font-medium">รวมสินค้าขายดี · อัพเดทรายเดือน</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1 bg-white/10 rounded-full px-3 py-1.5 text-xs text-green-100">
              <span>🔄</span>
              <span>อัพเดทล่าสุด: พฤษภาคม 2026</span>
            </div>
          </div>
        </header>
        <CategoryNav />
        <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
        <footer className="text-center text-gray-400 text-xs py-8 mt-8 border-t">
          <p>เว็บนี้มีลิงก์ affiliate จาก Shopee — เมื่อซื้อสินค้าผ่านลิงก์นี้ เราจะได้รับค่าคอมมิชชั่นเล็กน้อย</p>
        </footer>
      </body>
    </html>
  );
}
