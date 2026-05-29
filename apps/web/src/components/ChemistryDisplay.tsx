'use client'

import { useState } from 'react'
import type { ChemistryRecord } from '@/lib/types'
import ChartToggle, { type ChartType } from './ChartToggle'
import PieChart, { pieColor } from './PieChart'

// CO, H₂, CH₄ are measured in µM; everything else in mg/L
const MICROMOLAR_ANALYTES = new Set(['co', 'h2', 'ch4', 'methane'])

function getUnit(analyte: string): string {
  return MICROMOLAR_ANALYTES.has(analyte.toLowerCase()) ? 'µM' : 'mg/L'
}

function formatValue(value: number): string {
  if (value >= 100)  return value.toFixed(0)
  if (value >= 1)    return value.toFixed(2)
  if (value >= 0.01) return value.toFixed(4)
  return value.toExponential(2)
}

function analyteLabel(analyte: string): string {
  return analyte
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/\bH2\b/gi, 'H₂')
    .replace(/\bCh4\b/gi, 'CH₄')
    .replace(/\bCo\b/gi, 'CO')
}

// Module-level component avoids React re-creating it on every parent render
function AnalyteRow({ row, maxValue }: { row: ChemistryRecord; maxValue: number }) {
  const pct  = maxValue > 0 ? Math.min((row.value / maxValue) * 100, 100) : 0
  const unit = getUnit(row.analyte)
  return (
    <div className="py-1.5 border-b border-slate-100 last:border-0">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-xs font-medium text-slate-700">
          {analyteLabel(row.analyte)}
        </span>
        <span className="text-xs text-slate-800 ml-2 flex-shrink-0">
          {formatValue(row.value)}{' '}
          <span className="text-slate-500 font-sans font-normal">{unit}</span>
        </span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-teal-600 rounded-full"
          style={{ width: `${Math.max(pct, 0.5)}%`, opacity: 0.75 }}
        />
      </div>
    </div>
  )
}

/** Pie view of one unit group — composition by measured concentration */
function AnalytePie({ rows, unit }: { rows: ChemistryRecord[]; unit: string }) {
  const data = rows.map((r, i) => ({
    label: analyteLabel(r.analyte),
    value: r.value,
    color: pieColor(i),
  }))
  return (
    <PieChart
      data={data}
      ariaLabel={`Composition of ${unit} analytes by concentration`}
      formatValue={v => `${formatValue(v)} ${unit}`}
    />
  )
}

interface Props {
  chemistry: ChemistryRecord[]
  totalCount: number
}

export default function ChemistryDisplay({ chemistry, totalCount }: Props) {
  const [chartType, setChartType] = useState<ChartType>('bar')

  if (!chemistry || chemistry.length === 0) {
    return <p className="text-sm text-slate-600">No chemistry data available for this record.</p>
  }

  // Separate by unit group so bars don't compare across different scales
  const mgL    = chemistry.filter(r => !MICROMOLAR_ANALYTES.has(r.analyte.toLowerCase()))
  const microM = chemistry.filter(r =>  MICROMOLAR_ANALYTES.has(r.analyte.toLowerCase()))

  const maxMgL    = mgL.length    ? Math.max(...mgL.map(r => r.value))    : 1
  const maxMicroM = microM.length ? Math.max(...microM.map(r => r.value)) : 1

  return (
    <div>
      <div className="flex items-start justify-between gap-3 mb-3">
        <p className="text-xs text-slate-600">
          {chartType === 'bar' ? (
            <>
              {chemistry.length} analytes shown from {totalCount.toLocaleString()} chemistry records.
              Bar length is relative to the highest value in each unit group.
              Most values in mg/L; CO, H₂, CH₄ in µM.
            </>
          ) : (
            <>
              {chemistry.length} analytes shown from {totalCount.toLocaleString()} chemistry records.
              Slices show each analyte&apos;s share of the total measured concentration in its unit group.
            </>
          )}
        </p>
        <div className="flex-shrink-0">
          <ChartToggle value={chartType} onChange={setChartType} label="Chemistry chart type" />
        </div>
      </div>

      {chartType === 'bar' ? (
        <>
          {/* mg/L analytes */}
          {mgL.length > 0 && (
            <div className="mb-3">
              {mgL.map((row, i) => (
                <AnalyteRow key={i} row={row} maxValue={maxMgL} />
              ))}
            </div>
          )}

          {/* µM analytes — separate scale, labelled explicitly */}
          {microM.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1 mt-3">
                Dissolved gases (µM scale)
              </p>
              {microM.map((row, i) => (
                <AnalyteRow key={i} row={row} maxValue={maxMicroM} />
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {/* mg/L composition pie */}
          {mgL.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-2">
                Dissolved solids (mg/L scale)
              </p>
              <AnalytePie rows={mgL} unit="mg/L" />
            </div>
          )}

          {/* µM composition pie — separate scale */}
          {microM.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-2">
                Dissolved gases (µM scale)
              </p>
              <AnalytePie rows={microM} unit="µM" />
            </div>
          )}
        </>
      )}
    </div>
  )
}
