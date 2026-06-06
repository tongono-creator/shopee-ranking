import os
import sys
import subprocess
import datetime
from pathlib import Path

# Fix Windows console encoding for Thai characters
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

PROJECT_DIR = Path("D:/Projects/shopee-ranking")
LOG_FILE = PROJECT_DIR / "auto_update.log"

def log(message):
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_msg = f"[{timestamp}] {message}"
    print(log_msg)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(log_msg + "\n")

def run_command(cmd, cwd=PROJECT_DIR):
    try:
        # Use shell=True for Windows compatibility with system commands/git
        res = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True, encoding="utf-8")
        if res.returncode != 0:
            log(f"Command failed: {cmd}\nExit Code: {res.returncode}\nStderr: {res.stderr.strip()}")
            return False, res.stdout, res.stderr
        return True, res.stdout, res.stderr
    except Exception as e:
        log(f"Exception running command {cmd}: {e}")
        return False, "", str(e)

def main():
    log("=" * 60)
    log("Starting Automated Product Update Pipeline")
    log("=" * 60)
    
    # 1. Run Scraper
    log("Step 1: Running Shopee Scraper (scrape_top10.py)...")
    success, stdout, stderr = run_command("python scrape_top10.py")
    if not success:
        log("[Error] Scraper execution failed. Aborting pipeline.")
        return
        
    # Check if scraper printed any login warnings
    if "[Error] Blocked by verification" in stdout or "Warning: No products found" in stdout:
        log("[Warning] Scraper encountered a block or got no products. Check debug screenshots.")
        
    # 2. Run Compiler
    log("Step 2: Compiling Excel to JSON (excel_to_json.py)...")
    success, stdout, stderr = run_command("python excel_to_json.py")
    if not success:
        log("[Error] Excel-to-JSON compiler failed. Aborting pipeline.")
        return
        
    # 3. Check for Git Changes
    log("Step 3: Checking Git status for changes...")
    success, stdout, stderr = run_command("git status --porcelain")
    if not success:
        log("[Error] Failed to check Git status.")
        return
        
    changed_files = [line.strip() for line in stdout.splitlines() if line.strip()]
    
    # Check if data/products or Excel template changed
    relevant_changes = [f for f in changed_files if "data/products" in f or "products_template.xlsx" in f]
    
    if not relevant_changes:
        log("No changes detected in products data or Excel template. Pipeline completed.")
        return
        
    log(f"Detected {len(relevant_changes)} modified files to commit:")
    for change in relevant_changes:
        log(f"  - {change}")
        
    # 4. Commit and Push
    log("Step 4: Committing changes to local git repository...")
    # Add files
    success, _, _ = run_command("git add products_template.xlsx data/products/*.json")
    if not success:
        log("[Error] Git add failed.")
        return
        
    # Commit
    commit_msg = f"Auto-update products ranking - {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}"
    success, _, _ = run_command(f'git commit -m "{commit_msg}"')
    if not success:
        log("[Error] Git commit failed.")
        return
        
    # Push to GitHub (origin master)
    log("Step 5: Pushing changes to GitHub to trigger Vercel deploy...")
    success, stdout, stderr = run_command("git push origin master")
    if not success:
        log("[Error] Git push failed. Please verify your internet connection or git credentials.")
        return
        
    log("[Success] Successfully pushed updates to GitHub. Vercel deployment triggered!")
    log("Automated update completed successfully.")

if __name__ == "__main__":
    main()
