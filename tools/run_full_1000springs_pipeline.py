#!/usr/bin/env python3

import argparse
import csv
import html
import json
import random
import re
import time
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import quote

import requests
from bs4 import BeautifulSoup

BASE_URL = "https://1000springs.org.nz"
USER_AGENT = "HotSpringLens non-commercial research prototype with permission; contact: hamishkentlindsay@gmail.com"
LICENCE = "Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International"
ATTRIBUTION = "1000 Springs Project authors, GNS Science, and University of Waikato"

PERMISSION_FILE = Path("docs/1000SPRINGS_DATA_PERMISSION.md")


def now():
    return datetime.now(timezone.utc).isoformat()


def clean(value):
    if value is None:
        return None
    value = html.unescape(str(value))
    value = re.sub(r"\s+", " ", value).strip()
    return value or None


def number(value):
    value = clean(value)
    if not value:
        return None
    match = re.search(r"-?\d+(?:\.\d+)?", value)
    return float(match.group(0)) if match else None


def sample_id_from_url(url):
    return url.rstrip("/").split("/")[-1]


def sleep_random(min_delay, max_delay):
    delay = random.uniform(min_delay, max_delay)
    print(f"  sleeping {delay:.1f}s")
    time.sleep(delay)


def ensure_permission_file():
    PERMISSION_FILE.parent.mkdir(parents=True, exist_ok=True)

    if PERMISSION_FILE.exists():
        return

    PERMISSION_FILE.write_text(
        """# 1000 Springs data permission note

This project has permission to collect public 1000 Springs sample-site overview, chemistry, and taxonomy data for a free, non-commercial educational/research app and companion website.

Project constraints:
- no paid app
- no advertisements
- no subscriptions
- no sale of data
- preserve attribution
- preserve source URLs
- preserve CC BY-NC-SA 4.0 licensing
- preserve hot spring safety warnings
- respect access restrictions and sensitive-site requirements

Crawler behaviour:
- uses a clear User-Agent
- fetches slowly
- adds random delay between requests
- saves local copies for reproducibility
- resumes from existing files
- does not bypass login, authentication, or private endpoints
"""
    )


def fetch_sample_pages(seed_urls_path, html_dir, log_path, min_delay, max_delay, limit=None):
    html_dir.mkdir(parents=True, exist_ok=True)
    log_path.parent.mkdir(parents=True, exist_ok=True)

    urls = [
        line.strip()
        for line in seed_urls_path.read_text().splitlines()
        if line.strip() and not line.strip().startswith("#")
    ]

    if limit:
        urls = urls[:limit]

    headers = {"User-Agent": USER_AGENT}

    with log_path.open("a") as log:
        if log_path.stat().st_size == 0:
            log.write("timestamp_utc,sample_id,url,status,bytes,message\n")

        for i, url in enumerate(urls, start=1):
            sid = sample_id_from_url(url)
            out_path = html_dir / f"samplesite_{sid}.html"

            if out_path.exists() and out_path.stat().st_size > 1000:
                print(f"[skip html] {i}/{len(urls)} {sid}")
                continue

            print(f"[fetch html] {i}/{len(urls)} {url}")

            try:
                response = requests.get(url, headers=headers, timeout=45)
                status = response.status_code
                size = len(response.text)

                if status == 200 and "Sample Number" in response.text:
                    out_path.write_text(response.text)
                    message = "ok"
                else:
                    message = "unexpected_response"

                print(f"  -> {status} {size} bytes {message}")
                log.write(f"{now()},{sid},{url},{status},{size},{message}\n")
                log.flush()

            except Exception as exc:
                print(f"  -> ERROR {exc}")
                log.write(f"{now()},{sid},{url},ERROR,0,{repr(exc)}\n")
                log.flush()

            sleep_random(min_delay, max_delay)


def extract_title(soup):
    h2 = soup.find("h2")
    return clean(h2.get_text(" ")) if h2 else None


def extract_description_and_safety(soup):
    overview = soup.select_one("#overviewTab")
    if not overview:
        return None, None

    paragraphs = [clean(p.get_text(" ")) for p in overview.find_all("p")]
    paragraphs = [p for p in paragraphs if p]

    safety = None
    description = None

    for p in paragraphs:
        if "Hot springs can cause serious injury and death" in p:
            safety = p
        elif description is None:
            description = p

    return description, safety


def extract_table_values(soup):
    values = {}

    for row in soup.select("table.descTable tr"):
        h5 = row.find("h5")
        cells = row.find_all("td")

        if not h5 or len(cells) < 2:
            continue

        label = clean(h5.get_text(" "))
        if not label:
            continue

        label = label.replace(":", "").strip()
        value = clean(cells[1].get_text(" "))
        values[label] = value

    return values


