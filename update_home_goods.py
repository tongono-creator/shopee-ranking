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
                # Convert price: Shopee API returns price * 100000
                price = item.get("price", 0) / 100000
                return {
                    "name": item["name"],
                    "image": f"https://down-th.img.susercontent.com/file/{item['image']}",
                    "shopeeUrl": f"https://shopee.co.th/product/{item['shopid']}/{item['itemid']}",
                    "price": price,
                    "sold": f"{item.get('historical_sold', 0) // 1000}k+" if item.get('historical_sold', 0) >= 1000 else str(item.get('historical_sold', 0)),
                    "rating": round(item.get("item_rating", {}).get("rating_star", 0), 1)
                }
            else:
                print(f"No items found for {keyword}")
        else:
            print(f"Error {response.status_code} for {keyword}")
    except Exception as e:
        print(f"Exception for {keyword}: {str(e)}")
    return None

# Load existing data to preserve structure
with open("data/products/home-goods.json", "r", encoding="utf-8") as f:
    existing_data = json.load(f)

# Keywords to search based on existing items and new research
search_keywords = [
    "Xiaomi Vacuum Cleaner เครื่องดูดฝุ่นไร้สาย",
    "Xiaomi Air Purifier 4 Compact เครื่องฟอกอากาศ",
    "Simplus Air Fryer 5L หม้อทอดไร้น้ำมัน",
    "Spin Mop ไม้ถูพื้นถังปั่นสแตนเลส",
    "HomeHuk กล่องเก็บของอเนกประสงค์",
    "วอลเปเปอร์ 3D ลายอิฐ",
    "เครื่องสับอาหารไฟฟ้า Food Chopper 2L",
    "กาต้มน้ำไฟฟ้า 1.8L Electric Kettle",
    "Xiaomi Robot Vacuum หุ่นยนต์ดูดฝุ่น",
    "เครื่องรีดผ้าไอน้ำแบบพกพา Garment Steamer"
]

new_products = []
for i, kw in enumerate(search_keywords):
    print(f"Fetching data for: {kw}")
    data = get_shopee_data(kw)
    if data:
        # Use existing structure and merge with new data
        item = existing_data[i].copy()
        item["name"] = data["name"]
        item["image"] = data["image"]
        item["shopeeUrl"] = data["shopeeUrl"]
        item["price"] = int(data["price"])
        item["sold"] = data["sold"]
        item["rating"] = data["rating"]
        # Update discount if price changed (simplified)
        if item.get("originalPrice") and item["originalPrice"] > item["price"]:
            item["discount"] = int((1 - item["price"] / item["originalPrice"]) * 100)
        
        new_products.append(item)
    else:
        # Keep old one if not found (optional, but let's try to find them)
        new_products.append(existing_data[i])
    time.sleep(1)

with open("data/products/home-goods.json", "w", encoding="utf-8") as f:
    json.dump(new_products, f, ensure_ascii=False, indent=2)

print("Updated data/products/home-goods.json successfully.")
