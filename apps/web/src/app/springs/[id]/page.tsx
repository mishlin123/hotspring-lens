import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getAllSprings, getSpringById, getDistinctivenessBreakdown } from '@/lib/data'
import type { DistinctivenessBreakdown } from '@/lib/types'
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
      <p className="text-xs text-slate-600 mb-1">{label}</p>
      <p className="text-lg font-semibold text-slate-800 leading-none">
        {value}
        <span className="text-sm font-normal text-slate-600 ml-1">{unit}</span>
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
      <span className="text-sm text-slate-600">{label}</span>
      <span className="text-sm font-medium text-slate-800 text-right">
        {value}{unit ? <span className="text-slate-600 ml-1 font-normal">{unit}</span> : null}
      </span>
    </div>
  )
}

// ─── Distinctiveness section ──────────────────────────────────────────────────

function scoreLabel(score: number): string {
  if (score >= 80) return 'Highly distinctive'
  if (score >= 60) return 'Notably distinctive'
  if (score >= 40) return 'Moderately distinctive'
  return 'Common community profile'
}

function scoreColor(score: number): { text: string; bar: string; bg: string } {
  if (score >= 80) return { text: 'text-emerald-700', bar: 'bg-emerald-500', bg: 'bg-emerald-50' }
  if (score >= 60) return { text: 'text-teal-700',    bar: 'bg-teal-500',    bg: 'bg-teal-50' }
  if (score >= 40) return { text: 'text-amber-700',   bar: 'bg-amber-500',   bg: 'bg-amber-50' }
  return              { text: 'text-slate-600',    bar: 'bg-slate-400',   bg: 'bg-slate-50' }
}

interface ComponentRowProps {
  label: string
  score: number
  description: string
}

function ComponentRow({ label, score, description }: ComponentRowProps) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <div className="w-32 flex-shrink-0">
        <p className="text-xs font-medium text-slate-700 leading-tight">{label}</p>
        <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{description}</p>
      </div>
      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full bg-teal-500 transition-all"
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-slate-700 w-7 text-right flex-shrink-0">{score}</span>
    </div>
  )
}

function DistinctivenessSection({ d }: { d: DistinctivenessBreakdown }) {
  if (!d.has_taxonomy) return null
  const colors = scoreColor(d.score)
  return (
    <section className="bg-white rounded-xl border border-slate-200 p-5">
      <h2 className="text-lg font-semibold text-slate-800 mb-1">Distinctiveness</h2>
      <p className="text-xs text-slate-500 mb-4">
        Computed from genus-level taxon rarity across {d.total_taxa > 0 ? '755' : '—'} sampled springs.
        Not equivalent to phylogenetic uniqueness (UniFrac).
      </p>

      {/* Score badge */}
      <div className={`inline-flex items-center gap-3 rounded-lg px-4 py-2.5 mb-4 ${colors.bg}`}>
        <span className={`text-3xl font-black tabular-nums ${colors.text}`}>{d.score}</span>
        <div>
          <p className={`text-sm font-semibold leading-tight ${colors.text}`}>{scoreLabel(d.score)}</p>
          <p className="text-xs text-slate-500">out of 100</p>
        </div>
      </div>

      {/* Component breakdown */}
      <div className="space-y-0.5 mb-4">
        <ComponentRow
          label="National rarity"
          score={d.rarity_score}
          description="How rarely its top genera appear across NZ springs"
        />
        <ComponentRow
          label="Community evenness"
          score={d.evenness_score}
          description="How spread reads are across taxa vs one dominant"
        />
        <ComponentRow
          label="Taxon richness"
          score={d.richness_score}
          description="Number of detected taxa relative to other springs"
        />
      </div>

      {/* Rare taxa callout */}
      {d.rare_taxa.length > 0 && (
        <div className="bg-slate-50 rounded-lg px-3 py-2.5 mb-3 border border-slate-100">
          <p className="text-xs font-semibold text-slate-700 mb-1">
            {d.rare_taxa.length === 1 ? '1 rarely-seen genus' : `${d.rare_taxa.length} rarely-seen genera`}
            <span className="font-normal text-slate-500"> (≤5 springs nationally)</span>
          </p>
          <p className="text-xs text-slate-700">{d.rare_taxa.join(' · ')}</p>
        </div>
      )}

      {/* Dominance note */}
      {d.top_taxon_pct !== null && (
        <p className="text-xs text-slate-500">
          Top genus accounts for <span className="font-medium text-slate-700">{d.top_taxon_pct}%</span> of
          the top-10 sequencing reads at this site.
        </p>
      )}
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SpringDetailPage({ params }: Props) {
  const spring = getSpringById(params.id)
  if (!spring) notFound()
  const distinctiveness = getDistinctivenessBreakdown(params.id)

  return (
    <div>
      {/* ── Context band ────────────────────────────────────────── */}
      <div className="bg-teal-900 text-teal-300 px-4 py-3 text-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Link href="/explore" className="hover:text-white transition-colors">
              ← Explore
            </Link>
            <span className="text-teal-700">·</span>
            <span className="text-teal-400 truncate">{spring.geothermal_system}</span>
          </div>
          <Link
            href={`/explore?compare=${spring.id}`}
            className="text-teal-300 hover:text-white border border-teal-700 hover:border-teal-500 rounded px-3 py-1 transition-colors text-xs"
          >
            Compare this spring
          </Link>
        </div>
      </div>

    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

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
        <p className="text-xs text-slate-500 mb-2 uppercase tracking-widest">
          {spring.feature_type}
          <span className="mx-2 text-slate-300">·</span>
          {spring.sample_number}
        </p>
        <h1 className="text-4xl font-bold text-slate-800 mb-2 tracking-tight leading-tight">{spring.name}</h1>
        <p className="text-slate-600 text-base">{spring.location_text}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: main sections */}
        <div className="lg:col-span-2 space-y-6">

          {/* Site description */}
          {spring.description && (
            <section className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="text-lg font-semibold text-slate-800 mb-3">Site description</h2>
              <p className="text-base text-slate-800 leading-relaxed">{spring.description}</p>
              {spring.sample_date && (
                <p className="text-xs text-slate-500 mt-3">Sampled: {spring.sample_date}</p>
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
            <p className="text-xs text-slate-500 mb-3">
              16S rRNA amplicon sequencing. Ranks span domain to genus.
            </p>
            <TaxaDisplay taxa={spring.top_taxa} totalCount={spring.taxonomy_record_count} />
          </section>

          {/* Distinctiveness */}
          {distinctiveness && <DistinctivenessSection d={distinctiveness} />}
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

            <p className="text-xs text-slate-500 mt-3">
              Point-in-time field measurements. Conditions vary with season and hydrothermal activity.
            </p>
          </section>

          {/* Location */}
          {spring.latitude !== null && spring.longitude !== null && (
            <section className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="text-lg font-semibold text-slate-800 mb-3">Location</h2>
              <p className="text-sm text-slate-800 mb-2">{spring.location_text}</p>
              <p className="text-xs text-slate-500 mb-2">
                {spring.latitude.toFixed(4)}, {spring.longitude.toFixed(4)}
              </p>
              <p className="text-xs text-slate-500">
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
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-0.5">Source</p>
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
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-0.5">Attribution</p>
                <p className="text-xs text-slate-800 leading-relaxed">{spring.attribution}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-0.5">Licence</p>
                <a
                  href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:underline text-xs"
                >
                  {spring.licence}
                </a>
              </div>
              <p className="text-xs text-slate-500 pt-1 border-t border-slate-200">
                Data represents point-in-time field measurements from the 1000 Springs Project.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
    </div>
  )
}
