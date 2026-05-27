import { useState, useEffect, useRef, useMemo } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import * as Location from 'expo-location'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDebug } from '@/contexts/DebugContext'
import { ALL_SUMMARIES } from '@/lib/data'
import {
  bearingDegrees,
  haversineDistanceMeters,
  projectPoiToScreen,
  formatDistance,
} from '@/lib/geo'
import CameraSpringLabel from '@/components/CameraSpringLabel'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')
const HORIZONTAL_FOV = 70 // degrees — typical smartphone wide camera
const MAX_OVERLAY_SPRINGS = 12

export default function CameraScreen() {
  const { debugMode, mockLocation, mockHeading, overlayRadius } = useDebug()

  const [cameraPermission, requestCameraPermission] = useCameraPermissions()
  const [locationGranted, setLocationGranted] = useState(false)
  const [realLocation, setRealLocation] =
    useState<{ latitude: number; longitude: number } | null>(null)
  const [realHeading, setRealHeading] = useState(0)

  const locationSub = useRef<Location.LocationSubscription | null>(null)
  const headingSub = useRef<Location.LocationSubscription | null>(null)

  // Request location permission + subscribe
  useEffect(() => {
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') return
      setLocationGranted(true)

      locationSub.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 2000, distanceInterval: 5 },
        loc => setRealLocation(loc.coords)
      )
      headingSub.current = await Location.watchHeadingAsync(h => {
        setRealHeading(h.trueHeading ?? h.magHeading)
      })
    })()

    return () => {
      locationSub.current?.remove()
      headingSub.current?.remove()
    }
  }, [])

  const userLat = debugMode ? mockLocation.latitude : realLocation?.latitude ?? null
  const userLng = debugMode ? mockLocation.longitude : realLocation?.longitude ?? null
  // Always use the real device compass so pins track physical rotation.
  // Debug mode only fakes GPS coordinates — heading stays live.
  const heading = realHeading

  const visibleSprings = useMemo(() => {
    if (userLat === null || userLng === null) return []

    return ALL_SUMMARIES
      .filter(s => s.latitude != null && s.longitude != null)
      .map(s => {
        const dist = haversineDistanceMeters(userLat, userLng, s.latitude!, s.longitude!)
        const bearing = bearingDegrees(userLat, userLng, s.latitude!, s.longitude!)
        const proj = projectPoiToScreen({
          springBearing: bearing,
          deviceHeading: heading,
          screenWidth: SCREEN_WIDTH,
          horizontalFov: HORIZONTAL_FOV,
        })
        return { spring: s, dist, bearing, proj }
      })
      .filter(item => item.dist <= overlayRadius && item.proj.visible)
      .sort((a, b) => a.dist - b.dist)
      .slice(0, MAX_OVERLAY_SPRINGS)
  }, [userLat, userLng, heading, overlayRadius])

  // Permission not yet requested
  if (!cameraPermission) return <View style={styles.loading} />

  // Camera denied
  if (!cameraPermission.granted && !debugMode) {
    return (
      <SafeAreaView style={styles.permContainer}>
        <Text style={styles.permTitle}>Camera access needed</Text>
        <Text style={styles.permBody}>
          1000 Springs uses your camera to overlay spring information on your view.
        </Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestCameraPermission}>
          <Text style={styles.permBtnText}>Allow camera access</Text>
        </TouchableOpacity>
        <Text style={styles.permHint}>
          Or enable Debug Mode in the More tab to simulate the overlay without camera access.
        </Text>
      </SafeAreaView>
    )
  }

  // Location denied (real mode only)
  if (!locationGranted && !debugMode) {
    return (
      <SafeAreaView style={styles.permContainer}>
        <Text style={styles.permTitle}>Location access needed</Text>
        <Text style={styles.permBody}>
          Location is needed to find springs near you and calculate the compass overlay.
        </Text>
        <Text style={styles.permHint}>
          Enable Debug Mode in the More tab to test without real location.
        </Text>
      </SafeAreaView>
    )
  }

  // No real location yet (real mode only)
  const hasPosition = debugMode || (realLocation !== null)

  return (
    <View style={styles.container}>
      {/* Camera background or dark background in debug */}
      {cameraPermission.granted ? (
        <CameraView style={StyleSheet.absoluteFill} facing="back" />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.debugBackground]}>
          <Text style={styles.debugBgText}>📷 Camera preview (debug mode)</Text>
        </View>
      )}

      {/* Overlay: spring labels */}
      {hasPosition &&
        visibleSprings.map(({ spring, dist, proj }) => (
          <CameraSpringLabel
            key={spring.id}
            spring={spring}
            x={proj.x}
            distanceMeters={dist}
            screenHeight={SCREEN_HEIGHT}
          />
        ))}

      {/* No springs in view */}
      {hasPosition && visibleSprings.length === 0 && (
        <View style={styles.noSprings}>
          <Text style={styles.noSpringsText}>No springs in view</Text>
          <Text style={styles.noSpringsHint}>
            Try rotating or moving toward a geothermal area
          </Text>
        </View>
      )}

      {/* Compass + location HUD — bottom */}
      <View style={styles.hud}>
        {debugMode && (
          <View style={styles.debugPill}>
            <Text style={styles.debugPillText}>
              🔧 DEBUG · {mockLocation.name.split(',')[0]}
            </Text>
          </View>
        )}
        <View style={styles.hudRow}>
          <View style={styles.hudChip}>
            <Text style={styles.hudLabel}>Heading</Text>
            <Text style={styles.hudValue}>{Math.round(heading)}°</Text>
          </View>
          {hasPosition && (
            <View style={styles.hudChip}>
              <Text style={styles.hudLabel}>Location</Text>
              <Text style={styles.hudValue}>
                {userLat!.toFixed(3)}, {userLng!.toFixed(3)}
              </Text>
            </View>
          )}
          <View style={styles.hudChip}>
            <Text style={styles.hudLabel}>In view</Text>
            <Text style={styles.hudValue}>{visibleSprings.length}</Text>
          </View>
        </View>
      </View>

      {/* Safety notice at top */}
      <View style={styles.safetyStrip}>
        <Text style={styles.safetyStripText}>
          ⚠ Educational only — do not use for navigation
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  loading: { flex: 1, backgroundColor: '#0f172a' },
  debugBackground: {
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  debugBgText: { color: 'rgba(255,255,255,0.3)', fontSize: 16, marginTop: 80 },
  permContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  permTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  permBody: {
    color: '#94a3b8',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  permBtn: {
    backgroundColor: '#0d9488',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginBottom: 16,
  },
  permBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  permHint: { color: '#64748b', fontSize: 13, textAlign: 'center', lineHeight: 18 },
  safetyStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(120,53,15,0.85)',
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  safetyStripText: { color: '#fde68a', fontSize: 12, fontWeight: '600' },
  noSprings: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.45,
    left: 24,
    right: 24,
    alignItems: 'center',
  },
  noSpringsText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  noSpringsHint: { color: 'rgba(255,255,255,0.4)', fontSize: 13, textAlign: 'center' },
  hud: {
    position: 'absolute',
    bottom: 32,
    left: 16,
    right: 16,
    gap: 8,
  },
  debugPill: {
    alignSelf: 'center',
    backgroundColor: 'rgba(249,115,22,0.85)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  debugPillText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  hudRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  hudChip: {
    backgroundColor: 'rgba(15,118,110,0.85)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  hudLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, marginBottom: 2 },
  hudValue: { color: '#fff', fontSize: 14, fontWeight: '700' },
})
