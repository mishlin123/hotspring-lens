import type { Spring, SpringSummary } from './types'

// Bundled via Metro — watchFolders in metro.config.js extends reach to monorepo root
// eslint-disable-next-line @typescript-eslint/no-require-imports
const raw = require('../../../data/processed/springs_app_dataset_full.json') as Spring[]

export const ALL_SPRINGS: Spring[] = raw

export const ALL_SUMMARIES: SpringSummary[] = raw.map(s => ({
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
}))

export function getSpringById(id: string): Spring | undefined {
  return ALL_SPRINGS.find(s => s.id === id)
}

export function getUniqueGeothermalSystems(): string[] {
  return [...new Set(ALL_SPRINGS.map(s => s.geothermal_system).filter(Boolean))].sort()
}

export function getUniqueFeatureTypes(): string[] {
  return [...new Set(ALL_SPRINGS.map(s => s.feature_type).filter(Boolean))].sort()
}
