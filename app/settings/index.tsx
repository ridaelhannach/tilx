import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, DarkColors, Spacing, Typography, BorderRadius, type AppColors } from '@/theme';

const SETTINGS_SECTIONS = [
  {
    title: 'Appearance',
    items: [
      { label: 'Theme', value: 'System' },
    ],
  },
  {
    title: 'Cards',
    items: [
      { label: 'Default Template', value: 'Clean' },
      { label: 'Export Quality', value: 'High' },
    ],
  },
  {
    title: 'History',
    items: [
      { label: 'Clear History', value: null, destructive: true },
    ],
  },
  {
    title: 'About',
    items: [
      { label: 'Version', value: '1.0.0' },
      { label: 'Privacy Policy', value: null },
      { label: 'Terms of Service', value: null },
      { label: 'Support', value: null },
    ],
  },
];

/**
 * Settings screen — Milestone 6.
 * Implements all settings listed in PRD Section 13.
 */
export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? DarkColors : Colors;
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {SETTINGS_SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, i) => (
                <TouchableOpacity
                  key={item.label}
                  style={[
                    styles.settingRow,
                    i < section.items.length - 1 && styles.settingRowBorder,
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.settingLabel,
                      'destructive' in item && item.destructive
                        ? styles.destructive
                        : null,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.value ? (
                    <Text style={styles.settingValue}>{item.value}</Text>
                  ) : null}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.grey50,
    },
    scrollContent: {
      padding: Spacing.md,
      paddingBottom: Spacing.xxl,
    },
    section: {
      marginBottom: Spacing.lg,
    },
    sectionTitle: {
      fontSize: Typography.xs,
      fontWeight: Typography.semibold,
      color: colors.grey500,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: Spacing.xs,
      paddingHorizontal: Spacing.xs,
    },
    sectionCard: {
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.md,
      overflow: 'hidden',
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.md,
    },
    settingRowBorder: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.grey200,
    },
    settingLabel: {
      fontSize: Typography.md,
      color: colors.black,
    },
    settingValue: {
      fontSize: Typography.md,
      color: colors.grey500,
    },
    destructive: {
      color: colors.error,
    },
  });
}
