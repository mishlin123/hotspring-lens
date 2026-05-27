# HotSpring Lens / 1000 Springs Explorer

## Updated non-commercial build plan

**Project positioning:** a free, non-commercial educational and research tool for tourists, students, teachers, and microbiology researchers exploring geothermal springs in the North Island of Aotearoa New Zealand.

**Core idea:** users open a website or mobile app, explore geothermal spring sites on a map, then optionally use a camera/GPS/compass mode that points them toward nearby public/safe springs and opens rich information cards about microbiology, chemistry, geothermal context, safety, and approved cultural context.

**Hard rule:** this project has no commercial intentions. No paid app, no ads, no subscriptions, no sponsorship placement, no commercial tourism booking integration, and no dataset resale.

---

## 0. Current project state

The local project folder is now:

```text
/Users/hamishlindsay/Desktop/Masters/1000 Springs
```

The GitHub repo is:

```text
https://github.com/mishlin123/hotspring-lens
```

The full permissioned 1000 Springs data pipeline has been built and run. The main app/website dataset is:

```text
data/processed/springs_app_dataset_full.json
```

Supporting processed outputs:

```text
data/processed/sample_details_full.json
data/processed/sample_details_full.csv
data/processed/chemistry_records_full.json
data/processed/chemistry_records_full.csv
data/processed/taxonomy_records_full.json
data/processed/taxonomy_records_full.csv
```

The main pipeline script is:

```text
tools/run_full_1000springs_pipeline.py
```

Current dataset summary:

```text
792 spring overview records
22,275 chemistry records
92,282 taxonomy records
792 app-ready spring records
```

The website should use `data/processed/springs_app_dataset_full.json` first. Raw mirrored HTML and raw JSON files are local backup data and should not be the website's primary data source.

---

## 1. Ground rules before any code

### Licence alignment

1000 Springs content is licensed under **Creative Commons Attribution–NonCommercial–ShareAlike 4.0 International**. For this project that means:

- Build only a non-commercial educational/research app and website.
- Attribute the 1000 Springs authors, GNS Science, and the University of Waikato.
- Any adapted content published from 1000 Springs should remain under the same licence.
- Keep source URLs and access dates for imported records.
- Do not imply endorsement by 1000 Springs, GNS Science, University of Waikato, iwi/hapū, landowners, or tourism operators.

### Cultural and safety alignment

This app must not become a tool for trespassing, unsafe access, or cultural misuse.

Every spring record should support fields for:

- public location allowed / not allowed
- access status
- safety status
- exact coordinates allowed / general location only
- source URL
- licence
- cultural content permission status
- reviewer notes

Default policy:

> If access or cultural/location sensitivity is uncertain, hide exact coordinates from camera overlay mode and do not encourage navigation to the site.

---

## 2. Product vision

### One sentence

**HotSpring Lens is a free field-guide app and website that lets people explore the microbiology, chemistry, and geothermal setting of New Zealand hot springs using maps, spring profiles, and camera-based location overlays.**

### Main users

1. **Tourists**
   - Want a simple, safe explanation of what they are seeing.
   - Need warnings, access status, and plain-language science.

2. **Microbiology students/researchers**
   - Want sample numbers, pH, temperature, chemistry, and microbial taxonomy.
   - Need links back to source data.

3. **Teachers/outreach users**
   - Want reliable explanations and visuals.
   - Need non-commercial, attribution-compliant content.

4. **Research group / project team**
   - Want a compelling microbiology communication project.
   - Need something buildable from Christchurch using simulation.

---

## 3. Free-first strategy

The aim is to build and test as much as possible before paying for anything.

| Need | Free-first option |
|---|---|
| Code hosting | GitHub |
| Website | Next.js + Vercel Hobby |
| Database later | Supabase free tier or local JSON first |
| Mobile prototype | Expo React Native + Expo Go |
| Local data | JSON/CSV files already generated |
| Map prototype | Leaflet / MapLibre / OpenStreetMap |
| Testing app on phone | Expo Go QR code |
| Simulated GPS | debug mode + mock coordinates |
| Simulated routes | GPX route files / mock movement mode |
| App Store release | Later only, when worth Apple Developer fee |

