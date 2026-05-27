import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import type { SpringSummary } from '@/lib/types'
import { formatDistance } from '@/lib/geo'

function tempColor(temp: number | null): string {
  if (temp === null) return '#94a3b8'
  if (temp >= 80) return '#ef4444'
  if (temp >= 60) return '#f97316'
  if (temp >= 40) return '#eab308'
  return '#22c55e'
}

interface Props {
  spring: SpringSummary
  x: number
  distanceMeters: number
  screenHeight: number
}

const LABEL_WIDTH = 140

export default function CameraSpringLabel({ spring, x, distanceMeters, screenHeight }: Props) {
  const router = useRouter()
  const labelY = screenHeight * 0.35

  return (
    <View
      style={[
        styles.container,
        {
          left: x - LABEL_WIDTH / 2,
          top: labelY,
          width: LABEL_WIDTH,
        },
      ]}
    >
      {/* Vertical pointer line */}
      <View style={styles.pointer} />

      <TouchableOpacity
        style={styles.label}
        onPress={() => router.push(`/spring/${spring.id}`)}
        activeOpacity={0.85}
      >
        <Text style={styles.name} numberOfLines={2}>
          {spring.name}
        </Text>
        <View style={styles.metrics}>
          {spring.temperature_c !== null && (
            <View style={[styles.dot, { backgroundColor: tempColor(spring.temperature_c) }]} />
          )}
          <Text style={styles.metricText}>
            {spring.temperature_c !== null ? `${spring.temperature_c}°C · ` : ''}
            {formatDistance(distanceMeters)}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
  },
  pointer: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  label: {
    backgroundColor: 'rgba(15, 118, 110, 0.92)',
    borderRadius: 8,
    padding: 8,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  name: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 3,
    lineHeight: 16,
  },
  metrics: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  metricText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 10,
    fontWeight: '500',
  },
})
