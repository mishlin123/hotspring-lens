'use client'

import { useMemo, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { SpringSummary } from '@/lib/types'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  allSprings: SpringSummary[]       // full dataset — drives system/feature bars
  filteredSprings: SpringSummary[]  // current filter result — drives distributions
  activeSystem: string
  activeFeatureType: string[]
  onSystemClick: (system: string) => void
  onFeatureTypeClick: (type: string) => void
}

// ─── Distribution band definitions ───────────────────────────────────────────

const TEMP_BANDS = [
  { label: '< 40°C',  min: -Infinity, max: 40,       color: '#16a34a', bgColor: 'bg-green-600' },
  { label: '40–59°C', min: 40,        max: 60,        color: '#ca8a04', bgColor: 'bg-amber-600' },
  { label: '60–79°C', min: 60,        max: 80,        color: '#ea580c', bgColor: 'bg-orange-600' },
  { label: '≥ 80°C',  min: 80,        max: Infinity,  color: '#dc2626', bgColor: 'bg-red-600' },
]

const PH_BANDS = [
  { label: '< 2 (ext. acidic)',  min: -Infinity, max: 2,        color: '#7c3aed', bgColor: 'bg-violet-700' },
  { label: '2–4 (acidic)',       min: 2,         max: 4,        color: '#dc2626', bgColor: 'bg-red-600' },
  { label: '4–6 (mildly acidic)',min: 4,         max: 6,        color: '#ea580c', bgColor: 'bg-orange-600' },
  { label: '6–8 (near neutral)', min: 6,         max: 8,        color: '#16a34a', bgColor: 'bg-green-600' },
  { label: '≥ 8 (alkaline)',     min: 8,         max: Infinity, color: '#2563eb', bgColor: 'bg-blue-600' },
]

// Categorical colors for systems (same palette as SpringsMap)
const SYSTEM_PALETTE = [
  '#00AECC', '#10b981', '#f59e0b', '#6366f1', '#3b82f6',
  '#8b5cf6', '#14b8a6', '#f97316', '#ef4444', '#84cc16',
  '#0ea5e9', '#d946ef',
]

// ─── Sub-components ───────────────────────────────────────────────────────────

/** A single horizontal distribution band row */
function BandRow({
  label, count, total, color, pct,
}: {
  label: string; count: number; total: number; color: string; pct: number
}) {
  return (
    <div className="flex items-center gap-2 py-0.5">
      <div
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="text-xs text-slate-600 w-28 flex-shrink-0 leading-tight">{label}</span>
      <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: color, opacity: 0.85 }}
        />
      </div>
      <span className="text-xs text-slate-500 w-7 text-right flex-shrink-0">{count}</span>
    </div>
  )
}

