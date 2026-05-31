import json
import random
import string
import urllib.parse
from curl_cffi import requests

def generate_spc_f():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=32))

def get_top_products(cat_id, name):
    print(f"\nFetching Top 10 for: {name} (ID: {cat_id})")
    
    # Use search API with category filter and sales sorting
    url = f"https://shopee.co.th/api/v4/search/search_items?by=sales&categoryids={cat_id}&limit=10&newest=0&order=desc&page_type=search&scenario=PAGE_OTHERS&version=2"
    
    if cat_id == "overall":
        # For overall bestsellers, use a general keyword or just empty
        url = "https://shopee.co.th/api/v4/search/search_items?by=sales&keyword=%E0%B8%82%E0%B8%B2%E0%B8%A2%E0%B8%94%E0%B8%B5&limit=10&newest=0&order=desc&page_type=search&scenario=PAGE_GLOBAL_SEARCH&version=2"

    spc_f = generate_spc_f()
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "application/json",
        "Accept-Language": "th-TH,th;q=0.9,en;q=0.8",
        "x-shopee-language": "th",
        "Referer": "https://shopee.co.th/",
        "Cookie": f"SPC_F={spc_f};"
    }
    
    try:
        r = requests.get(url, headers=headers, impersonate="chrome110")
        if r.status_code == 200:
            data = r.json()
            items = data.get("items", [])
            print(f"  Found {len(items)} items")
            return items
        else:
            print(f"  Failed: {r.status_code} - {r.text[:200]}")
            return []
    except Exception as e:
        print(f"  Exception: {e}")
        return []

def main():
    categories = [
        ("overall", "Overall Bestsellers"),
        ("11044944", "Home Goods"),
        ("11044711", "Women's Fashion"),
        ("11044961", "Pets"),
        ("11044951", "Food & Drinks"),
        ("11044949", "Home Appliances"),
    ]
    
    results = {}
    for cat_id, name in categories:
        results[name] = get_top_products(cat_id, name)
        
    # Save a sample to check
    with open("debug_api_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()
