"""
Synthesize raw user reviews into a Product JSON entry matching the site schema,
then merge into data/products/{slug}.json (re-ranked by score desc).

Usage:
  python synthesize_reviews.py --slug robot-vacuum --model "DEEBOT T30 Pro Omni" \
      --brand ECOVACS --name "ECOVACS DEEBOT T30 Pro Omni หุ่นยนต์ดูดฝุ่น" \
      --price 18990 --shopee-url "https://s.shopee.co.th/xxxx" \
      [--reviews-file data/reviews/robot-vacuum.json] [--paste]

AI chain: Gemini (gemini-2.5-flash) -> Grok CLI -> local heuristic fallback.
The AI is instructed to summarize ONLY from supplied reviews (anti-hallucination).
"""
import argparse
import collections
import datetime
import json
import re
import subprocess
import sys
from pathlib import Path

import urllib.request
import urllib.error

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    # stdin defaults to cp874 on Thai Windows -> mangles pasted Thai reviews.
    sys.stdin.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent
GEMINI_KEY_FILE = Path(r"D:\Projects\KDP\api_key.txt")
GROK_EXE = Path(r"C:\Users\tongo\.grok\bin\grok.exe")
GEMINI_MODEL = "gemini-2.5-flash"


def load_reviews(args) -> list[dict]:
    if args.paste:
        print("Paste reviews (one per line), end with Ctrl+Z then Enter (Win):")
        lines = [ln.strip() for ln in sys.stdin.read().splitlines() if ln.strip()]
        return [{"source": "Manual", "rating": None, "text": ln} for ln in lines]

    rf = Path(args.reviews_file) if args.reviews_file else ROOT / "data" / "reviews" / f"{args.slug}.json"
    if not rf.is_absolute():
        rf = ROOT / rf
    if not rf.exists():
        print(f"No reviews file at {rf}. Falling back to --paste mode.")
        print("Paste reviews (one per line), end with Ctrl+Z then Enter (Win):")
        lines = [ln.strip() for ln in sys.stdin.read().splitlines() if ln.strip()]
        return [{"source": "Manual", "rating": None, "text": ln} for ln in lines]

    data = json.loads(rf.read_text(encoding="utf-8"))
    return data.get("reviews", [])


def build_ai_prompt(reviews: list[dict]) -> str:
    blob = "\n".join(f"- [{r.get('rating', '?')}★] {r['text']}" for r in reviews)
    return (
        "คุณคือผู้สรุปรีวิวสินค้า สรุปจากรีวิวจริงที่ให้มาเท่านั้น "
        "ห้ามแต่งข้อมูลเพิ่มเอง (no hallucination)\n\n"
        f"รีวิวจริง ({len(reviews)} รายการ):\n{blob}\n\n"
        "ตอบกลับเป็น JSON เท่านั้น (ไม่มีข้อความอื่น) ตาม schema:\n"
        "{\n"
        '  "reviewSummary": "สรุป 2-3 ประโยคภาษาไทย",\n'
        '  "prosDetailed": [{"text": "ข้อดี", "mentions": 3}],\n'
        '  "consDetailed": [{"text": "ข้อเสีย", "mentions": 2}],\n'
        '  "bestFor": "เหมาะกับใคร 1 บรรทัด",\n'
        '  "score": 8.5\n'
        "}\n"
        "เงื่อนไข: mentions = จำนวนรีวิวที่พูดถึงประเด็นนั้น, "
        "ใส่ pro/con เฉพาะที่มี mentions >= 2, "
        "score 0-10 ถ่วงน้ำหนัก rating เฉลี่ย + sentiment"
    )


def extract_json(text: str) -> dict | None:
    m = re.search(r"\{.*\}", text, re.DOTALL)
    if not m:
        return None
    try:
        return json.loads(m.group(0))
    except json.JSONDecodeError:
        return None


def try_gemini(prompt: str) -> dict | None:
    if not GEMINI_KEY_FILE.exists():
        print("Gemini key file missing, skip.")
        return None
    key = GEMINI_KEY_FILE.read_text(encoding="utf-8").strip()
    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{GEMINI_MODEL}:generateContent?key={key}"
    )
    body = json.dumps({"contents": [{"parts": [{"text": prompt}]}]}).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        text = data["candidates"][0]["content"]["parts"][0]["text"]
        print("Gemini OK")
        return extract_json(text)
    except urllib.error.HTTPError as e:
        print(f"Gemini HTTP {e.code} -> fallback")
        return None
    except Exception as e:
        print(f"Gemini error: {e} -> fallback")
        return None


def try_grok(prompt: str) -> dict | None:
    if not GROK_EXE.exists():
        return None
    try:
        out = subprocess.run(
            [str(GROK_EXE), "-p", prompt, "--permission-mode", "auto"],
            capture_output=True, text=True, timeout=180, encoding="utf-8",
        )
        if out.returncode != 0:
            print(f"Grok rc={out.returncode} -> fallback")
            return None
        print("Grok OK")
        return extract_json(out.stdout)
    except Exception as e:
        print(f"Grok error: {e} -> fallback")
        return None


