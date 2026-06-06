"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { categories } from "@/data/categories";

export default function CategoryNav({ lang = "th" }: { lang?: "th" | "en" }) {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="w-full px-5 sm:px-8 lg:px-12">
        <div className="flex items-center gap-1 overflow-x-auto py-2.5 scrollbar-hide" style={{WebkitOverflowScrolling: "touch", overflowX: "scroll"}}>
          <Link
            href="/"
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              pathname === "/"
                ? "bg-[#2d6a4f] text-white"
                : "text-gray-600 hover:bg-[#d8f3dc] hover:text-[#2d6a4f]"
            }`}
          >
            {lang === "en" ? "Home" : "หน้าแรก"}
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className={`flex-shrink-0 flex items-center gap-1.5 pl-1.5 pr-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                pathname === `/${cat.slug}`
                  ? "bg-[#2d6a4f] text-white"
                  : "text-gray-600 hover:bg-[#d8f3dc] hover:text-[#2d6a4f]"
              }`}
            >
              <Image src={cat.image} alt="" width={22} height={22} className="w-[22px] h-[22px] object-contain" />
              {lang === "en" ? cat.nameEn : cat.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
