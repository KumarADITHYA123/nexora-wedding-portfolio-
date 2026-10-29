import subprocess
import re

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
file_url = "file:///E:/AI/aa/monolithic_bundle.html"
proc = subprocess.run([chrome_path, "--headless=new", "--disable-gpu", "--dump-dom", file_url], capture_output=True, text=True, encoding="utf-8", errors="replace")
dom = proc.stdout

# Look for couple markup
m = re.search(r'<div class="couple">.*?</div>', dom, re.DOTALL)
if m:
    print("Couple HTML in DOM:\n", m.group(0))

# Look for reveal container
m_reveal = re.search(r'<div class="reveal.*?">.*?</div>', dom, re.DOTALL)
if m_reveal:
    print("\nReveal HTML in DOM:\n", m_reveal.group(0)[:400])

# Look for audio and music toggle
m_audio = re.search(r'<audio.*?</audio>', dom, re.DOTALL)
if m_audio:
    print("\nAudio tag src starts with:\n", m_audio.group(0)[:80])

# Check for console or unhandled script errors
print("\nIs root populated:", len(dom) > 10000)