# Keyword buckets for the offline heuristic fallback (Thai consumer-review signals).
POS_HINTS = ["ดี", "คุ้ม", "ชอบ", "แรง", "เงียบ", "เร็ว", "สะดวก", "แม่น", "ประทับใจ", "แนะนำ", "สวย", "ทน"]
NEG_HINTS = ["เสีย", "พัง", "ช้า", "ดัง", "แพง", "ปัญหา", "ผิดหวัง", "ไม่ดี", "ห่วย", "ยาก", "ร้อน", "หลุด"]


def heuristic_synth(reviews: list[dict]) -> dict:
    pos = collections.Counter()
    neg = collections.Counter()
    for r in reviews:
        t = r["text"]
        for h in POS_HINTS:
            if h in t:
                pos[h] += 1
        for h in NEG_HINTS:
            if h in t:
                neg[h] += 1
    pros = [{"text": f"ผู้ใช้พูดถึงว่า \"{k}\"", "mentions": v} for k, v in pos.most_common(5) if v >= 2]
    cons = [{"text": f"ผู้ใช้พูดถึงปัญหา \"{k}\"", "mentions": v} for k, v in neg.most_common(5) if v >= 2]
    ratings = [r["rating"] for r in reviews if isinstance(r.get("rating"), (int, float))]
    avg = sum(ratings) / len(ratings) if ratings else 0
    score = round(avg * 2, 1) if avg else 7.0
    return {
        "reviewSummary": f"สรุปอัตโนมัติจาก {len(reviews)} รีวิว (โหมด offline) "
                         f"คะแนนเฉลี่ย {round(avg, 1) if avg else 'N/A'} ดาว.",
        "prosDetailed": pros,
        "consDetailed": cons,
        "bestFor": "ดูรายละเอียดจากรีวิวประกอบการตัดสินใจ",
        "score": score,
    }


def synthesize(reviews: list[dict]) -> dict:
    prompt = build_ai_prompt(reviews)
    return try_gemini(prompt) or try_grok(prompt) or heuristic_synth(reviews)


def build_product(args, reviews: list[dict], ai: dict) -> dict:
    ratings = [r["rating"] for r in reviews if isinstance(r.get("rating"), (int, float))]
    rating = round(sum(ratings) / len(ratings), 1) if ratings else 0
    sources = sorted({r.get("source", "Unknown") for r in reviews})
    pros_detailed = ai.get("prosDetailed", [])
    best_for = ai.get("bestFor", "")
    return {
        "rank": 0,
        "name": args.name,
        "brand": args.brand,
        "model": args.model,
        "image": "",
        "price": args.price,
        "originalPrice": args.price,
        "discount": 0,
        "sold": "",
        "rating": rating,
        "score": float(ai.get("score", 7.0)),
        "shopeeUrl": args.shopee_url,
        "lazadaUrl": "",
        "highlight": "",
        "reason": best_for,
        "bestFor": best_for,
        "specs": {},
        "reviewSummary": ai.get("reviewSummary", ""),
        "prosDetailed": pros_detailed,
        "consDetailed": ai.get("consDetailed", []),
        "pros": [p["text"] for p in pros_detailed[:3]],
        "reviewCount": len(reviews),
        "reviewSources": sources,
        "lastReviewed": datetime.date.today().isoformat(),
    }


def merge(slug: str, product: dict):
    pf = ROOT / "data" / "products" / f"{slug}.json"
    items = json.loads(pf.read_text(encoding="utf-8")) if pf.exists() else []
    items = [p for p in items if p.get("model") != product["model"]]
    items.append(product)
    items.sort(key=lambda p: p.get("score", 0), reverse=True)
    for i, p in enumerate(items, 1):
        p["rank"] = i
    pf.parent.mkdir(parents=True, exist_ok=True)
    pf.write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Merged into {pf} ({len(items)} products)")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", required=True)
    ap.add_argument("--model", required=True)
    ap.add_argument("--brand", default="")
    ap.add_argument("--name", required=True)
    ap.add_argument("--price", type=int, required=True)
    ap.add_argument("--shopee-url", dest="shopee_url", required=True)
    ap.add_argument("--reviews-file", dest="reviews_file", default="")
    ap.add_argument("--paste", action="store_true")
    args = ap.parse_args()

    reviews = load_reviews(args)
    if not reviews:
        print("No reviews to synthesize. Abort.")
        sys.exit(1)
    print(f"Loaded {len(reviews)} reviews.")

    ai = synthesize(reviews)
    product = build_product(args, reviews, ai)
    merge(args.slug, product)

    print("\n=== PROS ===")
    for p in product["prosDetailed"]:
        print(f"  + {p['text']}  ({p['mentions']} mentions)")
    print("=== CONS ===")
    for c in product["consDetailed"]:
        print(f"  - {c['text']}  ({c['mentions']} mentions)")
    print(f"\nScore: {product['score']}/10  Rating: {product['rating']}★")


if __name__ == "__main__":
    main()
