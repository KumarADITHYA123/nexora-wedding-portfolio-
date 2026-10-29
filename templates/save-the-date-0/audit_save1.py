import os
import re

base_dir = r"C:\Users\eshhb\Downloads\save the date\save 1"
css_path = os.path.join(base_dir, r"assets.shaadipath.com\std-templates\std-02-peacock\styles.css")
js_path = os.path.join(base_dir, r"assets.shaadipath.com\std-templates\std-02-peacock\assets\app.js")
html_path = os.path.join(base_dir, r"www.shaadipath.com\api\preview\stdb25e.html")

with open(css_path, "r", encoding="utf-8") as f:
    css = f.read()

with open(js_path, "r", encoding="utf-8") as f:
    js = f.read()

with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

print("=== CSS URLs ===")
for u in sorted(set(re.findall(r'url\(["\']?([^)"\']+)["\']?\)', css))):
    print(" ", u)

print("\n=== JS Media References ===")
for m in sorted(set(re.findall(r'["\']([^"\']+\.(?:webp|png|jpg|mp3|mp4|svg))["\']', js))):
    print(" ", m)

print("\n=== HTML Media References ===")
for h in sorted(set(re.findall(r'["\']([^"\']+\.(?:webp|png|jpg|mp3|mp4|svg))["\']', html))):
    print(" ", h)

# Check which exist on disk vs missing
all_assets = set()
for s in [css, js, html]:
    for a in re.findall(r'https://assets\.shaadipath\.com/[^"\'\s<>)]+', s):
        all_assets.add(a)

print("\n=== Remote Assets Referenced ===")
for a in sorted(all_assets):
    # Check if exists locally
    rel_part = a.replace("https://", "").replace("/", "\\")
    local_f = os.path.join(base_dir, rel_part)
    exists = os.path.exists(local_f)
    print(f"  [{'EXISTS' if exists else 'MISSING'}] {a}")
    if not exists:
        print(f"      -> Expected at: {local_f}")
