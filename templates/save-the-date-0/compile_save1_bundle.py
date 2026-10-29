import os
import re
import base64
import shutil

SAVE1_DIR = r"C:\Users\eshhb\Downloads\save the date\save 1"
PEACOCK_DIR = os.path.join(SAVE1_DIR, r"assets.shaadipath.com\std-templates\std-02-peacock")
ASSETS_DIR = os.path.join(PEACOCK_DIR, "assets")
FONTS_DIR = os.path.join(SAVE1_DIR, r"assets\fonts")

def to_data_uri(filepath, mime):
    with open(filepath, "rb") as f:
        data = f.read()
    b64 = base64.b64encode(data).decode("ascii")
    return f"data:{mime};base64,{b64}"

print("1. Converting binary assets to Base64...")
jharoka_uri = to_data_uri(os.path.join(ASSETS_DIR, "Jharoka.webp"), "image/webp")
petal_uri = to_data_uri(os.path.join(ASSETS_DIR, "petal_shaadi.webp"), "image/webp")
bg_uri = to_data_uri(os.path.join(ASSETS_DIR, "savethedate_bg.webp"), "image/webp")
music_uri = to_data_uri(os.path.join(ASSETS_DIR, "std_demo_music.mp3"), "audio/mpeg")
intro_uri = to_data_uri(os.path.join(ASSETS_DIR, "intro.mp4"), "video/mp4")
poster_uri = to_data_uri(os.path.join(ASSETS_DIR, "poster.webp"), "image/webp")
og_uri = to_data_uri(os.path.join(ASSETS_DIR, r"og\og_std2.png"), "image/png")

print("2. Converting WOFF2 fonts...")
fonts_css_file = os.path.join(FONTS_DIR, "fonts.css")
with open(fonts_css_file, "r", encoding="utf-8") as f:
    fonts_css = f.read()

font_urls = sorted(set(re.findall(r'url\((https://fonts\.gstatic\.com/[^)]+)\)', fonts_css)))
for i, f_url in enumerate(font_urls):
    font_file = os.path.join(FONTS_DIR, f"font_{i:02d}_{os.path.basename(f_url)}")
    font_uri = to_data_uri(font_file, "font/woff2")
    fonts_css = fonts_css.replace(f_url, font_uri)

print("3. Inlining styles.css...")
styles_file = os.path.join(PEACOCK_DIR, "styles.css")
with open(styles_file, "r", encoding="utf-8") as f:
    styles_css = f.read()

# Replace bg in css
styles_css = styles_css.replace("assets/savethedate_bg.webp", bg_uri)

print("4. Patching app.js...")
app_js_file = os.path.join(ASSETS_DIR, "app.js")
with open(app_js_file, "r", encoding="utf-8") as f:
    app_js = f.read()

app_js = app_js.replace('"assets/petal_shaadi.webp"', f'"{petal_uri}"')
app_js = app_js.replace('"assets/intro.mp4"', f'"{intro_uri}"')
app_js = app_js.replace('"assets/poster.webp"', f'"{poster_uri}"')
app_js = app_js.replace('"assets/Jharoka.webp"', f'"{jharoka_uri}"')

print("5. Processing HTML...")
html_file = os.path.join(SAVE1_DIR, r"www.shaadipath.com\api\preview\stdb25e.html")
with open(html_file, "r", encoding="utf-8") as f:
    html = f.read()

# Strip base tag
html = re.sub(r'<base\s+href="[^"]*"\s*/?>\s*', '', html, flags=re.IGNORECASE)
# Strip HTTrack comments
html = re.sub(r'<!-- Mirrored from [^\n]+ -->\s*', '', html)
html = re.sub(r'<!-- Added by HTTrack -->.*?<!-- /Added by HTTrack -->\s*', '', html, flags=re.DOTALL)
# Remove font links
html = re.sub(r'<link\s+rel="preconnect"[^>]*>\s*', '', html)
html = re.sub(r'<link\s+rel="stylesheet"[^>]*fonts\.googleapis\.com[^>]*>\s*', '', html)
html = re.sub(r'<noscript><link\s+rel="stylesheet"[^>]*fonts\.googleapis\.com[^>]*></noscript>\s*', '', html)
# Remove preload links
html = re.sub(r'<link\s+rel="preload"[^>]*>\s*', '', html)
# Remove cloudflare beacon
html = re.sub(r'<script\s+type="module"\s+src="https://static\.cloudflareinsights\.com/[^"]*"[^>]*></script>\s*', '', html)

# Replace og and twitter images
html = html.replace('../../../assets.shaadipath.com/std-templates/std-02-peacock/assets/og/og_std2.png', og_uri)
# Replace audio src
html = html.replace('https://assets.shaadipath.com/std-templates/std-02-peacock/assets/std_demo_music.mp3', music_uri)

# Replace external styles.css link with inline style tag containing fonts + styles
combined_styles = f'<style id="inlined-fonts">\n{fonts_css}\n</style>\n<style id="inlined-theme">\n{styles_css}\n</style>'
html = re.sub(r'<link\s+rel="stylesheet"\s+href="[^"]*styles\.css"\s*/?>', lambda m: combined_styles, html)

# Replace app.js script tag with inlined script
inlined_app_script = f'<script>\n/* Inlined app.js */\n{app_js}\n</script>'
html = re.sub(r'<script\s+src="[^"]*app\.js"></script>', lambda m: inlined_app_script, html)

output_bundle = os.path.join(SAVE1_DIR, "monolithic_bundle.html")
with open(output_bundle, "w", encoding="utf-8") as f:
    f.write(html)
bundle_size = os.path.getsize(output_bundle)
print(f"Created monolithic_bundle.html: {bundle_size:,} bytes ({bundle_size / (1024*1024):.2f} MB)")

output_index = os.path.join(SAVE1_DIR, "index.html")
shutil.copyfile(output_bundle, output_index)
print("Copied to index.html successfully.")
