import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

const BASE = 'https://1000springs.org.nz/static/img/Methodologies'

export const metadata: Metadata = {
  title: 'Methodologies',
  description:
    'Field sampling, laboratory processing, sequencing protocols, and health & safety procedures used by the 1000 Springs Project.',
}

/* ─── Data ─────────────────────────────────────────────────────────────── */

const sampleDistribution = [
  { volume: '2,150 mL', container: 'Sterile 2 L polypropylene bottle', purpose: 'Microbial diversity & chemistry analysis' },
  { volume: '~330 mL', container: 'Rubber-necked bottle', purpose: 'H₂S, bicarbonate & chloride analysis' },
  { volume: '500 mL', container: 'Sterile polypropylene bottle', purpose: 'Physical attributes (conductivity, dissolved oxygen)' },
  { volume: '~60 mL', container: 'Syringe', purpose: 'Dissolved gas content' },
  { volume: '~10 g', container: 'Sediment container', purpose: 'Sediment sample (where possible), earmarked for future research' },
]

const fieldMetadata = [
  'Feature type (spring, stream, etc.)',
  'Area description',
  'Sampling date and staff',
  'Feature location & GPS coordinates',
  'Spring size',
  'Ebullition (bubbling / water upflow)',
  'Spring colour',
  "Images and bird's-eye-view sketches for future resampling",
]

const fieldMeasurements = [
  { param: 'pH', instrument: 'Hanna field multiparameter meter' },
  { param: 'Oxidation-reduction potential (ORP / redox)', instrument: 'Hanna field multiparameter meter' },
  { param: 'Conductivity (salinity proxy)', instrument: 'Hanna field multiparameter meter' },
  { param: 'Total dissolved solids', instrument: 'Hanna field multiparameter meter' },
  { param: 'Turbidity', instrument: 'Hanna field multiparameter meter' },
  { param: 'Dissolved oxygen', instrument: 'Hanna field multiparameter meter' },
  { param: 'Ferrous iron (Fe²⁺)', instrument: 'Field spectrophotometer (immediate)' },
]

const processingTable = [
  { bottle: '2 L bottle', processing: 'Filtered', storage: '−20 °C', parameter: 'Microbial diversity', method: 'DNA extraction & sequencing', location: 'University of Waikato' },
  { bottle: '500 mL bottle', processing: 'Raw', storage: 'n/a', parameter: 'Physical properties', method: 'Multiparameter field meter', location: 'On site' },
  { bottle: '500 mL bottle', processing: 'Filtered (0.22 µm)', storage: 'n/a', parameter: 'Fe²⁺', method: 'UV Spectroscopy', location: 'On site' },
  { bottle: '330 mL rubber-sealed', processing: 'Raw', storage: '4 °C', parameter: 'H₂S', method: 'UV Spectroscopy', location: 'NZGAL' },
  { bottle: '330 mL rubber-sealed', processing: 'Raw', storage: '4 °C', parameter: 'HCO₃⁻', method: 'Automated titration', location: 'NZGAL' },
  { bottle: '330 mL rubber-sealed', processing: 'Raw', storage: '4 °C', parameter: 'Cl⁻', method: 'Automated titration', location: 'NZGAL' },
  { bottle: '50 mL tube', processing: 'Filtered', storage: '4 °C', parameter: 'SO₄²⁻', method: 'Ion chromatography', location: 'NZGAL' },
  { bottle: '50 mL tube', processing: 'Filtered', storage: '−20 °C', parameter: 'NH₄⁺, PO₄³⁻, NO₂⁻, NO₃⁻', method: 'Flow injection analysis', location: 'University of Waikato' },
  { bottle: '50 mL tube', processing: 'Filtered', storage: '4 °C', parameter: 'Back-up sample', method: 'n/a', location: 'n/a' },
  { bottle: '15 mL tube', processing: 'Filtered & acidified', storage: '4 °C', parameter: 'Elements (ICP-MS)', method: 'Inductively coupled plasma mass spectrometry', location: 'University of Waikato' },
  { bottle: '15 mL tube', processing: 'Filtered & alkalified', storage: '4 °C', parameter: 'As, Sb', method: 'ICP atomic emission spectroscopy', location: 'NZGAL' },
  { bottle: '50 mL syringe', processing: 'Filtered', storage: 'Room temp.', parameter: 'H₂, CH₄, CO', method: 'Gas chromatography', location: 'Extremophile Research Group, GNS' },
]

