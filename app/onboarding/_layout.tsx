import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="gender" />
      <Stack.Screen name="birthday" />
      <Stack.Screen name="age" />
      <Stack.Screen name="fitnessLevel" />
      <Stack.Screen name="bodyParts" />
      <Stack.Screen name="week" />
      <Stack.Screen name="complete" />
    </Stack>
  );
}
