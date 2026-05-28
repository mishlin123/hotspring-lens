'use client'

import { useState, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import type { SpringSummary } from '@/lib/types'
import SpringCard from '@/components/SpringCard'
import DatasetInsights from '@/components/DatasetInsights'
import CompareBar from '@/components/CompareBar'

const SpringsMap = dynamic(() => import('@/components/SpringsMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[520px] bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400">
      Loading map…
    </div>
  ),
})

type SortKey = 'name' | 'tempDesc' | 'tempAsc' | 'phAsc' | 'phDesc' | 'taxDesc'

interface Props {
  springs: SpringSummary[]
  systems: string[]
  featureTypes: string[]
  initialSystem?: string
  initialCompareIds?: string[]
}

export default function ExploreClient({ springs, systems, featureTypes, initialSystem = '', initialCompareIds = [] }: Props) {
  const [search, setSearch]             = useState('')
  const [system, setSystem]             = useState(initialSystem)
  const [featureType, setFeatureType]   = useState<string[]>([])
  const [tempMin, setTempMin]           = useState('')
  const [tempMax, setTempMax]           = useState('')
  const [phMin, setPhMin]               = useState('')
  const [phMax, setPhMax]               = useState('')
  const [view, setView]                 = useState<'list' | 'map'>('map')
  const [showInsights, setShowInsights] = useState(true)
  const [sortBy, setSortBy]             = useState<SortKey>('name')
  const [compareIds, setCompareIds]     = useState<string[]>(initialCompareIds)

  // ─── Filter ───────────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    const q    = search.trim().toLowerCase()
    const tMin = tempMin !== '' ? parseFloat(tempMin) : null
    const tMax = tempMax !== '' ? parseFloat(tempMax) : null
    const pMin = phMin   !== '' ? parseFloat(phMin)   : null
    const pMax = phMax   !== '' ? parseFloat(phMax)   : null

    return springs.filter(s => {
      if (q) {
        const inName     = s.name.toLowerCase().includes(q)
        const inLocation = (s.location_text ?? '').toLowerCase().includes(q)
        const inSystem   = (s.geothermal_system ?? '').toLowerCase().includes(q)
        if (!inName && !inLocation && !inSystem) return false
      }
      if (system                  && s.geothermal_system !== system)                   return false
      if (featureType.length > 0 && !featureType.includes(s.feature_type))           return false
      if (tMin !== null && (s.temperature_c === null || s.temperature_c < tMin)) return false
      if (tMax !== null && (s.temperature_c === null || s.temperature_c > tMax)) return false
      if (pMin !== null && (s.ph === null || s.ph < pMin)) return false
      if (pMax !== null && (s.ph === null || s.ph > pMax)) return false
      return true
    })
  }, [springs, search, system, featureType, tempMin, tempMax, phMin, phMax])

  // ─── Sort ─────────────────────────────────────────────────────────────────

  const sorted = useMemo(() => {
    const arr = [...filtered]
    switch (sortBy) {
      case 'tempDesc': return arr.sort((a, b) => (b.temperature_c ?? -Infinity) - (a.temperature_c ?? -Infinity))
      case 'tempAsc':  return arr.sort((a, b) => (a.temperature_c ?? Infinity)  - (b.temperature_c ?? Infinity))
      case 'phAsc':    return arr.sort((a, b) => (a.ph ?? Infinity)             - (b.ph ?? Infinity))
      case 'phDesc':   return arr.sort((a, b) => (b.ph ?? -Infinity)            - (a.ph ?? -Infinity))
      case 'taxDesc':  return arr.sort((a, b) => b.taxonomy_record_count        - a.taxonomy_record_count)
      default:         return arr.sort((a, b) => a.name.localeCompare(b.name))
    }
  }, [filtered, sortBy])

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const clearFilters = useCallback(() => {
    setSearch('')
    setSystem('')
    setFeatureType([])
    setTempMin('')
    setTempMax('')
    setPhMin('')
    setPhMax('')
  }, [])

  const hasFilters = search || system || featureType.length > 0 || tempMin || tempMax || phMin || phMax

  const toggleCompare = useCallback((id: string) => {
    setCompareIds(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : prev.length < 3 ? [...prev, id] : prev
    )
  }, [])

  const selectedSprings = useMemo(
    () => springs.filter(s => compareIds.includes(s.id)),
    [springs, compareIds],
  )

  return (
    <div className={compareIds.length > 0 ? 'pb-20' : ''}>

      {/* Dataset overview toggle */}
      <button
        onClick={() => setShowInsights(v => !v)}
        className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-4 py-2.5 mb-3 transition-colors text-left"
        aria-expanded={showInsights}
      >
        <span className="flex items-center gap-2.5">
          <span className="text-base leading-none">📊</span>
          <span className="text-sm font-semibold text-slate-700">Dataset overview</span>
          <span className="hidden sm:inline text-xs text-slate-400">temperature &amp; pH distributions, system counts, scatter plot</span>
        </span>
        <span className="text-xs text-slate-400 flex-shrink-0">{showInsights ? '▲ hide' : '▼ show'}</span>
      </button>

      {/* Dataset insights panel */}
      {showInsights && (
        <DatasetInsights
          allSprings={springs}
          filteredSprings={filtered}
          activeSystem={system}
          activeFeatureType={featureType}
          onSystemClick={sys => setSystem(sys)}
          onFeatureTypeClick={ft => setFeatureType(prev => prev.includes(ft) ? prev.filter(x => x !== ft) : [...prev, ft])}
        />
      )}

      {/* Filter bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-5 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="sr-only">Search springs</label>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, location, or system…"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <select
            value={system}
            onChange={e => setSystem(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          >
            <option value="">All systems</option>
            {systems.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={featureType.length === 1 ? featureType[0] : ''}
            onChange={e => setFeatureType(e.target.value ? [e.target.value] : [])}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          >
            <option value="">{featureType.length > 1 ? `${featureType.length} types selected` : 'All types'}</option>
            {featureTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="font-medium">Temp (°C):</span>
            <input type="number" value={tempMin} onChange={e => setTempMin(e.target.value)} placeholder="Min"
              className="w-16 border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            <span>–</span>
            <input type="number" value={tempMax} onChange={e => setTempMax(e.target.value)} placeholder="Max"
              className="w-16 border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="font-medium">pH:</span>
            <input type="number" value={phMin} onChange={e => setPhMin(e.target.value)} placeholder="Min" step="0.1"
              className="w-16 border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            <span>–</span>
            <input type="number" value={phMax} onChange={e => setPhMax(e.target.value)} placeholder="Max" step="0.1"
              className="w-16 border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          {hasFilters && (
            <button onClick={clearFilters} className="text-sm text-slate-400 hover:text-slate-600 underline transition-colors ml-auto">
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Toolbar: count + sort + view */}
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <p className="text-sm text-slate-600 flex-shrink-0">
          {filtered.length === springs.length
            ? `${filtered.length} springs`
            : `${filtered.length} of ${springs.length} springs`}
        </p>

        <div className="flex items-center gap-2 ml-auto">
          {/* Sort */}
          {view === 'list' && (
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortKey)}
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Sort springs"
            >
              <option value="name">Sort: Name</option>
              <option value="tempDesc">Sort: Hottest first</option>
              <option value="tempAsc">Sort: Coolest first</option>
              <option value="phAsc">Sort: Most acidic first</option>
              <option value="phDesc">Sort: Most alkaline first</option>
              <option value="taxDesc">Sort: Most taxonomy data</option>
            </select>
          )}

          {/* View toggle */}
          <div className="flex rounded-lg border border-slate-200 overflow-hidden text-sm">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-1.5 font-medium transition-colors ${
                view === 'list' ? 'bg-teal-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setView('map')}
              className={`px-4 py-1.5 font-medium transition-colors ${
                view === 'map' ? 'bg-teal-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Map
            </button>
          </div>
        </div>
      </div>

      {/* Compare hint — shown once first spring is selected */}
      {compareIds.length === 1 && view === 'list' && (
        <p className="text-xs text-slate-400 mb-3">
          Select one or two more springs to compare. Hover a card and click "+" to add.
        </p>
      )}

      {/* Content */}
      {view === 'map' ? (
        <SpringsMap springs={filtered} />
      ) : sorted.length === 0 ? (
        <div className="text-center py-16 border border-slate-200 rounded bg-slate-50">
          <p className="text-sm font-medium text-slate-600 mb-1">No springs match these filters</p>
          <p className="text-sm text-slate-400 mb-4">Try broadening your search or adjusting the range values</p>
          <button onClick={clearFilters} className="text-sm text-teal-700 font-medium hover:underline">
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sorted.map(s => (
            <SpringCard
              key={s.id}
              spring={s}
              onToggleCompare={toggleCompare}
              isInCompare={compareIds.includes(s.id)}
            />
          ))}
        </div>
      )}

      {/* Floating compare bar */}
      <CompareBar
        selected={selectedSprings}
        onRemove={toggleCompare}
        onClear={() => setCompareIds([])}
      />
    </div>
  )
}
