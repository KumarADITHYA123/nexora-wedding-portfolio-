import sys
import io
import urllib.request
import re

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

url = 'https://www.shaadipath.com/_next/static/chunks/app/templates/page-05923b18d58124d3.js'
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req) as resp:
    js_text = resp.read().decode('utf-8', errors='replace')

print("Page JS length:", len(js_text))
matches = set(re.findall(r'std-[0-9a-zA-Z\-_]+', js_text))
print("All std-* tokens in templates page JS:")
for m in sorted(matches):
    print(" ", m)

# Also check for any 'std' objects or arrays
std_matches = re.findall(r'\{[^{}]*std-[^{}]*\}', js_text)
print("\nJSON/Object snippets with std-:")
for s in std_matches[:10]:
    print(" -", s[:200])
