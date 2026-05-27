import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description:
    'About the 1000 Springs Project — the research collaboration between GNS Science and the University of Waikato documenting geothermal ecosystems across the Taupō Volcanic Zone.',
}

const BASE = 'https://1000springs.org.nz/static/img'

/* ─── Data ─────────────────────────────────────────────────────────────── */

const researchAims = [
  {
    number: '01',
    title: 'Diversity assessment',
    body: 'Microbial and physicochemical diversity assessment for 1,000 geothermal features across the Taupō Volcanic Zone.',
  },
  {
    number: '02',
    title: 'DNA archiving',
    body: 'Long-term archiving of environmental DNA at GNS Science and the University of Waikato.',
  },
  {
    number: '03',
    title: 'Uniqueness metric',
    body: 'Development of an environmental indicator "uniqueness" metric for geothermal ecosystems.',
  },
]

const outputs = [
  {
    icon: '🗄️',
    title: 'Online database',
    body: 'A publicly accessible database of geothermal spring records, measurements, and microbial diversity data.',
  },
  {
    icon: '🧬',
    title: 'Genetic archive',
    body: 'A curated archive of environmental DNA samples preserved for future research.',
  },
  {
    icon: '📊',
    title: 'Uniqueness metric',
    body: 'A quantitative tool for assessing the conservation and scientific value of individual geothermal features.',
  },
]

const stakeholders = [
  { icon: '🏡', label: 'Landowners' },
  { icon: '🪶', label: 'Māori communities' },
  { icon: '⚡', label: 'Energy companies' },
  { icon: '🔬', label: 'Biotechnology sector' },
  { icon: '🗺️', label: 'Tourism operators' },
  { icon: '🏛️', label: 'Government agencies' },
  { icon: '📚', label: 'Scientific community' },
]

const team = [
  {
    name: 'Matthew Stott',
    institution: 'GNS Science',
    group: 'Extremophiles Research Group',
    title: 'Senior Scientist, Microbiology & Microbial Ecology',
    roles: 'Co-PI · sampling · geochemistry · ecology',
    photo: `${BASE}/about/ourteam/matthew_stott_2_tiny.jpg`,
  },
  {
    name: 'Craig Cary',
    institution: 'University of Waikato',
    group: 'Thermophile Research Unit',
    title: 'Professor · Director DNA Sequencing · ERI Theme Leader',
    roles: 'Co-PI · ecology · bioinformatics · sequencing',
    photo: null,
  },
  {
    name: 'Jean Power',
    institution: 'GNS Science',
    group: 'Extremophiles Research Group',
    title: 'Senior Technician & Doctoral Candidate',
    roles: 'Sampling coordination · geochemistry · ecology',
    photo: `${BASE}/about/ourteam/jean_power_2_tiny.jpg`,
  },
  {
    name: 'Charlie Lee',
    institution: 'University of Waikato',
    group: 'Thermophiles Research Group',
    title: 'Research Fellow, Bioinformatics & Microbial Ecology',
    roles: 'Bioinformatics · sequencing · ecology',
    photo: `${BASE}/about/ourteam/charles_lee_tiny.jpg`,
  },
  {
    name: 'Ian McDonald',
    institution: 'University of Waikato',
    group: 'Thermophile Research Unit',
    title: 'Associate Professor, Microbiology & Molecular Biology',
    roles: 'Phylogenetics · bioinformatics · sequencing · ecology',
    photo: `${BASE}/about/ourteam/ian_mcdonald_tiny.jpg`,
  },
  {
    name: 'Melissa Climo',
    institution: 'GNS Science',
    group: 'Geothermal Resources',
    title: 'Research Coordinator',
    roles: 'Management · outreach · grant writing',
    photo: `${BASE}/about/ourteam/melissa_climo_tiny.jpg`,
  },
  {
    name: 'Dave Evans',
    institution: 'GNS Science',
    group: 'Extremophiles Research Group',
    title: 'Field Staff',
    roles: 'Field sampling · sample processing',
    photo: `${BASE}/about/ourteam/dave_evans_tiny.jpg`,
  },
  {
    name: 'Georgia Wakerley',
    institution: 'University of Waikato',
    group: 'Thermophile Research Unit',
    title: 'Laboratory Technician',
    roles: 'DNA extraction · sequencing',
    photo: `${BASE}/about/ourteam/georgia_wakerly_tiny_2.jpg`,
  },
  {
    name: 'Annika Hinze',
    institution: 'University of Waikato',
    group: 'Computer Science',
    title: 'Lecturer, Information Systems & Databases',
    roles: 'Applications development · database design',
    photo: null,
  },
  {
    name: 'Mathew Button',
    institution: 'Push Button Developments',
    group: '',
    title: 'Programmer, Applications Support',
    roles: 'Website & database development',
    photo: `${BASE}/about/ourteam/mathew_button_tiny.jpg`,
  },
  {
    name: 'Duncan White',
    institution: 'GNS Science',
    group: 'Applications Group',
    title: 'Analyst Programmer',
    roles: 'Android & website development',
    photo: `${BASE}/about/ourteam/duncan_white_tiny.jpg`,
  },
]

