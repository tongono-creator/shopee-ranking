"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdBanner() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // adsbygoogle not loaded yet
    }
  }, []);

  return (
    <div className="my-3 overflow-hidden rounded-xl">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-2859165380870012"
        data-ad-slot="3781026583"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
