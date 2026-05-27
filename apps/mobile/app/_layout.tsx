import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { DebugProvider } from '@/contexts/DebugContext'

export default function RootLayout() {
  return (
    <DebugProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#0f766e' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="spring/[id]"
          options={{
            title: 'Spring Profile',
            headerBackTitle: 'Back',
          }}
        />
      </Stack>
    </DebugProvider>
  )
}