const icpElements = [
  'Boron', 'Lithium', 'Sodium', 'Magnesium', 'Aluminium', 'Silicon',
  'Sulphur', 'Potassium', 'Calcium', 'Vanadium', 'Chromium', 'Manganese',
  'Iron', 'Cobalt', 'Nickel', 'Copper', 'Zinc', 'Arsenic', 'Selenium',
  'Bromine', 'Rubidium', 'Molybdenum', 'Silver', 'Cadmium', 'Caesium',
  'Barium', 'Mercury', 'Thallium', 'Lead', 'Uranium',
]

const ppeItems = [
  'Comprehensive burns kit with full-body gel blanket',
  '1st aid kit',
  'Collapsible bucket & water bladder',
  'Modified throwbag',
  'Gas monitor',
  'GPS unit',
  'Satellite phone',
  'Personal locator beacon',
  'Laminated site info sheets (contacts, hazards, recommended PPE per site)',
]

const references = [
  {
    id: 'edgar2013',
    citation: 'Edgar, R.C. (2013). UPARSE: Highly accurate OTU sequences from microbial amplicon reads. Nature Methods 10, 996–998.',
  },
  {
    id: 'rueckert2007',
    citation: 'Rueckert, A. and Morgan, H.W. (2007). Removal of contaminating DNA from polymerase chain reaction using ethidium monoazide. J Microbiol Meth, 68(3), 596–600.',
  },
  {
    id: 'schloss2009',
    citation: 'Schloss, P.D., Westcott, S.L., Ryabin, T., Hall, J.R., Hartmann, M., Hollister, E.B., Lesniewski, R.A., Oakley, B.B., Parks, D.H., Robinson, C.J., Sahl, J.W., Stres, B., Thallinger, G.G., Van Horn, D.J. and Weber, C.F. (2009). Introducing mothur: open-source, platform-independent, community-supported software for describing and comparing microbial communities. Appl Environ Microbiol, 75(23), 7537–7541.',
  },
  {
    id: 'wang2007',
    citation: 'Wang Q., Garrity, G.M., Tiedje, J.M. and Cole, J.R. (2007). Naive Bayesian classifier for rapid assignment of rRNA sequences into the new bacterial taxonomy. Appl Environ Microbiol, 73(16), 5261–5267.',
  },
  {
    id: 'whitman1998',
    citation: 'Whitman, W.B., Coleman, D.C. and Wiebe, W.J. (1998). Prokaryotes, the unseen majority. Proc Natl Acad Sci USA, 95(12), 6578–6583.',
  },
  {
    id: 'wilson1960',
    citation: 'Wilson, A.D. (1960). The micro-determination of ferrous iron in silicate minerals by a volumetric and a colorimetric method. Analyst, 85, 823–827.',
  },
]

/* ─── Helpers ───────────────────────────────────────────────────────────── */

function MetaLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`text-xs uppercase tracking-widest mb-2 ${light ? 'text-teal-400' : 'text-slate-500'}`}>
      {children}
    </p>
  )
}

