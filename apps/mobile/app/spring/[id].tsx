import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet, Linking } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getSpringById } from '@/lib/data'
import type { ChemistryRecord, TaxonRecord } from '@/lib/types'

// ── Rank badge colours ────────────────────────────────────────────────────────
const RANK_COLORS: Record<string, { bg: string; text: string }> = {
  domain:  { bg: '#ede9fe', text: '#5b21b6' },
  phylum:  { bg: '#dbeafe', text: '#1e40af' },
  class:   { bg: '#cffafe', text: '#164e63' },
  order:   { bg: '#ccfbf1', text: '#134e4a' },
  family:  { bg: '#dcfce7', text: '#14532d' },
  genus:   { bg: '#fef9c3', text: '#713f12' },
  species: { bg: '#ffedd5', text: '#7c2d12' },
}
function rankStyle(rank: string) {
  return RANK_COLORS[rank.toLowerCase()] ?? { bg: '#f1f5f9', text: '#475569' }
}

// Analytes reported in µM rather than mg/L
const MICRO_ANALYTES = new Set(['co', 'h2', 'ch4'])

// ── Context helpers ───────────────────────────────────────────────────────────
function phContext(ph: number | null): { label: string; color: string } | null {
  if (ph === null) return null
  if (ph < 2)  return { label: 'Strongly acidic', color: '#dc2626' }
  if (ph < 4)  return { label: 'Acidic',           color: '#ea580c' }
  if (ph < 6)  return { label: 'Weakly acidic',    color: '#ca8a04' }
  if (ph < 8)  return { label: 'Near neutral',      color: '#16a34a' }
  return              { label: 'Alkaline',           color: '#2563eb' }
}

function tempContext(temp: number | null): { label: string; color: string } | null {
  if (temp === null) return null
  if (temp >= 80) return { label: 'Extremely hot', color: '#dc2626' }
  if (temp >= 60) return { label: 'Very hot',       color: '#ea580c' }
  if (temp >= 40) return { label: 'Hot',            color: '#ca8a04' }
  return               { label: 'Warm',             color: '#16a34a' }
}

// ── Lineage formatting ────────────────────────────────────────────────────────
function formatLineage(lineage: string): string {
  return (lineage ?? '')
    .replace(/^root;\s*/, '')
    .split(';')
    .map(s => s.trim())
    .filter(Boolean)
    .join(' › ')
}

// ── Sub-components ────────────────────────────────────────────────────────────
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  )
}

function MeasRow({
  label,
  value,
  unit,
  context,
}: {
  label: string
  value: string | number | null | undefined
  unit?: string
  context?: { label: string; color: string } | null
}) {
  if (value === null || value === undefined || value === '') return null
  return (
    <View style={styles.measRow}>
      <Text style={styles.measLabel}>{label}</Text>
      <View style={styles.measRight}>
        <Text style={styles.measValue}>
          {String(value)}
          {unit ? <Text style={styles.measUnit}> {unit}</Text> : null}
        </Text>
        {context ? (
          <Text style={[styles.measContext, { color: context.color }]}>{context.label}</Text>
        ) : null}
      </View>
    </View>
  )
}

function AnalyteBar({ record, maxValue }: { record: ChemistryRecord; maxValue: number }) {
  const isMicro = MICRO_ANALYTES.has(record.analyte.toLowerCase())
  const unitLabel = isMicro ? 'µM' : 'mg/L'
  const pct = maxValue > 0 ? (record.value / maxValue) * 100 : 0
  const formattedValue =
    record.value >= 100 ? record.value.toFixed(0)
    : record.value >= 1  ? record.value.toFixed(2)
    :                       record.value.toFixed(4)

  return (
    <View style={styles.analyteRow}>
      <Text style={styles.analyteName} numberOfLines={1}>
        {record.analyte.replace(/_/g, ' ')}
      </Text>
      <View style={styles.analyteBarRow}>
        <View style={styles.analyteBarTrack}>
          <View style={[styles.analyteBarFill, { width: `${Math.max(pct, 2)}%` as `${number}%` }]} />
        </View>
        <Text style={styles.analyteValueText}>
          {formattedValue} <Text style={styles.analyteUnitText}>{unitLabel}</Text>
        </Text>
      </View>
    </View>
  )
}

