import { Tabs } from 'expo-router';
import HouseIcon from '@/components/icons/HouseIcon';
import WeightIcon from '@/components/icons/WeightIcon';
import AnalysisIcon from '@/components/icons/AnalysisIcon';
import ProfileIcon from '@/components/icons/ProfileIcon';
import { colors } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      sceneStyle={{ backgroundColor: '#0A0A0A' }}
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
            <HouseIcon width={24} height={24} color={focused ? colors.tabBar.active : colors.tabBar.inactive} />
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
