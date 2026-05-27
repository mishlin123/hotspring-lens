import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useDebug } from '@/contexts/DebugContext'
import { View, Text, StyleSheet } from 'react-native'

function TabIcon({
  name,
  color,
  debugActive,
}: {
  name: keyof typeof Ionicons.glyphMap
  color: string
  debugActive?: boolean
}) {
  return (
    <View>
      <Ionicons name={name} size={24} color={color} />
      {debugActive && <View style={styles.debugDot} />}
    </View>
  )
}

export default function TabsLayout() {
  const { debugMode } = useDebug()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0d9488',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#e2e8f0' },
        headerStyle: { backgroundColor: '#0f766e' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700', fontSize: 17 },
      }}
    >
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <TabIcon name="map-outline" color={color} />,
          headerTitle: '1000 Springs',
          headerRight: () =>
            debugMode ? (
              <Text style={styles.debugBadge}>DEBUG</Text>
            ) : null,
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Camera',
          tabBarIcon: ({ color }) => (
            <TabIcon name="camera-outline" color={color} debugActive={debugMode} />
          ),
          headerTitle: 'Camera Explorer',
          headerRight: () =>
            debugMode ? (
              <Text style={styles.debugBadge}>DEBUG</Text>
            ) : null,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color }) => <TabIcon name="ellipsis-horizontal-outline" color={color} />,
          headerTitle: 'About & Settings',
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  debugDot: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f97316',
  },
  debugBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#f97316',
    marginRight: 12,
    backgroundColor: 'rgba(249,115,22,0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
})
