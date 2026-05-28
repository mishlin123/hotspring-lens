import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getSpringById } from '@/lib/data'
import type { Spring, ChemistryRecord, TaxonRecord } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Compare Springs',
  description: 'Side-by-side comparison of geothermal spring records.',
}

interface Props {
  searchParams: { ids?: string }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function phLabel(ph: number | null): { text: string; colour: string } {
  if (ph === null) return { text: '—', colour: 'text-slate-500' }
  if (ph < 2)  return { text: 'Extremely acidic',  colour: 'text-violet-700' }
  if (ph < 4)  return { text: 'Strongly acidic',   colour: 'text-red-600' }
  if (ph < 6)  return { text: 'Moderately acidic', colour: 'text-orange-600' }
  if (ph < 8)  return { text: 'Near neutral',      colour: 'text-green-700' }
  if (ph < 9)  return { text: 'Slightly alkaline', colour: 'text-blue-600' }
  return              { text: 'Alkaline',           colour: 'text-blue-700' }
}

function tempLabel(t: number | null): { text: string; colour: string } {
  if (t === null) return { text: '—', colour: 'text-slate-500' }
  if (t >= 80) return { text: 'Very hot',  colour: 'text-red-600' }
  if (t >= 60) return { text: 'Hot',       colour: 'text-orange-600' }
  if (t >= 40) return { text: 'Warm',      colour: 'text-amber-600' }
  return             { text: 'Cool',       colour: 'text-green-700' }
}

function fmt(v: number | null, decimals = 1): string {
  if (v === null) return '—'
  return v.toFixed(decimals)
}

// The 6 analytes present in virtually every record — good base for comparison
const CORE_ANALYTES = ['chloride', 'sodium', 'sulfate', 'silicon', 'potassium', 'calcium']

function getAnalyteValue(chem: ChemistryRecord[], analyte: string): number | null {
  return chem.find(c => c.analyte.toLowerCase() === analyte)?.value ?? null
}

function analyteLabel(a: string): string {
  return a.charAt(0).toUpperCase() + a.slice(1)
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** One column header: image + name + system */
function SpringHeader({ spring, cols }: { spring: Spring; cols: number }) {
  return (
    <div className="flex flex-col">
      {spring.large_image_url && (
        <div
          className="relative w-full bg-slate-100 mb-3 rounded-lg overflow-hidden flex-shrink-0"
          style={{ aspectRatio: '16/9' }}
        >
          <Image
            src={spring.large_image_url}
            alt={spring.name}
            fill
            className="object-cover"
            sizes={cols === 2 ? '50vw' : '33vw'}
          />
        </div>
      )}
      <p className="text-xs text-slate-600 mb-1">
        {spring.geothermal_system}
        <span className="mx-1.5 text-slate-300">·</span>
        {spring.feature_type}
      </p>
      <h2 className="font-bold text-slate-800 text-base leading-snug">{spring.name}</h2>
      <p className="text-xs text-slate-500 mt-0.5 truncate">{spring.location_text}</p>
      <Link
        href={`/springs/${spring.id}`}
        className="text-xs text-teal-600 hover:underline mt-1.5 inline-block"
      >
        Full record →
      </Link>
    </div>
  )
}

/** One cell in a measurement row */
function MeasCell({
  value,
  unit,
  label,
  labelColour,
}: {
  value: string
  unit?: string
  label?: string
  labelColour?: string
}) {
  return (
    <div className="py-3 px-4 border-b border-slate-100 last:border-0">
      <span className="text-sm font-semibold text-slate-800">
        {value}
        {unit && <span className="text-slate-500 font-normal ml-1 text-xs">{unit}</span>}
      </span>
      {label && <p className={`text-xs mt-0.5 ${labelColour ?? 'text-slate-600'}`}>{label}</p>}
    </div>
  )
}

/** Shared-scale horizontal bar for chemistry comparison */
function ChemBar({
  value,
  maxValue,
  unit = 'mg/L',
}: {
  value: number | null
  maxValue: number
  unit?: string
}) {
  if (value === null) {
    return <span className="text-xs text-slate-500">No data</span>
  }
  const pct = maxValue > 0 ? Math.min((value / maxValue) * 100, 100) : 0
  const display =
    value >= 100 ? value.toFixed(0) : value >= 1 ? value.toFixed(2) : value.toFixed(4)
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-xs font-mono text-slate-800">{display}</span>
        <span className="text-xs text-slate-500 ml-1">{unit}</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-teal-600 rounded-full"
          style={{ width: `${Math.max(pct, 0.5)}%`, opacity: 0.75 }}
        />
      </div>
    </div>
  )
}

/** Taxa bar for one spring in compare view */
function TaxaList({ taxa }: { taxa: TaxonRecord[] }) {
  if (!taxa || taxa.length === 0) {
    return <p className="text-xs text-slate-500 italic">No 16S taxonomy data.</p>
  }
  const maxReads = Math.max(...taxa.map(t => t.size))
  return (
    <div className="space-y-2">
      {taxa.slice(0, 5).map((t, i) => {
        const pct = maxReads > 0 ? (t.size / maxReads) * 100 : 0
        return (
          <div key={i}>
            <div className="flex items-baseline justify-between mb-0.5 gap-1 flex-wrap">
              <span className="text-xs italic text-slate-800 font-medium leading-tight truncate max-w-[80%]">
                {t.taxon_name.replace(/_/g, ' ')}
              </span>
              <span className="text-xs text-slate-500 flex-shrink-0">{t.size.toLocaleString()}</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded-full"
                style={{ width: `${Math.max(pct, 0.5)}%`, opacity: 0.75 }}
              />
            </div>
          </div>
        )
      })}
      <p className="text-xs text-slate-500 pt-1">Sequence read counts. Not cell abundance.</p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ComparePage({ searchParams }: Props) {
  const rawIds = (searchParams.ids ?? '').split(',').map(s => s.trim()).filter(Boolean)
  const ids    = rawIds.slice(0, 3) // cap at 3

  if (ids.length < 2) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-slate-800 mb-4">Select at least two springs from the explorer to compare.</p>
        <Link href="/explore" className="text-teal-600 font-medium hover:underline">
          ← Back to explorer
        </Link>
      </div>
    )
  }

  const springs = ids.map(id => getSpringById(id)).filter((s): s is Spring => s !== undefined)

  if (springs.length < 2) notFound()

  const cols = springs.length

  // ─── Chemistry: collect values for core analytes across all springs ───────
  const chemData = CORE_ANALYTES.map(analyte => {
    const values = springs.map(s => getAnalyteValue(s.top_chemistry, analyte))
    const max    = Math.max(...values.filter((v): v is number => v !== null), 0.001)
    return { analyte, values, max }
  })

  const gridCols = cols === 2 ? 'grid-cols-2' : 'grid-cols-3'

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Nav */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <Link
          href="/explore"
          className="inline-flex items-center gap-1 text-sm text-teal-600 hover:text-teal-800 transition-colors"
        >
          ← Back to explorer
        </Link>
        <p className="text-xs text-slate-500">
          Comparing {cols} springs · Point-in-time field measurements
        </p>
      </div>

      <h1 className="text-2xl font-bold text-slate-800 mb-6">Spring comparison</h1>

      {/* ─── Column headers ─────────────────────────────────────────────── */}
      <div className={`grid ${gridCols} gap-4 mb-6`}>
        {springs.map(s => (
          <SpringHeader key={s.id} spring={s} cols={cols} />
        ))}
      </div>

      {/* ─── Physical measurements ──────────────────────────────────────── */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2 px-4">
          Physical measurements
        </h2>
        <div className="border border-slate-200 rounded-xl overflow-hidden">

          {/* Header row: label column + one per spring */}
          <div
            className="bg-slate-50 border-b border-slate-200"
            style={{ display: 'grid', gridTemplateColumns: `140px repeat(${cols}, 1fr)` }}
          >
            <div className="px-4 py-2" />
            {springs.map(s => (
              <p key={s.id} className="text-xs font-semibold text-slate-800 px-4 py-2 truncate">{s.name}</p>
            ))}
          </div>

          {/* Build each measurement row with a label column */}
          {([
            {
              rowLabel: 'Temperature',
              cells: springs.map(s => {
                const ctx = tempLabel(s.temperature_c)
                return { value: s.temperature_c !== null ? String(s.temperature_c) : '—', unit: s.temperature_c !== null ? '°C' : undefined, label: ctx.text, labelColour: ctx.colour }
              }),
            },
            {
              rowLabel: 'pH',
              cells: springs.map(s => {
                const ctx = phLabel(s.ph)
                return { value: s.ph !== null ? String(s.ph) : '—', unit: undefined, label: ctx.text, labelColour: ctx.colour }
              }),
            },
            {
              rowLabel: 'ORP',
              cells: springs.map(s => ({ value: fmt(s.oxidation_reduction_potential_mv, 1), unit: 'mV', label: undefined, labelColour: undefined })),
            },
            {
              rowLabel: 'Conductivity',
              cells: springs.map(s => ({ value: fmt(s.conductivity_us_cm, 0), unit: 'µS/cm', label: undefined, labelColour: undefined })),
            },
            {
              rowLabel: 'Dissolved oxygen',
              cells: springs.map(s => ({ value: fmt(s.dissolved_oxygen_mg_l, 2), unit: 'mg/L', label: undefined, labelColour: undefined })),
            },
            {
              rowLabel: 'Turbidity',
              cells: springs.map(s => ({ value: fmt(s.turbidity_fnu, 1), unit: 'FNU', label: undefined, labelColour: undefined })),
            },
          ] as const).map(row => (
            <div
              key={row.rowLabel}
              className="border-b border-slate-100 last:border-0"
              style={{ display: 'grid', gridTemplateColumns: `140px repeat(${cols}, 1fr)` }}
            >
              <div className="px-4 py-3 flex items-start border-r border-slate-100">
                <p className="text-xs font-medium text-slate-600 leading-tight">{row.rowLabel}</p>
              </div>
              {row.cells.map((cell, ci) => (
                <MeasCell
                  key={ci}
                  value={cell.value}
                  unit={cell.unit}
                  label={cell.label}
                  labelColour={cell.labelColour}
                />
              ))}
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-500 mt-2 px-1">
          All measurements taken in the field at time of sampling. Conditions vary seasonally and with
          hydrothermal activity.
        </p>
      </section>

      {/* ─── Water chemistry ────────────────────────────────────────────── */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2 px-4">
          Water chemistry — core analytes (mg/L, shared scale)
        </h2>
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          {/* Column headers — label column + one per spring */}
          <div
            className="bg-slate-50 border-b border-slate-200"
            style={{ display: 'grid', gridTemplateColumns: `140px repeat(${cols}, 1fr)` }}
          >
            <div className="px-4 py-2" />
            {springs.map(s => (
              <p key={s.id} className="text-xs font-semibold text-slate-800 px-4 py-2 truncate">{s.name}</p>
            ))}
          </div>

          {chemData.map(({ analyte, values, max }) => (
            <div
              key={analyte}
              className="border-b border-slate-100 last:border-0"
              style={{ display: 'grid', gridTemplateColumns: `140px repeat(${cols}, 1fr)` }}
            >
              {/* Row label */}
              <div className="px-4 py-2.5 flex items-center border-r border-slate-100">
                <p className="text-xs font-medium text-slate-600">{analyteLabel(analyte)}</p>
              </div>
              {/* Value cells */}
              {values.map((val, ci) => (
                <div key={ci} className="px-4 py-2.5 border-r border-slate-100 last:border-0">
                  <ChemBar value={val} maxValue={max} />
                </div>
              ))}
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-500 mt-2 px-1">
          Bars are scaled to the highest value for each analyte across the compared springs.
          Values from {springs.map(s => s.chemistry_record_count).join('/')} chemistry records respectively.
        </p>
      </section>

      {/* ─── Microbial diversity ────────────────────────────────────────── */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2 px-4">
          Microbial diversity — top taxa by sequence reads
        </h2>
        <div className={`grid ${gridCols} gap-4`}>
          {springs.map(s => (
            <div key={s.id} className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-800 mb-3 truncate">{s.name}</p>
              <TaxaList taxa={s.top_taxa} />
              {s.taxonomy_record_count > 0 && (
                <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
                  {s.taxonomy_record_count.toLocaleString()} total 16S records
                </p>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2 px-1">
          16S rRNA amplicon data. Read counts reflect sequencing output, not cell abundance.
          Taxa are identified to varying ranks — do not interpret as species-level.
        </p>
      </section>

      {/* ─── Attribution ────────────────────────────────────────────────── */}
      <section className="border-t border-slate-200 pt-6 mt-6">
        <p className="text-xs text-slate-500 leading-relaxed">
          Data from the{' '}
          <a href="https://1000springs.org.nz" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
            1000 Springs Project
          </a>{' '}
          (GNS Science &amp; University of Waikato). Used under{' '}
          <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
            CC BY-NC-SA 4.0
          </a>
          . {springs[0]?.attribution}
        </p>
      </section>
    </div>
  )
}