function TaxonRow({ taxon, maxReads }: { taxon: TaxonRecord; maxReads: number }) {
  const rs = rankStyle(taxon.taxonomic_rank)
  const pct = maxReads > 0 ? (taxon.size / maxReads) * 100 : 0
  const lineage = formatLineage(taxon.lineage)

  return (
    <View style={styles.taxonRow}>
      <View style={styles.taxonHeader}>
        <View style={[styles.rankBadge, { backgroundColor: rs.bg }]}>
          <Text style={[styles.rankText, { color: rs.text }]}>{taxon.taxonomic_rank}</Text>
        </View>
        <Text style={styles.taxonName} numberOfLines={1}>
          {taxon.taxon_name.replace(/_/g, ' ')}
        </Text>
        <Text style={styles.taxonCount}>{taxon.size.toLocaleString()}</Text>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${Math.max(pct, 1)}%` as `${number}%` }]} />
      </View>
      {lineage ? (
        <Text style={styles.taxonLineage} numberOfLines={2}>{lineage}</Text>
      ) : null}
    </View>
  )
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function SpringDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const spring = getSpringById(id)

  if (!spring) {
    return (
      <SafeAreaView style={styles.notFound}>
        <Text style={styles.notFoundText}>Spring not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>← Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  // Partition chemistry records by unit scale
  const mgLRecords  = spring.top_chemistry.filter(r => !MICRO_ANALYTES.has(r.analyte.toLowerCase()))
  const microRecords = spring.top_chemistry.filter(r => MICRO_ANALYTES.has(r.analyte.toLowerCase()))
  const maxMgL  = Math.max(...mgLRecords.map(r => r.value),  0)
  const maxMicro = Math.max(...microRecords.map(r => r.value), 0)

  const maxReads = Math.max(...spring.top_taxa.map(t => t.size), 1)

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Safety warning */}
      {spring.safety_warning && (
        <View style={styles.safetyBanner}>
          <Text style={styles.safetyIcon}>⚠</Text>
          <Text style={styles.safetyText}>{spring.safety_warning}</Text>
        </View>
      )}

      {/* Hero image */}
      {spring.large_image_url ? (
        <Image source={{ uri: spring.large_image_url }} style={styles.hero} resizeMode="cover" />
      ) : null}

      {/* Title block */}
      <View style={styles.titleBlock}>
        <View style={styles.badges}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{spring.geothermal_system}</Text>
          </View>
          <View style={[styles.badge, styles.badgeGrey]}>
            <Text style={[styles.badgeText, { color: '#475569' }]}>{spring.feature_type}</Text>
          </View>
          <View style={[styles.badge, styles.badgeMono]}>
            <Text style={[styles.badgeText, styles.badgeMonoText]}>{spring.sample_number}</Text>
          </View>
        </View>
        <Text style={styles.title}>{spring.name}</Text>
        <Text style={styles.subtitle}>{spring.location_text}</Text>
      </View>

      {/* Site description */}
      {spring.description ? (
        <SectionCard title="Site description">
          <Text style={styles.description}>{spring.description}</Text>
          {spring.sample_date ? (
            <Text style={styles.meta}>Sampled: {spring.sample_date}</Text>
          ) : null}
        </SectionCard>
      ) : null}

      {/* Physical measurements */}
      <SectionCard title="Physical measurements">
        <MeasRow label="Temperature" value={spring.temperature_c} unit="°C" context={tempContext(spring.temperature_c)} />
        <MeasRow label="pH" value={spring.ph} context={phContext(spring.ph)} />
        <MeasRow label="ORP" value={spring.oxidation_reduction_potential_mv} unit="mV" />
        <MeasRow label="Conductivity" value={spring.conductivity_us_cm} unit="µS/cm" />
        <MeasRow label="Dissolved oxygen" value={spring.dissolved_oxygen_mg_l} unit="mg/L" />
        <MeasRow label="Turbidity" value={spring.turbidity_fnu} unit="FNU" />
        <MeasRow label="Ebullition (bubbling)" value={spring.ebullition} />
        <MeasRow label="Size (approx.)" value={spring.size_approx} />
      </SectionCard>

      {/* Water chemistry */}
      <SectionCard title="Water chemistry">
        {spring.top_chemistry.length === 0 ? (
          <Text style={styles.noDataText}>No chemistry records for this spring.</Text>
        ) : (
          <>
            <Text style={styles.sectionMeta}>
              Top {spring.top_chemistry.length} analytes · {spring.chemistry_record_count} total records
            </Text>

            {mgLRecords.length > 0 && (
              <>
                {mgLRecords.map((r, i) => (
                  <AnalyteBar key={i} record={r} maxValue={maxMgL} />
                ))}
              </>
            )}

            {microRecords.length > 0 && (
              <>
                <Text style={styles.unitGroupLabel}>Dissolved gases (µM scale)</Text>
                {microRecords.map((r, i) => (
                  <AnalyteBar key={i} record={r} maxValue={maxMicro} />
                ))}
              </>
            )}
          </>
        )}
      </SectionCard>

      {/* Microbial diversity */}
      <SectionCard title="Microbial diversity">
        {spring.top_taxa.length === 0 ? (
          <Text style={styles.noDataText}>No 16S rRNA taxonomy data for this spring.</Text>
        ) : (
          <>
            <Text style={styles.sectionMeta}>
              Top {spring.top_taxa.length} taxa · {spring.taxonomy_record_count} taxonomy records
            </Text>
            <Text style={styles.taxaDisclaimer}>
              Sequence read counts — <Text style={styles.bold}>not cell abundance</Text>. Identifications span domain to genus; species-level not claimed.
            </Text>
            {spring.top_taxa.map((taxon, i) => (
              <TaxonRow key={i} taxon={taxon} maxReads={maxReads} />
            ))}
          </>
        )}
      </SectionCard>

      {/* Source & Attribution */}
      <SectionCard title="Source & Attribution">
        <Text style={styles.attrLabel}>Source</Text>
        <TouchableOpacity onPress={() => Linking.openURL(spring.source_url)}>
          <Text style={styles.link}>{spring.source_url}</Text>
        </TouchableOpacity>

        <Text style={[styles.attrLabel, { marginTop: 10 }]}>Attribution</Text>
        <Text style={styles.attrValue}>{spring.attribution}</Text>
        <Text style={styles.attrMeta}>
          This record reflects conditions at a single sampling event and may not represent current
          conditions.
        </Text>

        <Text style={[styles.attrLabel, { marginTop: 10 }]}>Licence</Text>
        <TouchableOpacity
          onPress={() => Linking.openURL('https://creativecommons.org/licenses/by-nc-sa/4.0/')}
        >
          <Text style={styles.link}>{spring.licence}</Text>
        </TouchableOpacity>
      </SectionCard>
    </ScrollView>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { paddingBottom: 40 },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' },
  notFoundText: { fontSize: 18, color: '#64748b', marginBottom: 12 },
  backLink: { fontSize: 15, color: '#0d9488', fontWeight: '600' },

  safetyBanner: {
    backgroundColor: '#fffbeb',
    borderBottomWidth: 1,
    borderBottomColor: '#fcd34d',
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  safetyIcon: { fontSize: 16, color: '#d97706' },
  safetyText: { flex: 1, fontSize: 13, color: '#92400e', lineHeight: 18 },

  hero: { width: '100%', height: 220, backgroundColor: '#e2e8f0' },

  titleBlock: { paddingHorizontal: 16, paddingVertical: 14 },
  badges: { flexDirection: 'row', gap: 6, marginBottom: 8, flexWrap: 'wrap' },
  badge: { backgroundColor: '#ccfbf1', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  badgeGrey: { backgroundColor: '#f1f5f9' },
  badgeMono: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0' },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#115e59' },
  badgeMonoText: { fontFamily: 'monospace', color: '#64748b', fontWeight: '400' },
  title: { fontSize: 22, fontWeight: '800', color: '#1e293b', marginBottom: 4, lineHeight: 28 },
  subtitle: { fontSize: 14, color: '#64748b' },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0d9488',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  description: { fontSize: 14, color: '#475569', lineHeight: 20 },
  meta: { fontSize: 12, color: '#94a3b8', marginTop: 8 },
  sectionMeta: { fontSize: 12, color: '#94a3b8', marginBottom: 10 },
  noDataText: { fontSize: 13, color: '#94a3b8', fontStyle: 'italic' },

  // Physical measurements
  measRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  measLabel: { fontSize: 13, color: '#64748b', flex: 1, paddingTop: 1 },
  measRight: { alignItems: 'flex-end' },
  measValue: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  measUnit: { fontSize: 12, fontWeight: '400', color: '#94a3b8' },
  measContext: { fontSize: 11, fontWeight: '500', marginTop: 1 },

  // Chemistry analyte bars
  analyteRow: { marginBottom: 10 },
  analyteName: { fontSize: 12, color: '#64748b', textTransform: 'capitalize', marginBottom: 3 },
  analyteBarRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  analyteBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  analyteBarFill: { height: '100%', backgroundColor: '#0d9488', opacity: 0.75, borderRadius: 3 },
  analyteValueText: { fontSize: 12, fontWeight: '600', color: '#1e293b', minWidth: 80, textAlign: 'right' },
  analyteUnitText: { fontSize: 11, color: '#94a3b8', fontWeight: '400' },
  unitGroupLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 10,
    marginBottom: 8,
  },

  // Taxa
  taxaDisclaimer: {
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic',
    marginBottom: 12,
    lineHeight: 17,
  },
  bold: { fontWeight: '700', fontStyle: 'normal' },
  taxonRow: { marginBottom: 12 },
  taxonHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  rankBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  rankText: { fontSize: 10, fontWeight: '700' },
  taxonName: { flex: 1, fontSize: 13, fontWeight: '600', color: '#1e293b', fontStyle: 'italic' },
  taxonCount: { fontSize: 11, color: '#94a3b8' },
  barTrack: { height: 4, backgroundColor: '#f1f5f9', borderRadius: 2, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#0d9488', borderRadius: 2 },
  taxonLineage: { fontSize: 10, color: '#94a3b8', marginTop: 3, lineHeight: 14 },

  // Attribution
  attrLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 3,
  },
  attrValue: { fontSize: 13, color: '#475569', lineHeight: 18 },
  attrMeta: { fontSize: 11, color: '#94a3b8', lineHeight: 16, marginTop: 4, fontStyle: 'italic' },
  link: { fontSize: 13, color: '#0d9488', lineHeight: 18, textDecorationLine: 'underline' },
})