def extract_temp_ph_from_js(text):
    temp = None
    ph = None

    temp_match = re.search(
        r"var\s+tempBar\s*=\s*\(\{.*?current\s*:\s*(-?\d+(?:\.\d+)?)",
        text,
        re.DOTALL,
    )

    ph_match = re.search(
        r"var\s+phBar\s*=\s*\(\{.*?current\s*:\s*(-?\d+(?:\.\d+)?)",
        text,
        re.DOTALL,
    )

    if temp_match:
        temp = float(temp_match.group(1))

    if ph_match:
        ph = float(ph_match.group(1))

    return temp, ph


def extract_marker_from_js(text):
    match = re.search(
        r'addInfoWindowMarker\(\s*'
        r'"(?P<system>(?:\\.|[^"\\])*)"\s*,\s*'
        r'"(?P<lat>-?\d+(?:\.\d+)?)"\s*,\s*'
        r'"(?P<lng>-?\d+(?:\.\d+)?)"\s*,\s*'
        r'"(?P<name>(?:\\.|[^"\\])*)"\s*,\s*'
        r'"(?P<desc>(?:\\.|[^"\\])*)"\s*,\s*'
        r'sampleSiteMap',
        text,
        re.DOTALL,
    )

    if not match:
        return {}

    return {
        "geothermal_system": clean(match.group("system")),
        "latitude": float(match.group("lat")),
        "longitude": float(match.group("lng")),
        "marker_name": clean(match.group("name")),
        "marker_description": clean(match.group("desc")),
    }


def extract_status(text):
    match = re.search(r'statusGraph\("#status"\s*,\s*(\d+)\s*\)', text)
    return int(match.group(1)) if match else None


def extract_images(soup):
    img = soup.select_one("img#sampleSiteImg")
    image_url = img.get("src") if img else None

    large_image_url = None
    if img:
        parent = img.find_parent("a")
        if parent:
            large_image_url = parent.get("href")

    return clean(image_url), clean(large_image_url)


def source_id_from_file(path):
    match = re.search(r"(\d+)", path.stem)
    return match.group(1) if match else None


def parse_sample_html_file(path):
    text = path.read_text(errors="replace")
    soup = BeautifulSoup(text, "html.parser")

    source_id = source_id_from_file(path)
    values = extract_table_values(soup)
    description, safety = extract_description_and_safety(soup)
    temp, ph = extract_temp_ph_from_js(text)
    image_url, large_image_url = extract_images(soup)

    record = {
        "source_id": source_id,
        "source_url": f"{BASE_URL}/samplesite/{source_id}" if source_id else None,
        "name": extract_title(soup),
        "description": description,
        "safety_warning": safety,
        "location_text": values.get("Location"),
        "sample_number": values.get("Sample Number"),
        "sample_date": values.get("Sample Date"),
        "feature_type": values.get("Feature Type"),
        "temperature_c": temp,
        "ph": ph,
        "size_approx": values.get("Size (approx)"),
        "ebullition": values.get("Ebullition"),
        "oxidation_reduction_potential_mv": number(values.get("Oxidation Reduction Potential")),
        "oxidation_reduction_potential_raw": values.get("Oxidation Reduction Potential"),
        "conductivity_us_cm": number(values.get("Conductivity")),
        "conductivity_raw": values.get("Conductivity"),
        "dissolved_oxygen_mg_l": number(values.get("Dissolved Oxygen")),
        "dissolved_oxygen_raw": values.get("Dissolved Oxygen"),
        "turbidity_fnu": number(values.get("Turbidity")),
        "turbidity_raw": values.get("Turbidity"),
        "status_code": extract_status(text),
        "image_url": image_url,
        "large_image_url": large_image_url,
        "source_licence": LICENCE,
        "attribution": ATTRIBUTION,
        "parsed_at_utc": now(),
    }

    record.update(extract_marker_from_js(text))
    return record


def write_json(path, records):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(records, indent=2, ensure_ascii=False))


