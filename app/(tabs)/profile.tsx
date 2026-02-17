import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  User, Calendar, Activity, Bell, Moon, Ruler, Shield, FileText, Info, LogOut, Trash2,
} from 'lucide-react-native';
import { colors, typography, spacing } from '@/constants/theme';
import { SettingsRow, SettingsSection } from '@/components/SettingsRow';

export default function ProfileScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => router.replace('/'),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        {/* Avatar + Name */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <User size={32} color={colors.brand.primary} />
          </View>
          <Text style={styles.name}>Athlete</Text>
          <Text style={styles.memberSince}>Member since 2026</Text>
        </View>

        {/* Personal Info */}
        <SettingsSection title="Personal Info">
          <SettingsRow
            icon={<User size={18} color={colors.brand.primary} />}
            label="Name"
            right={<Text style={styles.value}>Athlete</Text>}
          />
          <SettingsRow
            icon={<Calendar size={18} color={colors.brand.blue} />}
            label="Age"
            right={<Text style={styles.value}>25</Text>}
          />
          <SettingsRow
            icon={<Activity size={18} color={colors.brand.green} />}
            label="Fitness Level"
            right={<Text style={styles.value}>Intermediate</Text>}
          />
        </SettingsSection>

        {/* Preferences */}
        <SettingsSection title="Preferences">
          <SettingsRow
            icon={<Bell size={18} color={colors.brand.cta} />}
            label="Notifications"
            description="Workout reminders & tips"
            right="toggle"
            toggled={notifications}
            onToggle={setNotifications}
          />
          <SettingsRow
            icon={<Moon size={18} color={colors.text.accent} />}
            label="Dark Mode"
            right="toggle"
            toggled={darkMode}
            onToggle={setDarkMode}
          />
          <SettingsRow
            icon={<Ruler size={18} color={colors.gray[400]} />}
            label="Units"
            right={<Text style={styles.value}>Metric</Text>}
          />
        </SettingsSection>

        {/* About */}
        <SettingsSection title="About">
          <SettingsRow
            icon={<Shield size={18} color={colors.gray[600]} />}
            label="Privacy Policy"
          />
          <SettingsRow
            icon={<FileText size={18} color={colors.gray[600]} />}
            label="Terms of Service"
          />
          <SettingsRow
            icon={<Info size={18} color={colors.gray[600]} />}
            label="Version"
            right={<Text style={styles.value}>1.0.0</Text>}
          />
        </SettingsSection>

        {/* Account Actions */}
        <SettingsSection>
          <SettingsRow
            icon={<LogOut size={18} color="#FF4444" />}
            label="Sign Out"
            destructive
            onPress={handleLogout}
            right={null as any}
          />
        </SettingsSection>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scroll: {
    paddingHorizontal: spacing.screen.paddingHorizontal,
    paddingTop: spacing.xl,
  },
  // Avatar
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.overlay.white8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.brand.primary,
  },
  name: {
    fontSize: typography.fontSize['3xl'],
    fontFamily: typography.fontFamily.heading,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  memberSince: {
    fontSize: typography.fontSize.base,
    color: colors.text.disabled,
  },
  // Right-side values
  value: {
    fontSize: typography.fontSize.base,
    color: colors.text.disabled,
  },
});
