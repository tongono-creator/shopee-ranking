"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories } from "@/data/categories";

export default function CategoryNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-1 overflow-x-auto py-2.5 scrollbar-hide">
          <Link
            href="/"
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              pathname === "/"
                ? "bg-[#2d6a4f] text-white"
                : "text-gray-600 hover:bg-[#d8f3dc] hover:text-[#2d6a4f]"
            }`}
          >
            หน้าแรก
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className={`flex-shrink-0 px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                pathname === `/${cat.slug}`
                  ? "bg-[#2d6a4f] text-white"
                  : "text-gray-600 hover:bg-[#d8f3dc] hover:text-[#2d6a4f]"
              }`}
            >
              {cat.icon} {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
