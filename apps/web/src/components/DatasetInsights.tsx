'use client'

import { useMemo, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { SpringSummary } from '@/lib/types'

type ScatterColorBy = 'system' | 'temperature' | 'ph' | 'distinctiveness'

// ── ColorBrewer RdBu-4: blue (cold) → red (hot) ───────────────────────────────
function scatterTempColor(t: number | null): string {
  if (t === null) return '#d9d9d9'
  if (t >= 80) return '#b2182b'   // dark red   — very hot
  if (t >= 60) return '#d6604d'   // medium red — hot
  if (t >= 40) return '#f4a582'   // salmon     — warm
  return '#2166ac'                 // blue       — cool
}

// ── ColorBrewer RdBu-5: red (acidic) → blue (alkaline) ───────────────────────
function scatterPhColor(p: number | null): string {
  if (p === null) return '#d9d9d9'
  if (p < 2)  return '#b2182b'   // dark red   — extremely acidic
  if (p < 4)  return '#d6604d'   // medium red — acidic
  if (p < 6)  return '#f4a582'   // salmon     — mildly acidic
  if (p < 8)  return '#4393c3'   // medium blue — near neutral
  return '#2166ac'                // dark blue  — alkaline
}

// ── ColorBrewer Greens-4: grey (common) → dark green (distinctive) ───────────
function scatterDistinctColor(score: number | null): string {
  if (score === null) return '#d9d9d9'
  if (score >= 80) return '#006d2c'   // dark green
  if (score >= 60) return '#31a354'   // medium green
  if (score >= 40) return '#74c476'   // light green
  return '#bdbdbd'                     // grey — common profile
}

const SCATTER_TEMP_LEGEND = [
  { label: '≥ 80°C (very hot)',    color: '#b2182b' },
  { label: '60–79°C (hot)',        color: '#d6604d' },
  { label: '40–59°C (warm)',       color: '#f4a582' },
  { label: '< 40°C (cool)',        color: '#2166ac' },
  { label: 'Not recorded',         color: '#d9d9d9' },
]

const SCATTER_PH_LEGEND = [
  { label: 'pH < 2 (ext. acidic)', color: '#b2182b' },
  { label: 'pH 2–4 (acidic)',      color: '#d6604d' },
  { label: 'pH 4–6 (mild. acidic)',color: '#f4a582' },
  { label: 'pH 6–8 (near neutral)',color: '#4393c3' },
  { label: 'pH ≥ 8 (alkaline)',    color: '#2166ac' },
  { label: 'Not recorded',         color: '#d9d9d9' },
]

const SCATTER_DISTINCT_LEGEND = [
  { label: 'Score 80–100 (high)',  color: '#006d2c' },
  { label: 'Score 60–79',          color: '#31a354' },
  { label: 'Score 40–59',          color: '#74c476' },
  { label: 'Score < 40 (common)',  color: '#bdbdbd' },
  { label: 'No taxonomy data',     color: '#d9d9d9' },
]

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  allSprings: SpringSummary[]       // full dataset — drives system/feature/analyte bars
  filteredSprings: SpringSummary[]  // current filter result — drives distributions
  activeSystem: string[]
  activeFeatureType: string[]
  activeAnalyte: string[]
  allAnalytes: { analyte: string; count: number }[]
  onSystemClick: (system: string) => void
  onFeatureTypeClick: (type: string) => void
  onAnalyteClick: (analyte: string) => void
}

// ─── Distribution band definitions ───────────────────────────────────────────

// ColorBrewer RdBu-4 — matches scatter plot temp colour function
const TEMP_BANDS = [
  { label: '< 40°C',  min: -Infinity, max: 40,       color: '#2166ac' },
  { label: '40–59°C', min: 40,        max: 60,        color: '#f4a582' },
  { label: '60–79°C', min: 60,        max: 80,        color: '#d6604d' },
  { label: '≥ 80°C',  min: 80,        max: Infinity,  color: '#b2182b' },
]

