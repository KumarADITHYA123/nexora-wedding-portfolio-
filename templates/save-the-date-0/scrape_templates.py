import sys
import io
import urllib.request
import re

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

def fetch(url):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as resp:
        return resp.read().decode('utf-8', errors='replace')

print("=== Checking /templates Detailed ===")
t_html = fetch('https://www.shaadipath.com/templates')
t_std = sorted(list(set(re.findall(r'/api/preview/std\?design=[^"\'\s<>]+', t_html))))
print(f"Templates page STD links ({len(t_std)}):")
for link in t_std:
    print(" ", link)

idx = 0
while True:
    idx = t_html.find('design=std-', idx)
    if idx == -1:
        break
    snippet = t_html[max(0, idx - 150): min(len(t_html), idx + 400)]
    print("\n--- Card snippet ---")
    print(snippet)
    idx += len('design=std-')

# Check JS files on /templates
js_files = set(re.findall(r'src=["\']([^"\']+\.js[^"\']*)["\']', t_html))
print("\n=== JS files on /templates ===")
for js in sorted(js_files):
    print(js)
