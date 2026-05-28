'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import 'leaflet/dist/leaflet.css'
import 'react-leaflet-cluster/dist/assets/MarkerCluster.css'
import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css'
import L from 'leaflet'
import Link from 'next/link'
import type { SpringSummary } from '@/lib/types'

// ─── Types ────────────────────────────────────────────────────────────────────

type LayerMode = 'temperature' | 'ph' | 'featureType' | 'system' | 'distinctiveness'
type BaseTile = 'street' | 'topographic' | 'satellite'

// ─── Tile layer configs ───────────────────────────────────────────────────────

const TILES: Record<BaseTile, { url: string; attribution: string; label: string; maxNativeZoom: number }> = {
  street: {
    label: 'Street',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxNativeZoom: 19,
  },
  topographic: {
    label: 'Terrain',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
      '<a href="https://viewfinderpanoramas.org">SRTM</a> | Style: &copy; ' +
      '<a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    maxNativeZoom: 17,
  },
  satellite: {
    label: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution:
      'Tiles &copy; Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxNativeZoom: 23,
  },
}

// ─── Color scales (ColorBrewer / Tableau publication palettes) ────────────────

// ColorBrewer RdBu-4: blue (cool) → red (hot)
function tempColor(temp: number | null): string {
  if (temp === null) return '#d9d9d9'
  if (temp >= 80) return '#b2182b'
  if (temp >= 60) return '#d6604d'
  if (temp >= 40) return '#f4a582'
  return '#2166ac'
}

// ColorBrewer RdBu-5: red (acidic) → blue (alkaline)
function phColor(ph: number | null): string {
  if (ph === null) return '#d9d9d9'
  if (ph < 2)  return '#b2182b'
  if (ph < 4)  return '#d6604d'
  if (ph < 6)  return '#f4a582'
  if (ph < 8)  return '#4393c3'
  return '#2166ac'
}

// Tableau-10 muted categorical palette — matches DatasetInsights system palette
const FEATURE_COLORS: Record<string, string> = {
  Spring:        '#4e79a7',
  Geyser:        '#e15759',
  Stream:        '#59a14f',
  Lake:          '#76b7b2',
  Terrace:       '#f28e2b',
  Miscellaneous: '#bab0ac',
}

// Tableau-10 muted — publication standard (Nature, ISME J., etc.)
const SYSTEM_PALETTE = [
  '#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f',
  '#edc948', '#b07aa1', '#ff9da7', '#9c755f', '#bab0ac',
  '#3d9970', '#8c564b',
]

// ColorBrewer Greens-4: grey (common) → dark green (distinctive)
function distinctivenessColor(score: number | null): string {
  if (score === null) return '#d9d9d9'
  if (score >= 80) return '#006d2c'
  if (score >= 60) return '#31a354'
  if (score >= 40) return '#74c476'
  return '#bdbdbd'
}

// ─── Legend configurations ────────────────────────────────────────────────────

const TEMP_LEGEND = [
  { label: '≥ 80°C (very hot)',  color: '#b2182b' },
  { label: '60–79°C (hot)',      color: '#d6604d' },
  { label: '40–59°C (warm)',     color: '#f4a582' },
  { label: '< 40°C (cool)',      color: '#2166ac' },
  { label: 'Not recorded',       color: '#d9d9d9' },
]

const PH_LEGEND = [
  { label: 'pH < 2 (ext. acidic)',  color: '#b2182b' },
  { label: 'pH 2–4 (acidic)',       color: '#d6604d' },
  { label: 'pH 4–6 (mild. acidic)', color: '#f4a582' },
  { label: 'pH 6–8 (near neutral)', color: '#4393c3' },
  { label: 'pH ≥ 8 (alkaline)',     color: '#2166ac' },
  { label: 'Not recorded',          color: '#d9d9d9' },
]

const DISTINCT_LEGEND = [
  { label: 'Score 80–100 (high)',  color: '#006d2c' },
  { label: 'Score 60–79',          color: '#31a354' },
  { label: 'Score 40–59',          color: '#74c476' },
  { label: 'Score < 40 (common)',  color: '#bdbdbd' },
  { label: 'No taxonomy data',     color: '#d9d9d9' },
]

// ─── Icon factories ───────────────────────────────────────────────────────────

// Cache icons by color to avoid re-creating L.DivIcon objects on each render
const ICON_CACHE = new Map<string, L.DivIcon>()

