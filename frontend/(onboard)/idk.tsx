import { ScrollView, Text, View } from 'react-native';
export default function Terms() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#000' }}
      contentContainerStyle={{ padding: 16 }}>
      <Text style={{ color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 12 }}>
        Terms & Conditions
      </Text>
      <Text style={{ color: '#CFCFCF', lineHeight: 22 }}>bobbt</Text>
    </ScrollView>
  );
}
