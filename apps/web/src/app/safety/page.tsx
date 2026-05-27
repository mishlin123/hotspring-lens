import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Safety',
  description: 'Safety guidelines for visiting geothermal springs in New Zealand.',
}

export default function SafetyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Safety Guidelines</h1>
      <p className="text-slate-500 mb-8">
        Geothermal springs in New Zealand are beautiful and scientifically fascinating — they are
        also dangerous. Please read this before visiting any spring.
      </p>

      {/* Main warning */}
      <div className="bg-red-50 border border-red-300 rounded-xl p-6 mb-8">
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 rounded-full border-2 border-red-500 text-red-600 font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">!</div>
          <div>
            <h2 className="text-lg font-bold text-red-800 mb-2">
              Hot springs can cause serious injury or death
            </h2>
            <p className="text-red-700">
              Hot spring water can reach temperatures above 100°C. Ground crusts around springs can
              be thin and collapse without warning. Many springs have steep sides, extreme pH, or
              toxic gas emissions.
            </p>
          </div>
        </div>
      </div>

      {/* Rules */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Rules to follow always</h2>
        <div className="space-y-3">
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
              title: 'Do not use this app for navigation',
              body: '1000 Springs is an educational tool. Do not use it to navigate to springs or plan routes. Location data may be approximate.',
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
            <div key={rule.title} className="flex gap-4 bg-white border border-slate-200 rounded-lg p-4">
              <span className="text-xs font-bold text-slate-400 w-6 flex-shrink-0 mt-0.5 tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <p className="font-semibold text-slate-800 mb-0.5">{rule.title}</p>
                <p className="text-sm text-slate-600">{rule.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Emergency */}
      <section className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-amber-900 mb-3">In an emergency</h2>
        <ul className="space-y-2 text-sm text-amber-800">
          <li>• Call <strong>111</strong> (New Zealand emergency services)</li>
          <li>• Get clear of the geothermal area immediately</li>
          <li>• For burns: cool with clean running water for 20 minutes — do not use ice</li>
          <li>• Alert other visitors and site staff</li>
        </ul>
      </section>

      {/* App limitations */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Limitations of this app</h2>
        <div className="bg-white border border-slate-200 rounded-lg p-5 text-sm text-slate-600 space-y-2">
          <p>• This app is non-commercial and educational. It is not a safety tool.</p>
          <p>• Location data is sourced from the 1000 Springs Project and may be approximate.</p>
          <p>• Access status and site conditions change. This app may not reflect current conditions.</p>
          <p>• This app does not grant permission to access any spring or land.</p>
          <p>• Do not rely on this app to determine whether a site is safe or accessible.</p>
        </div>
      </section>

      <div className="text-center">
        <Link
          href="/explore"
          className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
        >
          Continue to explorer →
        </Link>
      </div>
    </div>
  )
}
