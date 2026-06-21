export type Lang = "th" | "en";

export const dict = {
  th: {
    brandTagline: "Premium Ranking Hub",
    updateBadge: "อัพเดท: พฤษภาคม 2026",
    navHome: "หน้าแรก",

    categoryTitlePrefix: "Top 20",
    categoryTitleSuffix: "บน Shopee ไทย",
    curatedBadgeLine1: "รายการสินค้า",
    curatedBadgeLine2: "ที่คัดสรรแล้ว",
    emptyCategoryTitle: "ยังไม่มีข้อมูลสินค้า",
    emptyCategorySubtitle: "เรากำลังรวบรวมข้อมูลและจะอัพเดทให้เร็วๆ นี้",
    soldText: "ขายแล้ว",

    heroBadge: "อัพเดทพฤษภาคม 2026",
    heroTitle1: "สินค้าขายดี",
    heroTitle2: "ตัวจริงเสียงจริง",
    heroSubtitle:
      "รวมอันดับ Top 20 จากยอดขายจริงทุกหมวด คัดเฉพาะของดี รีวิวเยี่ยม ในที่เดียว",
    heroCtaPrimary: "ดูสินค้าแนะนำ",
    heroCtaSecondary: "ดู 20 อันดับ",
    trustProducts: "สินค้าคัดสรร",
    trustCategories: "หมวดหมู่",
    trustRating: "เรตติ้งเฉลี่ย",
    annRating: "เรตติ้ง",
    annScore: "คะแนนรวม",
    rankBadge: "อันดับ 1",

    statCategoriesLabel: "หมวดหมู่ยอดฮิต",
    statCategoriesValue: "8 หมวดหมู่",
    statProductsLabel: "สินค้าที่ผ่านการคัดเลือก",
    statProductsValue: "160+ รายการ",
    statUpdateLabel: "อัพเดทข้อมูลล่าสุด",
    statUpdateValue: "อัพเดทสม่ำเสมอ",

    catSectionTitle: "เลือกหมวดหมู่ที่น่าสนใจ",
    catSectionSubtitle: "ค้นหาอันดับสินค้าขายดีในหมวดหมู่ที่คุณต้องการ",
    catTop20: "Top 20 →",

    bestTitle: "สินค้าขายดีประจำเดือน",
    bestSeeAll: "ดูทั้งหมด 20 อันดับ",
    bestViewMore: "เปิดดูอันดับที่ 4 - 20 ต่อ",

    disclaimerTitle: "ประกาศเกี่ยวกับการแนะนำสินค้า",
    disclaimerBody:
      "เนื้อหาในหน้านี้ถูกสร้างขึ้นเพื่อแนะนำสินค้าคุณภาพบน Shopee เท่านั้น เว็บไซต์ของเรามีการใช้ลิงก์ Affiliate ซึ่งอาจทำให้เราได้รับค่าตอบแทนเล็กน้อยหากมีการสั่งซื้อผ่านลิงก์ โดยไม่มีการบวกราคาเพิ่มใดๆ กับผู้ซื้อ",

    footerTagline:
      "รวบรวมและคัดสรรสินค้าคุณภาพที่มียอดขายสูงสุดบน Shopee ไทย เพื่อช่วยให้คุณตัดสินใจเลือกซื้อสินค้าที่ดีที่สุดได้อย่างมั่นใจ",
    footerCopyright: "© 2026 SHOPEETOP. ALL RIGHTS RESERVED.",
    footerAffiliate:
      "* เว็บนี้มีลิงก์ affiliate จาก Shopee — เมื่อคุณซื้อสินค้าผ่านลิงก์นี้ เราจะได้รับค่าคอมมิชชั่นเล็กน้อยโดยไม่มีผลต่อราคาสินค้า",
  },
  en: {
    brandTagline: "Premium Ranking Hub",
    updateBadge: "Updated: May 2026",
    navHome: "Home",

    categoryTitlePrefix: "Top 20 Best",
    categoryTitleSuffix: "on Shopee Thailand",
    curatedBadgeLine1: "Curated",
    curatedBadgeLine2: "Products",
    emptyCategoryTitle: "No Products Found",
    emptyCategorySubtitle: "We are currently curating the products. Please check back soon!",
    soldText: "Sold",

    heroBadge: "Updated May 2026",
    heroTitle1: "Best Sellers",
    heroTitle2: "The Real Deal",
    heroSubtitle:
      "The Top 20 from real sales across every category — only the best, top-rated picks, all in one place.",
    heroCtaPrimary: "View Picks",
    heroCtaSecondary: "See Top 20",
    trustProducts: "Curated",
    trustCategories: "Categories",
    trustRating: "Avg Rating",
    annRating: "Rating",
    annScore: "Score",
    rankBadge: "Rank 1",

    statCategoriesLabel: "Popular Categories",
    statCategoriesValue: "8 Categories",
    statProductsLabel: "Curated Products",
    statProductsValue: "160+ items",
    statUpdateLabel: "Latest Update",
    statUpdateValue: "Always Fresh",

    catSectionTitle: "Browse Categories",
    catSectionSubtitle: "Find the best-selling products in the category you want",
    catTop20: "Top 20 →",

    bestTitle: "This Month's Best Sellers",
    bestSeeAll: "See all 20 ranks",
    bestViewMore: "View ranks 4 – 20",

    disclaimerTitle: "Product recommendation notice",
    disclaimerBody:
      "This page recommends quality products on Shopee. We use affiliate links and may earn a small commission on purchases made through them — at no extra cost to you.",

    footerTagline:
      "We curate the highest-selling quality products on Shopee Thailand to help you confidently choose the best.",
    footerCopyright: "© 2026 SHOPEETOP. ALL RIGHTS RESERVED.",
    footerAffiliate:
      "* This site uses Shopee affiliate links — when you buy through them we earn a small commission at no extra cost to you.",
  },
} as const;

export type Dict = (typeof dict)["th"];
