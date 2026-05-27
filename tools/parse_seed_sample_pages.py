#!/usr/bin/env python3

import argparse
import csv
import json
import re
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup


LICENCE = "Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International"
ATTRIBUTION = "1000 Springs Project authors, GNS Science, and University of Waikato"


def clean(text):
    if text is None:
        return None
    text = re.sub(r"\s+", " ", text).strip()
    return text or None


def numeric(text):
    if not text:
        return None
    match = re.search(r"-?\d+(?:\.\d+)?", text)
    return float(match.group(0)) if match else None


def sample_id_from_url(url):
    match = re.search(r"/samplesite/(\d+)", url)
    return match.group(1) if match else None


def get_lines(soup):
    text = soup.get_text("\n")
    lines = [clean(x) for x in text.splitlines()]
    return [x for x in lines if x]


def value_after(lines, label):
    label_norm = label.lower().replace(":", "").strip()

    for i, line in enumerate(lines):
        line_norm = line.lower().replace(":", "").strip()

        if line_norm == label_norm:
            for candidate in lines[i + 1 : i + 8]:
                if candidate and not candidate.endswith(":"):
                    return candidate

        # Handles split labels like:
        # Oxidation Reduction
        # Potential:
        if i + 1 < len(lines):
            combined = f"{line} {lines[i + 1]}".lower().replace(":", "").strip()
            if combined == label_norm:
                for candidate in lines[i + 2 : i + 9]:
                    if candidate and not candidate.endswith(":"):
                        return candidate

    return None


def extract_description(lines):
    for i, line in enumerate(lines):
        if "hot springs can cause serious injury and death" in line.lower():
            desc = []
            for candidate in lines[i + 1 : i + 8]:
                if candidate in {
                    "Location:",
                    "Sample Number:",
                    "Sample Date:",
                    "Feature Type:",
                    "Temperature:",
                    "pH:",
                }:
                    break
                if candidate and not candidate.endswith(":"):
                    desc.append(candidate)
            return clean(" ".join(desc))
    return None


def extract_title(lines):
    # Title usually appears after Home
    for i, line in enumerate(lines):
        if line == "Home" and i + 1 < len(lines):
            return lines[i + 1]

    # Fallback: first line before Overview that is not site chrome
    skip = {
        "The microbiology of geothermal hotsprings in New Zealand",
        "Login",
        "About",
        "Search",
        "Browse",
        "Our Science",
        "Home",
    }
    for line in lines:
        if line not in skip and line not in {"Overview", "Chemical Composition", "Microbial Diversity"}:
            return line

    return None


def parse_sample_page(url, html):
    soup = BeautifulSoup(html, "html.parser")
    lines = get_lines(soup)

    title = extract_title(lines)

    location = value_after(lines, "Location")
    sample_number = value_after(lines, "Sample Number")
    sample_date = value_after(lines, "Sample Date")
    feature_type = value_after(lines, "Feature Type")
    temperature = value_after(lines, "Temperature")
    ph = value_after(lines, "pH")
    size = value_after(lines, "Size (approx)")
    ebullition = value_after(lines, "Ebullition")
    orp = value_after(lines, "Oxidation Reduction Potential")
    conductivity = value_after(lines, "Conductivity")
    dissolved_oxygen = value_after(lines, "Dissolved Oxygen")
    turbidity = value_after(lines, "Turbidity")

    safety_warning = None
    for line in lines:
        if "hot springs can cause serious injury and death" in line.lower():
            safety_warning = line
            break

    return {
        "source_id": sample_id_from_url(url),
        "source_url": url,
        "name": title,
        "description": extract_description(lines),
        "location_text": location,
        "sample_number": sample_number,
        "sample_date": sample_date,
        "feature_type": feature_type,
        "temperature_c": numeric(temperature),
        "temperature_raw": temperature,
        "ph": numeric(ph),
        "ph_raw": ph,
        "size_approx": size,
        "ebullition": ebullition,
        "oxidation_reduction_potential_mv": numeric(orp),
        "oxidation_reduction_potential_raw": orp,
        "conductivity_us_cm": numeric(conductivity),
        "conductivity_raw": conductivity,
        "dissolved_oxygen_mg_l": numeric(dissolved_oxygen),
        "dissolved_oxygen_raw": dissolved_oxygen,
        "turbidity_fnu": numeric(turbidity),
        "turbidity_raw": turbidity,
        "safety_warning": safety_warning,
        "source_licence": LICENCE,
        "attribution": ATTRIBUTION,
        "accessed_at_utc": datetime.now(timezone.utc).isoformat(),
    }


def fetch(url):
    headers = {
        "User-Agent": "HotSpringLens non-commercial research prototype; contact: hamishkentlindsay@gmail.com"
    }
    response = requests.get(url, headers=headers, timeout=30)
    response.raise_for_status()
    return response.text


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--json-out", required=True)
    parser.add_argument("--csv-out", required=True)
    parser.add_argument("--save-html", action="store_true")
    parser.add_argument("--delay", type=float, default=1.0)
    args = parser.parse_args()

    input_path = Path(args.input)
    json_out = Path(args.json_out)
    csv_out = Path(args.csv_out)

    json_out.parent.mkdir(parents=True, exist_ok=True)
    csv_out.parent.mkdir(parents=True, exist_ok=True)

    urls = [
        line.strip()
        for line in input_path.read_text().splitlines()
        if line.strip() and not line.strip().startswith("#")
    ]

    records = []

    html_dir = Path("data/raw/html")
    if args.save_html:
        html_dir.mkdir(parents=True, exist_ok=True)

    for url in urls:
        print(f"[fetch] {url}")
        try:
            html = fetch(url)
            record = parse_sample_page(url, html)
            records.append(record)

            if args.save_html:
                sid = record.get("source_id") or "unknown"
                (html_dir / f"samplesite_{sid}.html").write_text(html)

            print(f"  -> {record.get('name')} | {record.get('sample_number')}")
            time.sleep(args.delay)

        except Exception as exc:
            print(f"[error] {url}: {exc}")

    json_out.write_text(json.dumps(records, indent=2, ensure_ascii=False))

    if records:
        fieldnames = list(records[0].keys())
        with csv_out.open("w", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(records)

    print(f"Wrote {len(records)} records to {json_out}")
    print(f"Wrote CSV to {csv_out}")


if __name__ == "__main__":
    main()
