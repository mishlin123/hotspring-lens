import { Redirect } from 'expo-router'

// Root path → first tab
export default function Index() {
  return <Redirect href="/(tabs)/explore" />
}