def write_csv(path, records):
    path.parent.mkdir(parents=True, exist_ok=True)

    if not records:
        path.write_text("")
        return

    fieldnames = sorted({key for record in records for key in record.keys()})

    with path.open("w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(records)


def parse_all_sample_pages(html_dir, json_out, csv_out):
    html_files = sorted(html_dir.glob("samplesite_*.html"))
    records = [parse_sample_html_file(path) for path in html_files]

    write_json(json_out, records)
    write_csv(csv_out, records)

    print(f"[parsed overview] {len(records)} records")
    print(f"  -> {json_out}")
    print(f"  -> {csv_out}")

    missing_sample = sum(1 for r in records if not r.get("sample_number"))
    missing_temp = sum(1 for r in records if r.get("temperature_c") is None)
    missing_ph = sum(1 for r in records if r.get("ph") is None)

    print(f"  missing sample number: {missing_sample}")
    print(f"  missing temperature:   {missing_temp}")
    print(f"  missing pH:            {missing_ph}")

    return records


def fetch_json_endpoint(url, out_path, headers):
    if out_path.exists() and out_path.stat().st_size > 5:
        return "skip_existing", out_path.stat().st_size

    response = requests.get(url, headers=headers, timeout=45)

    if response.status_code == 200:
        try:
            json.loads(response.text)
            out_path.write_text(response.text)
            return "ok", len(response.text)
        except Exception:
            out_path.write_text(response.text)
            return "invalid_json_saved_for_inspection", len(response.text)

    return f"status_{response.status_code}", len(response.text)


def fetch_all_ajax(details, chem_dir, tax_dir, log_path, min_delay, max_delay, limit=None):
    chem_dir.mkdir(parents=True, exist_ok=True)
    tax_dir.mkdir(parents=True, exist_ok=True)
    log_path.parent.mkdir(parents=True, exist_ok=True)

    if limit:
        details = details[:limit]

    headers = {"User-Agent": USER_AGENT}

    with log_path.open("a") as log:
        if log_path.stat().st_size == 0:
            log.write("timestamp_utc,sample_number,kind,url,status,bytes\n")

        for i, record in enumerate(details, start=1):
            sample_number = record.get("sample_number")

            if not sample_number:
                print(f"[skip ajax] {i}/{len(details)} no sample number")
                continue

            safe = quote(sample_number, safe="")

            jobs = [
                ("chemistry", f"{BASE_URL}/chemistryJson/{safe}", chem_dir / f"{sample_number}.json"),
                ("taxonomy", f"{BASE_URL}/taxonomyJson/{safe}", tax_dir / f"{sample_number}.json"),
            ]

            for kind, url, out_path in jobs:
                print(f"[fetch ajax] {i}/{len(details)} {sample_number} {kind}")

                try:
                    status, size = fetch_json_endpoint(url, out_path, headers)
                    print(f"  -> {status} {size} bytes")
                except Exception as exc:
                    status, size = f"ERROR:{repr(exc)}", 0
                    print(f"  -> {status}")

                log.write(f"{now()},{sample_number},{kind},{url},{status},{size}\n")
                log.flush()

                sleep_random(min_delay, max_delay)


def parse_chemistry_tree(sample_number, data):
    records = []

    def walk(node):
        children = node.get("children") or []

        if not children and "name" in node and "size" in node:
            records.append({
                "sample_number": sample_number,
                "analyte": node["name"],
                "value": node["size"],
                "unit_note": "ppm_or_mg_per_l_except_CO_H2_CH4_as_microM",
            })

        for child in children:
            walk(child)

    walk(data)
    return records


def parse_taxonomy_tree(sample_number, data):
    records = []

    def walk(node, lineage):
        name = node.get("name")
        rank = node.get("taxa")
        size = node.get("size")

        next_lineage = lineage[:]
        if name:
            next_lineage.append(name)

        if name and rank:
            records.append({
                "sample_number": sample_number,
                "taxon_name": name,
                "taxonomic_rank": rank,
                "size": size,
                "lineage": "; ".join(next_lineage),
            })

        for child in node.get("children") or []:
            walk(child, next_lineage)

    walk(data, [])
    return records


def parse_ajax_json(chem_dir, tax_dir, chem_json_out, chem_csv_out, tax_json_out, tax_csv_out):
    chemistry = []
    taxonomy = []

    for path in sorted(chem_dir.glob("*.json")):
        sample_number = path.stem
        try:
            chemistry.extend(parse_chemistry_tree(sample_number, json.loads(path.read_text())))
        except Exception as exc:
            print(f"[warn] Could not parse chemistry {path}: {exc}")

    for path in sorted(tax_dir.glob("*.json")):
        sample_number = path.stem
        try:
            taxonomy.extend(parse_taxonomy_tree(sample_number, json.loads(path.read_text())))
        except Exception as exc:
            print(f"[warn] Could not parse taxonomy {path}: {exc}")

    write_json(chem_json_out, chemistry)
    write_csv(chem_csv_out, chemistry)
    write_json(tax_json_out, taxonomy)
    write_csv(tax_csv_out, taxonomy)

    print(f"[parsed chemistry] {len(chemistry)} records")
    print(f"[parsed taxonomy]  {len(taxonomy)} records")

    return chemistry, taxonomy


def build_full_app_dataset(details, chemistry, taxonomy, out_path):
    chem_by_sample = defaultdict(list)
    tax_by_sample = defaultdict(list)

    for record in chemistry:
        chem_by_sample[record["sample_number"]].append(record)

    for record in taxonomy:
        tax_by_sample[record["sample_number"]].append(record)

    app_records = []

    for record in details:
        sample_number = record.get("sample_number")

        top_chemistry = sorted(
            chem_by_sample.get(sample_number, []),
            key=lambda x: float(x.get("value") or 0),
            reverse=True,
        )[:10]

        top_taxa = sorted(
            [x for x in tax_by_sample.get(sample_number, []) if x.get("size") is not None],
            key=lambda x: float(x.get("size") or 0),
            reverse=True,
        )[:10]

        app_records.append({
            "id": record.get("source_id"),
            "name": record.get("name"),
            "source_url": record.get("source_url"),
            "geothermal_system": record.get("geothermal_system"),
            "latitude": record.get("latitude"),
            "longitude": record.get("longitude"),
            "location_text": record.get("location_text"),
            "description": record.get("description"),
            "sample_number": sample_number,
            "sample_date": record.get("sample_date"),
            "feature_type": record.get("feature_type"),
            "temperature_c": record.get("temperature_c"),
            "ph": record.get("ph"),
            "size_approx": record.get("size_approx"),
            "ebullition": record.get("ebullition"),
            "oxidation_reduction_potential_mv": record.get("oxidation_reduction_potential_mv"),
            "conductivity_us_cm": record.get("conductivity_us_cm"),
            "dissolved_oxygen_mg_l": record.get("dissolved_oxygen_mg_l"),
            "turbidity_fnu": record.get("turbidity_fnu"),
            "image_url": record.get("image_url"),
            "large_image_url": record.get("large_image_url"),
            "safety_warning": record.get("safety_warning"),
            "chemistry_record_count": len(chem_by_sample.get(sample_number, [])),
            "taxonomy_record_count": len(tax_by_sample.get(sample_number, [])),
            "top_chemistry": top_chemistry,
            "top_taxa": top_taxa,
            "licence": record.get("source_licence"),
            "attribution": record.get("attribution"),
            "built_at_utc": now(),
        })

    write_json(out_path, app_records)
    print(f"[built app dataset] {len(app_records)} records -> {out_path}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--seed-urls", default="data/raw/seed_urls_from_map.txt")
    parser.add_argument("--html-dir", default="data/raw/html")
    parser.add_argument("--chem-dir", default="data/raw/chemistry_json")
    parser.add_argument("--tax-dir", default="data/raw/taxonomy_json")
    parser.add_argument("--processed-dir", default="data/processed")
    parser.add_argument("--log-dir", default="data/raw/fetch_logs")
    parser.add_argument("--min-delay", type=float, default=2.0)
    parser.add_argument("--max-delay", type=float, default=6.0)
    parser.add_argument("--limit", type=int, default=None)
    parser.add_argument("--skip-html-fetch", action="store_true")
    parser.add_argument("--skip-ajax-fetch", action="store_true")
    args = parser.parse_args()

    ensure_permission_file()

    seed_urls = Path(args.seed_urls)
    html_dir = Path(args.html_dir)
    chem_dir = Path(args.chem_dir)
    tax_dir = Path(args.tax_dir)
    processed_dir = Path(args.processed_dir)
    log_dir = Path(args.log_dir)

    if not seed_urls.exists():
        raise SystemExit(f"Missing seed URL file: {seed_urls}")

    if not args.skip_html_fetch:
        fetch_sample_pages(
            seed_urls_path=seed_urls,
            html_dir=html_dir,
            log_path=log_dir / "sample_pages_fetch_log.csv",
            min_delay=args.min_delay,
            max_delay=args.max_delay,
            limit=args.limit,
        )

    details = parse_all_sample_pages(
        html_dir=html_dir,
        json_out=processed_dir / "sample_details_full.json",
        csv_out=processed_dir / "sample_details_full.csv",
    )

    if not args.skip_ajax_fetch:
        fetch_all_ajax(
            details=details,
            chem_dir=chem_dir,
            tax_dir=tax_dir,
            log_path=log_dir / "ajax_fetch_log.csv",
            min_delay=args.min_delay,
            max_delay=args.max_delay,
            limit=args.limit,
        )

    chemistry, taxonomy = parse_ajax_json(
        chem_dir=chem_dir,
        tax_dir=tax_dir,
        chem_json_out=processed_dir / "chemistry_records_full.json",
        chem_csv_out=processed_dir / "chemistry_records_full.csv",
        tax_json_out=processed_dir / "taxonomy_records_full.json",
        tax_csv_out=processed_dir / "taxonomy_records_full.csv",
    )

    build_full_app_dataset(
        details=details,
        chemistry=chemistry,
        taxonomy=taxonomy,
        out_path=processed_dir / "springs_app_dataset_full.json",
    )

    print("\nDone.")
    print("Main outputs:")
    print("  data/processed/sample_details_full.json")
    print("  data/processed/chemistry_records_full.json")
    print("  data/processed/taxonomy_records_full.json")
    print("  data/processed/springs_app_dataset_full.json")


if __name__ == "__main__":
    main()
