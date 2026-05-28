'use client'

import Link from 'next/link'
import type { SpringSummary } from '@/lib/types'

interface Props {
  selected: SpringSummary[]
  onRemove: (id: string) => void
  onClear: () => void
}

export default function CompareBar({ selected, onRemove, onClear }: Props) {
  if (selected.length === 0) return null

  const compareHref = `/compare?ids=${selected.map(s => s.id).join(',')}`
  const canCompare  = selected.length >= 2

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-slate-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3 flex-wrap">
        <p className="text-sm font-medium text-slate-700 flex-shrink-0">
          Compare ({selected.length}/3):
        </p>

        {/* Selected spring chips */}
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
          {selected.map(s => (
            <span
              key={s.id}
              className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded"
            >
              <span className="truncate max-w-[140px]">{s.name}</span>
              <button
                onClick={() => onRemove(s.id)}
                className="text-slate-500 hover:text-slate-800 leading-none flex-shrink-0"
                aria-label={`Remove ${s.name} from comparison`}
              >
                ×
              </button>
            </span>
          ))}

          {/* Placeholder slots up to 3 */}
          {Array.from({ length: Math.max(0, 2 - selected.length) }).map((_, i) => (
            <span
              key={`slot-${i}`}
              className="inline-flex items-center border border-dashed border-slate-300 text-slate-500 text-xs px-2.5 py-1 rounded"
            >
              Add a spring
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onClear}
            className="text-xs text-slate-500 hover:text-slate-800 underline transition-colors"
          >
            Clear
          </button>
          {canCompare ? (
            <Link
              href={compareHref}
              className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-5 py-2 rounded transition-colors"
            >
              Compare {selected.length} springs
            </Link>
          ) : (
            <span className="bg-slate-200 text-slate-500 text-sm font-semibold px-5 py-2 rounded cursor-not-allowed">
              Select {2 - selected.length} more
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
