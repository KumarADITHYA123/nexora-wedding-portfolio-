import subprocess
import re
import tempfile
import os

# Test card rendering by setting window.__STD_GALLERY_MODE__ = true in a copy
bundle_path = r"E:\AI\aa\monolithic_bundle.html"
with open(bundle_path, "r", encoding="utf-8") as f:
    html = f.read()

# Temporarily inject window.__STD_GALLERY_MODE__ = true into head for verification
test_html = html.replace("<head>", "<head><script>window.__STD_GALLERY_MODE__ = true;</script>")
temp_file = r"E:\AI\aa\temp_test_card.html"
with open(temp_file, "w", encoding="utf-8") as f:
    f.write(test_html)

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
proc = subprocess.run([chrome_path, "--headless=new", "--disable-gpu", "--dump-dom", f"file:///{temp_file.replace('\\', '/')}"], capture_output=True, text=True, encoding="utf-8", errors="replace")
dom = proc.stdout

print("=== Testing Card Mode DOM ===")
print("Couple div present:", "class=\"couple\"" in dom)
m_couple = re.search(r'<div class="couple">.*?</div>', dom, re.DOTALL)
if m_couple:
    print("Couple element markup:", m_couple.group(0))

print("\nReveal element present:", "class=\"reveal" in dom)
m_reveal = re.search(r'<div class="reveal.*?">.*?</div>', dom, re.DOTALL)
if m_reveal:
    print("Reveal element markup:\n", m_reveal.group(0))

print("\nCTA present:", "Save to Google Calendar" in dom)
print("Scratch canvas present:", "scratch-canvas" in dom)
print("Frame image present:", "frame-img" in dom)

if os.path.exists(temp_file):
    os.remove(temp_file)
