import type { Metadata } from "next";
import { Rubik, Nunito_Sans } from "next/font/google";
import "./globals.css";
import CategoryNav from "@/components/CategoryNav";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import Link from "next/link";
import Image from "next/image";
import { dict } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import LanguageToggle from "@/components/LanguageToggle";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-rubik",
});

const nunito = Nunito_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800", "900"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://shopee-ranking.vercel.app"),
  title: {
    default: "สินค้าขายดีใน Shopee 2026 — รวม Top 20 ทุกหมวด | ShopeeTop",
    template: "%s | ShopeeTop",
  },
  description:
    "รวมสินค้าขายดีใน Shopee ไทย Top 20 ทุกหมวด — เครื่องใช้ในบ้าน เสื้อผ้าแฟชั่นผู้หญิง สัตว์เลี้ยง อาหารและเครื่องดื่ม คัดจากยอดขายจริง รีวิวเยี่ยม อัพเดททุกเดือน",
  keywords: [
    "สินค้าขายดี shopee",
    "สินค้าขายดีใน shopee",
    "ของขายดี shopee",
    "shopee top 20",
    "สินค้าขายดีประจำเดือน",
    "ของดีราคาถูก shopee",
    "อันดับสินค้าขายดี",
    "shopee ขายดี 2026",
  ],
  alternates: { canonical: "/" },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "สินค้าขายดีใน Shopee 2026 — รวม Top 20 ทุกหมวด | ShopeeTop",
    description:
      "รวมสินค้าขายดีใน Shopee ไทย Top 20 ทุกหมวด คัดจากยอดขายจริง รีวิวเยี่ยม อัพเดททุกเดือน",
    locale: "th_TH",
    type: "website",
    siteName: "ShopeeTop",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "สินค้าขายดีใน Shopee 2026 — รวม Top 20 ทุกหมวด | ShopeeTop",
    description: "รวมสินค้าขายดีใน Shopee ไทย Top 20 ทุกหมวด อัพเดททุกเดือน",
    images: ["/og-image.png"],
  },
  verification: {
    google: "SiXVEETUtYE9N8rD_DShtamQLnIwHbVkfjaMAuspLN8",
  },
  other: {
    "google-adsense-account": "ca-pub-2859165380870012",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = await getLang();
  const t = dict[lang];
  return (
    <html lang={lang} className={`${rubik.variable} ${nunito.variable}`}>
      <body className={`${nunito.className} min-h-screen antialiased overflow-x-hidden`} style={{background: "var(--background)"}}>
        <header className="bg-white border-b border-gray-100">
          <div className="w-full px-5 sm:px-8 lg:px-12 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <Image src="/favicon.png" alt="ShopeeTop" width={44} height={44} priority className="w-11 h-11 object-contain group-hover:scale-105 transition-transform duration-200" />
              <div>
                <h1 className="font-rubik font-black text-2xl leading-none tracking-tight text-slate-900">ShopeeTop</h1>
                <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider mt-0.5">{t.brandTagline}</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 bg-green-50 text-[#2d6a4f] rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wide">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                {t.updateBadge}
              </div>
              <LanguageToggle lang={lang} />
            </div>
          </div>
        </header>
        <CategoryNav lang={lang} />
        <main className="w-full px-5 sm:px-8 lg:px-12 py-8">{children}</main>
        <footer className="bg-slate-900 text-slate-400 py-12 mt-12 w-full">
          <div className="w-full px-5 sm:px-8 lg:px-12 text-center">
            <Image src="/favicon.png" alt="ShopeeTop" width={56} height={56} className="w-14 h-14 object-contain mx-auto mb-4" />
            <h2 className="text-white font-rubik font-bold text-xl mb-2">ShopeeTop</h2>
            <p className="max-w-md mx-auto text-sm leading-relaxed mb-8">
              {t.footerTagline}
            </p>
            <div className="pt-8 border-t border-slate-800 text-[11px] uppercase tracking-widest font-bold">
              {t.footerCopyright}
            </div>
            <p className="mt-4 text-[10px] text-slate-500 px-6 italic">
              {t.footerAffiliate}
            </p>
          </div>
        </footer>
        <Analytics />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2859165380870012"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-TCKQT785RP"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TCKQT785RP');
          `}
        </Script>
      </body>
    </html>
  );
}
