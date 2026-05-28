import { useState, useMemo, useRef, useCallback } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native'
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { ALL_SUMMARIES, getUniqueGeothermalSystems, getUniqueFeatureTypes } from '@/lib/data'
import SpringSummaryPanel from '@/components/SpringSummaryPanel'
import SafetyBanner from '@/components/SafetyBanner'
import type { SpringSummary } from '@/lib/types'

const SCREEN_WIDTH = Dimensions.get('window').width

type SortKey = 'nameAZ' | 'tempDesc' | 'tempAsc' | 'phAsc' | 'taxDesc'

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'nameAZ',   label: 'Name A–Z' },
  { key: 'tempDesc', label: 'Hottest first' },
  { key: 'tempAsc',  label: 'Coolest first' },
  { key: 'phAsc',    label: 'pH: lowest first' },
  { key: 'taxDesc',  label: 'Most taxonomy data' },
]

function tempColor(temp: number | null): string {
  if (temp === null) return '#94a3b8'
  if (temp >= 80) return '#ef4444'
  if (temp >= 60) return '#f97316'
  if (temp >= 40) return '#eab308'
  return '#22c55e'
}

const SYSTEMS = getUniqueGeothermalSystems()
const FEATURE_TYPES = getUniqueFeatureTypes()

function SpringListCard({ spring, onPress }: { spring: SpringSummary; onPress: () => void }) {
  return (
    <TouchableOpacity style={listStyles.card} onPress={onPress} activeOpacity={0.7}>
      {spring.image_url ? (
        <Image source={{ uri: spring.image_url }} style={listStyles.image} resizeMode="cover" />
      ) : (
        <View style={listStyles.imagePlaceholder}>
          <Text style={{ fontSize: 24 }}>♨</Text>
        </View>
      )}
      <View style={listStyles.info}>
        <Text style={listStyles.system}>{spring.geothermal_system}</Text>
        <Text style={listStyles.name} numberOfLines={2}>
          {spring.name}
        </Text>
        <View style={listStyles.pills}>
          {spring.temperature_c !== null && (
            <Text style={[listStyles.pill, { color: tempColor(spring.temperature_c) }]}>
              {spring.temperature_c}°C
            </Text>
          )}
          {spring.ph !== null && (
            <Text style={[listStyles.pill, { color: '#1d4ed8' }]}>pH {spring.ph}</Text>
          )}
          <Text style={[listStyles.pill, { color: '#64748b' }]}>{spring.feature_type}</Text>
        </View>
        {spring.taxonomy_record_count === 0 && (
          <Text style={listStyles.noTaxonomy}>No 16S taxonomy data</Text>
        )}
      </View>
    </TouchableOpacity>
  )
}

