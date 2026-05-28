import Link from 'next/link'
import Image from 'next/image'
import { getAllSprings, getUniqueGeothermalSystems } from '@/lib/data'

export default function HomePage() {
  const springs = getAllSprings()
  const systems = getUniqueGeothermalSystems()
  const chemCount = springs.reduce((sum, s) => sum + s.chemistry_record_count, 0)
  const taxCount = springs.reduce((sum, s) => sum + s.taxonomy_record_count, 0)

  return (
    <>
      {/* Hero */}
      <section className="relative text-white py-24 px-4 overflow-hidden">
        <Image
          src="/Champagne-Pool-Waiotapu-SLIDER.jpg"
          alt=""
          fill
          sizes="100vw"
          quality={90}
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-slate-900/65" />
        <div className="relative max-w-3xl mx-auto">
          <p className="text-teal-400 text-xs font-semibold uppercase tracking-widest mb-4">
            Taupō Volcanic Zone · Aotearoa New Zealand
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5 leading-tight tracking-tight">
            New Zealand's geothermal springs
          </h1>
          <p className="text-slate-300 text-lg mb-8 max-w-xl leading-relaxed">
            A free field guide to the microbiology, chemistry, and geothermal
            science of hot springs across the Taupō Volcanic Zone. It uses data from the 1000
            Springs Project.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/explore"
              className="bg-teal-600 hover:bg-teal-500 text-white font-semibold px-8 py-3 rounded transition-colors"
            >
              View spring records
            </Link>
            <Link
              href="/about"
              className="border border-white/30 text-white hover:bg-white/10 font-medium px-8 py-3 rounded transition-colors"
            >
              About this project
            </Link>
          </div>
        </div>
      </section>

      {/* Dataset summary */}
      <section className="border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: springs.length.toLocaleString(), label: 'Spring records' },
            { value: systems.length.toString(), label: 'Geothermal systems' },
            { value: chemCount.toLocaleString(), label: 'Chemistry records' },
            { value: taxCount.toLocaleString(), label: 'Taxonomy records' },
          ].map(stat => (
            <div key={stat.label}>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              <p className="text-sm text-slate-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Geothermal systems */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-xl font-semibold text-slate-800 mb-1">Browse by geothermal system</h2>
        <p className="text-slate-500 text-sm mb-6">
          Springs sampled across the Taupō Volcanic Zone and surrounding areas.
        </p>
        <div className="flex flex-wrap gap-2">
          {systems.map(system => (
            <Link
              key={system}
              href={`/explore?system=${encodeURIComponent(system)}`}
              className="bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 hover:border-teal-200 px-3 py-1.5 rounded text-sm transition-colors"
            >
              {system}
            </Link>
          ))}
        </div>
      </section>

      {/* Who this is for */}
      <section className="border-y border-slate-200 py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-semibold text-slate-800 mb-1">Who this is for</h2>
          <p className="text-slate-500 text-sm mb-8">Free and open to everyone.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-6">
            {[
              {
                title: 'Tourists and visitors',
                body: "Understand what you are looking at. Plain-language science, safety context, and site information.",
              },
              {
                title: 'Students and teachers',
                body: 'Reliable, attribution-compliant data for coursework and classroom use. Measurements, analytes, and microbial records for each spring.',
              },
              {
                title: 'Researchers',
                body: 'Direct access to sample numbers, pH, temperature, chemistry analytes, and microbial taxonomy linked back to source records.',
              },
              {
                title: 'Microbiologists',
                body: 'Explore thermal gradient communities, 16S rRNA sequence read diversity, and geochemical context across the TVZ.',
              },
            ].map(item => (
              <div key={item.title} className="border-l-2 border-teal-500 pl-4">
                <h3 className="font-semibold text-slate-800 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What each record contains */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-xl font-semibold text-slate-800 mb-1">What each spring record contains</h2>
        <p className="text-slate-500 text-sm mb-8">
          Every record is drawn directly from the 1000 Springs dataset.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              title: 'Physical measurements',
              items: ['Temperature (°C)', 'pH', 'Conductivity (µS/cm)', 'Dissolved oxygen', 'Turbidity (FNU)', 'ORP (mV)'],
            },
            {
              title: 'Chemical composition',
              items: ['Chloride', 'Sodium', 'Sulfate', 'Silicon', 'Potassium', 'Additional analytes where available'],
            },
            {
              title: 'Microbial diversity',
              items: ['Top taxa by sequence reads', 'Rank-labelled (domain to genus)', 'Lineage paths', 'No species-level overclaiming'],
            },
          ].map(col => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-teal-700 uppercase tracking-wide mb-3">{col.title}</h3>
              <ul className="space-y-1.5">
                {col.items.map(item => (
                  <li key={item} className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-slate-400 flex-shrink-0 mt-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Safety notice, integrated rather than interstitial */}
      <section className="border-t border-slate-200 bg-slate-50 py-10 px-4">
        <div className="max-w-3xl mx-auto flex gap-6 items-start">
          <div className="w-px self-stretch bg-amber-400 flex-shrink-0" />
          <div>
            <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wide mb-2">Safety notice</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-3">
              Hot springs can cause serious injury or death. Stay on marked paths, follow local
              signs, never cross barriers, and do not rely on this site for safe navigation.
              Many springs are on private land or in areas of cultural sensitivity.
            </p>
            <Link href="/safety" className="text-sm text-teal-700 font-medium hover:underline">
              Read the full safety guidelines
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
