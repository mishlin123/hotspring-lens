'use client'

import { useState, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import type { SpringSummary } from '@/lib/types'
import SpringCard from '@/components/SpringCard'

const SpringsMap = dynamic(() => import('@/components/SpringsMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[520px] bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400">
      Loading map…
    </div>
  ),
})

interface Props {
  springs: SpringSummary[]
  systems: string[]
  featureTypes: string[]
  initialSystem?: string
}

export default function ExploreClient({ springs, systems, featureTypes, initialSystem = '' }: Props) {
  const [search, setSearch] = useState('')
  const [system, setSystem] = useState(initialSystem)
  const [featureType, setFeatureType] = useState('')
  const [tempMin, setTempMin] = useState('')
  const [tempMax, setTempMax] = useState('')
  const [phMin, setPhMin] = useState('')
  const [phMax, setPhMax] = useState('')
  const [view, setView] = useState<'list' | 'map'>('list')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const tMin = tempMin !== '' ? parseFloat(tempMin) : null
    const tMax = tempMax !== '' ? parseFloat(tempMax) : null
    const pMin = phMin !== '' ? parseFloat(phMin) : null
    const pMax = phMax !== '' ? parseFloat(phMax) : null

    return springs.filter(s => {
      if (q) {
        const inName = s.name.toLowerCase().includes(q)
        const inLocation = (s.location_text ?? '').toLowerCase().includes(q)
        const inSystem = (s.geothermal_system ?? '').toLowerCase().includes(q)
        if (!inName && !inLocation && !inSystem) return false
      }
      if (system && s.geothermal_system !== system) return false
      if (featureType && s.feature_type !== featureType) return false
      if (tMin !== null && (s.temperature_c === null || s.temperature_c < tMin)) return false
      if (tMax !== null && (s.temperature_c === null || s.temperature_c > tMax)) return false
      if (pMin !== null && (s.ph === null || s.ph < pMin)) return false
      if (pMax !== null && (s.ph === null || s.ph > pMax)) return false
      return true
    })
  }, [springs, search, system, featureType, tempMin, tempMax, phMin, phMax])

  const clearFilters = useCallback(() => {
    setSearch('')
    setSystem('')
    setFeatureType('')
    setTempMin('')
    setTempMax('')
    setPhMin('')
    setPhMax('')
  }, [])

  const hasFilters = search || system || featureType || tempMin || tempMax || phMin || phMax

  return (
    <div>
      {/* Filter bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-5 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
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
          {/* System */}
          <select
            value={system}
            onChange={e => setSystem(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          >
            <option value="">All systems</option>
            {systems.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {/* Feature type */}
          <select
            value={featureType}
            onChange={e => setFeatureType(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          >
            <option value="">All types</option>
            {featureTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center">
          {/* Temp range */}
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="font-medium">Temp (°C):</span>
            <input
              type="number"
              value={tempMin}
              onChange={e => setTempMin(e.target.value)}
              placeholder="Min"
              className="w-16 border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <span>–</span>
            <input
              type="number"
              value={tempMax}
              onChange={e => setTempMax(e.target.value)}
              placeholder="Max"
              className="w-16 border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          {/* pH range */}
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="font-medium">pH:</span>
            <input
              type="number"
              value={phMin}
              onChange={e => setPhMin(e.target.value)}
              placeholder="Min"
              step="0.1"
              className="w-16 border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <span>–</span>
            <input
              type="number"
              value={phMax}
              onChange={e => setPhMax(e.target.value)}
              placeholder="Max"
              step="0.1"
              className="w-16 border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-slate-400 hover:text-slate-600 underline transition-colors ml-auto"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Toolbar: count + view toggle */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-600">
          {filtered.length === springs.length
            ? `${filtered.length} springs`
            : `${filtered.length} of ${springs.length} springs`}
        </p>
        <div className="flex rounded-lg border border-slate-200 overflow-hidden text-sm">
          <button
            onClick={() => setView('list')}
            className={`px-4 py-1.5 font-medium transition-colors ${
              view === 'list'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            List
          </button>
          <button
            onClick={() => setView('map')}
            className={`px-4 py-1.5 font-medium transition-colors ${
              view === 'map'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Map
          </button>
        </div>
      </div>

      {/* Content */}
      {view === 'map' ? (
        <SpringsMap springs={filtered} />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-5xl mb-3">♨</p>
          <p className="text-lg font-medium mb-1">No springs match these filters</p>
          <button
            onClick={clearFilters}
            className="text-sm text-teal-600 hover:underline mt-2"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(s => (
            <SpringCard key={s.id} spring={s} />
          ))}
        </div>
      )}
    </div>
  )
}