export default function ExploreScreen() {
  const router = useRouter()
  const mapRef = useRef<MapView>(null)

  const [view, setView] = useState<'map' | 'list'>('map')
  const [search, setSearch] = useState('')
  const [system, setSystem] = useState('')
  const [featureType, setFeatureType] = useState('')
  const [sortBy, setSortBy] = useState<SortKey>('nameAZ')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedSpring, setSelectedSpring] = useState<SpringSummary | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return ALL_SUMMARIES.filter(s => {
      if (q) {
        const match =
          s.name.toLowerCase().includes(q) ||
          (s.location_text ?? '').toLowerCase().includes(q) ||
          (s.geothermal_system ?? '').toLowerCase().includes(q)
        if (!match) return false
      }
      if (system && s.geothermal_system !== system) return false
      if (featureType && s.feature_type !== featureType) return false
      return true
    })
  }, [search, system, featureType])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    switch (sortBy) {
      case 'tempDesc': return arr.sort((a, b) => (b.temperature_c ?? -Infinity) - (a.temperature_c ?? -Infinity))
      case 'tempAsc':  return arr.sort((a, b) => (a.temperature_c ?? Infinity) - (b.temperature_c ?? Infinity))
      case 'phAsc':    return arr.sort((a, b) => (a.ph ?? Infinity) - (b.ph ?? Infinity))
      case 'taxDesc':  return arr.sort((a, b) => b.taxonomy_record_count - a.taxonomy_record_count)
      default:         return arr.sort((a, b) => a.name.localeCompare(b.name))
    }
  }, [filtered, sortBy])

  const hasFilters = search || system || featureType
  const hasActiveSort = sortBy !== 'nameAZ'
  const sortLabel = SORT_OPTIONS.find(o => o.key === sortBy)?.label ?? ''

  const clearFilters = useCallback(() => {
    setSearch('')
    setSystem('')
    setFeatureType('')
  }, [])

  const withCoords = useMemo(
    () => filtered.filter(s => s.latitude != null && s.longitude != null),
    [filtered]
  )

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <SafetyBanner />

      {/* Search bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search springs, systems…"
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity
          style={[styles.filterBtn, (system || featureType || hasActiveSort) && styles.filterBtnActive]}
          onPress={() => setShowFilters(true)}
        >
          <Text style={(system || featureType || hasActiveSort) ? styles.filterIconActive : styles.filterIcon}>
            ⚙
          </Text>
        </TouchableOpacity>
      </View>

      {/* Toolbar */}
      <View style={styles.toolbar}>
        <Text style={styles.count}>
          {filtered.length === ALL_SUMMARIES.length
            ? `${filtered.length} springs`
            : `${filtered.length} of ${ALL_SUMMARIES.length}`}
        </Text>
        {hasActiveSort && (
          <Text style={styles.sortIndicator} numberOfLines={1}>{sortLabel}</Text>
        )}
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, view === 'map' && styles.toggleBtnActive]}
            onPress={() => setView('map')}
          >
            <Text style={[styles.toggleText, view === 'map' && styles.toggleTextActive]}>Map</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, view === 'list' && styles.toggleBtnActive]}
            onPress={() => setView('list')}
          >
            <Text style={[styles.toggleText, view === 'list' && styles.toggleTextActive]}>
              List
            </Text>
          </TouchableOpacity>
        </View>
        {(hasFilters || hasActiveSort) ? (
          <TouchableOpacity onPress={() => { clearFilters(); setSortBy('nameAZ') }}>
            <Text style={styles.clearFilters}>Clear</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Map view */}
      {view === 'map' ? (
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_DEFAULT}
            style={styles.map}
            initialRegion={{
              latitude: -38.5,
              longitude: 176.2,
              latitudeDelta: 2.5,
              longitudeDelta: 2.5,
            }}
          >
            {withCoords.map(s => (
              <Marker
                key={s.id}
                coordinate={{ latitude: s.latitude!, longitude: s.longitude! }}
                onPress={() => {
                  setSelectedSpring(s)
                  mapRef.current?.animateToRegion(
                    {
                      latitude: s.latitude! - 0.018,
                      longitude: s.longitude!,
                      latitudeDelta: 0.06,
                      longitudeDelta: 0.06,
                    },
                    350
                  )
                }}
                tracksViewChanges={false}
              >
                <View
                  pointerEvents="none"
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                    backgroundColor: tempColor(s.temperature_c),
                    borderWidth: 1.5,
                    borderColor: 'rgba(255,255,255,0.8)',
                  }}
                />
              </Marker>
            ))}
          </MapView>

          {/* Map legend */}
          <View style={styles.legend}>
            {[
              { label: '≥80°C', color: '#ef4444' },
              { label: '60–79°C', color: '#f97316' },
              { label: '40–59°C', color: '#eab308' },
              { label: '<40°C', color: '#22c55e' },
            ].map(l => (
              <View key={l.label} style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: l.color }]} />
                <Text style={styles.legendText}>{l.label}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : (
        /* List view */
        <FlatList
          data={sorted}
          keyExtractor={s => s.id}
          renderItem={({ item }) => (
            <SpringListCard
              spring={item}
              onPress={() => router.push(`/spring/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#f1f5f9' }} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>♨</Text>
              <Text style={styles.emptyText}>No springs match these filters</Text>
              <TouchableOpacity onPress={clearFilters}>
                <Text style={styles.emptyAction}>Clear filters</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {/* Spring summary panel */}
      <Modal
        visible={selectedSpring !== null && view === 'map'}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedSpring(null)}
      >
        <View style={styles.sheetBackdrop}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={() => setSelectedSpring(null)}
          />
          {selectedSpring && (
            <SpringSummaryPanel
              spring={selectedSpring}
              onClose={() => setSelectedSpring(null)}
            />
          )}
        </View>
      </Modal>

      {/* Filter + Sort modal */}
      <Modal visible={showFilters} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter & Sort</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Text style={styles.modalClose}>Done</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>

            {/* Sort */}
            <Text style={styles.filterLabel}>Sort by</Text>
            <View style={styles.chipRow}>
              {SORT_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt.key}
                  style={[styles.chip, sortBy === opt.key && styles.chipActive]}
                  onPress={() => setSortBy(opt.key)}
                >
                  <Text style={[styles.chipText, sortBy === opt.key && styles.chipTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Geothermal System */}
            <Text style={styles.filterLabel}>Geothermal System</Text>
            <View style={styles.chipRow}>
              <TouchableOpacity
                style={[styles.chip, !system && styles.chipActive]}
                onPress={() => setSystem('')}
              >
                <Text style={[styles.chipText, !system && styles.chipTextActive]}>All</Text>
              </TouchableOpacity>
              {SYSTEMS.map(s => (
                <TouchableOpacity
                  key={s}
                  style={[styles.chip, system === s && styles.chipActive]}
                  onPress={() => setSystem(system === s ? '' : s)}
                >
                  <Text style={[styles.chipText, system === s && styles.chipTextActive]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Feature Type */}
            <Text style={styles.filterLabel}>Feature Type</Text>
            <View style={styles.chipRow}>
              <TouchableOpacity
                style={[styles.chip, !featureType && styles.chipActive]}
                onPress={() => setFeatureType('')}
              >
                <Text style={[styles.chipText, !featureType && styles.chipTextActive]}>All</Text>
              </TouchableOpacity>
              {FEATURE_TYPES.map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.chip, featureType === t && styles.chipActive]}
                  onPress={() => setFeatureType(featureType === t ? '' : t)}
                >
                  <Text style={[styles.chipText, featureType === t && styles.chipTextActive]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {(hasFilters || hasActiveSort) && (
              <TouchableOpacity
                style={styles.clearAllBtn}
                onPress={() => { clearFilters(); setSortBy('nameAZ'); setShowFilters(false) }}
              >
                <Text style={styles.clearAllText}>Clear all filters &amp; sort</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 38,
    gap: 6,
  },
  searchIcon: { fontSize: 14 },
  searchInput: { flex: 1, fontSize: 15, color: '#1e293b' },
  clearBtn: { fontSize: 14, color: '#94a3b8', paddingHorizontal: 4 },
  filterBtn: {
    width: 38,
    height: 38,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnActive: { backgroundColor: '#ccfbf1' },
  filterIcon: { fontSize: 18, color: '#64748b' },
  filterIconActive: { fontSize: 18, color: '#0d9488' },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    gap: 8,
  },
  count: { fontSize: 13, color: '#64748b' },
  sortIndicator: {
    flex: 1,
    fontSize: 12,
    color: '#0d9488',
    fontWeight: '600',
  },
  viewToggle: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  toggleBtn: { paddingHorizontal: 14, paddingVertical: 5 },
  toggleBtnActive: { backgroundColor: '#0d9488' },
  toggleText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  toggleTextActive: { color: '#fff' },
  clearFilters: { fontSize: 13, color: '#0d9488', fontWeight: '600' },
  mapContainer: { flex: 1 },
  map: { flex: 1 },
  legend: {
    position: 'absolute',
    bottom: 16,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 10,
    padding: 8,
    gap: 4,
  },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, color: '#475569' },
  sheetBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  list: { paddingBottom: 24 },
  empty: { alignItems: 'center', paddingTop: 64 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: '#64748b', marginBottom: 8 },
  emptyAction: { fontSize: 14, color: '#0d9488', fontWeight: '600' },
  modalContainer: { flex: 1, backgroundColor: '#fff' },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: { fontSize: 17, fontWeight: '700', color: '#1e293b' },
  modalClose: { fontSize: 16, color: '#0d9488', fontWeight: '600' },
  modalBody: { padding: 16 },
  filterLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 16,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  chipActive: { backgroundColor: '#0d9488', borderColor: '#0d9488' },
  chipText: { fontSize: 13, color: '#475569' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  clearAllBtn: {
    marginTop: 24,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  clearAllText: { fontSize: 15, fontWeight: '600', color: '#64748b' },
})

const listStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
  },
  imagePlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  system: { fontSize: 11, color: '#0d9488', fontWeight: '700', marginBottom: 2 },
  name: { fontSize: 15, fontWeight: '700', color: '#1e293b', marginBottom: 4, lineHeight: 20 },
  pills: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  pill: { fontSize: 12, fontWeight: '600' },
  noTaxonomy: { fontSize: 11, color: '#94a3b8', fontStyle: 'italic', marginTop: 3 },
})