/** A clickable horizontal bar for systems / feature types */
function ClickableBar({
  label, count, maxCount, color, active, onClick,
}: {
  label: string; count: number; maxCount: number; color: string; active: boolean; onClick: () => void
}) {
  const pct = maxCount > 0 ? (count / maxCount) * 100 : 0
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 py-1 px-1.5 rounded text-left transition-colors group ${
        active ? 'bg-teal-50 ring-1 ring-teal-300' : 'hover:bg-slate-50'
      }`}
    >
      <div
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className={`text-xs flex-shrink-0 w-28 truncate leading-tight ${active ? 'font-semibold text-teal-800' : 'text-slate-700'}`}>
        {label}
      </span>
      <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: color, opacity: active ? 1 : 0.7 }}
        />
      </div>
      <span className="text-xs text-slate-400 w-6 text-right flex-shrink-0">{count}</span>
    </button>
  )
}

/** pH vs Temperature scatter plot — pure SVG with React hover tooltip */
function ScatterPlot({ springs, systemColorMap }: {
  springs: SpringSummary[]
  systemColorMap: Record<string, string>
}) {
  const router = useRouter()
  const wrapRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<{
    x: number; y: number; spring: SpringSummary
  } | null>(null)

  const W = 900, H = 340
  const PAD = { top: 12, right: 20, bottom: 32, left: 36 }
  const plotW = W - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom

  const pts = springs.filter(s => s.temperature_c !== null && s.ph !== null)
  if (pts.length === 0) return null

  // Scale: temp 0–100, pH –1 to 10 (clamp negatives to –1 for display)
  const xScale = (t: number) => Math.max(0, Math.min(1, t / 100)) * plotW
  const yScale = (p: number) => {
    const clamped = Math.max(-1, Math.min(10, p))
    return plotH - ((clamped + 1) / 11) * plotH
  }

  const xTicks = [0, 20, 40, 60, 80, 100]
  const yTicks = [0, 2, 4, 6, 8, 10]

  const handleEnter = (e: React.MouseEvent, s: SpringSummary) => {
    const wrap = wrapRef.current
    if (!wrap) return
    const rect = wrap.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    // Flip tooltip to left if near right edge
    setTooltip({ x, y, spring: s })
  }

  const handleMove = (e: React.MouseEvent) => {
    const wrap = wrapRef.current
    if (!wrap || !tooltip) return
    const rect = wrap.getBoundingClientRect()
    setTooltip(prev => prev ? {
      ...prev,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    } : null)
  }

  return (
    <div ref={wrapRef} className="relative" onMouseLeave={() => setTooltip(null)}>
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label="Scatter plot of pH versus temperature for all springs"
        onMouseMove={handleMove}
      >
        <g transform={`translate(${PAD.left},${PAD.top})`}>
          {/* Grid */}
          {yTicks.map(p => (
            <line key={`gy${p}`} x1={0} y1={yScale(p)} x2={plotW} y2={yScale(p)} stroke="#e2e8f0" strokeWidth={0.5} />
          ))}
          {xTicks.map(t => (
            <line key={`gx${t}`} x1={xScale(t)} y1={0} x2={xScale(t)} y2={plotH} stroke="#e2e8f0" strokeWidth={0.5} />
          ))}

          {/* Neutral pH=7 reference line */}
          <line
            x1={0} y1={yScale(7)} x2={plotW} y2={yScale(7)}
            stroke="#64748b" strokeWidth={0.8} strokeDasharray="4,3" opacity={0.35}
          />

          {/* Data points — visible circle + larger invisible hit area */}
          {pts.map(s => {
            const cx = xScale(s.temperature_c!)
            const cy = yScale(s.ph!)
            const color = systemColorMap[s.geothermal_system] ?? '#94a3b8'
            return (
              <g key={s.id}>
                <circle cx={cx} cy={cy} r={2.5} fill={color} fillOpacity={0.65} stroke="none" />
                <circle
                  cx={cx} cy={cy} r={7}
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={e => handleEnter(e, s)}
                  onMouseLeave={() => setTooltip(null)}
                  onClick={() => router.push(`/springs/${s.id}`)}
                />
              </g>
            )
          })}

          {/* Axes */}
          <line x1={0} y1={plotH} x2={plotW} y2={plotH} stroke="#94a3b8" strokeWidth={1} />
          <line x1={0} y1={0}    x2={0}    y2={plotH} stroke="#94a3b8" strokeWidth={1} />

          {/* X-axis labels */}
          {xTicks.map(t => (
            <text key={`xl${t}`} x={xScale(t)} y={plotH + 12} textAnchor="middle" fontSize={9} fill="#94a3b8">{t}</text>
          ))}
          <text x={plotW / 2} y={plotH + 26} textAnchor="middle" fontSize={9} fill="#64748b">Temperature (°C)</text>

          {/* Y-axis labels */}
          {yTicks.map(p => (
            <text key={`yl${p}`} x={-6} y={yScale(p) + 3} textAnchor="end" fontSize={9} fill="#94a3b8">{p}</text>
          ))}
          <text
            transform={`rotate(-90) translate(${-plotH / 2},${-26})`}
            textAnchor="middle"
            fontSize={9}
            fill="#64748b"
          >
            pH
          </text>
        </g>
      </svg>

      {/* Hover tooltip */}
      {tooltip && (
        <div
          className="absolute z-10 bg-white border border-slate-200 rounded shadow-md px-2.5 py-1.5 pointer-events-none whitespace-nowrap text-xs"
          style={{
            left: tooltip.x + 12,
            top: tooltip.y - 48,
            // Prevent overflow on right side by clamping (done via transform when near right)
          }}
        >
          <p className="font-semibold text-slate-700 mb-0.5 leading-tight">{tooltip.spring.name}</p>
          <p className="text-slate-500">{tooltip.spring.temperature_c}°C · pH {tooltip.spring.ph}</p>
          <p className="text-slate-400 text-[10px]">{tooltip.spring.geothermal_system}</p>
        </div>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DatasetInsights({
  allSprings,
  filteredSprings,
  activeSystem,
  activeFeatureType,
  onSystemClick,
  onFeatureTypeClick,
}: Props) {
  const total = filteredSprings.length
  const allTotal = allSprings.length
  const isFiltered = total < allTotal

  // Temperature distribution (uses filtered set)
  const tempDist = useMemo(() => {
    return TEMP_BANDS.map(band => ({
      ...band,
      count: filteredSprings.filter(
        s => s.temperature_c !== null && s.temperature_c >= band.min && s.temperature_c < band.max,
      ).length,
    }))
  }, [filteredSprings])

  // pH distribution (uses filtered set)
  const phDist = useMemo(() => {
    return PH_BANDS.map(band => ({
      ...band,
      count: filteredSprings.filter(
        s => s.ph !== null && s.ph >= band.min && s.ph < band.max,
      ).length,
    }))
  }, [filteredSprings])

  // System counts (always uses full dataset for bars, but marks filtered)
  const systemColors = useMemo(() => {
    const systems = Array.from(new Set(allSprings.map(s => s.geothermal_system))).sort()
    return Object.fromEntries(systems.map((sys, i) => [sys, SYSTEM_PALETTE[i % SYSTEM_PALETTE.length]]))
  }, [allSprings])

  const systemCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    allSprings.forEach(s => { counts[s.geothermal_system] = (counts[s.geothermal_system] ?? 0) + 1 })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([sys, count]) => ({ sys, count }))
  }, [allSprings])

  const maxSystemCount = systemCounts[0]?.count ?? 1

  // Feature type counts (always uses full dataset)
  const featureTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    allSprings.forEach(s => { counts[s.feature_type] = (counts[s.feature_type] ?? 0) + 1 })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({ type, count }))
  }, [allSprings])

  const maxFtCount = featureTypeCounts[0]?.count ?? 1

  const tempTotal = tempDist.reduce((s, b) => s + b.count, 0)
  const phTotal   = phDist.reduce((s, b) => s + b.count, 0)

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 mb-5">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-700">Dataset overview</h2>
          {isFiltered ? (
            <p className="text-xs text-slate-400 mt-0.5">
              Distributions show the {total} filtered spring{total !== 1 ? 's' : ''}.
              System and feature-type bars show the full dataset — click to filter.
            </p>
          ) : (
            <p className="text-xs text-slate-400 mt-0.5">
              {allTotal} spring records. Click a system or feature type to filter the list.
            </p>
          )}
        </div>
      </div>

      {/* Full-width scatter plot */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-slate-500 tracking-wide mb-2">
          pH vs temperature
        </p>
        <ScatterPlot springs={filteredSprings} systemColorMap={systemColors} />
        <p className="text-xs text-slate-400 mt-1">
          Colour by geothermal system · hover for details · click to open spring
        </p>
      </div>

      {/* Four-column grid: distributions + clickable selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-4 border-t border-slate-100 items-start">

        {/* Temperature distribution */}
        <div>
          <p className="text-xs font-semibold text-slate-500 tracking-wide mb-2">
            Temperature at sampling
          </p>
          <div className="space-y-1">
            {tempDist.map(band => (
              <BandRow
                key={band.label}
                label={band.label}
                count={band.count}
                total={tempTotal}
                color={band.color}
                pct={tempTotal > 0 ? (band.count / tempTotal) * 100 : 0}
              />
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Range: 13.9–99.8°C across {tempTotal} records
          </p>
        </div>

        {/* pH distribution */}
        <div>
          <p className="text-xs font-semibold text-slate-500 tracking-wide mb-2">
            pH at sampling
          </p>
          <div className="space-y-1">
            {phDist.map(band => (
              <BandRow
                key={band.label}
                label={band.label}
                count={band.count}
                total={phTotal}
                color={band.color}
                pct={phTotal > 0 ? (band.count / phTotal) * 100 : 0}
              />
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Bimodal: sulfuric (acidic) and bicarbonate (neutral–alkaline) spring types
          </p>
        </div>

        {/* Geothermal systems */}
        <div>
          <p className="text-xs font-semibold text-slate-500 tracking-wide mb-2">
            By geothermal system
          </p>
          <div className="space-y-0.5">
            {systemCounts.map(({ sys, count }) => (
              <ClickableBar
                key={sys}
                label={sys}
                count={count}
                maxCount={maxSystemCount}
                color={systemColors[sys] ?? '#94a3b8'}
                active={activeSystem === sys}
                onClick={() => onSystemClick(activeSystem === sys ? '' : sys)}
              />
            ))}
          </div>
        </div>

        {/* Feature types */}
        <div>
          <p className="text-xs font-semibold text-slate-500 tracking-wide mb-2">
            By feature type
          </p>
          <div className="space-y-0.5">
            {featureTypeCounts.map(({ type, count }) => (
              <ClickableBar
                key={type}
                label={type}
                count={count}
                maxCount={maxFtCount}
                color="#00AECC"
                active={activeFeatureType.includes(type)}
                onClick={() => onFeatureTypeClick(type)}
              />
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Measurements reflect conditions at time of sampling. Springs may change over time.
          </p>
        </div>
      </div>
    </div>
  )
}
