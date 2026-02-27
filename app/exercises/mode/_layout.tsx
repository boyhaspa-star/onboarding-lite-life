import { Stack } from 'expo-router';
import { colors } from '@/constants/theme';

export default function ModeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background.primary },
        animation: 'fade',
      }}
    />
  );
}
