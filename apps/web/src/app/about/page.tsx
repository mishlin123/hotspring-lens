import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description: 'About 1000 Springs — a free, non-commercial educational tool.',
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">About 1000 Springs</h1>
      <p className="text-slate-500 mb-10">
        A free, non-commercial educational and research tool for exploring geothermal springs in
        Aotearoa New Zealand.
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-800 mb-3">What is this?</h2>
        <div className="prose prose-sm text-slate-600 space-y-3">
          <p>
            1000 Springs is a web-based field guide to the geothermal springs of New Zealand's
            North Island. It lets tourists, students, teachers, and researchers explore 792 spring
            records drawn from the 1000 Springs Project — including physical measurements, chemical
            composition, and microbial diversity data.
          </p>
          <p>
            The project started as a way to make the 1000 Springs dataset more accessible and
            visually explorable without requiring database access or specialist software.
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-800 mb-3">What this project is not</h2>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 text-sm text-slate-600 space-y-2">
          <p>• Not commercial. No ads, no subscriptions, no in-app purchases.</p>
          <p>• Not a navigation tool. Do not use it to find or access springs.</p>
          <p>• Not endorsed by 1000 Springs, GNS Science, or the University of Waikato.</p>
          <p>• Not a source of cultural history. Cultural content is not generated or implied.</p>
          <p>• Not affiliated with any tourism operator, landowner, or iwi/hapū.</p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-800 mb-3">The data</h2>
        <p className="text-sm text-slate-600 mb-4">
          All spring data comes from the{' '}
          <a
            href="https://1000springs.org.nz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600 hover:underline"
          >
            1000 Springs Project
          </a>
          , a research collaboration between GNS Science and the University of Waikato. The dataset
          is published under{' '}
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600 hover:underline"
          >
            CC BY-NC-SA 4.0
          </a>
          .
        </p>
        <p className="text-sm text-slate-600">
          Data was accessed and processed in 2026. Source URLs for each spring record are shown on
          the detail page and link back to the original 1000 Springs record. See the{' '}
          <Link href="/attribution" className="text-teal-600 hover:underline">
            Attribution page
          </Link>{' '}
          for full licence details.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-800 mb-3">A note on microbiology</h2>
        <p className="text-sm text-slate-600 mb-3">
          The microbial diversity data shown here comes from 16S rRNA amplicon sequencing.
          Identifications are to varying taxonomic ranks — from domain down to genus in some cases.
          This app deliberately avoids overclaiming species-level precision because the data does
          not support it.
        </p>
        <p className="text-sm text-slate-600">
          Sequence read counts are not cell counts. The relative abundances shown reflect what was
          sequenced at the time of sampling, not absolute population sizes.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-800 mb-3">Cultural and access sensitivity</h2>
        <p className="text-sm text-slate-600 mb-3">
          Many of the geothermal areas shown in this dataset are of deep cultural significance to
          local iwi and hapū. This app does not generate or imply any cultural history, meaning, or
          interpretation of sites.
        </p>
        <p className="text-sm text-slate-600">
          Exact coordinates are shown only where clearly public. The camera overlay mode (when
          available) will not display restricted, private, or culturally sensitive sites by default.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-800 mb-3">Tech stack</h2>
        <div className="text-sm text-slate-600 space-y-1">
          <p>• Next.js — web framework</p>
          <p>• TypeScript — language</p>
          <p>• Tailwind CSS — styling</p>
          <p>• Leaflet / react-leaflet + OpenStreetMap — maps</p>
          <p>• Local JSON — data (no database required for this version)</p>
          <p>• Vercel Hobby — hosting (free tier)</p>
        </div>
      </section>

      <div className="flex gap-3">
        <Link
          href="/explore"
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
        >
          Explore springs →
        </Link>
        <Link
          href="/attribution"
          className="border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
        >
          Attribution & licence
        </Link>
      </div>
    </div>
  )
}
