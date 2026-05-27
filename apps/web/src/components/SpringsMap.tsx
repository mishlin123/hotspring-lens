'use client'

import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import Link from 'next/link'
import type { SpringSummary } from '@/lib/types'

function markerColor(temp: number | null): string {
  if (temp === null) return '#94a3b8'
  if (temp >= 80) return '#ef4444'
  if (temp >= 60) return '#f97316'
  if (temp >= 40) return '#eab308'
  return '#22c55e'
}

const LEGEND = [
  { label: '≥ 80°C', color: '#ef4444' },
  { label: '60–79°C', color: '#f97316' },
  { label: '40–59°C', color: '#eab308' },
  { label: '< 40°C', color: '#22c55e' },
  { label: 'Unknown', color: '#94a3b8' },
]

interface Props {
  springs: SpringSummary[]
  height?: string
}

export default function SpringsMap({ springs, height = '520px' }: Props) {
  const withCoords = springs.filter(s => s.latitude != null && s.longitude != null)

  return (
    <div className="relative rounded-lg overflow-hidden border border-slate-200">
      <MapContainer
        center={[-38.5, 176.2]}
        zoom={8}
        style={{ height, width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {withCoords.map(s => (
          <CircleMarker
            key={s.id}
            center={[s.latitude!, s.longitude!]}
            radius={6}
            fillColor={markerColor(s.temperature_c)}
            color="rgba(255,255,255,0.7)"
            weight={1}
            fillOpacity={0.85}
          >
            <Popup>
              <div className="text-sm min-w-[160px]">
                <p className="font-semibold text-slate-800">{s.name}</p>
                <p className="text-slate-500 text-xs mb-1">
                  {s.geothermal_system} · {s.feature_type}
                </p>
                <div className="flex gap-2 text-xs mb-2">
                  {s.temperature_c !== null && (
                    <span className="bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">
                      {s.temperature_c}°C
                    </span>
                  )}
                  {s.ph !== null && (
                    <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                      pH {s.ph}
                    </span>
                  )}
                </div>
                <Link
                  href={`/springs/${s.id}`}
                  className="text-teal-600 font-medium text-xs hover:underline"
                >
                  View details →
                </Link>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg shadow p-2 z-[400]">
        <p className="text-xs font-semibold text-slate-600 mb-1">Temperature</p>
        {LEGEND.map(l => (
          <div key={l.label} className="flex items-center gap-1.5 mb-0.5">
            <span
              className="w-3 h-3 rounded-full flex-shrink-0 border border-white/50"
              style={{ backgroundColor: l.color }}
            />
            <span className="text-xs text-slate-600">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
