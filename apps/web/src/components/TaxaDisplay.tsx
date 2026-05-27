import type { TaxonRecord } from '@/lib/types'

const RANK_COLOURS: Record<string, string> = {
  domain: 'bg-purple-100 text-purple-800',
  phylum: 'bg-blue-100 text-blue-800',
  class: 'bg-cyan-100 text-cyan-800',
  order: 'bg-teal-100 text-teal-800',
  family: 'bg-green-100 text-green-800',
  genus: 'bg-yellow-100 text-yellow-800',
  species: 'bg-orange-100 text-orange-800',
}

function rankColour(rank: string): string {
  return RANK_COLOURS[rank.toLowerCase()] ?? 'bg-slate-100 text-slate-600'
}

interface Props {
  taxa: TaxonRecord[]
  totalCount: number
}

export default function TaxaDisplay({ taxa, totalCount }: Props) {
  if (!taxa || taxa.length === 0) {
    return <p className="text-sm text-slate-500">No taxonomy data available.</p>
  }

  const totalShown = taxa.reduce((sum, t) => sum + t.size, 0)

  return (
    <div>
      <p className="text-xs text-slate-500 mb-3">
        Showing top {taxa.length} taxa from {totalCount.toLocaleString()} taxonomy records.
        Identifications are to varying ranks — do not interpret as species-level.
        Abundances are sequence read counts, not cell counts.
      </p>
      <div className="space-y-2">
        {taxa.map((taxon, i) => {
          const pct = totalShown > 0 ? (taxon.size / totalShown) * 100 : 0
          return (
            <div key={i} className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${rankColour(taxon.taxonomic_rank)}`}>
                    {taxon.taxonomic_rank}
                  </span>
                  <span className="font-medium text-sm text-slate-800 italic truncate">
                    {taxon.taxon_name.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs text-slate-400 flex-shrink-0 ml-auto">
                    {taxon.size.toLocaleString()} reads
                  </span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-500 rounded-full"
                    style={{ width: `${Math.max(pct, 1)}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <p className="text-xs text-slate-400 mt-3">
        Lineage shown for top entry: {taxa[0]?.lineage?.replace(/root; /, '') ?? '—'}
      </p>
    </div>
  )
}
