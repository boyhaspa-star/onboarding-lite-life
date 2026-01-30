import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}>
      <Stack.Screen name="gender" />
      <Stack.Screen name="age" />
      <Stack.Screen name="fitnessLevel" />
      <Stack.Screen name="bodyParts" />
      <Stack.Screen name="complete" />
    </Stack>
  );
}
