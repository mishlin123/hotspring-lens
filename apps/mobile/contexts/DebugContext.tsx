import React, { createContext, useContext, useState } from 'react'
import { DEFAULT_MOCK_LOCATION, type MockLocation } from '@/lib/mockLocations'

interface DebugState {
  debugMode: boolean
  setDebugMode: (v: boolean) => void
  mockLocation: MockLocation
  setMockLocation: (v: MockLocation) => void
  mockHeading: number
  setMockHeading: (v: number) => void
  overlayRadius: number
  setOverlayRadius: (v: number) => void
}

const DebugContext = createContext<DebugState>({
  debugMode: false,
  setDebugMode: () => {},
  mockLocation: DEFAULT_MOCK_LOCATION,
  setMockLocation: () => {},
  mockHeading: 0,
  setMockHeading: () => {},
  overlayRadius: 2000,
  setOverlayRadius: () => {},
})

export function DebugProvider({ children }: { children: React.ReactNode }) {
  const [debugMode, setDebugMode] = useState(false)
  const [mockLocation, setMockLocation] = useState<MockLocation>(DEFAULT_MOCK_LOCATION)
  const [mockHeading, setMockHeading] = useState(45)
  const [overlayRadius, setOverlayRadius] = useState(2000)

  return (
    <DebugContext.Provider
      value={{
        debugMode,
        setDebugMode,
        mockLocation,
        setMockLocation,
        mockHeading,
        setMockHeading,
        overlayRadius,
        setOverlayRadius,
      }}
    >
      {children}
    </DebugContext.Provider>
  )
}

export function useDebug() {
  return useContext(DebugContext)
}
