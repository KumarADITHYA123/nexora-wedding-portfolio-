import sys
import io
import urllib.request
import re

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

designs = [
    'std-01-sand',
    'std-02-peacock',
    'std-03-Mirror',
    'std-04-lotus',
    'std-05-chandelier'
]

for d in designs:
    url = f"https://www.shaadipath.com/api/preview/std?design={d}"
    print(f"\n==================== {d} ====================")
    print("URL:", url)
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            content = resp.read().decode('utf-8', errors='replace')
            print(f"Status: {resp.status}, Content Length: {len(content)}")
            
            # Extract resources object or script assets
            res = re.findall(r'window\.__resources\s*=\s*\{([^}]+)\}', content)
            if res:
                print("window.__resources:", res[0])
            
            # Extract audio src
            aud = re.findall(r'<audio[^>]*src=["\']([^"\']+)["\']', content)
            if aud:
                print("Audio src:", aud[0])

            # Extract script src
            scripts = re.findall(r'<script[^>]*src=["\']([^"\']+)["\']', content)
            print("Scripts:", scripts)
    except Exception as e:
        print("Error:", e)
