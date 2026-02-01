import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import HouseIcon from '@/components/icons/HouseIcon';
import WeightIcon from '@/components/icons/WeightIcon';
import AnalysisIcon from '@/components/icons/AnalysisIcon';
import ProfileIcon from '@/components/icons/ProfileIcon';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopColor: '#1a1a1a',
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#CDFC00',
        tabBarInactiveTintColor: '#6D6D6D',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <HouseIcon width={24} height={24} color={focused ? '#000000' : '#6D6D6D'} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: 'Workout',
          tabBarIcon: ({ focused }) => (
            <WeightIcon width={24} height={24} color={focused ? '#CDFC00' : '#6D6D6D'} />
          ),
        }}
      />
      <Tabs.Screen
        name="analysis"
        options={{
          title: 'Analysis',
          tabBarIcon: ({ focused }) => (
            <AnalysisIcon width={21} height={22} color={focused ? '#CDFC00' : '#6D6D6D'} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <ProfileIcon width={28} height={28} color={focused ? '#CDFC00' : '#6D6D6D'} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerActive: {
    backgroundColor: '#CDFC00',
  },
});
