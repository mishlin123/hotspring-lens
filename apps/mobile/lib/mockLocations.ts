export interface MockLocation {
  name: string
  latitude: number
  longitude: number
}

export const MOCK_LOCATIONS: MockLocation[] = [
  { name: 'Te Whakarewarewa, Rotorua', latitude: -38.1631, longitude: 176.2542 },
  { name: 'Waiotapu Thermal Wonderland', latitude: -38.338, longitude: 176.368 },
  { name: 'Waimangu Volcanic Valley', latitude: -38.237, longitude: 176.338 },
  { name: 'Wairakei-Tauhara', latitude: -38.628, longitude: 176.098 },
  { name: 'Orakei Korako', latitude: -38.469, longitude: 176.146 },
  { name: 'Tokaanu', latitude: -38.975, longitude: 175.764 },
]

export const DEFAULT_MOCK_LOCATION = MOCK_LOCATIONS[0]
