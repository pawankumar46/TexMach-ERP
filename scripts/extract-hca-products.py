import json
import urllib.request
from pathlib import Path

OUT = Path(r"d:\HCA\hca-project\src\data\hca-catalog.json")
OUT.parent.mkdir(parents=True, exist_ok=True)

headers = {"User-Agent": "Mozilla/5.0 (compatible; HCA-ERP-Demo/1.0)"}
all_products = []

for page in range(1, 3):
    url = f"https://www.grouphca.com/products.json?limit=50&page={page}"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=30) as response:
        payload = json.loads(response.read().decode("utf-8"))
    items = payload.get("products", [])
    all_products.extend(items)
    if len(items) < 50:
        break

catalog = []
seen = set()
for product in all_products:
    handle = product.get("handle")
    if handle in seen:
        continue
    seen.add(handle)
    images = product.get("images") or []
    variants = product.get("variants") or [{}]
    variant = variants[0] or {}
    sku = (variant.get("sku") or "").strip()
    if not sku:
        sku = (product.get("handle") or "SKU").upper().replace("-", "")[:16]
    catalog.append(
        {
            "sourceId": product.get("id"),
            "name": product.get("title"),
            "handle": handle,
            "sku": sku,
            "brand": product.get("vendor") or "HCA",
            "category": product.get("product_type") or "Sewing",
            "tags": product.get("tags") or [],
            "image": images[0]["src"] if images else "",
            "model": variant.get("title") if variant.get("title") != "Default Title" else sku,
        }
    )

OUT.write_text(json.dumps(catalog[:48], indent=2, ensure_ascii=False), encoding="utf-8")
print(f"wrote {min(len(catalog), 48)} of {len(catalog)} products to {OUT}")
for item in catalog[:12]:
    print(f"{item['sku'][:20]:20} | {item['brand'][:14]:14} | {item['name'][:60]}")
