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
      <section className="relative text-white py-20 px-4 overflow-hidden">
        {/* Background photo */}
        <Image
          src="/Champagne-Pool-Waiotapu-SLIDER.jpg"
          alt=""
          fill
          sizes="100vw"
          quality={90}
          className="object-cover object-center"
          priority
        />
        {/* Lighter overlay so the photo shows through clearly */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-teal-950/50 to-slate-900/60" />
        {/* Content sits above the overlay */}
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-teal-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Aotearoa New Zealand
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            Explore New Zealand's
            <br />
            <span className="text-teal-300">Geothermal Springs</span>
          </h1>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            1000 Springs is a free field guide to the microbiology, chemistry, and geothermal
            science of hot springs across Aotearoa — from Rotorua to White Island.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/explore"
              className="bg-teal-500 hover:bg-teal-400 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Explore 792 Springs →
            </Link>
            <Link
              href="/about"
              className="border border-teal-500 text-teal-300 hover:bg-teal-900/50 font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              About this project
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-teal-800 text-white py-8 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: springs.length.toLocaleString(), label: 'Spring records' },
            { value: systems.length.toString(), label: 'Geothermal systems' },
            { value: chemCount.toLocaleString(), label: 'Chemistry records' },
            { value: taxCount.toLocaleString(), label: 'Taxonomy records' },
          ].map(stat => (
            <div key={stat.label}>
              <p className="text-3xl font-bold text-teal-200">{stat.value}</p>
              <p className="text-sm text-teal-300 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Geothermal systems overview */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">12 geothermal systems</h2>
        <p className="text-slate-500 mb-6">
          Springs sampled across the Taupō Volcanic Zone and surrounding areas.
        </p>
        <div className="flex flex-wrap gap-2">
          {systems.map(system => (
            <Link
              key={system}
              href={`/explore?system=${encodeURIComponent(system)}`}
              className="bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
            >
              {system}
            </Link>
          ))}
        </div>
      </section>

      {/* Who is this for */}
      <section className="bg-white border-y border-slate-100 py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Who is this for?</h2>
          <p className="text-slate-500 text-center mb-10">
            Free and open to everyone — no sign-up, no ads, no commercial agenda.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: '01',
                title: 'Tourists',
                body: "Understand what you're seeing. Get plain-language science, safety warnings, and site context.",
              },
              {
                label: '02',
                title: 'Researchers & Students',
                body: 'Access sample numbers, pH, temperature, chemistry analytes, and microbial taxonomy.',
              },
              {
                label: '03',
                title: 'Teachers',
                body: 'Reliable, attribution-compliant content for classroom and outreach use.',
              },
              {
                label: '04',
                title: 'Microbiologists',
                body: 'Explore thermal gradient communities, sequence read diversity, and geochemical context.',
              },
            ].map(card => (
              <div key={card.title} className="bg-slate-50 rounded-xl p-5">
                <p className="text-xs font-bold text-teal-600 tracking-widest mb-3">{card.label}</p>
                <h3 className="font-semibold text-slate-800 mb-1">{card.title}</h3>
                <p className="text-sm text-slate-600">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's inside each spring record */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">What's in each spring record?</h2>
        <p className="text-slate-500 mb-8">
          Every spring has a detailed profile page drawn directly from the 1000 Springs dataset.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: 'Physical measurements',
              items: ['Temperature (°C)', 'pH', 'Conductivity (µS/cm)', 'Dissolved oxygen', 'Turbidity (FNU)', 'ORP (mV)'],
            },
            {
              title: 'Chemical composition',
              items: ['Chloride', 'Sodium', 'Sulfate', 'Silicon', 'Potassium', '+ more analytes'],
            },
            {
              title: 'Microbial diversity',
              items: ['Top taxa by sequence reads', 'Rank-labelled (genus → domain)', 'Lineage paths', 'No species overclaiming'],
            },
          ].map(section => (
            <div key={section.title} className="bg-white border border-slate-200 rounded-lg p-5">
              <h3 className="font-semibold text-teal-700 mb-3">{section.title}</h3>
              <ul className="space-y-1">
                {section.items.map(item => (
                  <li key={item} className="text-sm text-slate-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Safety callout */}
      <section className="bg-amber-50 border-y border-amber-200 py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-amber-600 text-amber-700 font-bold text-lg mb-4">!</div>
          <h2 className="text-xl font-bold text-amber-900 mb-3">Safety first</h2>
          <p className="text-amber-800 mb-4">
            Hot springs can cause serious injury or death. Stay on marked paths, follow local signs,
            never cross barriers, and do not rely on this app for safe navigation. Many springs are
            on private land or in culturally sensitive areas.
          </p>
          <Link
            href="/safety"
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            Read safety guidelines →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto text-center py-16 px-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-3">
          Ready to explore?
        </h2>
        <p className="text-slate-500 mb-6">
          Browse the map, search by name or system, filter by temperature or pH, and open any spring
          for its full scientific profile.
        </p>
        <Link
          href="/explore"
          className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-semibold px-10 py-3 rounded-lg transition-colors text-lg"
        >
          Open the explorer →
        </Link>
      </section>
    </>
  )
}
