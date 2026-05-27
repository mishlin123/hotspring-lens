// Bearing and distance functions from the HotSpring Lens build plan (section 9)

export function bearingDegrees(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number
): number {
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLng = toRad(toLng - fromLng)
  const lat1 = toRad(fromLat)
  const lat2 = toRad(toLat)
  const y = Math.sin(dLng) * Math.cos(lat2)
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng)
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360
}

export function haversineDistanceMeters(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number
): number {
  const R = 6_371_000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(toLat - fromLat)
  const dLng = toRad(toLng - fromLng)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(fromLat)) * Math.cos(toRad(toLat)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function normaliseAngle180(angle: number): number {
  let a = angle % 360
  if (a > 180) a -= 360
  if (a < -180) a += 360
  return a
}

export function projectPoiToScreen(args: {
  springBearing: number
  deviceHeading: number
  screenWidth: number
  horizontalFov: number
}): { visible: boolean; x: number; relativeBearing: number } {
  const { springBearing, deviceHeading, screenWidth, horizontalFov } = args
  const relativeBearing = normaliseAngle180(springBearing - deviceHeading)
  const visible = Math.abs(relativeBearing) <= horizontalFov / 2
  const x =
    screenWidth / 2 + (relativeBearing / (horizontalFov / 2)) * (screenWidth / 2)
  return { visible, x, relativeBearing }
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`
  return `${(meters / 1000).toFixed(1)}km`
}
