import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Attribution & Licence',
  description: 'Data source attribution and Creative Commons licence information.',
}

export default function AttributionPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Attribution & Licence</h1>
      <p className="text-slate-600 mb-10">
        Full attribution for the data and tools used in the 1000 Springs Project.
      </p>

      {/* Primary attribution */}
      <section className="bg-teal-50 border border-teal-200 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-teal-900 mb-4">Primary data source</h2>
        <div className="space-y-3 text-sm text-teal-800">
          <div>
            <p className="font-semibold mb-0.5">Project</p>
            <p>1000 Springs Project</p>
          </div>
          <div>
            <p className="font-semibold mb-0.5">Institutions</p>
            <p>GNS Science and University of Waikato, New Zealand</p>
          </div>
          <div>
            <p className="font-semibold mb-0.5">URL</p>
            <a
              href="https://1000springs.org.nz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-700 hover:underline"
            >
              https://1000springs.org.nz
            </a>
          </div>
          <div>
            <p className="font-semibold mb-0.5">Licence</p>
            <a
              href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-700 hover:underline"
            >
              Creative Commons Attribution–NonCommercial–ShareAlike 4.0 International (CC BY-NC-SA 4.0)
            </a>
          </div>
          <div>
            <p className="font-semibold mb-0.5">Data accessed</p>
            <p>2026</p>
          </div>
        </div>
      </section>

      {/* Required attribution text */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-3">Required attribution text</h2>
        <div className="bg-slate-100 rounded-lg p-4 text-sm font-mono text-slate-700 border border-slate-200">
          1000 Springs Project authors, GNS Science, and University of Waikato.
          Data used under CC BY-NC-SA 4.0.
          Source: https://1000springs.org.nz
        </div>
      </section>

      {/* Licence summary */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-3">Licence summary (CC BY-NC-SA 4.0)</h2>
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3 text-sm text-slate-800">
          {[
            { type: 'allowed', label: 'Share', detail: 'You may copy and redistribute the material in any medium or format.' },
            { type: 'allowed', label: 'Adapt', detail: 'You may remix, transform, and build upon the material.' },
            { type: 'condition', label: 'Attribution required', detail: 'You must give appropriate credit, provide a link to the licence, and indicate if changes were made.' },
            { type: 'restricted', label: 'NonCommercial', detail: 'You may not use this material for commercial purposes.' },
            { type: 'condition', label: 'ShareAlike', detail: 'If you remix or adapt, you must distribute under the same CC BY-NC-SA licence.' },
          ].map(item => (
            <div key={item.label} className="flex gap-3">
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5 h-fit ${
                item.type === 'allowed' ? 'bg-green-100 text-green-700' :
                item.type === 'restricted' ? 'bg-red-100 text-red-700' :
                'bg-amber-100 text-amber-700'
              }`}>
                {item.type === 'allowed' ? 'YES' : item.type === 'restricted' ? 'NO' : 'COND'}
              </span>
              <div>
                <p className="font-medium text-slate-800">{item.label}</p>
                <p>{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2">
          This is a summary, not legal advice. See the full licence at{' '}
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600 hover:underline"
          >
            creativecommons.org
          </a>
          .
        </p>
      </section>

      {/* What this project does */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-3">How this project uses the data</h2>
        <div className="text-sm text-slate-800 space-y-2">
          <p>
            This explorer uses the 1000 Springs Project dataset solely for non-commercial educational and
            research purposes, in compliance with the CC BY-NC-SA 4.0 licence.
          </p>
          <p>
            Source URLs and access dates are retained for every record. Attribution to the 1000
            Springs authors, GNS Science, and the University of Waikato is displayed throughout the
            app.
          </p>

          <p>
            Adapted content derived from the 1000 Springs Project dataset is published under CC BY-NC-SA 4.0.
          </p>
        </div>
      </section>

      {/* Third-party tools */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-3">Third-party tools and services</h2>
        <div className="space-y-3 text-sm">
          {[
            {
              name: 'OpenStreetMap',
              licence: '© OpenStreetMap contributors, ODbL',
              url: 'https://www.openstreetmap.org/copyright',
            },
            {
              name: 'Leaflet',
              licence: 'BSD 2-Clause Licence',
              url: 'https://leafletjs.com',
            },
            {
              name: 'Next.js',
              licence: 'MIT Licence',
              url: 'https://nextjs.org',
            },
            {
              name: 'Tailwind CSS',
              licence: 'MIT Licence',
              url: 'https://tailwindcss.com',
            },
          ].map(tool => (
            <div
              key={tool.name}
              className="flex items-start justify-between bg-white border border-slate-200 rounded-lg px-4 py-3"
            >
              <div>
                <p className="font-medium text-slate-800">{tool.name}</p>
                <p className="text-slate-600 text-xs">{tool.licence}</p>
              </div>
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 text-xs hover:underline flex-shrink-0 ml-4"
              >
                {tool.url}
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
