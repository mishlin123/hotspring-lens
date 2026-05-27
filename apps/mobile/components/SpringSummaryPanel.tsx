import { useEffect, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native'
import { useRouter } from 'expo-router'
import type { SpringSummary } from '@/lib/types'

const SCREEN_HEIGHT = Dimensions.get('window').height
const SHEET_HEIGHT = Math.round(SCREEN_HEIGHT * 0.5)

function tempColor(temp: number | null): string {
  if (temp === null) return '#94a3b8'
  if (temp >= 80) return '#ef4444'
  if (temp >= 60) return '#f97316'
  if (temp >= 40) return '#eab308'
  return '#22c55e'
}

interface Props {
  spring: SpringSummary
  onClose: () => void
}

export default function SpringSummaryPanel({ spring, onClose }: Props) {
  const router = useRouter()
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current

  // Slide up on mount
  useEffect(() => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 60,
      friction: 12,
    }).start()
  }, [])

  const tColor = tempColor(spring.temperature_c)

  return (
    <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
      {/* Drag handle */}
      <View style={styles.handleBar}>
        <View style={styles.handle} />
      </View>

      {/* Scrollable body */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Image + identity row */}
        <View style={styles.topRow}>
          {spring.image_url ? (
            <Image source={{ uri: spring.image_url }} style={styles.thumb} resizeMode="cover" />
          ) : (
            <View style={[styles.thumbPlaceholder, { backgroundColor: tColor + '22' }]}>
              <Text style={styles.thumbIcon}>♨</Text>
            </View>
          )}

          <View style={styles.identity}>
            <View style={styles.badgeRow}>
              {spring.geothermal_system ? (
                <View style={styles.badgeTeal}>
                  <Text style={styles.badgeTealText} numberOfLines={1}>
                    {spring.geothermal_system}
                  </Text>
                </View>
              ) : null}
              {spring.feature_type ? (
                <View style={styles.badgeGray}>
                  <Text style={styles.badgeGrayText}>{spring.feature_type}</Text>
                </View>
              ) : null}
            </View>
            <Text style={styles.name} numberOfLines={3}>
              {spring.name}
            </Text>
          </View>
        </View>

        {/* Location */}
        {spring.location_text ? (
          <View style={styles.locationRow}>
            <Text style={styles.locationPin}>📍</Text>
            <Text style={styles.locationText} numberOfLines={2}>
              {spring.location_text}
            </Text>
          </View>
        ) : null}

        {/* Metric chips */}
        {(spring.temperature_c !== null || spring.ph !== null) && (
          <View style={styles.metrics}>
            {spring.temperature_c !== null && (
              <View style={[styles.chip, { backgroundColor: tColor + '18' }]}>
                <Text style={styles.chipLabel}>Temp</Text>
                <Text style={[styles.chipValue, { color: tColor }]}>
                  {spring.temperature_c}°C
                </Text>
              </View>
            )}
            {spring.ph !== null && (
              <View style={[styles.chip, { backgroundColor: '#eff6ff' }]}>
                <Text style={styles.chipLabel}>pH</Text>
                <Text style={[styles.chipValue, { color: '#1d4ed8' }]}>{spring.ph}</Text>
              </View>
            )}
          </View>
        )}

        {/* Safety warning */}
        {spring.safety_warning ? (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>⚠ {spring.safety_warning}</Text>
          </View>
        ) : null}
      </ScrollView>

      {/* Sticky action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
          <Text style={styles.closeBtnText}>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.profileBtn}
          activeOpacity={0.85}
          onPress={() => {
            onClose()
            router.push(`/spring/${spring.id}`)
          }}
        >
          <Text style={styles.profileBtnText}>Full profile →</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  sheet: {
    height: SHEET_HEIGHT,
    backgroundColor: '#fff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 20,
  },
  handleBar: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e2e8f0',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 12,
  },
  topRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  thumb: {
    width: 88,
    height: 88,
    borderRadius: 12,
    flexShrink: 0,
    backgroundColor: '#f1f5f9',
  },
  thumbPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: 12,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbIcon: { fontSize: 32 },
  identity: { flex: 1, paddingTop: 2 },
  badgeRow: {
    flexDirection: 'row',
    gap: 5,
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  badgeTeal: {
    backgroundColor: '#ccfbf1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    maxWidth: 180,
  },
  badgeTealText: { fontSize: 10, fontWeight: '700', color: '#115e59' },
  badgeGray: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeGrayText: { fontSize: 10, fontWeight: '600', color: '#475569' },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 21,
  },
  locationRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'flex-start',
  },
  locationPin: { fontSize: 13, marginTop: 1 },
  locationText: {
    flex: 1,
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  metrics: {
    flexDirection: 'row',
    gap: 10,
  },
  chip: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  chipLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  chipValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  warningBox: {
    backgroundColor: '#fffbeb',
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  warningText: {
    fontSize: 12,
    color: '#92400e',
    lineHeight: 17,
  },
  actions: {
    flexDirection: 'row',
    padding: 12,
    paddingBottom: 20,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  closeBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  closeBtnText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
  profileBtn: {
    flex: 2,
    backgroundColor: '#0d9488',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  profileBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
})
