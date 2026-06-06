import asyncio
import sys
import os
from pathlib import Path
from playwright.async_api import async_playwright
from playwright_stealth import Stealth

# Fix Windows console encoding for Thai characters
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

SESSION_PATH = Path("D:/Projects/shopee-ranking/shopee_session.json")

async def main():
    print("=" * 60)
    print("           SHOPEE LOGIN & SESSION SAVER")
    print("=" * 60)
    print("This script will open a browser window for you to log in to Shopee.")
    print("Once saved, the automated scraper will use this session to bypass blocks.")
    print("-" * 60)
    
    async with async_playwright() as p:
        # Launch headed browser so user can interact
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            locale="th-TH",
            viewport={'width': 1280, 'height': 800}
        )
        page = await context.new_page()
        await Stealth().apply_stealth_async(page)
        
        print("\n[System] Opening Shopee homepage...")
        await page.goto("https://shopee.co.th/", wait_until="domcontentloaded")
        
        # Click "ไทย" if present
        try:
            thai_button = page.get_by_role("button", name="ไทย")
            if await thai_button.is_visible(timeout=5000):
                await thai_button.click()
                await asyncio.sleep(2)
        except:
            pass
            
        print("\n" + "!" * 60)
        print("ACTION REQUIRED:")
        print("1. Log in to your Shopee account in the browser window.")
        print("2. Solve any OTP or SMS verification required.")
        print("3. Ensure you are on the Shopee homepage after logging in.")
        print("!" * 60)
        
        input("\n>>> Once you are logged in successfully, press [Enter] here to save session...")
        
        print("\n[System] Saving cookies and session storage state...")
        await context.storage_state(path=SESSION_PATH)
        print(f"[Success] Session saved successfully to {SESSION_PATH}!")
        
        await browser.close()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nExiting...")