const assistedMembers = [
  { name: 'Carlo Carere', photo: `${BASE}/about/ourteam/carlo_carere_tiny.jpg` },
  { name: 'Karen Houghton', photo: `${BASE}/about/ourteam/karen_houghton_tiny.jpg` },
  { name: 'Kevin Lee', photo: `${BASE}/about/ourteam/kevin_lee_tiny.jpg` },
  { name: 'Microbiology in Extreme Environments', photo: `${BASE}/about/ourteam/microbiology_tiny.jpg` },
]

const contacts = [
  {
    name: 'Matthew Stott',
    org: 'GNS Science',
    email: 'm.stott@gns.cri.nz',
    photo: `${BASE}/about/ourteam/matthew_stott_2_tiny.jpg`,
  },
  {
    name: 'Craig Cary',
    org: 'University of Waikato',
    email: 'caryc@waikato.ac.nz',
    photo: null,
  },
]

const tourismPartners: {
  region: string
  partners: { name: string; address: string; phone: string; photo: string }[]
}[] = [
  {
    region: 'Rotorua',
    partners: [
      {
        name: "Hell's Gate – Tikitere",
        address: 'State Highway 30, Tikitere',
        phone: '+64 7 345 3151',
        photo: `${BASE}/about/tourismpartners/hellsgate.jpg`,
      },
      {
        name: 'Te Puia',
        address: 'Hemo Rd, Te Whakarewarewa Valley',
        phone: '+64 7 348 9047',
        photo: `${BASE}/about/tourismpartners/te_puia.jpg`,
      },
      {
        name: 'Waikite Valley Thermal Pools',
        address: 'Waikite Valley Road',
        phone: '+64 7 333 1861',
        photo: `${BASE}/about/tourismpartners/waikite_valley_thermal_pools.jpg`,
      },
      {
        name: 'Waimangu Volcanic Valley',
        address: 'Waikite Valley Road, off SH5',
        phone: '+64 7 366 6137',
        photo: `${BASE}/about/tourismpartners/waimangu.jpg`,
      },
      {
        name: 'Waiotapu Thermal Wonderland',
        address: '201 Waiotapu Loop Road RD 3',
        phone: '+64 7 366 6333',
        photo: `${BASE}/about/tourismpartners/waiotapu_thermal_wonderland.jpg`,
      },
      {
        name: 'Whakarewarewa Village',
        address: '17 Tryon Street, Whakarewarewa',
        phone: '+64 7 349 3463',
        photo: `${BASE}/about/tourismpartners/whakarewarewa.jpg`,
      },
    ],
  },
  {
    region: 'Taupō',
    partners: [
      {
        name: 'Huka Prawn Park',
        address: 'Karetoto Road, Wairakei Tourist Park, SH1',
        phone: '+64 7 374 8474',
        photo: `${BASE}/about/tourismpartners/huka_prawn_park.jpg`,
      },
      {
        name: 'Orakei Korako Geothermal Park & Cave',
        address: '494 Orakeikorako Road, Reporoa',
        phone: '+64 7 378 3131',
        photo: `${BASE}/about/tourismpartners/orakei_korako.jpg`,
      },
      {
        name: 'Wairakei Terraces',
        address: 'Wairakei Rd, SH1 & 5',
        phone: '+64 7 378 0913',
        photo: `${BASE}/about/tourismpartners/wairakei_terraces.jpg`,
      },
    ],
  },
  {
    region: 'Turangi',
    partners: [
      {
        name: 'Tokaanu Thermal Walk and Pools',
        address: 'Mangaroa St, Tokaanu',
        phone: '+64 7 386 8575',
        photo: `${BASE}/about/tourismpartners/tokaanu_thermal_pools.jpg`,
      },
    ],
  },
]

