export const categories = [
  {
    slug: "bestsellers",
    name: "สินค้าขายดีประจำเดือนนี้",
    icon: "🔥",
    description: "Top 10 สินค้าขายดีที่สุดบน Shopee ประจำเดือนนี้",
  },
  {
    slug: "home-goods",
    name: "เครื่องใช้ในบ้าน",
    icon: "🏠",
    description: "Top 10 เครื่องใช้ในบ้านยอดนิยม",
  },
  {
    slug: "women-fashion",
    name: "เสื้อผ้าแฟชั่นผู้หญิง",
    icon: "👗",
    description: "Top 10 แฟชั่นผู้หญิงที่กำลังมาแรง",
  },
  {
    slug: "pets",
    name: "สัตว์เลี้ยง",
    icon: "🐾",
    description: "Top 10 สินค้าสัตว์เลี้ยงขายดี",
  },
  {
    slug: "food-drinks",
    name: "อาหารและเครื่องดื่ม",
    icon: "🍜",
    description: "Top 10 อาหารและเครื่องดื่มยอดฮิต",
  },
  {
    slug: "home-appliances",
    name: "เครื่องใช้ไฟฟ้าภายในบ้าน",
    icon: "⚡",
    description: "Top 10 เครื่องใช้ไฟฟ้าขายดีที่สุด",
  },
];

export type Category = (typeof categories)[number];
