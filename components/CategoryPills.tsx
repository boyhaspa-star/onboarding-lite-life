import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing } from '@/constants/theme';

interface CategoryItem {
  id: string;
  label: string;
}

interface CategoryPillsProps {
  categories: CategoryItem[];
  selected: string;
  onSelect: (id: string) => void;
}

export function CategoryPills({ categories, selected, onSelect }: CategoryPillsProps) {
  const handleSelect = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(id);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.container}>
      {categories.map((category) => {
        const isActive = selected === category.id;
        return (
          <TouchableOpacity
            key={category.id}
            onPress={() => handleSelect(category.id)}
            activeOpacity={0.8}
            style={[styles.pill, isActive && styles.pillActive]}>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    maxHeight: 44,
    marginBottom: spacing.xl,
  },
  container: {
    paddingHorizontal: spacing.screen.paddingHorizontal,
    gap: 10,
  },
  pill: {
    paddingVertical: 10,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.background.surface,
    borderRadius: spacing.radius.xl,
    borderWidth: 1,
    borderColor: colors.background.muted,
  },
  pillActive: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
  },
  label: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.subtle,
  },
  labelActive: {
    color: colors.text.inverse,
  },
});
