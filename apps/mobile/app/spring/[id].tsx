import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet, Linking } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getSpringById } from '@/lib/data'

const RANK_COLORS: Record<string, { bg: string; text: string }> = {
  domain: { bg: '#ede9fe', text: '#5b21b6' },
  phylum: { bg: '#dbeafe', text: '#1e40af' },
  class: { bg: '#cffafe', text: '#164e63' },
  order: { bg: '#ccfbf1', text: '#134e4a' },
  family: { bg: '#dcfce7', text: '#14532d' },
  genus: { bg: '#fef9c3', text: '#713f12' },
  species: { bg: '#ffedd5', text: '#7c2d12' },
}
function rankStyle(rank: string) {
  return RANK_COLORS[rank.toLowerCase()] ?? { bg: '#f1f5f9', text: '#475569' }
}

const MICRO_ANALYTES = new Set(['co', 'h2', 'ch4'])

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
}: {
  label: string
  value: string | number | null | undefined
  unit?: string
}) {
  if (value === null || value === undefined || value === '') return null
  return (
    <View style={styles.measRow}>
      <Text style={styles.measLabel}>{label}</Text>
      <Text style={styles.measValue}>
        {String(value)}
        {unit ? <Text style={styles.measUnit}> {unit}</Text> : null}
      </Text>
    </View>
  )
}

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
        <Image
          source={{ uri: spring.large_image_url }}
          style={styles.hero}
          resizeMode="cover"
        />
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

      {/* Overview */}
      {spring.description ? (
        <SectionCard title="Overview">
          <Text style={styles.description}>{spring.description}</Text>
          {spring.sample_date ? (
            <Text style={styles.meta}>Sampled: {spring.sample_date}</Text>
          ) : null}
        </SectionCard>
      ) : null}

      {/* Physical measurements */}
      <SectionCard title="Physical Measurements">
        <MeasRow label="Temperature" value={spring.temperature_c} unit="°C" />
        <MeasRow label="pH" value={spring.ph} />
        <MeasRow label="Size (approx.)" value={spring.size_approx} />
        <MeasRow label="Ebullition" value={spring.ebullition} />
        <MeasRow label="ORP" value={spring.oxidation_reduction_potential_mv} unit="mV" />
        <MeasRow label="Conductivity" value={spring.conductivity_us_cm} unit="µS/cm" />
        <MeasRow label="Dissolved oxygen" value={spring.dissolved_oxygen_mg_l} unit="mg/L" />
        <MeasRow label="Turbidity" value={spring.turbidity_fnu} unit="FNU" />
      </SectionCard>

      {/* Chemical composition */}
      <SectionCard title="Chemical Composition">
        <Text style={styles.sectionMeta}>
          Top {spring.top_chemistry.length} analytes · {spring.chemistry_record_count} total records
        </Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.tableCellLeft, styles.tableHeaderText]}>Analyte</Text>
            <Text style={[styles.tableCell, styles.tableHeaderText]}>Value</Text>
            <Text style={[styles.tableCell, styles.tableHeaderText]}>Unit</Text>
          </View>
          {spring.top_chemistry.map((row, i) => (
            <View
              key={i}
              style={[styles.tableRow, i % 2 === 1 && styles.tableRowAlt]}
            >
              <Text style={[styles.tableCell, styles.tableCellLeft, styles.tableCellLabel]}>
                {row.analyte.replace(/_/g, ' ')}
              </Text>
              <Text style={[styles.tableCell, styles.tableCellMono]}>
                {row.value >= 100
                  ? row.value.toFixed(0)
                  : row.value >= 1
                  ? row.value.toFixed(2)
                  : row.value.toFixed(4)}
              </Text>
              <Text style={[styles.tableCell, styles.tableCellUnit]}>
                {MICRO_ANALYTES.has(row.analyte.toLowerCase()) ? 'µM' : 'mg/L'}
              </Text>
            </View>
          ))}
        </View>
      </SectionCard>

      {/* Microbial diversity */}
      <SectionCard title="Microbial Diversity">
        <Text style={styles.sectionMeta}>
          Top {spring.top_taxa.length} taxa · {spring.taxonomy_record_count} taxonomy records
        </Text>
        <Text style={styles.taxaDisclaimer}>
          Identifications span domain to genus — not species-level.
          Read counts, not cell counts.
        </Text>
        {spring.top_taxa.map((taxon, i) => {
          const rs = rankStyle(taxon.taxonomic_rank)
          const total = spring.top_taxa.reduce((s, t) => s + t.size, 0)
          const pct = total > 0 ? (taxon.size / total) * 100 : 0
          return (
            <View key={i} style={styles.taxonRow}>
              <View style={styles.taxonHeader}>
                <View style={[styles.rankBadge, { backgroundColor: rs.bg }]}>
                  <Text style={[styles.rankText, { color: rs.text }]}>
                    {taxon.taxonomic_rank}
                  </Text>
                </View>
                <Text style={styles.taxonName} numberOfLines={1}>
                  {taxon.taxon_name.replace(/_/g, ' ')}
                </Text>
                <Text style={styles.taxonCount}>{taxon.size.toLocaleString()}</Text>
              </View>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${Math.max(pct, 1)}%` }]} />
              </View>
            </View>
          )
        })}
      </SectionCard>

      {/* Source & Attribution */}
      <SectionCard title="Source & Attribution">
        <Text style={styles.attrLabel}>Source</Text>
        <TouchableOpacity onPress={() => Linking.openURL(spring.source_url)}>
          <Text style={styles.link}>{spring.source_url}</Text>
        </TouchableOpacity>

        <Text style={[styles.attrLabel, { marginTop: 10 }]}>Attribution</Text>
        <Text style={styles.attrValue}>{spring.attribution}</Text>

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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { paddingBottom: 40 },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
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
  badge: {
    backgroundColor: '#ccfbf1',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
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
    fontSize: 14,
    fontWeight: '800',
    color: '#0d9488',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  description: { fontSize: 14, color: '#475569', lineHeight: 20 },
  meta: { fontSize: 12, color: '#94a3b8', marginTop: 8 },
  sectionMeta: { fontSize: 12, color: '#94a3b8', marginBottom: 8 },
  measRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  measLabel: { fontSize: 13, color: '#64748b', flex: 1 },
  measValue: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  measUnit: { fontSize: 12, fontWeight: '400', color: '#94a3b8' },
  table: { borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#e2e8f0' },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  tableHeaderText: { fontSize: 11, fontWeight: '700', color: '#64748b', textTransform: 'uppercase' },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  tableRowAlt: { backgroundColor: '#f8fafc' },
  tableCell: { flex: 1, textAlign: 'right' },
  tableCellLeft: { textAlign: 'left', flex: 2 },
  tableCellLabel: { fontSize: 13, color: '#334155', textTransform: 'capitalize' },
  tableCellMono: { fontSize: 13, color: '#1e293b', fontFamily: 'monospace' },
  tableCellUnit: { fontSize: 12, color: '#94a3b8' },
  taxaDisclaimer: {
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic',
    marginBottom: 10,
    lineHeight: 17,
  },
  taxonRow: { marginBottom: 10 },
  taxonHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  rankBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  rankText: { fontSize: 10, fontWeight: '700' },
  taxonName: { flex: 1, fontSize: 13, fontWeight: '600', color: '#1e293b', fontStyle: 'italic' },
  taxonCount: { fontSize: 11, color: '#94a3b8' },
  barTrack: { height: 4, backgroundColor: '#f1f5f9', borderRadius: 2, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#0d9488', borderRadius: 2 },
  attrLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 3,
  },
  attrValue: { fontSize: 13, color: '#475569', lineHeight: 18 },
  link: { fontSize: 13, color: '#0d9488', lineHeight: 18, textDecorationLine: 'underline' },
})
