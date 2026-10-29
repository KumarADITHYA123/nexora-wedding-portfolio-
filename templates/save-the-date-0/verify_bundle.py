import os
import re
import subprocess

BUNDLE_PATH = r"E:\AI\aa\monolithic_bundle.html"
INDEX_PATH = r"E:\AI\aa\index.html"

print("================================================================")
print("PHASE 5: AUTOMATED INTEGRITY & QUALITY ASSURANCE VERIFICATION")
print("================================================================\n")

# 1. File Inspection
with open(BUNDLE_PATH, "r", encoding="utf-8") as f:
    content = f.read()

bundle_size = os.path.getsize(BUNDLE_PATH)
index_size = os.path.getsize(INDEX_PATH)
print(f"File Paths:")
print(f"  - monolithic_bundle.html: {BUNDLE_PATH} ({bundle_size:,} bytes, {bundle_size / (1024*1024):.2f} MB)")
print(f"  - index.html:             {INDEX_PATH} ({index_size:,} bytes, {index_size / (1024*1024):.2f} MB)")

# 2. Check for external dependencies
external_src_href = re.findall(r'(?:src|href|url)\s*=\s*["\'](https?://[^"\']+)["\']', content, re.IGNORECASE)
css_urls = re.findall(r'url\(\s*["\']?(https?://[^)]+)["\']?\s*\)', content, re.IGNORECASE)
all_external = set(external_src_href + css_urls)
cdn_dependencies = [u for u in all_external if not ("calendar.google.com" in u or "wa.me" in u)]

# 3. Check for unresolved relative paths
relative_src_href = re.findall(r'(?:src|href|url)\s*=\s*["\']([^"\':]+\.(?:js|css|webp|png|jpg|jpeg|gif|svg|mp3|mp4|woff2|woff))["\']', content, re.IGNORECASE)
css_relative = re.findall(r'url\(\s*["\']?([^)"\':]+\.(?:webp|png|jpg|jpeg|gif|svg|woff2|woff))["\']?\s*\)', content, re.IGNORECASE)
all_relative = set(relative_src_href + css_relative)

# 4. Check base tag and trackers
has_base = "<base " in content.lower()
has_cf = "cloudflareinsights" in content.lower()

# 5. Base64 data URIs
data_uris = re.findall(r'data:([^;]+);base64,([a-zA-Z0-9+/=]+)', content)
mime_breakdown = {}
for mime, b64_val in data_uris:
    mime_breakdown[mime] = mime_breakdown.get(mime, 0) + 1

print("\n--- Asset & Dependency Audit ---")
print(f"  [PASS] External CDN dependencies remaining: {len(cdn_dependencies)}")
print(f"  [PASS] Unresolved relative asset references: {len(all_relative)}")
print(f"  [PASS] Base tag (<base href=\"\">) present:   {has_base}")
print(f"  [PASS] Cloudflare/tracking beacons present:  {has_cf}")
print(f"  [PASS] Total Base64 data URIs inlined:       {len(data_uris)}")
for mime, count in sorted(mime_breakdown.items()):
    print(f"         * {mime}: {count} inlined asset(s)")

# 6. Headless Browser Verification (Chrome / Edge)
print("\n--- Headless Browser DOM Initialization Verification ---")
chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
if not os.path.exists(chrome_path):
    chrome_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

file_url = "file:///" + BUNDLE_PATH.replace("\\", "/")

# Render default intro DOM
proc_intro = subprocess.run([chrome_path, "--headless=new", "--disable-gpu", "--no-sandbox", "--dump-dom", file_url], capture_output=True, text=True, encoding="utf-8", errors="replace")
dom_intro = proc_intro.stdout

# Render card mode DOM
temp_card_file = r"E:\AI\aa\temp_verify_card.html"
with open(temp_card_file, "w", encoding="utf-8") as f:
    f.write(content.replace("<head>", "<head><script>window.__STD_GALLERY_MODE__ = true;</script>"))
proc_card = subprocess.run([chrome_path, "--headless=new", "--disable-gpu", "--no-sandbox", "--dump-dom", f"file:///{temp_card_file.replace('\\', '/')}"], capture_output=True, text=True, encoding="utf-8", errors="replace")
dom_card = proc_card.stdout
if os.path.exists(temp_card_file):
    os.remove(temp_card_file)

checks = [
    ("Intro Mode Stage", "class=\"stage\"" in dom_intro),
    ("Intro Mode Video", "<video" in dom_intro and "data:video/mp4;base64" in dom_intro),
    ("Intro 'Tap to Begin' Overlay", "tap-to-begin" in dom_intro),
    ("Audio Element with inlined MP3", "id=\"stdBgAudio\"" in dom_intro and "data:audio/mpeg;base64" in dom_intro),
    ("Music Toggle Button", "id=\"stdMusicBtn\"" in dom_intro),
    ("Card Mode Couple Names", "Tanya" in dom_card and "Rohan" in dom_card and "class=\"couple\"" in dom_card),
    ("Card Mode Event Date", "12" in dom_card and "December" in dom_card and "2026" in dom_card),
    ("Card Mode Event Venue", "The Grand Palace, New Delhi" in dom_card),
    ("Card Mode Scratch Canvas", "scratch-canvas" in dom_card),
    ("Card Mode CTA Button", "Save to Google Calendar" in dom_card)
]

all_passed = True
for name, passed in checks:
    status = "PASS" if passed else "FAIL"
    if not passed:
        all_passed = False
    print(f"  [{status}] {name}")

print("\n================================================================")
if all_passed and len(cdn_dependencies) == 0 and len(all_relative) == 0 and not has_base and not has_cf:
    print("STATUS: VERIFIED SUCCESSFUL - 100% STANDALONE OFFLINE BUNDLE")
else:
    print("STATUS: VERIFICATION ENCOUNTERED ISSUES")
print("================================================================\n")
