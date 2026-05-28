import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description:
    'About the 1000 Springs Project: a research collaboration between GNS Science and the University of Waikato documenting geothermal ecosystems across the Taupō Volcanic Zone.',
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
    label: 'DB',
    title: 'Online database',
    body: 'A publicly accessible database of geothermal spring records, measurements, and microbial diversity data.',
  },
  {
    label: 'DNA',
    title: 'Genetic archive',
    body: 'A curated archive of environmental DNA samples preserved for future research.',
  },
  {
    label: 'MTR',
    title: 'Uniqueness metric',
    body: 'A quantitative tool for assessing the conservation and scientific value of individual geothermal features.',
  },
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

function MetaLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-6">
      {children}
    </p>
  )
}

function MetaLabelLight({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-mono uppercase tracking-widest text-teal-400 mb-6">
      {children}
    </p>
  )
}

function Thumb({ photo, name }: { photo: string | null; name: string }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2)
  return (
    <div className="w-8 h-8 rounded-full overflow-hidden bg-teal-100 relative flex-shrink-0">
      {photo ? (
        <Image src={photo} alt={name} fill className="object-cover" sizes="32px" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-teal-700 font-bold text-xs">{initials}</span>
        </div>
      )}
    </div>
  )
}

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function AboutPage() {
  return (
    <div className="pb-20">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="bg-teal-900 text-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-mono uppercase tracking-widest text-teal-400 mb-3">
            Joint research initiative · GNS Science &amp; University of Waikato
          </p>
          <h1 className="text-3xl font-bold mb-3 leading-tight">
            The 1000 Springs Project
          </h1>
          <p className="text-teal-200 max-w-2xl text-base leading-relaxed">
            Documenting the physical, chemical, and microbial biodiversity of geothermal
            ecosystems across Aotearoa New Zealand. Funded by MBIE.
          </p>
        </div>
      </div>

      {/* ── Primary goal + map ──────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <MetaLabel>Primary goal</MetaLabel>
        <blockquote className="border-l-2 border-teal-500 pl-5 mb-5 max-w-3xl">
          <p className="text-slate-700 italic text-lg leading-relaxed">
            "The primary goal of the research project is to collate the physical, chemical, and
            microbial biodiversity information from 1,000 geothermal ecosystems from the Taupō
            Volcanic Zone."
          </p>
        </blockquote>
        <p className="text-slate-600 text-sm leading-relaxed mb-10 max-w-3xl">
          Beyond documentation, the project aims to assess the conservation, cultural,
          recreational, and resource development value of microbial components in these
          geothermal ecosystems, knowledge that informs science, policy, and kaitiakitanga.
        </p>

        <figure className="max-w-[768px]">
          <div className="border border-slate-300 overflow-hidden">
            <Image
              src={`${BASE}/about/TVZ_hotspots_map_small.jpg`}
              alt="Map of geothermal hotspot locations across the Taupō Volcanic Zone"
              width={960}
              height={700}
              className="w-full h-auto"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
          <figcaption className="text-xs text-slate-500 mt-2 leading-relaxed">
            <span className="font-semibold text-slate-600">Fig. 1.</span>{' '}
            Geothermal hotspot locations across the Taupō Volcanic Zone.
            Source: 1000 Springs Project, GNS Science.
          </figcaption>
        </figure>
      </div>

      {/* ── Research aims ───────────────────────────────────────── */}
      <div className="border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <MetaLabel>Research aims</MetaLabel>
          <div className="divide-y divide-slate-100 max-w-3xl">
            {researchAims.map(aim => (
              <div key={aim.number} className="grid grid-cols-[3rem_1fr] gap-5 py-6">
                <p className="font-mono text-2xl font-light text-slate-300 leading-none pt-0.5 tabular-nums">
                  {aim.number}
                </p>
                <div>
                  <p className="font-semibold text-slate-800 mb-1">{aim.title}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{aim.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Outputs ─────────────────────────────────────────────── */}
      <div className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <MetaLabel>Project outputs</MetaLabel>
          <div className="overflow-x-auto">
            <table className="w-full text-sm max-w-3xl">
              <thead>
                <tr className="border-b border-slate-300">
                  <th className="text-left text-xs font-semibold text-slate-500 pb-2 pr-8 uppercase tracking-wide w-44">
                    Output
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 pb-2 uppercase tracking-wide">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {outputs.map(o => (
                  <tr key={o.title}>
                    <td className="py-4 pr-8 align-top">
                      <span className="font-mono text-xs text-teal-600 bg-teal-50 px-1.5 py-0.5 border border-teal-100">
                        {o.label}
                      </span>
                      <p className="font-medium text-slate-700 mt-1.5 text-sm">{o.title}</p>
                    </td>
                    <td className="py-4 text-slate-600 align-top leading-relaxed">{o.body}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Institutions & funders ──────────────────────────────── */}
      <div className="bg-teal-900 text-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <MetaLabelLight>Institutions &amp; funders</MetaLabelLight>
          <div className="divide-y divide-teal-800 max-w-3xl">
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
              <div
                key={inst.name}
                className="py-5 grid grid-cols-1 sm:grid-cols-[12rem_1fr] gap-1 sm:gap-6"
              >
                <p className="font-semibold text-white">{inst.name}</p>
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-teal-400 mb-0.5">
                    {inst.role}
                  </p>
                  <p className="text-teal-200 text-sm">{inst.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Research team ───────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <MetaLabel>Research team</MetaLabel>
        <p className="text-xs text-slate-500 -mt-4 mb-8">
          GNS Science and University of Waikato. Roles as at time of project.
        </p>
        <div className="divide-y divide-slate-100">
          {team.map(person => (
            <div
              key={person.name}
              className="py-4 grid grid-cols-1 sm:grid-cols-[14rem_1fr] gap-y-1 gap-x-8"
            >
              <div className="flex items-center gap-3">
                <Thumb photo={person.photo} name={person.name} />
                <div>
                  <p className="font-medium text-slate-800 text-sm leading-snug">{person.name}</p>
                  <p className="text-xs text-teal-600">{person.institution}</p>
                </div>
              </div>
              <div className="pl-11 sm:pl-0 mt-0.5">
                <p className="text-xs text-slate-600 leading-snug">{person.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{person.roles}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">
            Also assisted by
          </p>
          <p className="text-sm text-slate-600">
            {assistedMembers.map((m, i) => (
              <span key={m.name}>
                {m.name}{i < assistedMembers.length - 1 ? ' · ' : ''}
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* ── Site access & support ───────────────────────────────── */}
      <div className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <MetaLabel>Site access &amp; support</MetaLabel>
          <p className="text-xs text-slate-500 -mt-4 mb-8">
            The following sites provided access and support for the 1000 Springs Project sampling programme.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-12 gap-y-10">
            {tourismPartners.map(region => (
              <div key={region.region}>
                <p className="text-xs font-mono uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-2 mb-4">
                  {region.region}
                </p>
                <ul className="space-y-5">
                  {region.partners.map(p => (
                    <li key={p.name}>
                      <p className="font-medium text-slate-700 text-sm">{p.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{p.address}</p>
                      <p className="text-xs text-slate-500">{p.phone}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Contact ─────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <MetaLabel>Contact</MetaLabel>
        <div className="divide-y divide-slate-100 max-w-xl">
          {contacts.map(c => (
            <div key={c.name} className="py-4 flex items-center gap-4">
              <Thumb photo={c.photo} name={c.name} />
              <div>
                <p className="text-sm font-medium text-slate-800">
                  {c.name}{' '}
                  <span className="font-normal text-slate-500">&middot; {c.org}</span>
                </p>
                <a
                  href={`mailto:${c.email}`}
                  className="text-xs text-teal-600 hover:underline"
                >
                  {c.email}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── About this explorer ─────────────────────────────────── */}
      <div className="border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <MetaLabel>About this explorer</MetaLabel>

          <p className="text-sm text-slate-600 leading-relaxed mb-10 max-w-3xl">
            This explorer is a free, non-commercial tool for making the 1000 Springs Project dataset
            accessible to a broader audience: tourists, students, teachers, and researchers.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8 mb-10 max-w-3xl">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-2 mb-4">
                What this is
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                {[
                  'A web-based field guide to NZ geothermal springs',
                  'Built on the 1000 Springs Project dataset',
                  'Free and open to everyone, no sign-up required',
                  'Used under CC BY-NC-SA 4.0 licence',
                ].map(item => (
                  <li key={item} className="flex gap-2.5 items-baseline">
                    <span className="text-teal-500 flex-shrink-0 text-xs leading-tight">›</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-2 mb-4">
                What this is not
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                {[
                  'Not commercial: no ads, subscriptions, or purchases',
                  'Not a navigation tool: do not use it to access springs',
                  'Not endorsed by the 1000 Springs Project, GNS, or University of Waikato',
                  'Not a source of cultural history or interpretation',
                  'Not affiliated with any tourism operator or landowner',
                ].map(item => (
                  <li key={item} className="flex gap-2.5 items-baseline">
                    <span className="text-slate-300 flex-shrink-0 text-xs leading-tight">›</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 mb-10 text-sm text-slate-600 max-w-3xl">
            <div>
              <p className="font-semibold text-slate-700 mb-1.5">A note on microbiology</p>
              <p className="leading-relaxed mb-2">
                Microbial diversity data comes from 16S rRNA amplicon sequencing. Identifications
                are to varying taxonomic ranks, from domain down to genus in some cases. This
                explorer deliberately avoids overclaiming species-level precision because the data
                does not support it.
              </p>
              <p className="leading-relaxed">
                Sequence read counts are not cell counts. Relative abundances reflect what was
                sequenced at the time of sampling, not absolute population sizes.
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-700 mb-1.5">Cultural &amp; access sensitivity</p>
              <p className="leading-relaxed mb-2">
                Many geothermal areas in this dataset hold deep cultural significance for local iwi
                and hapū. This explorer does not generate or imply any cultural history, meaning,
                or interpretation of sites.
              </p>
              <p className="leading-relaxed">
                Exact coordinates are shown only where clearly public. The camera overlay will not
                display restricted, private, or culturally sensitive sites.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-sm border-t border-slate-100 pt-6">
            <Link href="/explore" className="text-teal-700 hover:underline">
              Explore the dataset →
            </Link>
            <Link href="/attribution" className="text-slate-500 hover:text-slate-700 hover:underline">
              Attribution &amp; licence
            </Link>
            <a
              href="https://1000springs.org.nz/about"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-700 hover:underline"
            >
              Official project site ↗
            </a>
          </div>
        </div>
      </div>

    </div>
  )
}
