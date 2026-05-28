export interface ChemistryRecord {
  analyte: string
  value: number
  unit_note: string
  sample_number: string
}

export interface TaxonRecord {
  taxon_name: string
  taxonomic_rank: string
  size: number
  lineage: string
  sample_number: string
}

export interface Spring {
  id: string
  name: string
  source_url: string
  geothermal_system: string
  latitude: number | null
  longitude: number | null
  location_text: string
  description: string
  sample_number: string
  sample_date: string
  feature_type: string
  temperature_c: number | null
  ph: number | null
  size_approx: string | null
  ebullition: string | null
  oxidation_reduction_potential_mv: number | null
  conductivity_us_cm: number | null
  dissolved_oxygen_mg_l: number | null
  turbidity_fnu: number | null
  image_url: string | null
  large_image_url: string | null
  safety_warning: string | null
  chemistry_record_count: number
  taxonomy_record_count: number
  top_chemistry: ChemistryRecord[]
  top_taxa: TaxonRecord[]
  licence: string
  attribution: string
  built_at_utc: string
}

export interface SpringSummary {
  id: string
  name: string
  geothermal_system: string
  feature_type: string
  temperature_c: number | null
  ph: number | null
  latitude: number | null
  longitude: number | null
  location_text: string
  image_url: string | null
  safety_warning: string | null
  chemistry_record_count: number
  taxonomy_record_count: number
  analytes: string[]
}
