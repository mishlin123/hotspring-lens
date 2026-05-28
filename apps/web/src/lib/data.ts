import path from 'path'
import { readFileSync } from 'fs'
import type { Spring, SpringSummary, DistinctivenessBreakdown } from './types'

const DATA_PATH = path.join(
  process.cwd(),
  '..',
  '..',
  'data',
  'processed',
  'springs_app_dataset_full.json'
)

let _springs: Spring[] | null = null

export function getAllSprings(): Spring[] {
  if (_springs) return _springs
  const raw = readFileSync(DATA_PATH, 'utf-8')
  _springs = JSON.parse(raw) as Spring[]
  return _springs
}

export function getSpringById(id: string): Spring | undefined {
  return getAllSprings().find(s => s.id === id)
}

export function getAllSpringSummaries(): SpringSummary[] {
  const distinctiveness = computeAllDistinctiveness()
  return getAllSprings().map(s => ({
    id: s.id,
    name: s.name,
    geothermal_system: s.geothermal_system,
    feature_type: s.feature_type,
    temperature_c: s.temperature_c,
    ph: s.ph,
    latitude: s.latitude,
    longitude: s.longitude,
    location_text: s.location_text,
    image_url: s.image_url,
    safety_warning: s.safety_warning,
    chemistry_record_count: s.chemistry_record_count,
    taxonomy_record_count: s.taxonomy_record_count,
    analytes: s.top_chemistry.map(c => c.analyte),
    distinctiveness_score: distinctiveness.get(s.id)?.score ?? null,
  }))
}

export function getUniqueGeothermalSystems(): string[] {
  const systems = new Set(
    getAllSprings()
      .map(s => s.geothermal_system)
      .filter(Boolean)
  )
  return Array.from(systems).sort()
}

export function getUniqueFeatureTypes(): string[] {
  const types = new Set(
    getAllSprings()
      .map(s => s.feature_type)
      .filter(Boolean)
  )
  return Array.from(types).sort()
}

// ─── Distinctiveness ──────────────────────────────────────────────────────────

let _distinctiveness: Map<string, DistinctivenessBreakdown> | null = null

function computeAllDistinctiveness(): Map<string, DistinctivenessBreakdown> {
  if (_distinctiveness) return _distinctiveness

  const springs = getAllSprings()

  // Springs with usable taxonomy data
  const withTaxa = springs.filter(s => s.taxonomy_record_count > 0 && s.top_taxa.length > 0)
  const N = withTaxa.length

  // Count how many springs each genus/species taxon appears in
  // (exclude domain/phylum/class/order/family — too broad to signal rarity)
  const genusLevelRanks = new Set(['genus', 'species'])
  const taxonSpringCount: Record<string, number> = {}
  withTaxa.forEach(s => {
    const seen = new Set<string>()
    s.top_taxa
      .filter(t => genusLevelRanks.has(t.taxonomic_rank))
      .forEach(t => {
        if (!seen.has(t.taxon_name)) {
          taxonSpringCount[t.taxon_name] = (taxonSpringCount[t.taxon_name] ?? 0) + 1
          seen.add(t.taxon_name)
        }
      })
  })

  // Richness: min/max for normalization across springs with data
  const richnessCounts = withTaxa.map(s => s.taxonomy_record_count)
  const richMin = Math.min(...richnessCounts)
  const richMax = Math.max(...richnessCounts)

  const result = new Map<string, DistinctivenessBreakdown>()

  springs.forEach(s => {
    if (s.taxonomy_record_count === 0 || s.top_taxa.length === 0) {
      result.set(s.id, {
        score: 0, rarity_score: 0, evenness_score: 0, richness_score: 0,
        rare_taxa: [], top_taxon_pct: null, total_taxa: 0, has_taxonomy: false,
      })
      return
    }

    // ── Rarity score (50% weight) ─────────────────────────────────────────
    // Average rarity of top genus/species taxa; fall back to all ranks if none
    const genusTaxa = s.top_taxa.filter(t => genusLevelRanks.has(t.taxonomic_rank))
    const taxaForRarity = genusTaxa.length > 0 ? genusTaxa : s.top_taxa

    const rarityValues = taxaForRarity.map(t => {
      const count = taxonSpringCount[t.taxon_name] ?? 1
      return 1 - (count / N)
    })
    const rarity_score = Math.round(
      (rarityValues.reduce((a, b) => a + b, 0) / rarityValues.length) * 100
    )

    // Which of the top genera appear in ≤5 springs nationally?
    const rare_taxa = genusTaxa
      .filter(t => (taxonSpringCount[t.taxon_name] ?? 1) <= 5)
      .map(t => t.taxon_name)

    // ── Evenness score (25% weight) ───────────────────────────────────────
    // Fraction of top-10 reads held by the single most abundant taxon.
    // Lower dominance → higher evenness → higher score.
    const sortedBySize = [...s.top_taxa].sort((a, b) => b.size - a.size)
    const totalReads = sortedBySize.reduce((sum, t) => sum + t.size, 0)
    const topTaxonPct = totalReads > 0 ? sortedBySize[0].size / totalReads : null
    const evenness_score = topTaxonPct !== null
      ? Math.round((1 - topTaxonPct) * 100)
      : 50

    // ── Richness score (25% weight) ───────────────────────────────────────
    const richness_score = richMax > richMin
      ? Math.round(((s.taxonomy_record_count - richMin) / (richMax - richMin)) * 100)
      : 50

    // ── Composite ────────────────────────────────────────────────────────
    const score = Math.round(rarity_score * 0.5 + evenness_score * 0.25 + richness_score * 0.25)

    result.set(s.id, {
      score,
      rarity_score,
      evenness_score,
      richness_score,
      rare_taxa,
      top_taxon_pct: topTaxonPct !== null ? Math.round(topTaxonPct * 100) : null,
      total_taxa: s.taxonomy_record_count,
      has_taxonomy: true,
    })
  })

  _distinctiveness = result
  return result
}

export function getDistinctivenessBreakdown(id: string): DistinctivenessBreakdown | null {
  return computeAllDistinctiveness().get(id) ?? null
}

export function getUniqueAnalytes(): { analyte: string; count: number }[] {
  const counts: Record<string, number> = {}
  getAllSprings().forEach(s => {
    s.top_chemistry.forEach(c => {
      counts[c.analyte] = (counts[c.analyte] ?? 0) + 1
    })
  })
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([analyte, count]) => ({ analyte, count }))
}