// ColorBrewer RdBu-5 — matches scatter plot pH colour function
const PH_BANDS = [
  { label: '< 2 (ext. acidic)',  min: -Infinity, max: 2,        color: '#b2182b' },
  { label: '2–4 (acidic)',       min: 2,         max: 4,        color: '#d6604d' },
  { label: '4–6 (mildly acidic)',min: 4,         max: 6,        color: '#f4a582' },
  { label: '6–8 (near neutral)', min: 6,         max: 8,        color: '#4393c3' },
  { label: '≥ 8 (alkaline)',     min: 8,         max: Infinity, color: '#2166ac' },
]

// Tableau-10 muted categorical palette — publication standard (Nature, ISME J.)
const SYSTEM_PALETTE = [
  '#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f',
  '#edc948', '#b07aa1', '#ff9da7', '#9c755f', '#bab0ac',
  '#3d9970', '#8c564b',
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
      <span className="text-xs text-slate-800 w-28 flex-shrink-0 leading-tight">{label}</span>
      <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: color, opacity: 0.85 }}
        />
      </div>
      <span className="text-xs text-slate-600 w-7 text-right flex-shrink-0">{count}</span>
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
        active ? 'bg-teal-50 ring-1 ring-teal-300' : 'hover:bg-slate-100 hover:ring-1 hover:ring-slate-200'
      }`}
    >
      {/* Checkbox indicator */}
      <span className={`w-3.5 h-3.5 rounded-sm border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
        active
          ? 'bg-teal-500 border-teal-500'
          : 'border-slate-300 group-hover:border-teal-400'
      }`}>
        {active && (
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1.5 4l2 2 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
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
      <span className="text-xs text-slate-500 w-6 text-right flex-shrink-0">{count}</span>
    </button>
  )
}

/** pH vs Temperature scatter plot — pure SVG with React hover tooltip */
function ScatterPlot({ springs, systemColorMap, colorBy }: {
  springs: SpringSummary[]
  systemColorMap: Record<string, string>
  colorBy: ScatterColorBy
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
            const color = colorBy === 'temperature'    ? scatterTempColor(s.temperature_c)
                        : colorBy === 'ph'             ? scatterPhColor(s.ph)
                        : colorBy === 'distinctiveness' ? scatterDistinctColor(s.distinctiveness_score)
                        : systemColorMap[s.geothermal_system] ?? '#94a3b8'
            return (
              <g key={s.id}>
                <circle cx={cx} cy={cy} r={3} fill={color} fillOpacity={0.80} stroke="white" strokeWidth={0.5} strokeOpacity={0.7} />
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
          <p className="text-slate-600">{tooltip.spring.temperature_c}°C · pH {tooltip.spring.ph}</p>
          <p className="text-slate-500 text-[10px]">{tooltip.spring.geothermal_system}</p>
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
  activeAnalyte,
  allAnalytes,
  onSystemClick,
  onFeatureTypeClick,
  onAnalyteClick,
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

  const [scatterColorBy, setScatterColorBy] = useState<ScatterColorBy>('system')

  // Legend items to show below the scatter plot (all non-system modes)
  const scatterLegend = scatterColorBy === 'temperature'    ? SCATTER_TEMP_LEGEND
                      : scatterColorBy === 'ph'             ? SCATTER_PH_LEGEND
                      : scatterColorBy === 'distinctiveness' ? SCATTER_DISTINCT_LEGEND
                      : null

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 mb-5">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-700">Dataset overview</h2>
          {isFiltered ? (
            <p className="text-xs text-slate-500 mt-0.5">
              Distributions show the {total} filtered spring{total !== 1 ? 's' : ''}.
              System and feature-type bars show the full dataset — click to filter.
            </p>
          ) : (
            <p className="text-xs text-slate-500 mt-0.5">
              {allTotal} spring records. Click a system or feature type to filter the list.
            </p>
          )}
        </div>
      </div>

      {/* Full-width scatter plot — hidden on mobile (dots too small to use) */}
      <div className="hidden sm:block mb-5">
        {/* Header row with title + colour-by toggle */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-slate-600 tracking-wide">
            pH vs temperature
          </p>
          <div className="flex items-center gap-0.5 bg-slate-100 rounded-lg p-0.5">
            <span className="text-xs text-slate-500 px-2">Colour:</span>
            {([
              { key: 'system',          label: 'System' },
              { key: 'temperature',     label: 'Temp' },
              { key: 'ph',              label: 'pH' },
              { key: 'distinctiveness', label: 'Distinct' },
            ] as { key: ScatterColorBy; label: string }[]).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setScatterColorBy(key)}
                className={`text-xs px-2.5 py-1 rounded-md transition-colors font-medium ${
                  scatterColorBy === key
                    ? 'bg-white text-teal-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <ScatterPlot springs={filteredSprings} systemColorMap={systemColors} colorBy={scatterColorBy} />

        {/* Dynamic legend for temp/pH modes, or plain note for system mode */}
        {scatterLegend ? (
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {scatterLegend.map(item => (
              <div key={item.label} className="flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-slate-500">{item.label}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 mt-1">
            Colour by geothermal system · hover for details · click to open spring
          </p>
        )}
      </div>

      {/* Four-column grid: distributions + clickable selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-4 border-t border-slate-100 items-start">

        {/* Col 1: Temperature + pH stacked */}
        <div className="space-y-5">

          {/* Temperature distribution */}
          <div>
            <p className="text-xs font-semibold text-slate-600 tracking-wide mb-2">
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
            <p className="text-xs text-slate-500 mt-2">
              Range: 13.9–99.8°C across {tempTotal} records
            </p>
          </div>

          {/* pH distribution */}
          <div>
            <p className="text-xs font-semibold text-slate-600 tracking-wide mb-2">
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
            <p className="text-xs text-slate-500 mt-2">
              Bimodal: sulfuric (acidic) and bicarbonate (neutral–alkaline) spring types
            </p>
          </div>
        </div>

        {/* Col 2: Geothermal systems */}
        <div>
          <p className="text-xs font-semibold text-slate-600 tracking-wide mb-0.5">
            By geothermal system
          </p>
          <p className="text-xs text-slate-500 mb-2">Click to filter · select multiple</p>
          <div className="space-y-0.5">
            {systemCounts.map(({ sys, count }) => (
              <ClickableBar
                key={sys}
                label={sys}
                count={count}
                maxCount={maxSystemCount}
                color={systemColors[sys] ?? '#94a3b8'}
                active={activeSystem.includes(sys)}
                onClick={() => onSystemClick(sys)}
              />
            ))}
          </div>
        </div>

        {/* Col 3: Feature types */}
        <div>
          <p className="text-xs font-semibold text-slate-600 tracking-wide mb-0.5">
            By feature type
          </p>
          <p className="text-xs text-slate-500 mb-2">Click to filter · select multiple</p>
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
        </div>

        {/* Col 4: Chemical composition */}
        <div>
          <p className="text-xs font-semibold text-slate-600 tracking-wide mb-0.5">
            By chemical composition
          </p>
          <p className="text-xs text-slate-500 mb-2">Click to filter · select multiple</p>
          <div className="space-y-0.5">
            {allAnalytes.map(({ analyte, count }) => (
              <ClickableBar
                key={analyte}
                label={analyte}
                count={count}
                maxCount={allAnalytes[0]?.count ?? 1}
                color="#0d9488"
                active={activeAnalyte.includes(analyte)}
                onClick={() => onAnalyteClick(analyte)}
              />
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Based on top analytes per spring from field chemistry records.
          </p>
        </div>
      </div>
    </div>
  )
}
