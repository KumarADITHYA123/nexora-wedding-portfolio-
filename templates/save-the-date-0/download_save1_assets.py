import os
import urllib.request
import re

target_dir = r"C:\Users\eshhb\Downloads\save the date\save 1\assets.shaadipath.com\std-templates\std-02-peacock\assets"
os.makedirs(target_dir, exist_ok=True)

assets = [
    ("https://assets.shaadipath.com/std-templates/std-02-peacock/assets/Jharoka.webp", "Jharoka.webp"),
    ("https://assets.shaadipath.com/std-templates/std-02-peacock/assets/petal_shaadi.webp", "petal_shaadi.webp"),
    ("https://assets.shaadipath.com/std-templates/std-02-peacock/assets/savethedate_bg.webp", "savethedate_bg.webp"),
    ("https://assets.shaadipath.com/std-templates/std-02-peacock/assets/std_demo_music.mp3", "std_demo_music.mp3"),
    ("https://assets.shaadipath.com/std-templates/std-02-peacock/assets/intro.mp4", "intro.mp4"),
    ("https://assets.shaadipath.com/std-templates/std-02-peacock/assets/poster.webp", "poster.webp"),
    ("https://assets.shaadipath.com/std-templates/std-02-peacock/assets/og/og_std2.png", "og/og_std2.png")
]

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

print("=== Downloading Missing Assets for Save 1 ===")
for url, filename in assets:
    dest_path = os.path.join(target_dir, filename)
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 0:
        print(f"Already exists ({os.path.getsize(dest_path)} bytes): {dest_path}")
        continue
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
            with open(dest_path, "wb") as f:
                f.write(data)
            print(f"[OK 200] {url} -> {dest_path} ({len(data)} bytes)")
    except Exception as e:
        print(f"[ERR] Failed {url}: {e}")

# Download Google Fonts WOFF2 files
fonts_url = "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap"
fonts_dir = r"C:\Users\eshhb\Downloads\save the date\save 1\assets\fonts"
os.makedirs(fonts_dir, exist_ok=True)

print("\n=== Downloading Fonts ===")
req = urllib.request.Request(fonts_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'})
with urllib.request.urlopen(req) as resp:
    fonts_css = resp.read().decode('utf-8')

with open(os.path.join(fonts_dir, "fonts.css"), "w", encoding="utf-8") as f:
    f.write(fonts_css)

font_urls = sorted(set(re.findall(r'url\((https://fonts\.gstatic\.com/[^)]+)\)', fonts_css)))
print(f"Unique font files: {len(font_urls)}")
for i, f_url in enumerate(font_urls):
    font_filename = f"font_{i:02d}_{os.path.basename(f_url)}"
    dest = os.path.join(fonts_dir, font_filename)
    if not os.path.exists(dest) or os.path.getsize(dest) == 0:
        r = urllib.request.Request(f_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(r) as res:
            with open(dest, "wb") as out:
                out.write(res.read())
        print(f"[OK 200] Font {i}: {dest}")
    else:
        print(f"Font already exists: {dest}")

print("\n=== Download Complete ===")
