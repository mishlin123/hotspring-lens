import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { useRouter } from 'expo-router'
import type { SpringSummary } from '@/lib/types'

function tempColor(temp: number | null): string {
  if (temp === null) return '#94a3b8'
  if (temp >= 80) return '#ef4444'
  if (temp >= 60) return '#f97316'
  if (temp >= 40) return '#eab308'
  return '#22c55e'
}

interface Props {
  spring: SpringSummary
  distanceLabel?: string
  onClose: () => void
}

export default function SpringSummaryPanel({ spring, distanceLabel, onClose }: Props) {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.handle} />
      </View>

      <View style={styles.content}>
        {spring.image_url ? (
          <Image source={{ uri: spring.image_url }} style={styles.image} resizeMode="cover" />
        ) : null}

        <View style={styles.info}>
          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: '#ccfbf1' }]}>
              <Text style={[styles.badgeText, { color: '#115e59' }]}>
                {spring.geothermal_system}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: '#f1f5f9' }]}>
              <Text style={[styles.badgeText, { color: '#475569' }]}>{spring.feature_type}</Text>
            </View>
          </View>

          <Text style={styles.name} numberOfLines={2}>
            {spring.name}
          </Text>
          <Text style={styles.location} numberOfLines={1}>
            {spring.location_text}
          </Text>

          <View style={styles.metrics}>
            {spring.temperature_c !== null && (
              <View style={[styles.metric, { backgroundColor: tempColor(spring.temperature_c) + '20' }]}>
                <Text style={[styles.metricText, { color: tempColor(spring.temperature_c) }]}>
                  {spring.temperature_c}°C
                </Text>
              </View>
            )}
            {spring.ph !== null && (
              <View style={[styles.metric, { backgroundColor: '#eff6ff' }]}>
                <Text style={[styles.metricText, { color: '#1d4ed8' }]}>pH {spring.ph}</Text>
              </View>
            )}
            {distanceLabel ? (
              <View style={[styles.metric, { backgroundColor: '#f8fafc' }]}>
                <Text style={[styles.metricText, { color: '#64748b' }]}>{distanceLabel}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeBtnText}>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.detailBtn}
          onPress={() => {
            onClose()
            router.push(`/spring/${spring.id}`)
          }}
        >
          <Text style={styles.detailBtnText}>View full profile →</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 6,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e2e8f0',
  },
  content: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  info: {
    flex: 1,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },
  location: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
  },
  metrics: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  metric: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  metricText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
  },
  closeBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  detailBtn: {
    flex: 2,
    backgroundColor: '#0d9488',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  detailBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
})
