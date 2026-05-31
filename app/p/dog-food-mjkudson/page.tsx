import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MJ.Kudson อาหารสุนัขพรีเมียมสูตรแกะ — ลดขนร่วง ลดคราบน้ำตา",
  description: "อาหารสุนัขพรีเมียมสูตรแกะ ลดขนร่วง ลดคราบน้ำตา ลดกลิ่นมูล ทานได้ทุกสายพันธุ์ ราคา 542 บาท",
  openGraph: {
    title: "MJ.Kudson อาหารสุนัขพรีเมียมสูตรแกะ",
    description: "ลดขนร่วง ลดคราบน้ำตา ลดกลิ่นมูล ราคา 542 บาท",
    images: [{ url: "https://i.ibb.co/prWVXCPG/9eafb2b1cd3f.jpg", width: 1080, height: 1080 }],
    type: "website",
    locale: "th_TH",
  },
};

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <p className="text-slate-500 mb-6">กำลังพาไปที่ Shopee...</p>
      <a
        href="https://s.shopee.co.th/2BC8LHMRmu"
        className="bg-[#ee4d2d] text-white font-bold px-8 py-4 rounded-2xl text-lg hover:bg-[#d73211] transition-colors"
      >
        กดที่นี่ถ้าไม่ redirect อัตโนมัติ →
      </a>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace("https://s.shopee.co.th/2BC8LHMRmu");`,
        }}
      />
    </div>
  );
}
