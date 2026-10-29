import subprocess
import os
import re

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
if not os.path.exists(chrome_path):
    chrome_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

file_url = "file:///C:/Users/eshhb/Downloads/save%20the%20date/save%201/index.html"
proc = subprocess.run([chrome_path, "--headless=new", "--disable-gpu", "--no-sandbox", "--dump-dom", file_url], capture_output=True, text=True, encoding="utf-8", errors="replace")
dom = proc.stdout

print("DOM length:", len(dom))
checks = [
    ("Stage container", "class=\"stage\"" in dom),
    ("Intro video with Base64", "data:video/mp4;base64" in dom),
    ("Tap prompt", "tap-prompt" in dom or "intro" in dom),
    ("Inlined Audio element", "data:audio/mpeg;base64" in dom and "id=\"stdBgAudio\"" in dom),
    ("Music button", "id=\"stdMusicBtn\"" in dom),
]

for name, res in checks:
    print(f"[{'PASS' if res else 'FAIL'}] {name}")

# Now test card mode by setting __STD_GALLERY_MODE__ = true
bundle_file = r"C:\Users\eshhb\Downloads\save the date\save 1\index.html"
with open(bundle_file, "r", encoding="utf-8") as f:
    raw_html = f.read()

test_card = raw_html.replace("<head>", "<head><script>window.__STD_GALLERY_MODE__ = true;</script>")
temp_path = r"C:\Users\eshhb\Downloads\save the date\save 1\temp_test.html"
with open(temp_path, "w", encoding="utf-8") as f:
    f.write(test_card)

proc2 = subprocess.run([chrome_path, "--headless=new", "--disable-gpu", "--no-sandbox", "--dump-dom", f"file:///{temp_path.replace('\\', '/')}"], capture_output=True, text=True, encoding="utf-8", errors="replace")
dom2 = proc2.stdout
if os.path.exists(temp_path):
    os.remove(temp_path)

print("\n--- Card Mode Checks ---")
card_checks = [
    ("Couple element", "class=\"couple\"" in dom2 and "Tanya" in dom2 and "Rohan" in dom2),
    ("Date & Venue", "The Grand Palace, New Delhi" in dom2 and "12" in dom2),
    ("Jharoka frame", "jharoka-wrap" in dom2 and "data:image/webp;base64" in dom2),
    ("CTA button", "Save to Google Calendar" in dom2),
]
for name, res in card_checks:
    print(f"[{'PASS' if res else 'FAIL'}] {name}")
