import os
import urllib.request
import re

ASSETS_TO_DOWNLOAD = [
    {
        "url": "https://assets.shaadipath.com/std-templates/std-01-sand/assets/save-the-date/savethedate_bg.webp",
        "local_path": "assets.shaadipath.com/std-templates/std-01-sand/assets/save-the-date/savethedate_bg.webp"
    },
    {
        "url": "https://assets.shaadipath.com/std-templates/std-01-sand/assets/save-the-date/frame.webp",
        "local_path": "assets.shaadipath.com/std-templates/std-01-sand/assets/save-the-date/frame.webp"
    },
    {
        "url": "https://assets.shaadipath.com/std-templates/std-01-sand/assets/save-the-date/sand.webp",
        "local_path": "assets.shaadipath.com/std-templates/std-01-sand/assets/save-the-date/sand.webp"
    },
    {
        "url": "https://assets.shaadipath.com/std-templates/std-01-sand/assets/save-the-date/intro.mp4",
        "local_path": "assets.shaadipath.com/std-templates/std-01-sand/assets/save-the-date/intro.mp4"
    },
    {
        "url": "https://assets.shaadipath.com/std-templates/std-01-sand/assets/save-the-date/poster.webp",
        "local_path": "assets.shaadipath.com/std-templates/std-01-sand/assets/save-the-date/poster.webp"
    },
    {
        "url": "https://assets.shaadipath.com/std-templates/std-01-sand/assets/music/std_demo_music.mp3",
        "local_path": "assets.shaadipath.com/std-templates/std-01-sand/assets/music/std_demo_music.mp3"
    },
]

# Also download Google Fonts CSS and all its WOFF2 font files
FONTS_CSS_URL = "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@1,400;1,500;1,600;1,700&family=Jost:wght@400;500&display=swap"
FONTS_LOCAL_DIR = "assets/fonts"

def download_file(url, local_path):
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
    with urllib.request.urlopen(req) as resp:
        if resp.status != 200:
            raise Exception(f"HTTP status {resp.status} for {url}")
        content = resp.read()
        if len(content) == 0:
            raise Exception(f"Empty content for {url}")
        with open(local_path, "wb") as f:
            f.write(content)
        print(f"[OK 200] {url} -> {local_path} ({len(content)} bytes)")
        return content

print("=== Downloading Primary Missing Assets ===")
for item in ASSETS_TO_DOWNLOAD:
    download_file(item["url"], item["local_path"])

print("\n=== Fetching Google Fonts & WOFF2 Subsets ===")
os.makedirs(FONTS_LOCAL_DIR, exist_ok=True)
req = urllib.request.Request(FONTS_CSS_URL, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'})
with urllib.request.urlopen(req) as resp:
    fonts_css = resp.read().decode('utf-8')

with open(os.path.join(FONTS_LOCAL_DIR, "fonts.css"), "w", encoding="utf-8") as f:
    f.write(fonts_css)
print(f"[OK 200] Fetched Google Fonts CSS ({len(fonts_css)} bytes)")

font_urls = sorted(set(re.findall(r'url\((https://fonts\.gstatic\.com/[^)]+)\)', fonts_css)))
print(f"Discovered {len(font_urls)} unique WOFF2 font files.")

font_url_to_local = {}
for i, f_url in enumerate(font_urls):
    filename = f"font_{i:02d}_{os.path.basename(f_url)}"
    dest = os.path.join(FONTS_LOCAL_DIR, filename)
    download_file(f_url, dest)
    font_url_to_local[f_url] = dest

print("\n=== All Assets Downloaded and Verified ===")
