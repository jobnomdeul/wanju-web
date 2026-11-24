#!/usr/bin/env python3
"""Update public metadata after a Pages URL/domain is confirmed. Does not alter DNS."""
import json, pathlib, sys, urllib.parse
root = pathlib.Path(__file__).resolve().parents[1]
url = sys.argv[1].rstrip('/') + '/' if len(sys.argv) == 2 else ''
parsed = urllib.parse.urlparse(url)
if parsed.scheme != 'https' or not parsed.netloc or parsed.query or parsed.fragment:
    raise SystemExit('Usage: python3 scripts/set-site-url.py https://your-confirmed-domain.example/')
config = root / 'site-config.json'
old = json.loads(config.read_text())['url']
for name in ['index.html', 'privacy.html', 'support.html', '404.html', 'sitemap.xml', 'robots.txt']:
    path = root / name
    path.write_text(path.read_text().replace(old, url))
config.write_text(json.dumps({'url': url}, indent=2) + '\n')
print('Updated canonical, social, sitemap, robots, and 404 URLs. Configure Pages/DNS separately.')