Suggested build order:

1. Build website first.
2. Use local JSON data first.
3. Build mobile app second.
4. Build camera overlay third.
5. Test from Christchurch using mock GPS/heading.
6. Recruit Rotorua/Taupō testers later.
7. Pay Apple only when public iOS release is justified.

---

## 4. Repository structure

Target monorepo structure:

```text
hotspring-lens/
  README.md
  package.json
  pnpm-workspace.yaml
  .env.example
  docs/
    PRD.md
    DATA_GOVERNANCE.md
    LICENCE_AND_ATTRIBUTION.md
    SAFETY_POLICY.md
    CULTURAL_CONTENT_POLICY.md
    CHRISTCHURCH_TESTING_PLAN.md
    APP_STORE_PLAN.md
    1000SPRINGS_DATA_PERMISSION.md
  apps/
    web/
    mobile/
  packages/
    core/
    ui/
  supabase/
    migrations/
    seed/
  tools/
    run_full_1000springs_pipeline.py
  data/
    raw/
    processed/
      springs_app_dataset_full.json
      sample_details_full.json
      chemistry_records_full.json
      taxonomy_records_full.json
```

---

## 5. Website-first MVP

The website is the best first milestone because it is free to deploy, easy to share, useful before the app works, and better for checking data quality.

### Website pages

```text
/
  Landing page

/explore
  Map/list and filters

/springs/[id]
  Full spring profile

/microbiology
  Explain geothermal microbiology

/safety
  Safety and access rules

/about
  Non-commercial project explanation

/attribution
  1000 Springs attribution and licence

/research
  For microbiology researchers/students
```

### Website MVP features

- Map/list of all 792 spring records.
- Search by sample number, spring name, location, pH, temperature, and system.
- Filter by temperature range, pH range, feature type, and geothermal system.
- Spring profile page with:
  - Overview
  - Physical measurements
  - Chemical composition summary
  - Microbial diversity summary
  - Safety/access warning
  - Source/attribution/licence
- “Open in mobile app later” placeholder.

### Website tech stack

- Next.js
- TypeScript
- Tailwind
- Local JSON first
- Leaflet or MapLibre/OpenStreetMap for maps
- Vercel Hobby deployment later

---

## 6. Mobile app MVP

The mobile app should not start as true AR. Start with a robust camera overlay using GPS + heading + bearing maths.

### Mobile MVP features

1. Onboarding
   - explain non-commercial educational purpose
   - explain safety limits
   - explain data attribution

2. Permissions
   - location permission
   - camera permission
   - motion/compass permission if needed

3. Map screen
   - nearby springs
   - filters
   - tap spring card

4. Camera explorer screen
   - camera preview
   - GPS location
   - compass heading
   - nearby spring overlays
   - hidden restricted/sensitive sites by default

5. Spring profile popup
   - title
   - distance
   - pH/temp
   - microbiology summary
   - chemistry summary
   - safety/access warning
   - source URL

6. Debug/simulation mode
   - fake location
   - fake heading
   - fake compass accuracy
   - choose Rotorua/Taupō test sites
   - visualise bearing lines

---

## 7. Data pipeline

The current full data pipeline has already been built. It should remain reproducible through:

```bash
python tools/run_full_1000springs_pipeline.py --skip-html-fetch --min-delay 2.0 --max-delay 6.0
```

The pipeline does:

```text
seed URLs
→ download sample HTML
→ parse overview fields
→ extract sample number
→ fetch chemistryJson/<sampleNumber>
→ fetch taxonomyJson/<sampleNumber>
→ normalize chemistry records
→ normalize taxonomy records
→ build app-ready dataset
```

The app and website should primarily consume:

```text
data/processed/springs_app_dataset_full.json
```

Each record includes:

