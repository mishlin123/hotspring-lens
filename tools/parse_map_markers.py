#!/usr/bin/env python3

import argparse
import csv
import html
import json
import re
from datetime import datetime, timezone
from pathlib import Path

BASE_URL = "https://1000springs.org.nz"
LICENCE = "Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International"
ATTRIBUTION = "1000 Springs Project authors, GNS Science, and University of Waikato"

PATTERN = re.compile(
    r'addInfoWindowMarker\(\s*'
    r'"(?P<system>(?:\\.|[^"\\])*)"\s*,\s*'
    r'"(?P<lat>-?\d+(?:\.\d+)?)"\s*,\s*'
    r'"(?P<lng>-?\d+(?:\.\d+)?)"\s*,\s*'
    r'"(?P<name>(?:\\.|[^"\\])*)"\s*,\s*'
    r'"(?P<description>(?:\\.|[^"\\])*)"\s*,\s*'
    r'map\s*,\s*'
    r"""['"](?P<path>/samplesite/\d+)['"]\s*"""
    r'\)',
    re.DOTALL,
)


def clean_js_html_string(value: str) -> str:
    value = value.replace('\\"', '"').replace("\\'", "'")
    value = html.unescape(value)
    value = re.sub(r"\s+", " ", value).strip()
    return value


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", default="data/raw/mapsearch_page_source.html")
    parser.add_argument("--json-out", default="data/processed/map_markers.json")
    parser.add_argument("--csv-out", default="data/processed/map_markers.csv")
    parser.add_argument("--seed-out", default="data/raw/seed_urls_from_map.txt")
    args = parser.parse_args()

    input_path = Path(args.input)
    json_out = Path(args.json_out)
    csv_out = Path(args.csv_out)
    seed_out = Path(args.seed_out)

    json_out.parent.mkdir(parents=True, exist_ok=True)
    csv_out.parent.mkdir(parents=True, exist_ok=True)
    seed_out.parent.mkdir(parents=True, exist_ok=True)

    text = input_path.read_text(errors="replace")
    records = []
    seen_ids = set()

    for match in PATTERN.finditer(text):
        path = match.group("path")
        source_id = path.rsplit("/", 1)[-1]
        if source_id in seen_ids:
            continue
        seen_ids.add(source_id)

        records.append({
            "source_id": source_id,
            "source_url": f"{BASE_URL}{path}",
            "path": path,
            "geothermal_system": clean_js_html_string(match.group("system")),
            "latitude": float(match.group("lat")),
            "longitude": float(match.group("lng")),
            "name": clean_js_html_string(match.group("name")),
            "map_description": clean_js_html_string(match.group("description")),
            "source": "manually saved 1000 Springs mapsearch page source",
            "source_licence": LICENCE,
            "attribution": ATTRIBUTION,
            "parsed_at_utc": datetime.now(timezone.utc).isoformat(),
        })

    records.sort(key=lambda x: int(x["source_id"]))
    json_out.write_text(json.dumps(records, indent=2, ensure_ascii=False))

    if records:
        with csv_out.open("w", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=list(records[0].keys()))
            writer.writeheader()
            writer.writerows(records)

    seed_out.write_text("\n".join(record["source_url"] for record in records) + ("\n" if records else ""))

    print(f"Parsed {len(records)} map markers")
    print(f"Wrote JSON: {json_out}")
    print(f"Wrote CSV: {csv_out}")
    print(f"Wrote seed URLs: {seed_out}")

    if records:
        print("\nFirst 5 records:")
        for record in records[:5]:
            print(f"{record['source_id']}: {record['geothermal_system']} | {record['name']} | {record['latitude']}, {record['longitude']}")


if __name__ == "__main__":
    main()