/* ─── Helpers ───────────────────────────────────────────────────────────── */

function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${light ? 'text-teal-300' : 'text-teal-600'}`}>
      {children}
    </p>
  )
}

function Avatar({
  photo,
  name,
  size = 'sm',
}: {
  photo: string | null
  name: string
  size?: 'sm' | 'lg'
}) {
  const dim = size === 'lg' ? 'w-14 h-14' : 'w-10 h-10'
  const text = size === 'lg' ? 'text-base' : 'text-sm'
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2)
  return (
    <div className={`${dim} rounded-full overflow-hidden bg-teal-100 relative flex-shrink-0`}>
      {photo ? (
        <Image src={photo} alt={name} fill className="object-cover" sizes="80px" />
      ) : (
        <div className={`w-full h-full flex items-center justify-center`}>
          <span className={`text-teal-700 font-bold ${text}`}>{initials}</span>
        </div>
      )}
    </div>
  )
}

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function AboutPage() {
  return (
    <div className="pb-20">

      {/* ── Page header ─────────────────────────────────────────── */}
      <div className="bg-teal-900 text-white py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <SectionLabel light>About</SectionLabel>
          <h1 className="text-4xl font-bold mb-3 leading-tight">
            The 1000 Springs Project
          </h1>
          <p className="text-teal-200 max-w-2xl text-lg">
            A joint research initiative by GNS Science and the University of Waikato, documenting
            the physical, chemical, and microbial biodiversity of geothermal ecosystems across
            Aotearoa New Zealand.
          </p>
        </div>
      </div>

      {/* ── Primary goal ────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          <div className="lg:col-span-3">
            <SectionLabel>Primary goal</SectionLabel>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Mapping a thousand geothermal worlds
            </h2>
            <blockquote className="border-l-4 border-teal-500 pl-5 mb-5">
              <p className="text-slate-700 italic text-lg leading-relaxed">
                "The primary goal of the research project is to collate the physical, chemical, and
                microbial biodiversity information from 1,000 geothermal ecosystems from the Taupō
                Volcanic Zone."
              </p>
            </blockquote>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Beyond documentation, the project aims to assess the conservation, cultural,
              recreational, and resource development value of microbial components in these
              geothermal ecosystems — knowledge that informs science, policy, and kaitiakitanga.
            </p>
            {/* TVZ map */}
            <div className="rounded-xl overflow-hidden border border-slate-200">
              <div className="relative h-52 w-full">
                <Image
                  src={`${BASE}/about/TVZ_hotspots_map_small.jpg`}
                  alt="Map of geothermal systems in the Taupō Volcanic Zone"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 600px"
                />
              </div>
              <p className="text-xs text-slate-500 text-center py-2 bg-slate-50 border-t border-slate-200">
                Geothermal hotspot locations across the Taupō Volcanic Zone
              </p>
            </div>
          </div>
          <div className="lg:col-span-2 bg-teal-50 border border-teal-100 rounded-2xl p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-4">
              This knowledge serves
            </p>
            <ul className="space-y-2.5">
              {stakeholders.map(s => (
                <li key={s.label} className="flex items-center gap-3 text-sm text-teal-900">
                  <span className="text-xl">{s.icon}</span>
                  {s.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Research aims ───────────────────────────────────────── */}
      <div className="bg-slate-50 border-y border-slate-100 py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>Research aims</SectionLabel>
          <h2 className="text-2xl font-bold text-slate-800 mb-8">Three core objectives</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {researchAims.map(aim => (
              <div key={aim.number} className="bg-white rounded-xl border border-slate-200 p-6">
                <p className="text-4xl font-black text-teal-100 leading-none mb-3">{aim.number}</p>
                <h3 className="font-semibold text-slate-800 mb-2">{aim.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{aim.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Outputs ─────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <SectionLabel>Outputs</SectionLabel>
        <h2 className="text-2xl font-bold text-slate-800 mb-8">What the project produces</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {outputs.map(o => (
            <div key={o.title} className="flex flex-col gap-3">
              <div className="text-3xl">{o.icon}</div>
              <h3 className="font-semibold text-slate-800">{o.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{o.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Funding ─────────────────────────────────────────────── */}
      <div className="bg-teal-800 text-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>
            <span className="text-teal-300">Funding &amp; partners</span>
          </SectionLabel>
          <h2 className="text-2xl font-bold mb-6">Institutions &amp; funders</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                name: 'GNS Science',
                role: 'Lead research institution',
                detail: 'Extremophiles Research Group & Applications Group',
              },
              {
                name: 'University of Waikato',
                role: 'Research partner',
                detail: 'Thermophile Research Unit & Computer Science',
              },
              {
                name: 'MBIE',
                role: 'Funding body',
                detail: 'Ministry of Business, Innovation and Employment',
              },
            ].map(inst => (
              <div key={inst.name} className="bg-teal-700/60 rounded-xl p-5">
                <p className="font-bold text-white text-lg mb-1">{inst.name}</p>
                <p className="text-teal-200 text-xs font-semibold uppercase tracking-wide mb-2">
                  {inst.role}
                </p>
                <p className="text-teal-300 text-sm">{inst.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Team ────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <SectionLabel>Our team</SectionLabel>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">The people behind the project</h2>
        <p className="text-slate-500 mb-8">
          Researchers, technicians, and developers from GNS Science and the University of Waikato.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {team.map(person => (
            <div
              key={person.name}
              className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-1"
            >
              <Avatar photo={person.photo} name={person.name} />
              <p className="font-semibold text-slate-800 mt-1">{person.name}</p>
              <p className="text-xs font-semibold text-teal-600">{person.institution}</p>
              {person.group && (
                <p className="text-xs text-slate-500">{person.group}</p>
              )}
              <p className="text-xs text-slate-600 mt-1 leading-snug">{person.title}</p>
              <p className="text-xs text-slate-400 mt-1 border-t border-slate-100 pt-2">
                {person.roles}
              </p>
            </div>
          ))}
        </div>

        {/* Assisted members */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
            Also assisted by
          </p>
          <div className="flex flex-wrap gap-3">
            {assistedMembers.map(m => (
              <div key={m.name} className="flex items-center gap-2 bg-white border border-slate-200 rounded-full pl-1 pr-3 py-1">
                <div className="w-7 h-7 rounded-full overflow-hidden relative flex-shrink-0">
                  <Image src={m.photo} alt={m.name} fill className="object-cover" sizes="28px" />
                </div>
                <span className="text-sm text-slate-600">{m.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tourism partners ────────────────────────────────────── */}
      <div className="bg-slate-50 border-y border-slate-100 py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>Tourism partners</SectionLabel>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Partner sites</h2>
          <p className="text-slate-500 mb-8">
            These tourism operators provide site access and support for the 1000 Springs Project
            sampling programme.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {tourismPartners.map(region => (
              <div key={region.region}>
                <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <span className="w-5 h-0.5 bg-teal-500 inline-block" />
                  {region.region}
                </h3>
                <ul className="space-y-4">
                  {region.partners.map(p => (
                    <li key={p.name} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                      {/* Photo */}
                      <div className="relative h-36 w-full">
                        <Image
                          src={p.photo}
                          alt={p.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 33vw"
                        />
                      </div>
                      {/* Info */}
                      <div className="p-4">
                        <p className="font-medium text-slate-800 text-sm mb-1">{p.name}</p>
                        <p className="text-xs text-slate-500">{p.address}</p>
                        <p className="text-xs text-teal-600 mt-1">{p.phone}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Contact ─────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <SectionLabel>Contact</SectionLabel>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Get in touch with the project</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
          {contacts.map(c => (
            <div key={c.name} className="bg-white border border-slate-200 rounded-xl p-6 flex gap-4 items-start">
              <Avatar photo={c.photo} name={c.name} size="lg" />
              <div>
                <p className="font-semibold text-slate-800">{c.name}</p>
                <p className="text-xs text-teal-600 mb-2">{c.org}</p>
                <a
                  href={`mailto:${c.email}`}
                  className="text-sm text-slate-600 hover:text-teal-600 transition-colors"
                >
                  {c.email}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* ── About this explorer ───────────────────────────────── */}
        <div className="border-t border-slate-200 pt-14">
          <SectionLabel>About this explorer</SectionLabel>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">About this website</h2>
          <p className="text-slate-500 mb-8">
            This explorer is a free, non-commercial tool for making the 1000 Springs dataset
            accessible to a broader audience — tourists, students, teachers, and researchers.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-800 mb-3">What this is</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                {[
                  'A web-based field guide to NZ geothermal springs',
                  'Built on the 1000 Springs Project dataset',
                  'Free and open to everyone — no sign-up required',
                  'Used under CC BY-NC-SA 4.0 licence',
                ].map(item => (
                  <li key={item} className="flex gap-2">
                    <span className="text-teal-500 flex-shrink-0">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <h3 className="font-semibold text-amber-900 mb-3">What this is not</h3>
              <ul className="space-y-2 text-sm text-amber-800">
                {[
                  'Not commercial — no ads, subscriptions, or purchases',
                  'Not a navigation tool — do not use it to access springs',
                  'Not endorsed by 1000 Springs, GNS, or University of Waikato',
                  'Not a source of cultural history or interpretation',
                  'Not affiliated with any tourism operator or landowner',
                ].map(item => (
                  <li key={item} className="flex gap-2">
                    <span className="flex-shrink-0">✗</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">A note on microbiology</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-2">
                Microbial diversity data comes from 16S rRNA amplicon sequencing. Identifications
                are to varying taxonomic ranks — domain down to genus in some cases. This explorer
                deliberately avoids overclaiming species-level precision because the data does not
                support it.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Sequence read counts are not cell counts. Relative abundances reflect what was
                sequenced at the time of sampling, not absolute population sizes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Cultural &amp; access sensitivity</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-2">
                Many geothermal areas in this dataset hold deep cultural significance for local iwi
                and hapū. This explorer does not generate or imply any cultural history, meaning,
                or interpretation of sites.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Exact coordinates are shown only where clearly public. The camera overlay will not
                display restricted, private, or culturally sensitive sites.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
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
              Attribution &amp; licence
            </Link>
            <a
              href="https://1000springs.org.nz/about"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
            >
              Official project site ↗
            </a>
          </div>
        </div>
      </div>

    </div>
  )
}