function getMarkerIcon(color: string): L.DivIcon {
  if (!ICON_CACHE.has(color)) {
    ICON_CACHE.set(
      color,
      L.divIcon({
        html: `<span style="display:block;width:13px;height:13px;background:${color};border-radius:50%;border:2px solid rgba(255,255,255,0.9);box-shadow:0 0 0 1px rgba(0,0,0,0.15),0 1px 3px rgba(0,0,0,0.22);"></span>`,
        className: '',
        iconSize:    [13, 13],
        iconAnchor:  [6, 6],
        popupAnchor: [0, -9],
      }),
    )
  }
  return ICON_CACHE.get(color)!
}

function createClusterIcon(cluster: { getChildCount(): number }): L.DivIcon {
  const count = cluster.getChildCount()
  const s = count < 10 ? 28 : count < 50 ? 34 : 40
  return L.divIcon({
    html: `<span style="display:flex;align-items:center;justify-content:center;width:${s}px;height:${s}px;background:#0f766e;border:2px solid #fff;border-radius:50%;color:#fff;font-size:11px;font-weight:700;box-shadow:0 1px 4px rgba(0,0,0,0.28);">${count}</span>`,
    className: '',
    iconSize:   [s, s],
    iconAnchor: [s / 2, s / 2],
  })
}

// ─── Pinch zoom booster ───────────────────────────────────────────────────────
// Mac trackpad pinch generates wheel events with ctrlKey=true and tiny deltas
// (±1–5 per frame vs ±100s for scroll). Leaflet's wheelPxPerZoomLevel applies
// equally to both, so pinch feels far slower than scroll. This component
// intercepts pinch events in the capture phase, applies a multiplier, and calls
// setZoom directly — preventing Leaflet's own handler from seeing the raw tiny delta.

function PinchZoomBooster() {
  const map = useMap()
  useEffect(() => {
    const container = map.getContainer()
    const handler = (e: WheelEvent) => {
      if (!e.ctrlKey) return           // regular scroll — let Leaflet handle it
      e.preventDefault()
      e.stopImmediatePropagation()     // block Leaflet's own wheel handler
      const delta = -e.deltaY * 0.05  // pinch deltas ≈ ±1–10; scale to useful zoom rate
      map.setZoom(map.getZoom() + delta, { animate: false })
    }
    container.addEventListener('wheel', handler, { passive: false, capture: true })
    return () => container.removeEventListener('wheel', handler, { capture: true })
  }, [map])
  return null
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  springs: SpringSummary[]
  height?: string
}

