"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function LanguageToggle({ lang }: { lang: "th" | "en" }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const setLang = (next: "th" | "en") => {
    if (next === lang) return;
    document.cookie = `lang=${next}; path=/; max-age=31536000`;
    startTransition(() => router.refresh());
  };

  return (
    <div
      className={`inline-flex items-center rounded-full bg-gray-100 p-0.5 text-xs font-bold ${
        isPending ? "opacity-60" : ""
      }`}
    >
      {(["th", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`px-2.5 py-1 rounded-full uppercase tracking-wide transition-colors cursor-pointer ${
            lang === l
              ? "bg-[#2d6a4f] text-white shadow-sm"
              : "text-slate-500 hover:text-[#2d6a4f]"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