function SectionAnchor({ id }: { id: string }) {
  return <span id={id} className="block relative -top-20" />
}

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function MethodologiesPage() {
  return (
    <div className="pb-20">

      {/* ── Page header ─────────────────────────────────────────── */}
      <div className="bg-teal-900 text-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <MetaLabel light>Methodologies · 1000 Springs Project</MetaLabel>
          <h1 className="text-3xl font-bold mb-2 leading-tight tracking-tight">
            Sampling &amp; Analysis Protocols
          </h1>
          <p className="text-teal-200 max-w-2xl text-base mb-6">
            Field sampling techniques, laboratory processing procedures, sequencing protocols, and
            health &amp; safety guidelines used across the 1000 Springs Project.
          </p>
          {/* Anchor nav */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-teal-300">
            {[
              { href: '#sampling', label: 'Feature Sampling' },
              { href: '#processing', label: 'Field & Lab Processing' },
              { href: '#sequencing', label: 'Sequencing' },
              { href: '#safety', label: 'Health & Safety' },
              { href: '#references', label: 'References' },
            ].map((link, i, arr) => (
              <span key={link.href} className="flex items-center gap-4">
                <a href={link.href} className="hover:text-white transition-colors">
                  {link.label}
                </a>
                {i < arr.length - 1 && <span className="text-teal-700 select-none">·</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Protocol metadata strip ─────────────────────────────── */}
      <div className="border-b border-slate-200 bg-white py-4 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-x-8 gap-y-2">
          {[
            { value: '1,000', label: 'geothermal features targeted' },
            { value: '~70,000', label: 'sequences read per sample' },
            { value: '97%', label: 'OTU similarity threshold' },
            { value: '250 bp', label: 'trimmed read length' },
          ].map(stat => (
            <div key={stat.label} className="flex items-baseline gap-2">
              <span className="font-semibold text-teal-700 text-sm">{stat.value}</span>
              <span className="text-xs text-slate-600">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Dataflow diagram ────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-2">
        <MetaLabel>Overview diagram</MetaLabel>
        <figure>
          <div className="border border-slate-300 overflow-hidden">
            <div className="relative w-full" style={{ paddingBottom: '40%' }}>
              <Image
                src={`${BASE}/1000-springs-dataflow.png`}
                alt="1000 Springs Project data flow, from field sampling through analysis and computing to the online database"
                fill
                className="object-contain bg-white"
                sizes="(max-width: 1024px) 100vw, 960px"
              />
            </div>
          </div>
          <figcaption className="text-xs text-slate-600 mt-2">
            <span className="font-semibold text-slate-800">Fig. 1.</span>{' '}
            Data flow from field sampling through laboratory analysis and computing to the online database.
          </figcaption>
        </figure>
      </div>

      {/* ══════════════════════════════════════════════════════════
          FEATURE SAMPLING
      ══════════════════════════════════════════════════════════ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SectionAnchor id="sampling" />
        <MetaLabel>01: Feature Sampling</MetaLabel>
        <h2 className="text-xl font-bold text-slate-800 mb-6">Sample site selection &amp; water collection</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div>
            <h3 className="font-semibold text-slate-800 mb-3">Site selection</h3>
            <p className="text-sm text-slate-800 leading-relaxed mb-3">
              The research targets a broad range of physicochemical conditions in
              geothermally-influenced springs within the Taupō Volcanic Zone. Water columns are
              sampled from springs. Sediments, biofilms, mudpots, and heated soils are excluded.
            </p>
            <p className="text-sm text-slate-800 leading-relaxed">
              The goal is to collect 1,000 samples, primarily one per individual feature. Repeated
              sampling occurs where conditions vary significantly, for temporal studies, or for
              quality control purposes.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 mb-3">Collection technique</h3>
            <p className="text-sm text-slate-800 leading-relaxed mb-3">
              A telescopic sampling pole fitted with sterile containers or custom-built samplers
              collects water across the full depth of the spring, ensuring homogenous and
              representative samples.
            </p>
            <p className="text-sm text-slate-800 leading-relaxed">
              A field tablet and custom app record physical, chemical, and metadata in the field,
              eliminating double-handling of field notes and reducing transcription errors. Metadata
              uploads instantly to the database.
            </p>
          </div>
        </div>

        {/* Table 1: Sample water distribution */}
        <h3 className="font-semibold text-slate-800 mb-2">Sample water distribution</h3>
        <p className="text-xs text-slate-500 mb-3">Table 1. Volume and container allocation per sample.</p>
        <div className="overflow-x-auto border border-slate-200 mb-10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-300 bg-slate-50 text-xs text-slate-600 uppercase tracking-wide">
                <th className="text-left px-4 py-3 font-semibold">Volume</th>
                <th className="text-left px-4 py-3 font-semibold">Container</th>
                <th className="text-left px-4 py-3 font-semibold">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sampleDistribution.map((row, i) => (
                <tr key={i} className="bg-white hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-teal-700 font-medium whitespace-nowrap">{row.volume}</td>
                  <td className="px-4 py-3 text-slate-800">{row.container}</td>
                  <td className="px-4 py-3 text-slate-800">{row.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Field sampling photos */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          {[
            { src: `${BASE}/sampling/field_sampling_tiny.jpg`, fig: 'Fig. 2.', caption: 'Collecting water samples using the telescopic sampling pole.' },
            { src: `${BASE}/sampling/field%20sampling_2_small.jpg`, fig: 'Fig. 3.', caption: 'Field sampling documentation and mobile lab setup.' },
          ].map(img => (
            <figure key={img.src}>
              <div className="border border-slate-200 overflow-hidden">
                <div className="relative h-48">
                  <Image src={img.src} alt={img.caption} fill className="object-cover" sizes="50vw" />
                </div>
              </div>
              <figcaption className="text-xs text-slate-600 mt-1.5">
                <span className="font-semibold text-slate-800">{img.fig}</span> {img.caption}
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Field metadata */}
        <h3 className="font-semibold text-slate-800 mb-3">Field metadata recorded</h3>
        <div className="divide-y divide-slate-100 border-t border-slate-100">
          {fieldMetadata.map(item => (
            <div key={item} className="flex gap-3 py-2 text-sm text-slate-800">
              <span className="text-slate-300 flex-shrink-0 mt-px">›</span>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          FIELD & LAB PROCESSING
      ══════════════════════════════════════════════════════════ */}
      <div className="bg-slate-50 border-y border-slate-200 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <SectionAnchor id="processing" />
          <MetaLabel>02: Field &amp; Laboratory Processing</MetaLabel>
          <h2 className="text-xl font-bold text-slate-800 mb-6">Measurements, filtration &amp; chemistry</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* Field measurements */}
            <div className="bg-white border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-800 mb-3">Field measurements</h3>
              <p className="text-xs text-slate-600 mb-4">
                Processing occurs in a 4WD field van configured as a mobile laboratory to minimise
                temperature changes, dissolved oxygen changes, and microbial activity effects.
              </p>
              <div className="divide-y divide-slate-100">
                {fieldMeasurements.map(m => (
                  <div key={m.param} className="flex justify-between items-start gap-3 py-2">
                    <span className="text-sm font-medium text-slate-700">{m.param}</span>
                    <span className="text-xs text-slate-600 text-right flex-shrink-0">{m.instrument}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Microorganism collection */}
            <div className="bg-white border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Microorganism collection</h3>
              <p className="text-sm text-slate-800 leading-relaxed mb-3">
                A battery-operated peristaltic pump pushes up to 2 litres through a{' '}
                <strong>0.2 µm Sterivex column filter</strong> (Millipore). After extensive field
                testing, Sterivex filters demonstrated higher filtration volume capacity than
                tested alternatives.
              </p>
              <p className="text-sm text-slate-800 leading-relaxed mb-3">
                Filtrate water is collected in 15 mL and 50 mL tubes for additional chemistry
                analyses.
              </p>
              <p className="text-sm text-slate-800 leading-relaxed">
                All filtrate samples, filters, and soil samples are cooled to{' '}
                <strong>4 °C</strong> and transported immediately to the Wairakei laboratory for
                storage until analysis.
              </p>

              <div className="mt-5 pt-4 border-t border-slate-100">
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-3">
                  Chemistry analysis locations
                </p>
                <div className="space-y-1.5">
                  {[
                    ['NZGAL', 'NZ Geothermal Analytical Laboratory, GNS Science'],
                    ['ERG', 'Extremophile Research Group, GNS Science'],
                    ['UWaikato', 'University of Waikato, School of Science'],
                  ].map(([abbr, full]) => (
                    <div key={abbr} className="flex gap-2 text-xs text-slate-800">
                      <span className="bg-teal-50 text-teal-700 px-1.5 py-0.5 border border-teal-100 font-semibold flex-shrink-0">
                        {abbr}
                      </span>
                      {full}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Field & lab photos */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            {[
              { src: `${BASE}/field_lab/field_and_lab_tiny.jpg`, fig: 'Fig. 4.', caption: 'The 4WD mobile laboratory used for field processing.' },
              { src: `${BASE}/field_lab/field_and_lab_2_tiny.jpg`, fig: 'Fig. 5.', caption: 'Filtering samples through the Sterivex column.' },
            ].map(img => (
              <figure key={img.src}>
                <div className="border border-slate-200 overflow-hidden">
                  <div className="relative h-48">
                    <Image src={img.src} alt={img.caption} fill className="object-cover" sizes="50vw" />
                  </div>
                </div>
                <figcaption className="text-xs text-slate-600 mt-1.5">
                  <span className="font-semibold text-slate-800">{img.fig}</span> {img.caption}
                </figcaption>
              </figure>
            ))}
          </div>

          {/* Table 2: Processing summary */}
          <h3 className="font-semibold text-slate-800 mb-2">Sample processing summary</h3>
          <p className="text-xs text-slate-500 mb-3">Table 2. Container, processing method, storage, and analysis location per parameter.</p>
          <div className="overflow-x-auto border border-slate-200 mb-8">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-300 bg-slate-50 text-slate-600 uppercase tracking-wide">
                  <th className="text-left px-3 py-3 font-semibold">Container</th>
                  <th className="text-left px-3 py-3 font-semibold">Processing</th>
                  <th className="text-left px-3 py-3 font-semibold">Storage</th>
                  <th className="text-left px-3 py-3 font-semibold">Parameter</th>
                  <th className="text-left px-3 py-3 font-semibold">Analytical method</th>
                  <th className="text-left px-3 py-3 font-semibold">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {processingTable.map((row, i) => (
                  <tr key={i} className="bg-white hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-2.5 text-slate-800 whitespace-nowrap">{row.bottle}</td>
                    <td className="px-3 py-2.5 text-slate-800">{row.processing}</td>
                    <td className="px-3 py-2.5 text-slate-700">{row.storage}</td>
                    <td className="px-3 py-2.5 font-medium text-teal-700">{row.parameter}</td>
                    <td className="px-3 py-2.5 text-slate-800">{row.method}</td>
                    <td className="px-3 py-2.5 text-slate-600">{row.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ICP elements */}
          <div className="bg-white border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-800 mb-1">
              Elements measured via ICP-MS
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              30 elements quantified by inductively coupled plasma mass spectrometry at the
              University of Waikato.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {icpElements.map(el => (
                <span
                  key={el}
                  className="bg-teal-50 text-teal-800 text-xs px-2 py-0.5 border border-teal-100"
                >
                  {el}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SEQUENCING
      ══════════════════════════════════════════════════════════ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SectionAnchor id="sequencing" />
        <MetaLabel>03: Sequencing</MetaLabel>
        <h2 className="text-xl font-bold text-slate-800 mb-3">Microbial diversity assessment</h2>
        <p className="text-slate-600 text-sm mb-10 max-w-2xl leading-relaxed">
          Soil and freshwater can contain up to one billion and ten million cells respectively,
          making exhaustive identification impractical. The project instead extracts total microbial
          DNA, sequences a universal gene, and uses bioinformatics pipelines to assign taxonomy at
          scale using Ion Torrent Next-Generation Sequencing.
        </p>

        {/* Phase 1: DNA Extraction */}
        <div className="mb-12">
          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-xs text-teal-600 uppercase tracking-widest">Phase 1</span>
            <h3 className="text-base font-bold text-slate-800">DNA Extraction</h3>
          </div>
          <div className="border-l-4 border-teal-400 bg-teal-50 pl-5 py-4 pr-4 mb-5">
            <p className="text-sm text-teal-800 leading-relaxed">
              <strong>Summary:</strong> Chemical and physical techniques extract, purify, and
              concentrate DNA from microorganisms. Before cell disruption, sterile skim milk blocks
              possible binding sites on solids/sediments captured during filtration. Captured cells
              in the Sterivex filter are disrupted using{' '}
              <strong>cetyl trimethylammonium bromide (CTAB)</strong>. Proteins, lipids, and
              ribonucleic acids are chemically removed using phenol-chloroform-isoamyl alcohol and
              chloroform-isoamyl alcohol. DNA is then concentrated via magnetic bead-adsorption.
            </p>
          </div>
          <div className="divide-y divide-slate-100 border-t border-slate-100">
            {[
              {
                step: '1',
                title: 'Cell disruption',
                body: 'Sterivex filters thaw on ice. 1.0 mL of 0.8% w/v skim milk powder solution is added and incubated for 30 min at 65 °C. 0.4 mL CTAB, 0.2 mL phosphate-buffered saline, and 0.1 mL sodium dodecyl sulfate are added and vortexed for 1 minute. The filter is placed in a 50 mL sterile capped tube and incubated at 150 rpm / 65 °C for 30 minutes. After briefly cooling on ice, the aqueous component is pushed through the syringe and collected in 2 mL tubes.',
              },
              {
                step: '2',
                title: 'DNA purification',
                body: 'Equal volume (1:1) of chloroform:isoamyl alcohol (24:1) is added to each tube, vortexed for 10 s, and centrifuged at 12,400 rpm for 10 minutes. The aqueous phase (typically top) is transferred to a new tube. 300 µL chloroform:isoamyl (24:1) is added to the aqueous phase, mixed on a Hula mixer for 20 minutes, then centrifuged for 10 minutes at 12,400 rpm. The aqueous phase is collected, avoiding the bottom layer.',
              },
              {
                step: '3',
                title: 'DNA concentration',
                body: 'Equal volume of 100% ethanol and 40 µL MoBio beads are added to the aqueous phase. Samples are agitated every 30 s–5 min, then placed on a magnetic stand for 2 minutes. Supernatant is removed and beads are washed with 500 µL of 100% ethanol, cleaning tube walls. All ethanol is removed and beads are resuspended in 30 µL Tris (pH 8.0) by gentle pipetting and brief vortexing.',
              },
            ].map(s => (
              <div key={s.step} className="flex gap-5 py-5">
                <span className="text-slate-300 text-sm flex-shrink-0 tabular-nums pt-px">{s.step}.</span>
                <div>
                  <p className="font-semibold text-slate-800 mb-1 text-sm">{s.title}</p>
                  <p className="text-sm text-slate-800 leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phase 2: Amplification */}
        <div className="mb-12">
          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-xs text-teal-600 uppercase tracking-widest">Phase 2</span>
            <h3 className="text-base font-bold text-slate-800">DNA Amplification &amp; NGS Preparation</h3>
          </div>
          <div className="border-l-4 border-teal-400 bg-teal-50 pl-5 py-4 pr-4 mb-5">
            <p className="text-sm text-teal-800 leading-relaxed">
              <strong>Summary:</strong> Microbial diversity is determined by sequencing the{' '}
              <strong>16S ribosomal RNA gene</strong> (~1,540 nucleotides), a short gene possessed
              by all bacteria and archaea. Total DNA is extracted and 16S rRNA genes are amplified
              by PCR modified for Ion Torrent Next-Generation Sequencing. On average,{' '}
              <strong>~70,000 sequences</strong> (~270 bp each) are read per sample.
            </p>
          </div>
          <div className="divide-y divide-slate-100 border-t border-slate-100">
            {[
              {
                step: '1',
                title: 'PCR amplification',
                body: (
                  <>
                    <p className="text-sm text-slate-800 leading-relaxed mb-3">
                      PCR amplifies the microbial community 16S rRNA genes using universal
                      bacterial/archaeal primers from the{' '}
                      <strong>Earth Microbiome Project</strong>:
                    </p>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-start gap-3">
                        <span className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-100 px-2 py-1 flex-shrink-0">F515</span>
                        <code className="text-xs bg-slate-100 text-slate-700 px-2 py-1 break-all">
                          5′-GTGCCAGCMGCCGCGGTAA-3′
                        </code>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-100 px-2 py-1 flex-shrink-0">R806</span>
                        <code className="text-xs bg-slate-100 text-slate-700 px-2 py-1 break-all">
                          5′-GGACTACVSGGGTATCTAAT-3′
                        </code>
                      </div>
                    </div>
                    <p className="text-sm text-slate-800 leading-relaxed">
                      The forward primer contains an A-adaptor, a 10–12 nucleotide sample-specific
                      barcode, a 'GAT' barcode adaptor, and the F515 sequencing primer. The reverse
                      primer includes a P1 sequence and R806 sequencing primer.
                    </p>
                  </>
                ),
              },
              {
                step: '2',
                title: 'PCR reaction composition',
                body: (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-800">
                    {[
                      ['0.5 µL each', 'Forward & reverse primers (10 µM)'],
                      ['1.0 µL', 'Bovine serum albumin (10 mg/mL)'],
                      ['3.0 µL', 'dNTPs (8 mM)'],
                      ['3.0 µL', '10× PCR buffer'],
                      ['3.0 µL', 'MgCl₂ (50 mM)'],
                      ['2.0 µL', 'Soil community DNA (0.5 ng/µL template)'],
                    ].map(([vol, desc]) => (
                      <div key={desc} className="flex gap-2 items-start">
                        <span className="text-teal-700 text-xs bg-teal-50 border border-teal-100 px-1.5 py-0.5 flex-shrink-0">{vol}</span>
                        <span>{desc}</span>
                      </div>
                    ))}
                    <p className="col-span-full text-xs text-slate-600 mt-2">
                      25 µL total reaction volume. Master mix is pre-treated with ethidium
                      monoazide bromide (EMA) to remove trace DNA contaminants before primer, Taq,
                      and template addition.
                    </p>
                    <div className="col-span-full mt-2 pt-2 border-t border-slate-100">
                      <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Thermocycling</p>
                      <p className="text-xs text-slate-800">
                        Initial denaturation 94 °C / 3 min → 30 cycles: 94 °C / 45 s · 50 °C / 1 min · 72 °C / 1.5 min → Final extension 72 °C / 10 min
                      </p>
                    </div>
                  </div>
                ),
              },
              {
                step: '3',
                title: 'NGS preparation & sequencing',
                body: (
                  <p className="text-sm text-slate-800 leading-relaxed">
                    Amplicons from triplicated PCR products are purified using{' '}
                    <strong>SPRIselect</strong> (Beckman Coulter) to remove small nucleotide
                    fragments. Quality and concentration are verified and adjusted to{' '}
                    <strong>26 pM</strong> via HS Qubit 2.0 (Life Technologies) and 9100
                    BioAnalyser (Agilent Technologies). Amplicons from all samples are pooled for
                    emulsion PCR. Sequencing is conducted at the{' '}
                    <strong>Waikato DNA Sequencing Facility</strong> using Ion Torrent PGM (Life
                    Technologies) with Ion 318v2 chip and 400 bp chemistry.
                  </p>
                ),
              },
            ].map(s => (
              <div key={s.step} className="flex gap-5 py-5">
                <span className="text-slate-300 text-sm flex-shrink-0 tabular-nums pt-px">{s.step}.</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 mb-2 text-sm">{s.title}</p>
                  {s.body}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sequencing equipment photos */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { src: `${BASE}/sequencing/ion_torrent_small.jpg`, fig: 'Fig. 6.', caption: 'Ion Torrent PGM sequencer.' },
            { src: `${BASE}/sequencing/loading_chip_tiny.jpg`, fig: 'Fig. 7.', caption: 'Loading the Ion 318v2 chip.' },
            { src: `${BASE}/sequencing/ion_torrent_chips_tiny.jpg`, fig: 'Fig. 8.', caption: 'Ion Torrent sequencing chips.' },
          ].map(img => (
            <figure key={img.src}>
              <div className="border border-slate-200 overflow-hidden">
                <div className="relative h-40">
                  <Image src={img.src} alt={img.caption} fill className="object-cover" sizes="33vw" />
                </div>
              </div>
              <figcaption className="text-xs text-slate-600 mt-1.5">
                <span className="font-semibold text-slate-800">{img.fig}</span> {img.caption}
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Phase 3: Post-sequencing */}
        <div>
          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-xs text-teal-600 uppercase tracking-widest">Phase 3</span>
            <h3 className="text-base font-bold text-slate-800">Post-sequencing Bioinformatics</h3>
          </div>
          <div className="border-l-4 border-teal-400 bg-teal-50 pl-5 py-4 pr-4 mb-5">
            <p className="text-sm text-teal-800 leading-relaxed">
              <strong>Summary:</strong> ~70,000 raw reads per sample are processed by customised
              bioinformatic pipelines. Erroneous reads are removed, tagging sequences are stripped,
              and reads are screened for known errors and trimmed to{' '}
              <strong>250 bp</strong>. Similar sequences are clustered into{' '}
              <strong>Operational Taxonomic Units (OTUs)</strong> at 97% similarity. OTUs are
              taxonomically ranked by comparison with microbial databases. For this explorer, OTUs
              with &gt; 5 reads per sample are presented graphically.
            </p>
          </div>
          <div className="bg-white border border-slate-200 p-6">
            <h4 className="font-semibold text-slate-800 mb-3 text-sm">Pipeline details</h4>
            <div className="space-y-3 text-sm text-slate-800">
              <p>
                Raw reads in <strong>FASTQ format</strong> are processed using a custom pipeline
                based on <strong>Mothur</strong> and <strong>USEARCH</strong>.
              </p>
              <div className="divide-y divide-slate-100 border-t border-slate-100">
                {[
                  'Reads outside 275–345 bp are removed',
                  'Reads with any error in barcode or forward PCR primer are removed',
                  'Barcode and forward primer sequences are stripped from remaining reads',
                  'Q-score filtering removes reads with ≥ 3 expected errors',
                  'Reads are globally trimmed to 250 bp',
                  'After de-replication, unique reads are sorted by abundance',
                  'USEARCH generates OTUs via centroid-based clustering (97% similarity) and removes chimeras',
                  'OTUs are taxonomically assigned using RDP Classifier with RDP Release 11.2',
                ].map(step => (
                  <div key={step} className="flex gap-3 py-2">
                    <span className="text-slate-300 flex-shrink-0 mt-px">›</span>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          HEALTH & SAFETY
      ══════════════════════════════════════════════════════════ */}
      <div className="bg-amber-50 border-y border-amber-200 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <SectionAnchor id="safety" />
          <p className="text-xs uppercase tracking-widest text-amber-700 mb-2">
            04: Health &amp; Safety
          </p>
          <h2 className="text-xl font-bold text-amber-900 mb-6">Geothermal field safety</h2>

          <div className="border-l-4 border-amber-500 bg-amber-100/60 pl-5 py-4 pr-4 mb-8">
            <p className="text-amber-900 font-semibold mb-1 text-sm">Important safety notice</p>
            <p className="text-amber-800 text-sm leading-relaxed">
              Sampling springs in geothermal environments presents serious danger and{' '}
              <strong>should not be attempted by the public</strong>. Ground surrounding hot springs
              can be hot, unstable, and undercut. Springs often emit high concentrations of toxic
              and/or asphyxiating gases. All project participants have extensive experience moving
              through and sampling geothermal ecosystems. The project attempts to minimise
              environmental impact from sampling.
            </p>
          </div>

          {/* H&S photos */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              { src: `${BASE}/health_safety/h%26s_small.jpg`, fig: 'Fig. 9.', caption: 'Team equipped for geothermal field work.' },
              { src: `${BASE}/health_safety/h%26s_2_tiny.jpg`, fig: 'Fig. 10.', caption: 'Personal protective equipment for sampling.' },
            ].map(img => (
              <figure key={img.src}>
                <div className="border border-amber-200 overflow-hidden">
                  <div className="relative h-52">
                    <Image src={img.src} alt={img.caption} fill className="object-cover" sizes="50vw" />
                  </div>
                </div>
                <figcaption className="text-xs text-amber-700 mt-1.5">
                  <span className="font-semibold">{img.fig}</span> {img.caption}
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-amber-900 mb-3 text-sm">Personal protective equipment &amp; emergency kit</h3>
              <div className="divide-y divide-amber-100 border-t border-amber-100">
                {ppeItems.map(item => (
                  <div key={item} className="flex gap-3 py-2 text-sm text-amber-800">
                    <span className="text-amber-300 flex-shrink-0 mt-px">›</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 mb-3 text-sm">Clothing &amp; footwear</h3>
              <div className="divide-y divide-amber-100 border-t border-amber-100 text-sm text-amber-800">
                <div className="py-4">
                  <p className="font-medium mb-1">Footwear</p>
                  <p>
                    Leather boots topped with <strong>neoprene puttees (gaiters)</strong> are
                    preferred over gumboots; they provide better ankle support and protection in
                    unstable terrain.
                  </p>
                </div>
                <div className="py-4">
                  <p className="font-medium mb-1">Trousers</p>
                  <p>
                    Locally made <strong>Cactus SuperTrousers</strong> protect against vegetation
                    and slow water/mud infiltration if accidents occur.
                  </p>
                </div>
                <div className="py-4">
                  <p className="font-medium mb-1">General guidance for visitors</p>
                  <p>
                    When visiting geothermal environments: do not leave formed tracks, do not
                    approach springs or steaming soils, and always follow posted safety instructions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          REFERENCES
      ══════════════════════════════════════════════════════════ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SectionAnchor id="references" />
        <MetaLabel>References</MetaLabel>
        <h2 className="text-xl font-bold text-slate-800 mb-6">Literature cited</h2>
        <div className="divide-y divide-slate-100 border-t border-slate-100">
          {references.map(ref => (
            <div key={ref.id} className="flex gap-4 py-4">
              <span className="text-slate-300 flex-shrink-0 mt-0.5">›</span>
              <p className="text-sm text-slate-800 leading-relaxed">{ref.citation}</p>
            </div>
          ))}
        </div>

        {/* Document navigation */}
        <div className="flex flex-wrap gap-6 text-sm mt-10 pt-8 border-t border-slate-200">
          <Link href="/explore" className="text-teal-700 hover:underline">
            Explore springs →
          </Link>
          <Link href="/about" className="text-slate-600 hover:text-slate-700 hover:underline">
            About the project
          </Link>
          <a
            href="https://1000springs.org.nz/methodologies"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 hover:text-slate-700 hover:underline"
          >
            Official methodologies page ↗
          </a>
        </div>
      </div>

    </div>
  )
}
