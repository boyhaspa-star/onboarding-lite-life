import { Stack } from 'expo-router';

export default function PreferenceLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0A0A0A' } }}>
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
