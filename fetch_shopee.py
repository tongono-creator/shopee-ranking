import requests
import json
import time
import urllib.parse

def get_shopee_data(keyword):
    encoded_kw = urllib.parse.quote(keyword)
    url = f"https://shopee.co.th/api/v4/search/search_items?by=relevancy&keyword={encoded_kw}&limit=1&newest=0&order=desc&page_type=search&scenario=PAGE_GLOBAL_SEARCH&version=2"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": f"https://shopee.co.th/search?keyword={encoded_kw}",
        "x-api-source": "pc",
        "x-shopee-language": "th",
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("items"):
                item = data["items"][0]["item_basic"]
                return {
                    "name": item["name"],
                    "image": f"https://down-th.img.susercontent.com/file/{item['image']}",
                    "shopid": item["shopid"],
                    "itemid": item["itemid"],
                    "price": item["price"] / 100000 if "price" in item else 0
                }
            else:
                print(f"No items found for {keyword}: {data}")
        else:
            print(f"Error {response.status_code} for {keyword}: {response.text}")
    except Exception as e:
        print(f"Exception for {keyword}: {str(e)}")
    return None

keywords = {
    "home-goods": [
        "Xiaomi Vacuum P30 Wireless เครื่องดูดฝุ่นไร้สาย",
        "Xiaomi Air Purifier 4 Compact เครื่องฟอกอากาศ",
        "Simplus Air Fryer 5L หม้อทอดไร้น้ำมันมีหน้าต่าง",
        "Spin Mop ไม้ถูพื้นระบบปั่น ถังสเตนเลส",
        "กล่องเก็บของ modular storage",
        "วอลเปเปอร์ 3D ลายอิฐโฟม ติดผนัง self-adhesive",
        "เครื่องสับอาหารไฟฟ้า food chopper 2L",
        "กาต้มน้ำไฟฟ้ากระจก 1.8L glass kettle",
        "Xiaomi Robot Vacuum S40 Pro หุ่นยนต์ดูดฝุ่น",
        "เครื่องรีดผ้าไอน้ำแบบถือ garment steamer"
    ],
    "women-fashion": [
        "ชุดเดรสยาวลายดอก maxi dress",
        "กางเกงช้างไทย elephant pants",
        "Yuedpao เสื้อ oversized cotton",
        "กางเกง linen balloon pants",
        "Gentlewoman canvas tote bag",
        "เสื้อลูกไม้ lace blouse ฝรั่งเศส",
        "กางเกงยีนส์ขาบาน high waist wide leg",
        "ชุด co-ord set linen",
        "รองเท้าแตะ platform chunky beige",
        "เสื้อกันหนาว cropped cardigan macaron"
    ],
    "food-drinks": [
        "ชาตราตรึงค์ ชาไทย 500g",
        "Ensure Gold อาหารเสริม",
        "เลอรส ก๋วยเตี๋ยวเรือ instant",
        "pistachio butter spread no sugar",
        "Samyang Buldak ramen",
        "ทุเรียนอบกรอบ freeze-dried durian 100g",
        "ผงมัทฉะ matcha uji ceremonial grade",
        "Oishi Green Tea 1.5L x6",
        "แม่ประนอม น้ำพริกเผา 513g",
        "ขนมเผือก taro sticks กรอบ"
    ]
}

results = {}
for cat, list_kw in keywords.items():
    results[cat] = []
    for kw in list_kw:
        print(f"Fetching {kw}...")
        data = get_shopee_data(kw)
        if data:
            results[cat].append(data)
        time.sleep(2) # Avoid aggressive rate limiting

with open("shopee_results.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("Done!")
