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
    <div className="h-[520px] bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500">
      Loading map…
    </div>
  ),
})

type SortKey = 'name' | 'tempDesc' | 'tempAsc' | 'phAsc' | 'phDesc' | 'taxDesc' | 'distinctDesc'

type View = 'map' | 'data' | 'list'

// ─── Primary view tabs ────────────────────────────────────────────────────────

function MapIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 1.5c-2.2 0-4 1.8-4 4 0 2.9 4 9 4 9s4-6.1 4-9c0-2.2-1.8-4-4-4Z" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="8" cy="5.5" r="1.4" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}

function DataIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.5" y="8" width="3" height="6" rx="0.6" stroke="currentColor" strokeWidth="1.3" />
      <rect x="6.5" y="4" width="3" height="10" rx="0.6" stroke="currentColor" strokeWidth="1.3" />
      <rect x="11.5" y="1.5" width="3" height="12.5" rx="0.6" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

const VIEW_TABS: { key: View; label: string; sub: string; icon: () => JSX.Element }[] = [
  { key: 'map',  label: 'Map',           sub: 'Where the springs are',   icon: MapIcon },
  { key: 'data', label: 'Data overview', sub: 'Charts & distributions',  icon: DataIcon },
  { key: 'list', label: 'List',          sub: 'Browse every record',     icon: ListIcon },
]

interface Props {
  springs: SpringSummary[]
  systems: string[]
  featureTypes: string[]
  analytes: { analyte: string; count: number }[]
  initialSystem?: string
  initialCompareIds?: string[]
}

