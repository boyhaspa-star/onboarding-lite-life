import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import HouseIcon from '@/components/icons/HouseIcon';
import WeightIcon from '@/components/icons/WeightIcon';
import AnalysisIcon from '@/components/icons/AnalysisIcon';
import ProfileIcon from '@/components/icons/ProfileIcon';
import { colors, spacing } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background.pure,
          borderTopColor: colors.background.surface,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.tabBar.active,
        tabBarInactiveTintColor: colors.tabBar.inactive,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <HouseIcon width={24} height={24} color={focused ? colors.text.inverse : colors.tabBar.inactive} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: 'Workout',
          tabBarIcon: ({ focused }) => (
            <WeightIcon width={24} height={24} color={focused ? colors.tabBar.active : colors.tabBar.inactive} />
          ),
        }}
      />
      <Tabs.Screen
        name="analysis"
        options={{
          title: 'Analysis',
          tabBarIcon: ({ focused }) => (
            <AnalysisIcon width={21} height={22} color={focused ? colors.tabBar.active : colors.tabBar.inactive} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <ProfileIcon width={28} height={28} color={focused ? colors.tabBar.active : colors.tabBar.inactive} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: spacing.iconContainer,
    height: spacing.iconContainer,
    borderRadius: spacing.iconContainer / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerActive: {
    backgroundColor: colors.brand.primary,
  },
});
