export const categories = [
  {
    slug: "bestsellers",
    name: "สินค้าขายดี",
    icon: "🔥",
    image: "/icons/bestsellers.png",
    description: "Top 20 สินค้าขายดีที่สุดบน Shopee ประจำเดือนนี้",
  },
  {
    slug: "home-goods",
    name: "เครื่องใช้ในบ้าน",
    icon: "🏠",
    image: "/icons/home-goods.png",
    description: "Top 20 เครื่องใช้ในบ้านยอดนิยม",
  },
  {
    slug: "women-fashion",
    name: "เสื้อผ้าแฟชั่นผู้หญิง",
    icon: "👗",
    image: "/icons/women-fashion.png",
    description: "Top 20 แฟชั่นผู้หญิงที่กำลังมาแรง",
  },
  {
    slug: "pets",
    name: "สัตว์เลี้ยง",
    icon: "🐾",
    image: "/icons/pets.png",
    description: "Top 20 สินค้าสัตว์เลี้ยงขายดี",
  },
  {
    slug: "food-drinks",
    name: "อาหารและเครื่องดื่ม",
    icon: "🍜",
    image: "/icons/food-drinks.png",
    description: "Top 20 อาหารและเครื่องดื่มยอดฮิต",
  },
  {
    slug: "home-appliances",
    name: "เครื่องใช้ไฟฟ้าภายในบ้าน",
    icon: "⚡",
    image: "/icons/home-appliances.png",
    description: "Top 20 เครื่องใช้ไฟฟ้าขายดีที่สุด",
  },
];

export type Category = (typeof categories)[number];