export default function SpringsMap({ springs, height = '520px' }: Props) {
  const [layerMode, setLayerMode] = useState<LayerMode>('temperature')
  const [baseTile, setBaseTile]   = useState<BaseTile>('satellite')

  const withCoords = useMemo(
    () => springs.filter(s => s.latitude != null && s.longitude != null),
    [springs],
  )

  // Map each system name to a stable colour index based on sorted position
  const systemColorMap = useMemo(() => {
    const systems = Array.from(new Set(springs.map(s => s.geothermal_system))).sort()
    return Object.fromEntries(
      systems.map((sys, i) => [sys, SYSTEM_PALETTE[i % SYSTEM_PALETTE.length]]),
    )
  }, [springs])

  const getColor = useCallback(
    (s: SpringSummary): string => {
      switch (layerMode) {
        case 'temperature':    return tempColor(s.temperature_c)
        case 'ph':             return phColor(s.ph)
        case 'featureType':    return FEATURE_COLORS[s.feature_type] ?? '#94a3b8'
        case 'system':         return systemColorMap[s.geothermal_system] ?? '#94a3b8'
        case 'distinctiveness': return distinctivenessColor(s.distinctiveness_score)
      }
    },
    [layerMode, systemColorMap],
  )

  const legend = useMemo(() => {
    switch (layerMode) {
      case 'temperature':
        return { title: 'Temperature at sampling', items: TEMP_LEGEND }
      case 'ph':
        return { title: 'pH at sampling', items: PH_LEGEND }
      case 'featureType':
        return {
          title: 'Feature type',
          items: Object.entries(FEATURE_COLORS).map(([label, color]) => ({ label, color })),
        }
      case 'system':
        return {
          title: 'Geothermal system',
          items: Object.entries(systemColorMap).map(([label, color]) => ({ label, color })),
        }
      case 'distinctiveness':
        return { title: 'Microbial distinctiveness', items: DISTINCT_LEGEND }
    }
  }, [layerMode, systemColorMap])

  const tile     = TILES[baseTile]
  const noCoords = springs.length - withCoords.length

  return (
    <div className="relative rounded-lg overflow-hidden border border-slate-200" style={{ height }}>
      {/* Map */}
      <MapContainer
        center={[-38.5, 176.2]}
        zoom={8}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        zoomSnap={0}
        wheelPxPerZoomLevel={30}
        zoomControl={false}
      >
        <ZoomControl position="bottomleft" />
        <PinchZoomBooster />
        <TileLayer key={baseTile} url={tile.url} attribution={tile.attribution} maxNativeZoom={tile.maxNativeZoom} />

        <MarkerClusterGroup
          iconCreateFunction={createClusterIcon as Parameters<typeof MarkerClusterGroup>[0]['iconCreateFunction']}
          chunkedLoading
          maxClusterRadius={45}
          showCoverageOnHover={false}
          spiderfyOnMaxZoom
          zoomToBoundsOnClick
        >
          {withCoords.map(s => (
            <Marker
              key={s.id}
              position={[s.latitude!, s.longitude!]}
              icon={getMarkerIcon(getColor(s))}
            >
              <Popup>
                <div className="text-sm min-w-[160px]">
                  <p className="font-semibold text-slate-800 leading-tight mb-0.5">{s.name}</p>
                  <p className="text-slate-600 text-xs mb-2">
                    {s.geothermal_system} · {s.feature_type}
                  </p>
                  <div className="flex gap-1.5 text-xs mb-3 flex-wrap">
                    {s.temperature_c !== null && (
                      <span className="bg-orange-50 text-orange-700 border border-orange-200 px-1.5 py-0.5 rounded font-medium">
                        {s.temperature_c}°C
                      </span>
                    )}
                    {s.ph !== null && (
                      <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                        pH {s.ph}
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/springs/${s.id}`}
                    className="text-teal-600 font-medium text-xs hover:underline"
                  >
                    View record →
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      {/* Base tile toggle — top left */}
      <div className="absolute top-3 left-3 z-[400] flex gap-1">
        {(Object.keys(TILES) as BaseTile[]).map(key => (
          <button
            key={key}
            onClick={() => setBaseTile(key)}
            className={`px-2.5 py-1 text-xs font-medium rounded border shadow-sm transition-colors ${
              baseTile === key
                ? 'bg-slate-900/90 text-white border-white/20 shadow-md'
                : 'bg-slate-900/65 text-slate-200 border-white/10 hover:bg-slate-900/85 hover:text-white'
            }`}
          >
            {TILES[key].label}
          </button>
        ))}
      </div>

      {/* Layer mode selector — top right */}
      <div className="absolute top-3 right-3 z-[400]">
        <select
          value={layerMode}
          onChange={e => setLayerMode(e.target.value as LayerMode)}
          className="bg-slate-900/85 backdrop-blur-sm border border-white/10 rounded shadow-sm text-xs text-slate-200 px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-400 cursor-pointer"
          aria-label="Map colour layer"
        >
          <option value="temperature">Colour: Temperature</option>
          <option value="ph">Colour: pH</option>
          <option value="featureType">Colour: Feature type</option>
          <option value="system">Colour: System</option>
          <option value="distinctiveness">Colour: Distinctiveness</option>
        </select>
      </div>

      {/* Legend — bottom right, scrollable if many items */}
      <div className="absolute bottom-8 right-3 bg-slate-900/85 backdrop-blur-sm rounded-lg shadow border border-white/10 p-2.5 z-[400] max-h-52 overflow-y-auto">
        <p className="text-xs font-semibold text-white mb-1.5">{legend.title}</p>
        {legend.items.map(l => (
          <div key={l.label} className="flex items-center gap-1.5 mb-0.5 last:mb-0">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0 border border-white/25"
              style={{ backgroundColor: l.color }}
            />
            <span className="text-xs text-slate-200 leading-tight whitespace-nowrap">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Missing coords notice — bottom left */}
      {noCoords > 0 && (
        <div className="absolute bottom-3 left-3 z-[400]">
          <p className="text-xs text-slate-600 bg-white/85 backdrop-blur-sm rounded px-2 py-1 shadow-sm border border-slate-200/60">
            {noCoords} spring{noCoords !== 1 ? 's' : ''} not shown — no coordinates on record
          </p>
        </div>
      )}
    </div>
  )
}
