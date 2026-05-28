import path from 'path'
import { readFileSync } from 'fs'
import type { Spring, SpringSummary } from './types'

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
