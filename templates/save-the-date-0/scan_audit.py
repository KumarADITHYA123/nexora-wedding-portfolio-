import os
import re

html_path = 'www.shaadipath.com/api/preview/stde125.html'
js_path = 'assets.shaadipath.com/std-templates/std-01-sand/assets/save-the-date/app.js'

with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

with open(js_path, 'r', encoding='utf-8') as f:
    js = f.read()

print('=== HTML External URLs ===')
for m in sorted(set(re.findall(r'https?://[^\s"\'<>()]+', html))):
    print(m)

print('\n=== JS External URLs ===')
for m in sorted(set(re.findall(r'https?://[^\s"\'<>()]+', js))):
    print(m)

print('\n=== Media references in JS ===')
for m in sorted(set(re.findall(r'["\']([^"\']+\.(?:webp|png|jpg|jpeg|gif|svg|mp3|mp4|woff2|woff))["\']', js))):
    print(m)

print('\n=== Media references in HTML ===')
for m in sorted(set(re.findall(r'["\']([^"\']+\.(?:webp|png|jpg|jpeg|gif|svg|mp3|mp4|woff2|woff))["\']', html))):
    print(m)
