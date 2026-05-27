# HotSpring Lens — 1000 Springs Explorer

A free, non-commercial educational tool for exploring the geothermal springs of Aotearoa New Zealand. Maps, spring profiles, chemistry, microbial diversity, and a camera overlay.

**Licence:** Data from the 1000 Springs Project (GNS Science / University of Waikato) under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). No commercial use.

---

## Project structure

```
apps/
  web/        Next.js 14 website (MVP complete)
  mobile/     Expo React Native app (MVP complete)
data/
  processed/  springs_app_dataset_full.json  ← 792 spring records
tools/
  run_full_1000springs_pipeline.py           ← data pipeline
```

---

## Running the website

```bash
cd apps/web
npm install
npm run dev
# → http://localhost:3000
```

### Pages
| Route | Description |
|---|---|
| `/` | Homepage |
| `/explore` | Map + search/filter all 792 springs |
| `/springs/[id]` | Full spring profile |
| `/safety` | Safety guidelines |
| `/about` | About the project |
| `/attribution` | CC BY-NC-SA 4.0 attribution |

---

## Running the mobile app

```bash
cd apps/mobile
npm install
npx expo start
# Scan QR with Expo Go on your phone
```

### Screens
| Tab | Description |
|---|---|
| Explore | Map (react-native-maps) + list of all springs |
| Camera | Camera overlay with GPS + compass bearing |
| More | About, attribution, safety, **debug/simulation mode** |

### Debug / simulation mode

The app includes a **simulation mode** for testing from Christchurch without visiting the North Island:

1. Open the **More** tab
2. Toggle **Debug / Simulation Mode** ON
3. Pick a mock location (Rotorua, Waiotapu, Waimangu, etc.)
4. Adjust the mock heading slider (0–359°)
5. Switch to the **Camera** tab to see the overlay working

The camera overlay will show spring labels positioned by simulated GPS and heading.

---

## Data pipeline

The full permissioned pipeline is:

```bash
python tools/run_full_1000springs_pipeline.py \
  --skip-html-fetch --min-delay 2.0 --max-delay 6.0
```

Output: `data/processed/springs_app_dataset_full.json` (792 records).

---

## Attribution

Data from the **1000 Springs Project** — GNS Science and University of Waikato.  
Source: https://1000springs.org.nz  
Licence: Creative Commons Attribution–NonCommercial–ShareAlike 4.0 International.

This project is not endorsed by 1000 Springs, GNS Science, University of Waikato, iwi/hapū, or landowners.

---

## Safety

> Hot springs can cause serious injury or death. Stay on marked paths, follow local signs, never cross barriers, and do not use this app for navigation.

NZ Emergency: **111**
