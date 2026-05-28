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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Explore Springs</h1>
        <p className="text-slate-500 mt-1">
          {summaries.length} spring records across {systems.length} geothermal systems.
          Hover any card to add it to a comparison.
        </p>
      </div>
      <ExploreClient
        springs={summaries}
        systems={systems}
        featureTypes={featureTypes}
        initialSystem={initialSystem}
        initialCompareIds={initialCompareIds}
      />
    </div>
  )
}
