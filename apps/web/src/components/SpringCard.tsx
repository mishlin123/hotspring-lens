'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { SpringSummary } from '@/lib/types'

function TempBadge({ temp }: { temp: number | null }) {
  if (temp === null) return null
  let colour = 'bg-slate-100 text-slate-800'
  if (temp >= 80)      colour = 'bg-red-50 text-red-700 border border-red-200'
  else if (temp >= 60) colour = 'bg-orange-50 text-orange-700 border border-orange-200'
  else if (temp >= 40) colour = 'bg-amber-50 text-amber-700 border border-amber-200'
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${colour}`}>
      {temp}°C
    </span>
  )
}

interface Props {
  spring: SpringSummary
  onToggleCompare?: (id: string) => void
  isInCompare?: boolean
}

export default function SpringCard({ spring, onToggleCompare, isInCompare = false }: Props) {
  const hasTaxonomy = spring.taxonomy_record_count > 0

  return (
    <div className="relative group">
      <Link
        href={`/springs/${spring.id}`}
        className={`block bg-white border rounded overflow-hidden hover:shadow-sm transition-all ${
          isInCompare
            ? 'border-teal-400 ring-1 ring-teal-300'
            : 'border-slate-200 hover:border-teal-400'
        }`}
      >
        {/* Image */}
        <div className="relative h-36 bg-slate-100">
          {spring.image_url ? (
            <Image
              src={spring.image_url}
              alt={spring.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs text-slate-500 font-medium tracking-wide uppercase">No photo</span>
            </div>
          )}
          {/* System pill */}
          <div className="absolute top-2 left-2">
            <span className="bg-teal-800/85 text-white text-xs px-2 py-0.5 rounded font-medium">
              {spring.geothermal_system}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-3">
          <h3 className="font-semibold text-slate-800 text-sm leading-tight group-hover:text-teal-700 transition-colors line-clamp-2">
            {spring.name}
          </h3>
          <p className="text-xs text-slate-600 mt-0.5 truncate">{spring.location_text}</p>

          {/* Badges */}
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <TempBadge temp={spring.temperature_c} />
            {spring.ph !== null && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                pH {spring.ph}
              </span>
            )}
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs text-slate-500 ml-auto">
              {spring.feature_type}
            </span>
          </div>

          {/* Data completeness — only flag missing taxonomy */}
          {!hasTaxonomy && (
            <p className="text-xs text-slate-500 mt-2 italic">No 16S taxonomy data</p>
          )}
        </div>
      </Link>

      {/* Compare toggle — visible on hover or when selected */}
      {onToggleCompare && (
        <button
          onClick={e => { e.preventDefault(); e.stopPropagation(); onToggleCompare(spring.id) }}
          title={isInCompare ? 'Remove from comparison' : 'Add to comparison'}
          className={`absolute top-2 right-2 w-6 h-6 rounded border text-xs font-bold leading-none transition-all z-10 ${
            isInCompare
              ? 'bg-teal-600 border-teal-600 text-white opacity-100 shadow'
              : 'bg-white/90 border-slate-300 text-slate-600 opacity-0 group-hover:opacity-100 hover:border-teal-400 hover:text-teal-600'
          }`}
          aria-pressed={isInCompare}
        >
          {isInCompare ? '✓' : '+'}
        </button>
      )}
    </div>
  )
}
