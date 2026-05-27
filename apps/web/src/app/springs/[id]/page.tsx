import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getAllSprings, getSpringById } from '@/lib/data'
import TaxaDisplay from '@/components/TaxaDisplay'
import ChemistryDisplay from '@/components/ChemistryDisplay'

interface Props {
  params: { id: string }
}

export async function generateStaticParams() {
  return getAllSprings().map(s => ({ id: s.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const spring = getSpringById(params.id)
  if (!spring) return { title: 'Spring not found' }
  return {
    title: spring.name,
    description: `${spring.geothermal_system} · ${spring.feature_type} · ${
      spring.temperature_c !== null ? `${spring.temperature_c}°C` : ''
    }${spring.ph !== null ? ` · pH ${spring.ph}` : ''}`,
  }
}

function MeasurementRow({ label, value, unit }: { label: string; value: string | number | null; unit?: string }) {
  if (value === null || value === undefined || value === '') return null
  return (
    <div className="flex items-baseline justify-between py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-800">
        {value}{unit ? <span className="text-slate-500 ml-1 font-normal">{unit}</span> : null}
      </span>
    </div>
  )
}

export default function SpringDetailPage({ params }: Props) {
  const spring = getSpringById(params.id)
  if (!spring) notFound()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back */}
      <Link
        href="/explore"
        className="inline-flex items-center gap-1 text-sm text-teal-600 hover:text-teal-800 mb-6 transition-colors"
      >
        ← Back to explorer
      </Link>

      {/* Safety warning */}
      {spring.safety_warning && (
        <div className="border-l-4 border-amber-400 bg-amber-50 px-4 py-3 mb-6 flex gap-3">
          <div className="w-5 h-5 rounded-full border border-amber-500 text-amber-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">!</div>
          <p className="text-sm text-amber-800 leading-relaxed">{spring.safety_warning}</p>
        </div>
      )}

      {/* Hero image */}
      {spring.large_image_url && (
        <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden mb-6 bg-slate-200">
          <Image
            src={spring.large_image_url}
            alt={spring.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 896px) 100vw, 896px"
          />
        </div>
      )}

      {/* Title block */}
      <div className="mb-8">
        <p className="text-xs text-slate-500 mb-2 font-medium">
          {spring.geothermal_system}
          <span className="mx-2 text-slate-300">·</span>
          {spring.feature_type}
          <span className="mx-2 text-slate-300">·</span>
          <span className="font-mono">{spring.sample_number}</span>
        </p>
        <h1 className="text-3xl font-bold text-slate-800 mb-1 tracking-tight">{spring.name}</h1>
        <p className="text-slate-500 text-sm">{spring.location_text}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: main sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          {spring.description && (
            <section className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="text-lg font-semibold text-slate-800 mb-3">Overview</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{spring.description}</p>
              {spring.sample_date && (
                <p className="text-xs text-slate-400 mt-3">Sampled: {spring.sample_date}</p>
              )}
            </section>
          )}

          {/* Chemistry */}
          <section className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Chemical Composition</h2>
            <ChemistryDisplay
              chemistry={spring.top_chemistry}
              totalCount={spring.chemistry_record_count}
            />
          </section>

          {/* Microbiology */}
          <section className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-lg font-semibold text-slate-800 mb-1">Microbial Diversity</h2>
            <p className="text-xs text-slate-400 mb-3">
              16S rRNA amplicon data. Ranks span domain to genus — do not interpret as species
              identifications.
            </p>
            <TaxaDisplay taxa={spring.top_taxa} totalCount={spring.taxonomy_record_count} />
          </section>
        </div>

        {/* Right column: measurements + attribution */}
        <div className="space-y-6">
          {/* Physical measurements */}
          <section className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Physical Measurements</h2>
            <div>
              <MeasurementRow label="Temperature" value={spring.temperature_c} unit="°C" />
              <MeasurementRow label="pH" value={spring.ph} />
              <MeasurementRow label="Size (approx.)" value={spring.size_approx} />
              <MeasurementRow label="Ebullition" value={spring.ebullition} />
              <MeasurementRow label="ORP" value={spring.oxidation_reduction_potential_mv} unit="mV" />
              <MeasurementRow label="Conductivity" value={spring.conductivity_us_cm} unit="µS/cm" />
              <MeasurementRow label="Dissolved oxygen" value={spring.dissolved_oxygen_mg_l} unit="mg/L" />
              <MeasurementRow label="Turbidity" value={spring.turbidity_fnu} unit="FNU" />
            </div>
          </section>

          {/* Location */}
          {spring.latitude !== null && spring.longitude !== null && (
            <section className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="text-lg font-semibold text-slate-800 mb-3">Location</h2>
              <p className="text-sm text-slate-600 mb-2">{spring.location_text}</p>
              <p className="text-xs text-mono text-slate-400">
                {spring.latitude.toFixed(4)}, {spring.longitude.toFixed(4)}
              </p>
            </section>
          )}

          {/* Source & Attribution */}
          <section className="bg-slate-50 rounded-xl border border-slate-200 p-5">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Source & Attribution</h2>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">
                  Source
                </p>
                <a
                  href={spring.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:underline break-all"
                >
                  {spring.source_url}
                </a>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">
                  Attribution
                </p>
                <p className="text-slate-600">{spring.attribution}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">
                  Licence
                </p>
                <a
                  href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:underline"
                >
                  {spring.licence}
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
