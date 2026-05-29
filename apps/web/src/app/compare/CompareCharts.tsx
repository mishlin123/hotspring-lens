'use client'

import { useState } from 'react'
import type { TaxonRecord } from '@/lib/types'
import ChartToggle, { type ChartType } from '@/components/ChartToggle'
import PieChart, { pieColor } from '@/components/PieChart'

function analyteLabel(a: string): string {
  return a.charAt(0).toUpperCase() + a.slice(1)
}

// ─── Chemistry comparison ───────────────────────────────────────────────────

/** Shared-scale horizontal bar for chemistry comparison */
function ChemBar({
  value,
  maxValue,
  unit = 'mg/L',
}: {
  value: number | null
  maxValue: number
  unit?: string
}) {
  if (value === null) {
    return <span className="text-xs text-slate-500">No data</span>
  }
  const pct = maxValue > 0 ? Math.min((value / maxValue) * 100, 100) : 0
  const display =
    value >= 100 ? value.toFixed(0) : value >= 1 ? value.toFixed(2) : value.toFixed(4)
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-xs text-slate-800">{display}</span>
        <span className="text-xs text-slate-500 ml-1">{unit}</span>
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

interface ChemDatum {
  analyte: string
  values: (number | null)[]
  max: number
}

export function CompareChemistrySection({
  springNames,
  chemData,
  recordCounts,
  cols,
}: {
  springNames: string[]
  chemData: ChemDatum[]
  recordCounts: number[]
  cols: number
}) {
  const [chartType, setChartType] = useState<ChartType>('bar')
  const gridCols = cols === 2 ? 'grid-cols-2' : 'grid-cols-3'

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between gap-3 mb-2 px-4 flex-wrap">
        <h2 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
          Water chemistry — core analytes (mg/L
          {chartType === 'bar' ? ', shared scale' : ', composition'})
        </h2>
        <ChartToggle value={chartType} onChange={setChartType} label="Chemistry chart type" />
      </div>

      {chartType === 'pie' ? (
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className={`grid ${gridCols} gap-4`}>
            {springNames.map((name, si) => {
              const data = chemData.map((cd, ai) => ({
                label: analyteLabel(cd.analyte),
                value: cd.values[si] ?? 0,
                color: pieColor(ai),
              }))
              return (
                <div key={si} className="flex flex-col items-center">
                  <p className="text-xs font-semibold text-slate-800 mb-2 truncate w-full text-center">
                    {name}
                  </p>
                  <PieChart
                    data={data}
                    size={120}
                    hideLegend
                    ariaLabel={`Core analyte composition for ${name}`}
                  />
                </div>
              )
            })}
          </div>
          {/* Shared legend — analytes are the same across all springs */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 pt-3 border-t border-slate-100 justify-center">
            {chemData.map((cd, ai) => (
              <div key={cd.analyte} className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: pieColor(ai) }}
                />
                <span className="text-xs text-slate-600">{analyteLabel(cd.analyte)}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          {/* Column headers — label column + one per spring */}
          <div
            className="bg-slate-50 border-b border-slate-200"
            style={{ display: 'grid', gridTemplateColumns: `140px repeat(${cols}, 1fr)` }}
          >
            <div className="px-4 py-2" />
            {springNames.map((name, si) => (
              <p key={si} className="text-xs font-semibold text-slate-800 px-4 py-2 truncate">{name}</p>
            ))}
          </div>

          {chemData.map(({ analyte, values, max }) => (
            <div
              key={analyte}
              className="border-b border-slate-100 last:border-0"
              style={{ display: 'grid', gridTemplateColumns: `140px repeat(${cols}, 1fr)` }}
            >
              {/* Row label */}
              <div className="px-4 py-2.5 flex items-center border-r border-slate-100">
                <p className="text-xs font-medium text-slate-600">{analyteLabel(analyte)}</p>
              </div>
              {/* Value cells */}
              {values.map((val, ci) => (
                <div key={ci} className="px-4 py-2.5 border-r border-slate-100 last:border-0">
                  <ChemBar value={val} maxValue={max} />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-slate-500 mt-2 px-1">
        {chartType === 'bar'
          ? 'Bars are scaled to the highest value for each analyte across the compared springs.'
          : 'Each pie shows how the core analytes divide that spring’s total measured concentration.'}{' '}
        Values from {recordCounts.join('/')} chemistry records respectively.
      </p>
    </section>
  )
}

// ─── Microbial diversity comparison ─────────────────────────────────────────

/** Taxa bar list for one spring in compare view */
function TaxaBarList({ taxa }: { taxa: TaxonRecord[] }) {
  const maxReads = Math.max(...taxa.map(t => t.size))
  return (
    <div className="space-y-2">
      {taxa.slice(0, 5).map((t, i) => {
        const pct = maxReads > 0 ? (t.size / maxReads) * 100 : 0
        return (
          <div key={i}>
            <div className="flex items-baseline justify-between mb-0.5 gap-1 flex-wrap">
              <span className="text-xs italic text-slate-800 font-medium leading-tight truncate max-w-[80%]">
                {t.taxon_name.replace(/_/g, ' ')}
              </span>
              <span className="text-xs text-slate-500 flex-shrink-0">{t.size.toLocaleString()}</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded-full"
                style={{ width: `${Math.max(pct, 0.5)}%`, opacity: 0.75 }}
              />
            </div>
          </div>
        )
      })}
      <p className="text-xs text-slate-500 pt-1">Sequence read counts. Not cell abundance.</p>
    </div>
  )
}

interface CompareSpring {
  id: string
  name: string
  top_taxa: TaxonRecord[]
  taxonomy_record_count: number
}

export function CompareTaxaSection({
  springs,
  cols,
}: {
  springs: CompareSpring[]
  cols: number
}) {
  const [chartType, setChartType] = useState<ChartType>('bar')
  const gridCols = cols === 2 ? 'grid-cols-2' : 'grid-cols-3'

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between gap-3 mb-2 px-4 flex-wrap">
        <h2 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
          Microbial diversity — top taxa by sequence reads
        </h2>
        <ChartToggle value={chartType} onChange={setChartType} label="Taxa chart type" />
      </div>
      <div className={`grid ${gridCols} gap-4`}>
        {springs.map(s => {
          const taxa = s.top_taxa ?? []
          return (
            <div key={s.id} className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-800 mb-3 truncate">{s.name}</p>
              {taxa.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No 16S taxonomy data.</p>
              ) : chartType === 'pie' ? (
                <PieChart
                  data={taxa.slice(0, 5).map((t, i) => ({
                    label: t.taxon_name.replace(/_/g, ' '),
                    value: t.size,
                    color: pieColor(i),
                  }))}
                  size={120}
                  ariaLabel={`Top taxa read share for ${s.name}`}
                  formatValue={v => v.toLocaleString()}
                />
              ) : (
                <TaxaBarList taxa={taxa} />
              )}
              {s.taxonomy_record_count > 0 && (
                <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
                  {s.taxonomy_record_count.toLocaleString()} total 16S records
                </p>
              )}
            </div>
          )
        })}
      </div>
      <p className="text-xs text-slate-500 mt-2 px-1">
        16S rRNA amplicon data. Read counts reflect sequencing output, not cell abundance.
        Taxa are identified to varying ranks — do not interpret as species-level.
      </p>
    </section>
  )
}