```text
id
name
source_url
geothermal_system
latitude
longitude
location_text
description
sample_number
sample_date
feature_type
temperature_c
ph
size_approx
ebullition
oxidation_reduction_potential_mv
conductivity_us_cm
dissolved_oxygen_mg_l
turbidity_fnu
image_url
large_image_url
safety_warning
chemistry_record_count
taxonomy_record_count
top_chemistry
top_taxa
licence
attribution
built_at_utc
```

Important display rule: `top_taxa` may mix taxonomic ranks. The UI should avoid overclaiming species-level precision and should label ranks clearly.

---

## 8. Database schema later

For the first website, use local JSON. Supabase/PostGIS can come later.

When needed, create tables for:

- springs
- chemical_measurements
- microbial_taxa
- cultural_context
- content_cards
- source_references
- media

Default `show_in_camera_overlay` should be false unless reviewed.

---

## 9. Camera overlay maths

### Inputs

```text
user latitude
user longitude
device heading
device pitch/roll
nearby springs
screen width
screen height
horizontal field of view
```

### Core functions

```ts
export function bearingDegrees(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number
): number;

export function haversineDistanceMeters(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number
): number;

export function normaliseAngle180(angle: number): number;

export function projectPoiToScreen(args: {
  springBearing: number;
  deviceHeading: number;
  screenWidth: number;
  horizontalFov: number;
}): { visible: boolean; x: number; relativeBearing: number };
```

### Display rule

Show a label only when:

- spring is within chosen radius
- spring is allowed in camera overlay
- relative bearing is inside field of view
- user GPS accuracy is acceptable
- compass accuracy is acceptable

---

## 10. Christchurch testing plan

Christchurch is not a dealbreaker because most app logic can run from fake coordinates and fake headings.

Build these simulation tools:

1. Mock location picker: Rotorua, Taupō, Wairakei-Tauhara, Waiotapu, Waimangu, custom lat/lng.
2. Mock heading slider: 0–360°.
3. Mock walking route: fake movement along coordinates.
4. Expected overlay tests: standing at coordinate X, heading Y, spring Z should appear centre/right/left/hidden.
5. Debug export: record heading, location, and visible labels.

---

## 11. Safety and access policy

Always show:

> Hot springs can cause serious injury or death. Stay on marked paths, follow local signs, never cross barriers, and do not rely on this app for safe navigation.

Do not show camera pins for:

- restricted sites
- private land
- culturally sensitive sites
- uncertain access sites
- sites where exact coordinates are not clearly public
- sites where location precision is low

---

## 12. Cultural content policy

Do not AI-generate cultural history as fact.

Claude can help build the system, but it should not invent Māori history, iwi/hapū relationships, place-name meanings, or cultural interpretations.

Allowed content states:

```text
hidden
source-only
draft
under review
approved public
approved limited
removed by request
```

Required fields:

```text
iwi/hapū context
source
permission status
reviewer
review date
public visibility
withdrawal/removal notes
```

---

## 13. App Store later plan

Do not pay for Apple Developer Program at the start.

Before paying Apple, have:

- website deployed
- imported data reviewed
- mock camera overlay working
- simulated Rotorua/Taupō testing working from Christchurch
- safety/access policy implemented
- attribution page implemented
- no commercialisation
- supervisor/tester feedback

Then consider TestFlight, North Island testers, field validation, and public free App Store release.

---

## 14. Immediate next steps

The data layer is done. The next milestone is the website MVP.

1. Build `apps/web`.
2. Use `data/processed/springs_app_dataset_full.json` directly.
3. Add search, filters, spring detail pages, safety, and attribution.
4. Keep the first website minimal and robust.
5. Commit and push.
6. Deploy later to Vercel.

---

## 15. Definition of done for website MVP v0.1

The website MVP is done when:

- homepage explains the project
- explore page lists/maps all 792 records
- search works
- filters work
- each spring has a detail page
- overview measurements display correctly
- chemistry summary displays clearly
- microbial diversity summary displays clearly without overclaiming taxonomy certainty
- safety warning is prominent
- attribution/licence page is present
- no commercial features exist
- project can run locally from README instructions

