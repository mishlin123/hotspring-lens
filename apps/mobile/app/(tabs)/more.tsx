import { View, Text, ScrollView, Switch, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Slider from '@react-native-community/slider'
import { useDebug } from '@/contexts/DebugContext'
import { MOCK_LOCATIONS } from '@/lib/mockLocations'
import { ALL_SUMMARIES } from '@/lib/data'

export default function MoreScreen() {
  const {
    debugMode,
    setDebugMode,
    mockLocation,
    setMockLocation,
    overlayRadius,
    setOverlayRadius,
  } = useDebug()

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Debug mode section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SIMULATION MODE</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>Debug / Simulation Mode</Text>
                <Text style={styles.rowMeta}>
                  Fake GPS and heading for Christchurch testing
                </Text>
              </View>
              <Switch
                value={debugMode}
                onValueChange={setDebugMode}
                trackColor={{ false: '#e2e8f0', true: '#0d9488' }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {debugMode && (
          <>
            {/* Mock location picker */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>MOCK LOCATION</Text>
              <View style={styles.card}>
                {MOCK_LOCATIONS.map(loc => (
                  <TouchableOpacity
                    key={loc.name}
                    style={[
                      styles.locationRow,
                      mockLocation.name === loc.name && styles.locationRowActive,
                    ]}
                    onPress={() => setMockLocation(loc)}
                  >
                    <View
                      style={[
                        styles.radio,
                        mockLocation.name === loc.name && styles.radioActive,
                      ]}
                    />
                    <View style={styles.locationInfo}>
                      <Text
                        style={[
                          styles.locationName,
                          mockLocation.name === loc.name && styles.locationNameActive,
                        ]}
                      >
                        {loc.name}
                      </Text>
                      <Text style={styles.locationCoords}>
                        {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Overlay radius */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>OVERLAY RADIUS</Text>
              <View style={styles.card}>
                <View style={styles.sliderHeader}>
                  <Text style={styles.rowLabel}>Max overlay distance</Text>
                  <Text style={styles.sliderValue}>
                    {overlayRadius >= 1000
                      ? `${(overlayRadius / 1000).toFixed(1)} km`
                      : `${overlayRadius} m`}
                  </Text>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={200}
                  maximumValue={5000}
                  step={100}
                  value={overlayRadius}
                  onValueChange={setOverlayRadius}
                  minimumTrackTintColor="#0d9488"
                  maximumTrackTintColor="#e2e8f0"
                  thumbTintColor="#0d9488"
                />
              </View>
            </View>
          </>
        )}

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ABOUT</Text>
          <View style={styles.card}>
            <Text style={styles.aboutTitle}>1000 Springs</Text>
            <Text style={styles.aboutVersion}>v0.1.0 — Website + Mobile MVP</Text>
            <Text style={styles.aboutBody}>
              A free, non-commercial educational tool for exploring the geothermal springs of
              Aotearoa New Zealand. No ads, no subscriptions, no tracking.
            </Text>
            <View style={styles.divider} />
            <Text style={styles.aboutBody}>
              <Text style={styles.bold}>Data: </Text>
              {ALL_SUMMARIES.length} spring records from the 1000 Springs Project.
            </Text>
          </View>
        </View>

        {/* Attribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DATA & ATTRIBUTION</Text>
          <View style={styles.card}>
            <Text style={styles.attrLabel}>1000 Springs Project</Text>
            <Text style={styles.attrBody}>GNS Science and University of Waikato</Text>
            <Text style={styles.attrUrl}>https://1000springs.org.nz</Text>

            <View style={styles.divider} />

            <Text style={styles.attrLabel}>Licence</Text>
            <Text style={styles.attrBody}>
              Creative Commons Attribution–NonCommercial–ShareAlike 4.0 International (CC BY-NC-SA
              4.0)
            </Text>

          </View>
        </View>

        {/* Safety */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SAFETY</Text>
          <View style={[styles.card, styles.safetyCard]}>
            <Text style={styles.safetyTitle}>⚠ Hot springs are dangerous</Text>
            <Text style={styles.safetyBody}>
              Hot springs can cause serious injury or death. Stay on marked paths, follow local
              signs, never cross barriers, and do not use this app for navigation. Always follow
              posted safety instructions.
            </Text>
            <Text style={styles.safetyEmergency}>
              NZ Emergency: <Text style={styles.bold}>111</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16, gap: 4, paddingBottom: 32 },
  section: { marginBottom: 8 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 6,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowText: { flex: 1, marginRight: 12 },
  rowLabel: { fontSize: 15, fontWeight: '600', color: '#1e293b' },
  rowMeta: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  locationRowActive: { backgroundColor: '#f0fdfa', marginHorizontal: -16, paddingHorizontal: 16 },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#cbd5e1',
  },
  radioActive: { borderColor: '#0d9488', backgroundColor: '#0d9488' },
  locationInfo: { flex: 1 },
  locationName: { fontSize: 14, fontWeight: '600', color: '#334155' },
  locationNameActive: { color: '#0d9488' },
  locationCoords: { fontSize: 11, color: '#94a3b8', marginTop: 1, fontFamily: 'monospace' },
  sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  sliderValue: { fontSize: 15, fontWeight: '700', color: '#0d9488' },
  slider: { marginHorizontal: -8 },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -4 },
  sliderLabel: { fontSize: 10, color: '#94a3b8' },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 10 },
  aboutTitle: { fontSize: 18, fontWeight: '800', color: '#0f766e', marginBottom: 2 },
  aboutVersion: { fontSize: 12, color: '#94a3b8', marginBottom: 10 },
  aboutBody: { fontSize: 14, color: '#475569', lineHeight: 20 },
  bold: { fontWeight: '700' },
  attrLabel: { fontSize: 12, fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 2 },
  attrBody: { fontSize: 13, color: '#475569', lineHeight: 18, marginBottom: 2 },
  attrUrl: { fontSize: 12, color: '#0d9488', marginBottom: 2 },
  safetyCard: { backgroundColor: '#fffbeb', borderColor: '#fcd34d' },
  safetyTitle: { fontSize: 15, fontWeight: '700', color: '#92400e', marginBottom: 8 },
  safetyBody: { fontSize: 13, color: '#78350f', lineHeight: 19, marginBottom: 8 },
  safetyEmergency: { fontSize: 14, color: '#92400e' },
})
