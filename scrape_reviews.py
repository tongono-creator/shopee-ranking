"""
Scrape REAL user reviews for a product model from Shopee + Lazada + Pantip.
Saves raw reviews to data/reviews/{slug}.json for synthesize_reviews.py to consume.

Usage:
  python scrape_reviews.py --slug robot-vacuum --query "ECOVACS DEEBOT T30 Pro" \
      [--shopee-url "https://shopee.co.th/..."] [--max 60]

Defensive by design: each source is wrapped in try/except so one failure
(anti-bot block, layout change) never kills the whole run. Rate-limited.
"""
import argparse
import asyncio
import datetime
import hashlib
import json
import sys
from pathlib import Path
from urllib.parse import quote

from playwright.async_api import async_playwright

try:
    from playwright_stealth import Stealth
    HAS_STEALTH = True
except ImportError:
    HAS_STEALTH = False

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent
STORAGE_STATE = ROOT / "shopee_state.json"  # produced by login_shopee.py if present
MIN_LEN = 8


def _clean(text: str) -> str:
    return " ".join((text or "").split())


async def _dismiss_thai_modal(page):
    try:
        btn = page.get_by_role("button", name="ไทย")
        if await btn.is_visible(timeout=3000):
            await btn.click()
    except Exception:
        pass
    for label in ["English", "ตกลง", "เข้าใจแล้ว"]:
        try:
            b = page.get_by_role("button", name=label)
            if await b.is_visible(timeout=1000):
                await b.click()
        except Exception:
            pass


async def scrape_shopee(context, url, out, limit):
    if not url:
        print("  [Shopee] no --shopee-url, skip")
        return
    page = await context.new_page()
    try:
        print(f"  [Shopee] {url}")
        await page.goto(url, wait_until="domcontentloaded", timeout=60000)
        await _dismiss_thai_modal(page)
        await asyncio.sleep(2)
        # Scroll to load lazy review section.
        for _ in range(12):
            await page.mouse.wheel(0, 1500)
            await asyncio.sleep(1)
        items = await page.query_selector_all(
            ".shopee-product-rating__main, .shopee-product-rating"
        )
        for it in items[:limit]:
            try:
                txt_el = await it.query_selector(
                    ".shopee-product-rating__content, .YNedDV"
                )
                text = _clean(await txt_el.inner_text()) if txt_el else ""
                if len(text) < MIN_LEN:
                    continue
                stars = await it.query_selector_all(
                    ".shopee-product-rating__rating .icon-rating-solid--active, "
                    ".repeat-purchase-con .icon-rating-solid"
                )
                rating = len(stars) if stars else None
                out.append({"source": "Shopee", "rating": rating, "text": text, "date": None})
            except Exception:
                continue
        print(f"  [Shopee] got {len([o for o in out if o['source']=='Shopee'])}")
    except Exception as e:
        print(f"  [Shopee] failed: {e}")
    finally:
        await page.close()


async def scrape_lazada(context, query, out, limit):
    page = await context.new_page()
    try:
        search = f"https://www.lazada.co.th/catalog/?q={quote(query)}"
        print(f"  [Lazada] {search}")
        await page.goto(search, wait_until="domcontentloaded", timeout=60000)
        await asyncio.sleep(2)
        first = await page.query_selector("a[href*='/products/']")
        if not first:
            print("  [Lazada] no product found")
            return
        href = await first.get_attribute("href")
        if href and href.startswith("//"):
            href = "https:" + href
        await page.goto(href, wait_until="domcontentloaded", timeout=60000)
        await asyncio.sleep(2)
        for _ in range(10):
            await page.mouse.wheel(0, 1500)
            await asyncio.sleep(1)
        items = await page.query_selector_all(".item, .mod-reviews .item")
        count = 0
        for it in items[:limit]:
            try:
                txt_el = await it.query_selector(".content, .item-content .content")
                text = _clean(await txt_el.inner_text()) if txt_el else ""
                if len(text) < MIN_LEN:
                    continue
                stars = await it.query_selector_all(".container-star .star, img[src*='star_yellow']")
                rating = len(stars) if stars else None
                out.append({"source": "Lazada", "rating": rating, "text": text, "date": None})
                count += 1
            except Exception:
                continue
        print(f"  [Lazada] got {count}")
    except Exception as e:
        print(f"  [Lazada] failed: {e}")
    finally:
        await page.close()


async def scrape_pantip(context, query, out, limit):
    page = await context.new_page()
    try:
        search = f"https://pantip.com/search?q={quote(query + ' รุ่นไหนดี')}"
        print(f"  [Pantip] {search}")
        await page.goto(search, wait_until="domcontentloaded", timeout=60000)
        await asyncio.sleep(2)
        links = await page.query_selector_all("a[href*='/topic/']")
        hrefs = []
        for a in links:
            h = await a.get_attribute("href")
            if h and "/topic/" in h:
                full = h if h.startswith("http") else "https://pantip.com" + h
                if full not in hrefs:
                    hrefs.append(full)
        count = 0
        for href in hrefs[:3]:
            try:
                await page.goto(href, wait_until="domcontentloaded", timeout=60000)
                await asyncio.sleep(2)
                comments = await page.query_selector_all(
                    ".display-post-story, .comment-box .display-post-story"
                )
                for c in comments[: limit // 2]:
                    text = _clean(await c.inner_text())
                    if len(text) < MIN_LEN:
                        continue
                    out.append({"source": "Pantip", "rating": None, "text": text, "date": None})
                    count += 1
                await asyncio.sleep(2)
            except Exception:
                continue
        print(f"  [Pantip] got {count}")
    except Exception as e:
        print(f"  [Pantip] failed: {e}")
    finally:
        await page.close()


def dedup(reviews):
    seen, result = set(), []
    for r in reviews:
        h = hashlib.md5(r["text"].encode("utf-8")).hexdigest()
        if h in seen:
            continue
        seen.add(h)
        result.append(r)
    return result


async def run(args):
    raw = []
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=False)
        ctx_kwargs = {}
        if STORAGE_STATE.exists():
            print(f"Using session state {STORAGE_STATE}")
            ctx_kwargs["storage_state"] = str(STORAGE_STATE)
        context = await browser.new_context(**ctx_kwargs)
        if HAS_STEALTH:
            try:
                await Stealth().apply_stealth_async(context)
            except Exception:
                pass

        await scrape_shopee(context, args.shopee_url, raw, args.max)
        await asyncio.sleep(2)
        await scrape_lazada(context, args.query, raw, args.max)
        await asyncio.sleep(2)
        await scrape_pantip(context, args.query, raw, args.max)

        await browser.close()

    reviews = dedup([r for r in raw if len(r["text"]) >= MIN_LEN])
    out = {
        "slug": args.slug,
        "query": args.query,
        "scraped_at": datetime.datetime.now().isoformat(),
        "reviews": reviews,
    }
    of = ROOT / "data" / "reviews" / f"{args.slug}.json"
    of.parent.mkdir(parents=True, exist_ok=True)
    of.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nSaved {len(reviews)} reviews -> {of}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", required=True)
    ap.add_argument("--query", required=True)
    ap.add_argument("--shopee-url", dest="shopee_url", default="")
    ap.add_argument("--max", type=int, default=60)
    args = ap.parse_args()
    asyncio.run(run(args))


if __name__ == "__main__":
    main()
