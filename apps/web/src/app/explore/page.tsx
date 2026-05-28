import type { Metadata } from 'next'
import {
  getAllSpringSummaries,
  getUniqueGeothermalSystems,
  getUniqueFeatureTypes,
} from '@/lib/data'
import ExploreClient from './ExploreClient'

export const metadata: Metadata = {
  title: 'Explore',
  description: 'Map and list of 792 geothermal springs across New Zealand.',
}

interface Props {
  searchParams: { system?: string; compare?: string }
}

export default function ExplorePage({ searchParams }: Props) {
  const summaries    = getAllSpringSummaries()
  const systems      = getUniqueGeothermalSystems()
  const featureTypes = getUniqueFeatureTypes()
  const initialSystem     = searchParams.system  ?? ''
  const initialCompareIds = searchParams.compare
    ? searchParams.compare.split(',').map(s => s.trim()).filter(Boolean).slice(0, 3)
    : []

  return (
    <>
      {/* ── Hero band ─────────────────────────────────────────── */}
      <div className="bg-teal-900 text-white py-10 sm:py-12 px-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-widest text-teal-400 mb-4">
            Taupō Volcanic Zone · Aotearoa New Zealand
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 leading-tight tracking-tight">
            Explore Springs
          </h1>
          <p className="text-teal-200 text-lg leading-relaxed">
            {summaries.length.toLocaleString()} spring records across {systems.length} geothermal systems.
          </p>
        </div>
      </div>

      {/* ── Spring list + map ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ExploreClient
          springs={summaries}
          systems={systems}
          featureTypes={featureTypes}
          initialSystem={initialSystem}
          initialCompareIds={initialCompareIds}
        />
      </div>
    </>
  )
}
