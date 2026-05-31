import asyncio
from playwright.async_api import async_playwright
from playwright_stealth import Stealth

async def main():
    async with async_playwright() as p:
        device = p.devices['iPhone 13']
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(**device, locale="th-TH")
        page = await context.new_page()
        await Stealth().apply_stealth_async(page)
        
        url = "https://shopee.co.th/top_products"
        print(f"Navigating to: {url} (Mobile Emulation)")
        
        try:
            await page.goto(url, wait_until="domcontentloaded", timeout=60000)
            await page.wait_for_timeout(5000)
            
            # Check for language popup on mobile
            try:
                thai_button = page.get_by_text("ไทย")
                if await thai_button.is_visible(timeout=3000):
                    await thai_button.click()
                    await page.wait_for_timeout(2000)
            except:
                pass
                
            print(f"Current URL: {page.url}")
            print(f"Title: {await page.title()}")
            
            content = await page.content()
            if "verify/traffic/error" in page.url or "Verification" in content or "ตรวจสอบ" in content:
                print("BLOCK DETECTED (Mobile)")
            else:
                # Look for products
                items_count = await page.evaluate("""() => {
                    return document.querySelectorAll('.top-products-item, [data-sqe="item"], .shopee-search-item-result__item').length;
                }""")
                print(f"Items found: {items_count}")
                
            await page.screenshot(path="debug_mobile.png")
            
        except Exception as e:
            print(f"Error: {e}")
            
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
