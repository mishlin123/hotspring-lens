import { View, Text, StyleSheet } from 'react-native'

export default function SafetyBanner() {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠</Text>
      <Text style={styles.text}>
        Hot springs can cause serious injury or death. Stay on marked paths and never cross
        barriers.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fffbeb',
    borderBottomWidth: 1,
    borderBottomColor: '#fcd34d',
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  icon: {
    fontSize: 14,
    color: '#d97706',
    marginTop: 1,
  },
  text: {
    flex: 1,
    fontSize: 12,
    color: '#92400e',
    lineHeight: 17,
  },
})
