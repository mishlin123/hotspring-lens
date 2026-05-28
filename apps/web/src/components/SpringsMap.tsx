'use client'

import { useState, useMemo, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import 'leaflet/dist/leaflet.css'
import 'react-leaflet-cluster/dist/assets/MarkerCluster.css'
import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css'
import L from 'leaflet'
import Link from 'next/link'
import type { SpringSummary } from '@/lib/types'

// ─── Types ────────────────────────────────────────────────────────────────────

type LayerMode = 'temperature' | 'ph' | 'featureType' | 'system'
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

// ─── Color scales ─────────────────────────────────────────────────────────────

function tempColor(temp: number | null): string {
  if (temp === null) return '#94a3b8'
  if (temp >= 80) return '#dc2626'
  if (temp >= 60) return '#ea580c'
  if (temp >= 40) return '#ca8a04'
  return '#16a34a'
}

function phColor(ph: number | null): string {
  if (ph === null) return '#94a3b8'
  if (ph < 2)  return '#7c3aed'
  if (ph < 4)  return '#dc2626'
  if (ph < 6)  return '#ea580c'
  if (ph < 8)  return '#16a34a'
  return '#2563eb'
}

const FEATURE_COLORS: Record<string, string> = {
  Spring:        '#00AECC',
  Geyser:        '#dc2626',
  Stream:        '#3b82f6',
  Lake:          '#1d4ed8',
  Terrace:       '#d97706',
  Miscellaneous: '#94a3b8',
}

// 12 categorical colours for geothermal systems
const SYSTEM_PALETTE = [
  '#00AECC', '#10b981', '#f59e0b', '#6366f1', '#3b82f6',
  '#8b5cf6', '#14b8a6', '#f97316', '#ef4444', '#84cc16',
  '#0ea5e9', '#d946ef',
]

// ─── Legend configurations ────────────────────────────────────────────────────

const TEMP_LEGEND = [
  { label: '≥ 80°C', color: '#dc2626' },
  { label: '60–79°C', color: '#ea580c' },
  { label: '40–59°C', color: '#ca8a04' },
  { label: '< 40°C',  color: '#16a34a' },
  { label: 'Not recorded', color: '#94a3b8' },
]

const PH_LEGEND = [
  { label: 'pH < 2 (extremely acidic)', color: '#7c3aed' },
  { label: 'pH 2–4 (strongly acidic)',  color: '#dc2626' },
  { label: 'pH 4–6 (moderately acidic)', color: '#ea580c' },
  { label: 'pH 6–8 (near neutral)',     color: '#16a34a' },
  { label: 'pH ≥ 8 (alkaline)',         color: '#2563eb' },
  { label: 'Not recorded',              color: '#94a3b8' },
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

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  springs: SpringSummary[]
  height?: string
}

export default function SpringsMap({ springs, height = '520px' }: Props) {
  const [layerMode, setLayerMode] = useState<LayerMode>('temperature')
  const [baseTile, setBaseTile]   = useState<BaseTile>('street')

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
        case 'temperature': return tempColor(s.temperature_c)
        case 'ph':          return phColor(s.ph)
        case 'featureType': return FEATURE_COLORS[s.feature_type] ?? '#94a3b8'
        case 'system':      return systemColorMap[s.geothermal_system] ?? '#94a3b8'
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
        wheelPxPerZoomLevel={80}
      >
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
                  <p className="text-slate-500 text-xs mb-2">
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
                ? 'bg-white text-teal-800 border-teal-300 shadow-md'
                : 'bg-white/85 text-slate-600 border-slate-200 hover:bg-white'
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
          className="bg-white border border-slate-200 rounded shadow-sm text-xs text-slate-700 px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
          aria-label="Map colour layer"
        >
          <option value="temperature">Colour: Temperature</option>
          <option value="ph">Colour: pH</option>
          <option value="featureType">Colour: Feature type</option>
          <option value="system">Colour: System</option>
        </select>
      </div>

      {/* Legend — bottom right, scrollable if many items */}
      <div className="absolute bottom-8 right-3 bg-white/92 backdrop-blur-sm rounded-lg shadow border border-slate-200/80 p-2.5 z-[400] max-h-52 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-600 mb-1.5">{legend.title}</p>
        {legend.items.map(l => (
          <div key={l.label} className="flex items-center gap-1.5 mb-0.5 last:mb-0">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0 border border-white/60"
              style={{ backgroundColor: l.color }}
            />
            <span className="text-xs text-slate-600 leading-tight whitespace-nowrap">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Missing coords notice — bottom left */}
      {noCoords > 0 && (
        <div className="absolute bottom-3 left-3 z-[400]">
          <p className="text-xs text-slate-500 bg-white/85 backdrop-blur-sm rounded px-2 py-1 shadow-sm border border-slate-200/60">
            {noCoords} spring{noCoords !== 1 ? 's' : ''} not shown — no coordinates on record
          </p>
        </div>
      )}
    </div>
  )
}
