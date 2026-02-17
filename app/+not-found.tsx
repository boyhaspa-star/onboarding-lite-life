import { Stack, router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPinOff } from 'lucide-react-native';
import { EmptyState } from '@/components';
import { colors, typography, spacing } from '@/constants/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!', headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <EmptyState
          icon={<MapPinOff size={56} color={colors.brand.primary} />}
          title="Page not found"
          subtitle="The screen you're looking for doesn't exist or has been moved."
          actionLabel="Go Home"
          onAction={() => router.replace('/')}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
});
