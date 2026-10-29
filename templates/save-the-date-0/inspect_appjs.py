import os
import re

js_path = r"C:\Users\eshhb\Downloads\save the date\save 1\assets.shaadipath.com\std-templates\std-02-peacock\assets\app.js"
with open(js_path, "r", encoding="utf-8") as f:
    js = f.read()

print("Length of app.js:", len(js))
for m in re.finditer(r'assets/[^\s"\'()]+', js):
    start = max(0, m.start() - 40)
    end = min(len(js), m.end() + 40)
    print("Match:", repr(js[start:end]))
