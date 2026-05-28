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

// ─── pH context scale ─────────────────────────────────────────────────────────

function phContext(ph: number | null): { label: string; color: string } | null {
  if (ph === null) return null
  if (ph < 2)  return { label: 'Extremely acidic',   color: 'text-violet-700' }
  if (ph < 4)  return { label: 'Strongly acidic',    color: 'text-red-600' }
  if (ph < 6)  return { label: 'Moderately acidic',  color: 'text-orange-600' }
  if (ph < 7)  return { label: 'Mildly acidic',      color: 'text-amber-600' }
  if (ph < 8)  return { label: 'Near neutral',       color: 'text-green-700' }
  if (ph < 9)  return { label: 'Slightly alkaline',  color: 'text-blue-600' }
  return              { label: 'Alkaline',            color: 'text-blue-700' }
}

function tempContext(temp: number | null): { label: string; color: string } | null {
  if (temp === null) return null
  if (temp >= 80) return { label: 'Very hot',  color: 'text-red-600' }
  if (temp >= 60) return { label: 'Hot',       color: 'text-orange-600' }
  if (temp >= 40) return { label: 'Warm',      color: 'text-amber-600' }
  return               { label: 'Cool',        color: 'text-green-700' }
}

// ─── Measurement card ─────────────────────────────────────────────────────────

interface MeasurementCardProps {
  label: string
  value: number | null
  unit: string
  context?: { label: string; color: string } | null
}

function MeasurementCard({ label, value, unit, context }: MeasurementCardProps) {
  if (value === null) return null
  return (
    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-lg font-semibold text-slate-800 leading-none">
        {value}
        <span className="text-sm font-normal text-slate-500 ml-1">{unit}</span>
      </p>
      {context && (
        <p className={`text-xs mt-1 font-medium ${context.color}`}>{context.label}</p>
      )}
    </div>
  )
}

// ─── Simple key–value row (for non-numeric measurements) ─────────────────────

function DetailRow({ label, value, unit }: { label: string; value: string | number | null; unit?: string }) {
  if (value === null || value === undefined || value === '') return null
  return (
    <div className="flex items-baseline justify-between py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-800 text-right">
        {value}{unit ? <span className="text-slate-500 ml-1 font-normal">{unit}</span> : null}
      </span>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SpringDetailPage({ params }: Props) {
  const spring = getSpringById(params.id)
  if (!spring) notFound()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back + compare link */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <Link
          href="/explore"
          className="inline-flex items-center gap-1 text-sm text-teal-600 hover:text-teal-800 transition-colors"
        >
          ← Back to explorer
        </Link>
        <Link
          href={`/explore?compare=${spring.id}`}
          className="text-sm text-slate-500 hover:text-slate-700 border border-slate-200 rounded px-3 py-1 transition-colors hover:border-slate-300"
        >
          Compare this spring
        </Link>
      </div>

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
        {/* Left: main sections */}
        <div className="lg:col-span-2 space-y-6">

          {/* Site description */}
          {spring.description && (
            <section className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="text-lg font-semibold text-slate-800 mb-3">Site description</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{spring.description}</p>
              {spring.sample_date && (
                <p className="text-xs text-slate-400 mt-3">Sampled: {spring.sample_date}</p>
              )}
            </section>
          )}

          {/* Water chemistry */}
          <section className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Water chemistry</h2>
            <ChemistryDisplay
              chemistry={spring.top_chemistry}
              totalCount={spring.chemistry_record_count}
            />
          </section>

          {/* Microbial diversity */}
          <section className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-lg font-semibold text-slate-800 mb-1">Microbial diversity</h2>
            <p className="text-xs text-slate-400 mb-3">
              16S rRNA amplicon sequencing. Ranks span domain to genus.
            </p>
            <TaxaDisplay taxa={spring.top_taxa} totalCount={spring.taxonomy_record_count} />
          </section>
        </div>

        {/* Right: measurements + location + attribution */}
        <div className="space-y-6">

          {/* Physical measurements — key values as cards, rest as rows */}
          <section className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Physical measurements</h2>

            {/* Key measurements as cards */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <MeasurementCard
                label="Temperature"
                value={spring.temperature_c}
                unit="°C"
                context={tempContext(spring.temperature_c)}
              />
              <MeasurementCard
                label="pH"
                value={spring.ph}
                unit=""
                context={phContext(spring.ph)}
              />
            </div>

            {/* Secondary measurements as rows */}
            <div className="mt-1">
              <DetailRow label="ORP" value={spring.oxidation_reduction_potential_mv} unit="mV" />
              <DetailRow label="Conductivity" value={spring.conductivity_us_cm} unit="µS/cm" />
              <DetailRow label="Dissolved oxygen" value={spring.dissolved_oxygen_mg_l} unit="mg/L" />
              <DetailRow label="Turbidity" value={spring.turbidity_fnu} unit="FNU" />
              <DetailRow label="Size (approx.)" value={spring.size_approx} />
              <DetailRow label="Ebullition (bubbling)" value={spring.ebullition} />
            </div>

            <p className="text-xs text-slate-400 mt-3">
              Point-in-time field measurements. Conditions vary with season and hydrothermal activity.
            </p>
          </section>

          {/* Location */}
          {spring.latitude !== null && spring.longitude !== null && (
            <section className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="text-lg font-semibold text-slate-800 mb-3">Location</h2>
              <p className="text-sm text-slate-600 mb-2">{spring.location_text}</p>
              <p className="font-mono text-xs text-slate-400 mb-2">
                {spring.latitude.toFixed(4)}, {spring.longitude.toFixed(4)}
              </p>
              <p className="text-xs text-slate-400">
                Coordinates are approximate GPS readings from field sampling.
                Do not use for navigation.
              </p>
            </section>
          )}

          {/* Source & attribution */}
          <section className="bg-slate-50 rounded-xl border border-slate-200 p-5">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Source & attribution</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">Source</p>
                <a
                  href={spring.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:underline break-all text-xs"
                >
                  {spring.source_url}
                </a>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">Attribution</p>
                <p className="text-xs text-slate-600 leading-relaxed">{spring.attribution}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">Licence</p>
                <a
                  href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:underline text-xs"
                >
                  {spring.licence}
                </a>
              </div>
              <p className="text-xs text-slate-400 pt-1 border-t border-slate-200">
                Data represents point-in-time field measurements from the 1000 Springs Project.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
