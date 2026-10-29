import os
import re
import base64
import shutil

ROOT_DIR = r"E:\AI\aa"

def get_base64_data_uri(filepath, mime_type):
    with open(filepath, "rb") as f:
        data = f.read()
    b64 = base64.b64encode(data).decode("ascii")
    return f"data:{mime_type};base64,{b64}"

print("1. Reading binary assets...")
bg_data_uri = get_base64_data_uri(
    os.path.join(ROOT_DIR, "assets.shaadipath.com/std-templates/std-01-sand/assets/save-the-date/savethedate_bg.webp"),
    "image/webp"
)
frame_data_uri = get_base64_data_uri(
    os.path.join(ROOT_DIR, "assets.shaadipath.com/std-templates/std-01-sand/assets/save-the-date/frame.webp"),
    "image/webp"
)
sand_data_uri = get_base64_data_uri(
    os.path.join(ROOT_DIR, "assets.shaadipath.com/std-templates/std-01-sand/assets/save-the-date/sand.webp"),
    "image/webp"
)
intro_data_uri = get_base64_data_uri(
    os.path.join(ROOT_DIR, "assets.shaadipath.com/std-templates/std-01-sand/assets/save-the-date/intro.mp4"),
    "video/mp4"
)
poster_data_uri = get_base64_data_uri(
    os.path.join(ROOT_DIR, "assets.shaadipath.com/std-templates/std-01-sand/assets/save-the-date/poster.webp"),
    "image/webp"
)
music_data_uri = get_base64_data_uri(
    os.path.join(ROOT_DIR, "assets.shaadipath.com/std-templates/std-01-sand/assets/music/std_demo_music.mp3"),
    "audio/mpeg"
)
og_data_uri = get_base64_data_uri(
    os.path.join(ROOT_DIR, "assets.shaadipath.com/std-templates/std-01-sand/assets/og/og_std1.png"),
    "image/png"
)

print("2. Inlining Google Fonts WOFF2 files...")
fonts_css_path = os.path.join(ROOT_DIR, "assets/fonts/fonts.css")
with open(fonts_css_path, "r", encoding="utf-8") as f:
    fonts_css = f.read()

font_urls = sorted(set(re.findall(r'url\((https://fonts\.gstatic\.com/[^)]+)\)', fonts_css)))
for i, f_url in enumerate(font_urls):
    font_file = os.path.join(ROOT_DIR, f"assets/fonts/font_{i:02d}_{os.path.basename(f_url)}")
    font_b64_uri = get_base64_data_uri(font_file, "font/woff2")
    fonts_css = fonts_css.replace(f_url, font_b64_uri)

print("3. Reading source HTML...")
source_html_path = os.path.join(ROOT_DIR, "www.shaadipath.com/api/preview/stde125.html")
with open(source_html_path, "r", encoding="utf-8") as f:
    html = f.read()

print("4. Patching HTML structure...")
# Remove base tag
html = re.sub(r'<base\s+href="[^"]*"\s*/?>\s*', '', html, flags=re.IGNORECASE)

# Remove HTTrack header comments and tags
html = re.sub(r'<!-- Mirrored from [^\n]+ -->\s*', '', html)
html = re.sub(r'<!-- Added by HTTrack -->.*?<!-- /Added by HTTrack -->\s*', '', html, flags=re.DOTALL)

# Remove Google Fonts external link & noscript tags
html = re.sub(r'<link\s+rel="preconnect"[^>]*>\s*', '', html)
html = re.sub(r'<link\s+rel="stylesheet"\s+href="https://fonts\.googleapis\.com/[^"]*"[^>]*>\s*', '', html)
html = re.sub(r'<noscript><link\s+rel="stylesheet"\s+href="https://fonts\.googleapis\.com/[^"]*"[^>]*></noscript>\s*', '', html)

# Insert inlined fonts CSS inside head
inlined_fonts_tag = f'<style id="inlined-fonts">\n{fonts_css}\n</style>\n'
html = html.replace('<meta name="color-scheme"', inlined_fonts_tag + '<meta name="color-scheme"')

# Remove preload links
html = re.sub(r'<link\s+rel="preload"[^>]*savethedate_bg\.webp[^>]*>\s*', '', html)
html = re.sub(r'<link\s+rel="preload"[^>]*frame\.webp[^>]*>\s*', '', html)

# Replace background image in CSS
html = html.replace(
    'https://assets.shaadipath.com/std-templates/std-01-sand/assets/save-the-date/savethedate_bg.webp',
    bg_data_uri
)

# Replace window.__resources JSON
# Original: window.__resources = { frameImg: "https://assets.shaadipath.com/std-templates/std-01-sand/assets/save-the-date/frame.webp", sandImg: "https://assets.shaadipath.com/std-templates/std-01-sand/assets/save-the-date/sand.webp", introVideo: "https://assets.shaadipath.com/std-templates/std-01-sand/assets/save-the-date/intro.mp4" };
html = html.replace('https://assets.shaadipath.com/std-templates/std-01-sand/assets/save-the-date/frame.webp', frame_data_uri)
html = html.replace('https://assets.shaadipath.com/std-templates/std-01-sand/assets/save-the-date/sand.webp', sand_data_uri)
html = html.replace('https://assets.shaadipath.com/std-templates/std-01-sand/assets/save-the-date/intro.mp4', intro_data_uri)

# Replace og:image and twitter:image
html = html.replace('../../../assets.shaadipath.com/std-templates/std-01-sand/assets/og/og_std1.png', og_data_uri)

# Replace audio src
html = html.replace('https://assets.shaadipath.com/std-templates/std-01-sand/assets/music/std_demo_music.mp3', music_data_uri)

# Remove Cloudflare telemetry script
html = re.sub(r'<script\s+type="module"\s+src="https://static\.cloudflareinsights\.com/[^"]*"[^>]*></script>\s*', '', html)

print("5. Patching and inlining app.js...")
app_js_path = os.path.join(ROOT_DIR, "assets.shaadipath.com/std-templates/std-01-sand/assets/save-the-date/app.js")
with open(app_js_path, "r", encoding="utf-8") as f:
    app_js = f.read()

# Replace hardcoded poster path in app.js
app_js_patched = app_js.replace('poster:"assets/save-the-date/poster.webp"', f'poster:"{poster_data_uri}"')

# Inline app.js into script tag
app_script_tag = f'<script>\n/* Inlined app.js */\n{app_js_patched}\n</script>'
html = re.sub(
    r'<script\s+src="[^"]*app\.js"></script>',
    lambda m: app_script_tag,
    html
)

print("6. Writing monolithic_bundle.html...")
bundle_path = os.path.join(ROOT_DIR, "monolithic_bundle.html")
with open(bundle_path, "w", encoding="utf-8") as f:
    f.write(html)
bundle_size = os.path.getsize(bundle_path)
print(f"monolithic_bundle.html created successfully ({bundle_size} bytes / {bundle_size / (1024*1024):.2f} MB)")

print("7. Copying to index.html at root...")
index_path = os.path.join(ROOT_DIR, "index.html")
shutil.copyfile(bundle_path, index_path)
print("Copied to index.html successfully.")
