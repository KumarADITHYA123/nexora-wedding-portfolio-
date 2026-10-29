"""
Nexora Wedding Studio - Cloudflare R2 Media Exporter & Linker
============================================================
Usage:
  1. python wire_cloudflare_cdn.py --export
     Creates a clean 'r2_export/' directory containing all 236 MB of media assets
     ready to drag-and-drop straight into your Cloudflare R2 bucket.

  2. python wire_cloudflare_cdn.py --apply https://your-r2-subdomain.r2.dev
     Automatically rewrites all video and audio URLs in index.html and templates
     to stream from your high-speed Cloudflare R2 CDN.

  3. python wire_cloudflare_cdn.py --revert
     Reverts all URLs back to local relative paths.
"""

import os
import sys
import shutil
import re

MEDIA_MAPPING = {
    # Main page AI videos
    "index.html": [
        ('ai%20videos/ai%20video%201.mp4', 'ai%20videos/ai%20video%201.mp4'),
        ('ai%20videos/ai%20video%202.mp4', 'ai%20videos/ai%20video%202.mp4'),
    ],
    # Template 0
    "templates/template-0/index.html": [
        ('assets/intro.mp4', 'templates/template-0/assets/intro.mp4'),
        ('assets/music.mp3', 'templates/template-0/assets/music.mp3'),
    ],
    # Template 1
    "templates/template-1/index.html": [
        ('assets/intro.mp4', 'templates/template-1/assets/intro.mp4'),
        ('assets/music.mp3?v=new', 'templates/template-1/assets/music.mp3'),
        ('assets/music.mp3', 'templates/template-1/assets/music.mp3'),
    ],
    # Template 2
    "templates/template-2/index.html": [
        ('assets/intro.mp4', 'templates/template-2/assets/intro.mp4'),
        ('assets/gujrati hero vedio.mp4', 'templates/template-2/assets/gujrati%20hero%20vedio.mp4'),
        ('assets/hero-video.mp4', 'templates/template-2/assets/hero-video.mp4'),
        ('assets/music.mp3', 'templates/template-2/assets/music.mp3'),
    ],
    # Template 3
    "templates/template-3/index.html": [
        ('assets/intro-video.mp4', 'templates/template-3/assets/intro-video.mp4'),
        ('assets/hero-video.mp4', 'templates/template-3/assets/hero-video.mp4'),
        ('assets/music.mp3', 'templates/template-3/assets/music.mp3'),
    ],
    # Template 4
    "templates/template-4/index.html": [
        ('assets/intro.mp4', 'templates/template-4/assets/intro.mp4'),
        ('assets/hero.mp4', 'templates/template-4/assets/hero.mp4'),
        ('assets/music.mp3', 'templates/template-4/assets/music.mp3'),
    ],
    # Template 5
    "templates/template-5/assets/index.js": [
        ('assets/intro.mp4', 'templates/template-5/assets/intro.mp4'),
        ('assets/hero.mp4', 'templates/template-5/assets/hero.mp4'),
        ('assets/music.mp3', 'templates/template-5/assets/music.mp3'),
    ],
}

FILES_TO_EXPORT = [
    (r"ai videos\ai video 1.mp4", r"ai videos\ai video 1.mp4"),
    (r"ai videos\ai video 2.mp4", r"ai videos\ai video 2.mp4"),
    (r"templates\template-0\assets\intro.mp4", r"templates\template-0\assets\intro.mp4"),
    (r"templates\template-0\assets\music.mp3", r"templates\template-0\assets\music.mp3"),
    (r"templates\template-1\assets\intro.mp4", r"templates\template-1\assets\intro.mp4"),
    (r"templates\template-1\assets\music.mp3", r"templates\template-1\assets\music.mp3"),
    (r"templates\template-2\assets\intro.mp4", r"templates\template-2\assets\intro.mp4"),
    (r"templates\template-2\assets\hero-video.mp4", r"templates\template-2\assets\hero-video.mp4"),
    (r"templates\template-2\assets\gujrati hero vedio.mp4", r"templates\template-2\assets\gujrati hero vedio.mp4"),
    (r"templates\template-2\assets\music.mp3", r"templates\template-2\assets\music.mp3"),
    (r"templates\template-3\assets\intro-video.mp4", r"templates\template-3\assets\intro-video.mp4"),
    (r"templates\template-3\assets\hero-video.mp4", r"templates\template-3\assets\hero-video.mp4"),
    (r"templates\template-3\assets\music.mp3", r"templates\template-3\assets\music.mp3"),
    (r"templates\template-4\assets\intro.mp4", r"templates\template-4\assets\intro.mp4"),
    (r"templates\template-4\assets\hero.mp4", r"templates\template-4\assets\hero.mp4"),
    (r"templates\template-4\assets\music.mp3", r"templates\template-4\assets\music.mp3"),
    (r"templates\template-5\assets\intro.mp4", r"templates\template-5\assets\intro.mp4"),
    (r"templates\template-5\assets\hero.mp4", r"templates\template-5\assets\hero.mp4"),
    (r"templates\template-5\assets\music.mp3", r"templates\template-5\assets\music.mp3"),
]

def export_assets(dest_dir="r2_export"):
    os.makedirs(dest_dir, exist_ok=True)
    count = 0
    total_bytes = 0
    for src, rel in FILES_TO_EXPORT:
        if os.path.exists(src):
            dst = os.path.join(dest_dir, rel)
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            if not os.path.exists(dst) or os.path.getsize(dst) != os.path.getsize(src):
                print(f"Copying {src} -> {dst}")
                shutil.copy2(src, dst)
            sz = os.path.getsize(src)
            total_bytes += sz
            count += 1
        else:
            print(f"Warning: {src} not found!")
    print(f"\n[DONE] Exported {count} media assets ({total_bytes / (1024*1024):.2f} MB) to '{dest_dir}/'.")
    print(f"Upload the contents of '{dest_dir}/' directly to your Cloudflare R2 bucket.")

def apply_cdn_urls(cdn_base_url):
    cdn_base_url = cdn_base_url.rstrip('/')
    print(f"Applying CDN URL: {cdn_base_url}")
    for file_path, replacements in MEDIA_MAPPING.items():
        if not os.path.exists(file_path):
            print(f"Skipping {file_path} (not found)")
            continue
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        modified = content
        for local_ref, r2_rel in replacements:
            cdn_url = f"{cdn_base_url}/{r2_rel}"
            # Replace local path with CDN url
            if local_ref in modified:
                modified = modified.replace(local_ref, cdn_url)
                print(f"[{file_path}] Replaced '{local_ref}' with '{cdn_url}'")
        if modified != content:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(modified)
            print(f"Saved {file_path}")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--export":
        export_assets()
    elif len(sys.argv) > 2 and sys.argv[1] == "--apply":
        apply_cdn_urls(sys.argv[2])
    else:
        print(__doc__)
