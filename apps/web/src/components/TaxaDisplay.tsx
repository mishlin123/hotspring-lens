'use client'

import { useState } from 'react'
import type { TaxonRecord } from '@/lib/types'
import ChartToggle, { type ChartType } from './ChartToggle'
import PieChart, { pieColor } from './PieChart'

// Rank → subtle pill colour
const RANK_STYLES: Record<string, string> = {
  domain:  'bg-purple-50  text-purple-700  border-purple-200',
  phylum:  'bg-blue-50    text-blue-700    border-blue-200',
  class:   'bg-cyan-50    text-cyan-700    border-cyan-200',
  order:   'bg-teal-50    text-teal-700    border-teal-200',
  family:  'bg-green-50   text-green-700   border-green-200',
  genus:   'bg-amber-50   text-amber-700   border-amber-200',
  species: 'bg-orange-50  text-orange-700  border-orange-200',
}

function rankStyle(rank: string): string {
  return RANK_STYLES[rank.toLowerCase()] ?? 'bg-slate-50 text-slate-800 border-slate-200'
}

function formatLineage(lineage: string): string {
  return (lineage ?? '')
    .replace(/^root;\s*/, '')
    .split(';')
    .map(s => s.trim())
    .filter(Boolean)
    .join(' › ')
}

interface Props {
  taxa: TaxonRecord[]
  totalCount: number
}

export default function TaxaDisplay({ taxa, totalCount }: Props) {
  const [chartType, setChartType] = useState<ChartType>('bar')

  if (!taxa || taxa.length === 0) {
    return <p className="text-sm text-slate-600">No 16S rRNA taxonomy data for this record.</p>
  }

  const maxReads = Math.max(...taxa.map(t => t.size))

  return (
    <div>
      {/* Caveat + chart toggle */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <p className="text-xs text-slate-600 leading-relaxed">
          Top {taxa.length} taxa by 16S rRNA sequence read count, from{' '}
          {totalCount.toLocaleString()} total records.{' '}
          {chartType === 'bar'
            ? 'Bars show relative read counts'
            : 'Slices show each taxon’s share of the charted reads'} —{' '}
          <strong className="font-medium">not cell abundance</strong>. Identifications
          are to the rank shown; do not interpret as species-level.
        </p>
        <div className="flex-shrink-0">
          <ChartToggle value={chartType} onChange={setChartType} label="Taxa chart type" />
        </div>
      </div>

      {chartType === 'pie' ? (
        <PieChart
          data={taxa.map((t, i) => ({
            label: t.taxon_name.replace(/_/g, ' '),
            value: t.size,
            color: pieColor(i),
          }))}
          ariaLabel="Relative 16S rRNA read counts by taxon"
          formatValue={v => `${v.toLocaleString()} reads`}
        />
      ) : (
      /* Taxa bars */
      <div className="space-y-2.5">
        {taxa.map((taxon, i) => {
          const pct  = maxReads > 0 ? (taxon.size / maxReads) * 100 : 0
          const name = taxon.taxon_name.replace(/_/g, ' ')

          return (
            <div key={i}>
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span
                  className={`text-xs px-1.5 py-0.5 rounded border font-medium flex-shrink-0 ${rankStyle(taxon.taxonomic_rank)}`}
                >
                  {taxon.taxonomic_rank}
                </span>
                <span className="font-medium text-sm text-slate-800 italic leading-tight">
                  {name}
                </span>
                <span className="text-xs text-slate-500 ml-auto flex-shrink-0">
                  {taxon.size.toLocaleString()} reads
                </span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-500 rounded-full"
                  style={{ width: `${Math.max(pct, 0.5)}%`, opacity: 0.8 }}
                />
              </div>
            </div>
          )
        })}
      </div>
      )}

      {/* Lineage path for top entry */}
      {taxa[0]?.lineage && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <p className="text-xs text-slate-600 font-medium mb-0.5">
            Lineage path — top entry
          </p>
          <p className="text-xs text-slate-500 leading-relaxed break-words">
            {formatLineage(taxa[0].lineage)}
          </p>
          <p className="text-xs text-slate-500 mt-1.5">
            Lineage derived from 16S rRNA amplicon sequencing. Taxonomic placement
            reflects the reference database in use at time of analysis.
          </p>
        </div>
      )}
    </div>
  )
}