export default function ExploreClient({ springs, systems, featureTypes, analytes, initialSystem = '', initialCompareIds = [] }: Props) {
  const [search, setSearch]             = useState('')
  const [system, setSystem]             = useState<string[]>(initialSystem ? [initialSystem] : [])
  const [featureType, setFeatureType]   = useState<string[]>([])
  const [activeAnalyte, setActiveAnalyte] = useState<string[]>([])
  const [tempMin, setTempMin]           = useState('')
  const [tempMax, setTempMax]           = useState('')
  const [phMin, setPhMin]               = useState('')
  const [phMax, setPhMax]               = useState('')
  const [view, setView]                 = useState<View>('map')
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
      if (system.length > 0        && !system.includes(s.geothermal_system))                   return false
      if (featureType.length > 0   && !featureType.includes(s.feature_type))                   return false
      if (activeAnalyte.length > 0 && !activeAnalyte.some(a => s.analytes.includes(a)))        return false
      if (tMin !== null && (s.temperature_c === null || s.temperature_c < tMin)) return false
      if (tMax !== null && (s.temperature_c === null || s.temperature_c > tMax)) return false
      if (pMin !== null && (s.ph === null || s.ph < pMin)) return false
      if (pMax !== null && (s.ph === null || s.ph > pMax)) return false
      return true
    })
  }, [springs, search, system, featureType, activeAnalyte, tempMin, tempMax, phMin, phMax])

  // ─── Sort ─────────────────────────────────────────────────────────────────

  const sorted = useMemo(() => {
    const arr = [...filtered]
    switch (sortBy) {
      case 'tempDesc': return arr.sort((a, b) => (b.temperature_c ?? -Infinity) - (a.temperature_c ?? -Infinity))
      case 'tempAsc':  return arr.sort((a, b) => (a.temperature_c ?? Infinity)  - (b.temperature_c ?? Infinity))
      case 'phAsc':    return arr.sort((a, b) => (a.ph ?? Infinity)             - (b.ph ?? Infinity))
      case 'phDesc':   return arr.sort((a, b) => (b.ph ?? -Infinity)            - (a.ph ?? -Infinity))
      case 'taxDesc':      return arr.sort((a, b) => b.taxonomy_record_count - a.taxonomy_record_count)
      case 'distinctDesc': return arr.sort((a, b) => (b.distinctiveness_score ?? -1) - (a.distinctiveness_score ?? -1))
      default:             return arr.sort((a, b) => a.name.localeCompare(b.name))
    }
  }, [filtered, sortBy])

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const clearFilters = useCallback(() => {
    setSearch('')
    setSystem([])
    setFeatureType([])
    setActiveAnalyte([])
    setTempMin('')
    setTempMax('')
    setPhMin('')
    setPhMax('')
  }, [])

  const hasFilters = search || system.length > 0 || featureType.length > 0 || activeAnalyte.length > 0 || tempMin || tempMax || phMin || phMax

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

      {/* Primary view switcher — choose how to explore the dataset */}
      <div
        role="tablist"
        aria-label="Explore view"
        className="grid grid-cols-3 gap-1 bg-slate-100 rounded-xl p-1 mb-5"
      >
        {VIEW_TABS.map(({ key, label, sub, icon: Icon }) => {
          const active = view === key
          return (
            <button
              key={key}
              role="tab"
              aria-selected={active}
              onClick={() => setView(key)}
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 transition-colors ${
                active
                  ? 'bg-white shadow-sm text-teal-700'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <span className={active ? 'text-teal-600' : 'text-slate-500'}>
                <Icon />
              </span>
              <span className="text-left leading-tight">
                <span className="block text-sm font-semibold">{label}</span>
                <span className="hidden sm:block text-xs font-normal text-slate-500">{sub}</span>
              </span>
            </button>
          )
        })}
      </div>

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
            value={system.length === 1 ? system[0] : ''}
            onChange={e => setSystem(e.target.value ? [e.target.value] : [])}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          >
            <option value="">{system.length > 1 ? `${system.length} systems selected` : 'All systems'}</option>
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
          <div className="flex items-center gap-2 text-sm text-slate-800">
            <span className="font-medium">Temp (°C):</span>
            <input type="number" value={tempMin} onChange={e => setTempMin(e.target.value)} placeholder="Min"
              className="w-16 border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            <span>–</span>
            <input type="number" value={tempMax} onChange={e => setTempMax(e.target.value)} placeholder="Max"
              className="w-16 border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-800">
            <span className="font-medium">pH:</span>
            <input type="number" value={phMin} onChange={e => setPhMin(e.target.value)} placeholder="Min" step="0.1"
              className="w-16 border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            <span>–</span>
            <input type="number" value={phMax} onChange={e => setPhMax(e.target.value)} placeholder="Max" step="0.1"
              className="w-16 border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          {hasFilters && (
            <button onClick={clearFilters} className="text-sm text-slate-500 hover:text-slate-800 underline transition-colors ml-auto">
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Toolbar: count + sort */}
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <p className="text-sm text-slate-800 flex-shrink-0">
          {filtered.length === springs.length
            ? `${filtered.length} springs`
            : `${filtered.length} of ${springs.length} springs`}
        </p>

        <div className="flex items-center gap-2 ml-auto">
          {/* Sort — list view only */}
          {view === 'list' && (
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortKey)}
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Sort springs"
            >
              <option value="name">Sort: Name</option>
              <option value="tempDesc">Sort: Hottest first</option>
              <option value="tempAsc">Sort: Coolest first</option>
              <option value="phAsc">Sort: Most acidic first</option>
              <option value="phDesc">Sort: Most alkaline first</option>
              <option value="taxDesc">Sort: Most taxonomy data</option>
              <option value="distinctDesc">Sort: Most distinctive</option>
            </select>
          )}
        </div>
      </div>

      {/* Compare hint — shown once first spring is selected */}
      {compareIds.length === 1 && view === 'list' && (
        <p className="text-xs text-slate-500 mb-3">
          Select one or two more springs to compare. Hover a card and click "+" to add.
        </p>
      )}

      {/* Content */}
      {view === 'data' ? (
        <DatasetInsights
          allSprings={springs}
          filteredSprings={filtered}
          activeSystem={system}
          activeFeatureType={featureType}
          activeAnalyte={activeAnalyte}
          allAnalytes={analytes}
          onSystemClick={sys => setSystem(prev => prev.includes(sys) ? prev.filter(x => x !== sys) : [...prev, sys])}
          onFeatureTypeClick={ft => setFeatureType(prev => prev.includes(ft) ? prev.filter(x => x !== ft) : [...prev, ft])}
          onAnalyteClick={a => setActiveAnalyte(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])}
        />
      ) : view === 'map' ? (
        <SpringsMap springs={filtered} />
      ) : sorted.length === 0 ? (
        <div className="text-center py-16 border border-slate-200 rounded bg-slate-50">
          <p className="text-sm font-medium text-slate-800 mb-1">No springs match these filters</p>
          <p className="text-sm text-slate-500 mb-4">Try broadening your search or adjusting the range values</p>
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
