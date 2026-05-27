#!/usr/bin/env python3

import json
from pathlib import Path
from datetime import datetime, timezone

MAP_MARKERS = Path("data/processed/map_markers.json")
DETAILS = Path("data/processed/sample_sites.json")
OUT = Path("data/processed/springs_app_dataset.json")

def load_json(path):
    if not path.exists():
        return []
    return json.loads(path.read_text())

def main():
    markers = load_json(MAP_MARKERS)
    details = {str(d["source_id"]): d for d in load_json(DETAILS)}

    records = []

    for marker in markers:
        sid = str(marker["source_id"])
        detail = details.get(sid)

        record = {
            "id": sid,
            "name": marker.get("name"),
            "source_url": marker.get("source_url"),
            "geothermal_system": marker.get("geothermal_system"),
            "latitude": marker.get("latitude"),
            "longitude": marker.get("longitude"),
            "description": marker.get("map_description"),
            "has_detail_record": detail is not None,
            "sample_number": detail.get("sample_number") if detail else None,
            "sample_date": detail.get("sample_date") if detail else None,
            "feature_type": detail.get("feature_type") if detail else None,
            "safety_warning": (
                detail.get("safety_warning")
                if detail
                else "Hot springs can cause serious injury and death."
            ),
            "data_quality_notes": [
                "Location/name/description parsed from manually saved map page source.",
                "Detailed chemistry, pH, temperature, and microbial data not yet parsed.",
                "Do not encourage users to leave paths, cross barriers, or access unsafe/private features.",
            ],
            "licence": marker.get("source_licence"),
            "attribution": marker.get("attribution"),
            "built_at_utc": datetime.now(timezone.utc).isoformat(),
        }

        records.append(record)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(records, indent=2, ensure_ascii=False))

    print(f"Wrote {len(records)} app-ready spring records to {OUT}")

if __name__ == "__main__":
    main()
