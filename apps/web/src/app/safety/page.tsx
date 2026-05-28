import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Safety',
  description: 'Safety guidelines for visiting geothermal springs in New Zealand.',
}

export default function SafetyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest text-slate-500 mb-3">
          Field safety protocol
        </p>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Geothermal Spring Safety
        </h1>
        <p className="text-sm text-slate-600">
          New Zealand geothermal environments. Read before visiting any spring.
        </p>
      </div>

      {/* ── Primary warning ─────────────────────────────────────── */}
      <div className="border-l-4 border-red-600 pl-5 mb-8">
        <p className="text-xs uppercase tracking-widest text-red-600 mb-2">Warning</p>
        <p className="text-xl font-bold text-slate-900 mb-2 leading-tight">
          Hot springs can cause serious injury or death.
        </p>
        <p className="text-sm text-slate-800 leading-relaxed">
          Spring water can reach temperatures above 100 °C. Ground crusts around springs can be
          thin and collapse without warning. Many springs have steep sides, extreme pH, or toxic
          gas emissions.
        </p>
      </div>

      {/* ── Navigation notice ───────────────────────────────────── */}
      <div className="bg-amber-50 border border-amber-300 px-4 py-3 mb-12 flex gap-3 items-start">
        <span className="text-xs uppercase tracking-widest text-amber-600 flex-shrink-0 mt-0.5 leading-tight">
          Notice
        </span>
        <p className="text-sm text-amber-800 leading-relaxed">
          <strong>Do not use this site for navigation.</strong> 1000 Springs Project is an educational
          tool. It does not grant access permission, location data may be approximate, and it
          does not reflect current site conditions.
        </p>
      </div>

      {/* ── Safety protocol ─────────────────────────────────────── */}
      <section className="mb-14">
        <p className="text-xs uppercase tracking-widest text-slate-500 mb-6">
          Safety protocol
        </p>
        <div className="divide-y divide-slate-100">
          {[
            {
              title: 'Stay on marked paths',
              body: 'Never leave marked walking tracks or boardwalks at geothermal areas. Unmarked ground may look solid but can be thin crust over boiling water.',
            },
            {
              title: 'Never cross barriers',
              body: 'Barriers exist for your protection. Do not climb over, duck under, or move barriers for any reason, including photography.',
            },
            {
              title: 'Follow local signs and instructions',
              body: 'Follow all instructions posted at geothermal sites and from site staff or rangers. Rules differ between sites.',
            },
            {
              title: 'Respect access status',
              body: 'Many springs are on private land or in restricted areas. This app does not grant access permission. Always check access status and get permission before visiting.',
            },
            {
              title: 'Respect cultural significance',
              body: 'Many geothermal areas are tapu (sacred) to local Māori and have deep cultural significance. Treat them with respect and follow any cultural protocols requested by mana whenua.',
            },
            {
              title: 'Never touch or enter spring water without authorisation',
              body: 'Water temperatures can be deceptively cool at the surface and scalding below. Immersion in geothermal water without scientific authorisation and safety equipment can be fatal.',
            },
            {
              title: 'Keep children and pets close',
              body: "Children and animals can move quickly. Always keep them within arm's reach at geothermal sites.",
            },
          ].map((rule, i) => (
            <div key={rule.title} className="grid grid-cols-[2.5rem_1fr] gap-4 py-5">
              <p className="text-slate-300 text-sm tabular-nums pt-0.5">
                {String(i + 1).padStart(2, '0')}.
              </p>
              <div>
                <p className="font-semibold text-slate-800 text-sm mb-1">{rule.title}</p>
                <p className="text-sm text-slate-800 leading-relaxed">{rule.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Emergency ───────────────────────────────────────────── */}
      <section className="mb-14 border-t-2 border-red-600 pt-6">
        <p className="text-xs uppercase tracking-widest text-red-600 mb-5">
          In an emergency
        </p>
        <div className="flex items-baseline gap-5 mb-7">
          <p className="text-6xl font-black text-slate-900 leading-none tabular-nums">111</p>
          <p className="text-sm text-slate-600">New Zealand emergency services</p>
        </div>
        <div className="divide-y divide-slate-100 text-sm text-slate-800">
          <p className="py-2.5">Get clear of the geothermal area immediately.</p>
          <p className="py-2.5">
            For burns: cool with clean running water for 20 minutes. Do not use ice.
          </p>
          <p className="py-2.5">Alert other visitors and site staff.</p>
        </div>
      </section>

      {/* ── Disclaimer ──────────────────────────────────────────── */}
      <section className="mb-12 border-t border-slate-200 pt-8">
        <p className="text-xs uppercase tracking-widest text-slate-500 mb-5">
          Disclaimer — limitations of this site
        </p>
        <div className="text-sm text-slate-800 space-y-2.5 leading-relaxed">
          <p>This site is non-commercial and educational. It is not a safety tool.</p>
          <p>Location data is sourced from the 1000 Springs Project and may be approximate.</p>
          <p>
            Access status and site conditions change. This site may not reflect current
            conditions.
          </p>
          <p>This site does not grant permission to access any spring or land.</p>
          <p>
            Do not rely on this site to determine whether a site is safe or accessible.
          </p>
        </div>
      </section>

      {/* ── Navigation ──────────────────────────────────────────── */}
      <div className="border-t border-slate-100 pt-6">
        <Link href="/explore" className="text-sm text-teal-700 hover:underline">
          ← Return to the explorer
        </Link>
      </div>

    </div>
  )
}
