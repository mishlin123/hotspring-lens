import type { ChemistryRecord } from '@/lib/types'

const MICROMO_ANALYTES = new Set(['co', 'h2', 'ch4'])

function formatUnit(analyte: string): string {
  return MICROMO_ANALYTES.has(analyte.toLowerCase()) ? 'µM' : 'mg/L'
}

function formatValue(value: number): string {
  if (value >= 100) return value.toFixed(0)
  if (value >= 1) return value.toFixed(2)
  return value.toFixed(4)
}

interface Props {
  chemistry: ChemistryRecord[]
  totalCount: number
}

export default function ChemistryDisplay({ chemistry, totalCount }: Props) {
  if (!chemistry || chemistry.length === 0) {
    return <p className="text-sm text-slate-500">No chemistry data available.</p>
  }

  return (
    <div>
      <p className="text-xs text-slate-500 mb-3">
        Showing top {chemistry.length} analytes from {totalCount.toLocaleString()} chemistry records.
        Most values in mg/L; CO, H₂, CH₄ in µM.
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-2 pr-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Analyte
              </th>
              <th className="text-right py-2 pr-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Value
              </th>
              <th className="text-right py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Unit
              </th>
            </tr>
          </thead>
          <tbody>
            {chemistry.map((row, i) => (
              <tr
                key={i}
                className={`border-b border-slate-100 ${i % 2 === 0 ? '' : 'bg-slate-50/50'}`}
              >
                <td className="py-1.5 pr-4 font-medium text-slate-700 capitalize">
                  {row.analyte.replace(/_/g, ' ')}
                </td>
                <td className="py-1.5 pr-4 text-right font-mono text-slate-800">
                  {formatValue(row.value)}
                </td>
                <td className="py-1.5 text-right text-slate-500">
                  {formatUnit(row.analyte)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
