'use client'

import { useState } from 'react'

// ─── Shared categorical palette (Tableau-10 muted, publication standard) ──────
export const CHART_PALETTE = [
  '#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f',
  '#edc948', '#b07aa1', '#ff9da7', '#9c755f', '#bab0ac',
  '#3d9970', '#8c564b', '#17becf', '#bcbd22', '#7f7f7f',
]

/** Stable colour for the i-th slice, cycling through the palette */
export function pieColor(i: number): string {
  return CHART_PALETTE[i % CHART_PALETTE.length]
}

export interface PieDatum {
  label: string
  value: number
  color: string
}

// ─── SVG arc geometry ─────────────────────────────────────────────────────────

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
}

/** Build a donut/pie slice path between two angles (degrees, clockwise from top) */
function slicePath(
  cx: number, cy: number, rOuter: number, rInner: number,
  startAngle: number, endAngle: number,
): string {
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  const oStart = polar(cx, cy, rOuter, startAngle)
  const oEnd   = polar(cx, cy, rOuter, endAngle)

  if (rInner <= 0) {
    return [
      `M ${cx} ${cy}`,
      `L ${oStart.x} ${oStart.y}`,
      `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${oEnd.x} ${oEnd.y}`,
      'Z',
    ].join(' ')
  }

  const iStart = polar(cx, cy, rInner, startAngle)
  const iEnd   = polar(cx, cy, rInner, endAngle)
  return [
    `M ${oStart.x} ${oStart.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${oEnd.x} ${oEnd.y}`,
    `L ${iEnd.x} ${iEnd.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${iStart.x} ${iStart.y}`,
    'Z',
  ].join(' ')
}

interface PieChartProps {
  data: PieDatum[]
  /** Diameter of the pie in px (default 132) */
  size?: number
  /** Render as a donut (default true) */
  donut?: boolean
  /** Format a slice value for the legend; omit to hide raw values */
  formatValue?: (value: number) => string
  /** Labels currently active — used for click-to-filter pies */
  activeLabels?: string[]
  /** Click handler — when set, slices and legend rows become interactive */
  onSliceClick?: (label: string) => void
  /** Hide the legend (e.g. when a shared legend is rendered elsewhere) */
  hideLegend?: boolean
  /** Accessible description of what the chart shows */
  ariaLabel?: string
}

export default function PieChart({
  data,
  size = 132,
  donut = true,
  formatValue,
  activeLabels,
  onSliceClick,
  hideLegend = false,
  ariaLabel,
}: PieChartProps) {
  const [hovered, setHovered] = useState<string | null>(null)

  // Only positive values can be shown as slices
  const slices = data.filter(d => d.value > 0)
  const total = slices.reduce((s, d) => s + d.value, 0)

  if (total <= 0) {
    return <p className="text-xs text-slate-500 italic">No data to chart.</p>
  }

  const cx = size / 2
  const cy = size / 2
  const rOuter = size / 2 - 2
  const rInner = donut ? rOuter * 0.56 : 0
  const interactive = !!onSliceClick

  // Pre-compute slice angles
  let angle = 0
  const arcs = slices.map(d => {
    const frac  = d.value / total
    const start = angle * 360
    const end   = (angle + frac) * 360
    angle += frac
    return { ...d, start, end, frac }
  })

  const isActive = (label: string) =>
    activeLabels ? activeLabels.includes(label) : false
  const anyActive = (activeLabels?.length ?? 0) > 0

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="flex-shrink-0"
        role="img"
        aria-label={ariaLabel ?? 'Pie chart'}
      >
        {arcs.length === 1 ? (
          // Single 100% slice — arcs degenerate, draw full circles instead
          <>
            <circle cx={cx} cy={cy} r={rOuter} fill={arcs[0].color} fillOpacity={0.85} />
            {donut && <circle cx={cx} cy={cy} r={rInner} fill="white" />}
          </>
        ) : (
          arcs.map(arc => {
            const dim = (hovered && hovered !== arc.label) ||
                        (anyActive && !isActive(arc.label))
            return (
              <path
                key={arc.label}
                d={slicePath(cx, cy, rOuter, rInner, arc.start, arc.end)}
                fill={arc.color}
                fillOpacity={dim ? 0.35 : 0.9}
                stroke="white"
                strokeWidth={1}
                style={interactive ? { cursor: 'pointer' } : undefined}
                onMouseEnter={() => setHovered(arc.label)}
                onMouseLeave={() => setHovered(null)}
                onClick={interactive ? () => onSliceClick!(arc.label) : undefined}
              >
                <title>
                  {arc.label}: {formatValue ? formatValue(arc.value) : arc.value} (
                  {(arc.frac * 100).toFixed(1)}%)
                </title>
              </path>
            )
          })
        )}
      </svg>

      {!hideLegend && (
        <ul className="flex-1 min-w-[120px] space-y-0.5">
          {arcs.map(arc => {
            const active = isActive(arc.label)
            const Row = interactive ? 'button' : 'div'
            return (
              <li key={arc.label}>
                <Row
                  {...(interactive
                    ? {
                        onClick: () => onSliceClick!(arc.label),
                        onMouseEnter: () => setHovered(arc.label),
                        onMouseLeave: () => setHovered(null),
                        className: `w-full flex items-center gap-1.5 text-left rounded px-1 py-0.5 transition-colors ${
                          active ? 'bg-teal-50' : 'hover:bg-slate-100'
                        }`,
                      }
                    : { className: 'flex items-center gap-1.5' })}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: arc.color }}
                  />
                  <span
                    className={`text-xs truncate leading-tight ${
                      active ? 'font-semibold text-teal-800' : 'text-slate-700'
                    }`}
                  >
                    {arc.label}
                  </span>
                  <span className="text-xs text-slate-500 ml-auto flex-shrink-0 tabular-nums">
                    {(arc.frac * 100).toFixed(0)}%
                    {formatValue && (
                      <span className="text-slate-400">
                        {' · '}
                        {formatValue(arc.value)}
                      </span>
                    )}
                  </span>
                </Row>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
