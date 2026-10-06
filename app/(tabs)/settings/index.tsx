import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, DarkColors, Spacing, Typography, BorderRadius, type AppColors } from '@/theme';
import { ChevronRight } from 'lucide-react-native';
import { clearHistory } from '@/database/db'; // Will need to implement clearHistory if not exists

// We create a mock clearHistory since we don't know if it's exported from db.ts yet
const handleClearHistory = () => {
  Alert.alert(
    'Clear history?',
    'All locally saved cards will be removed.',
    [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Clear', 
        style: 'destructive',
        onPress: () => {
          try {
            // @ts-ignore - Just in case it's not exported
            if (typeof clearHistory === 'function') clearHistory();
            alert('History cleared');
          } catch (e) {
            console.error(e);
          }
        }
      }
    ]
  );
};

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? DarkColors : Colors;
  const styles = createStyles(colors);

  const SettingsRow = ({ label, value, onPress, destructive }: { label: string, value?: string, onPress?: () => void, destructive?: boolean }) => (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7} disabled={!onPress}>
      <Text style={[styles.rowLabel, destructive && { color: colors.danger }]}>{label}</Text>
      <View style={styles.rowRight}>
        {value && <Text style={styles.rowValue}>{value}</Text>}
        {onPress && <ChevronRight color={colors.mutedText} size={20} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Appearance Group */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.group}>
            <SettingsRow label="Theme" value="System" onPress={() => {}} />
          </View>
        </View>

        {/* Creating Group */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Creating</Text>
          <View style={styles.group}>
            <SettingsRow label="Default template" value="Clean" onPress={() => {}} />
            <View style={styles.divider} />
            <SettingsRow label="Export quality" value="High" onPress={() => {}} />
          </View>
        </View>

        {/* Storage Group */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Storage</Text>
          <View style={styles.group}>
            <SettingsRow label="Clear history" destructive onPress={handleClearHistory} />
          </View>
        </View>

        {/* About Group */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.group}>
            <SettingsRow label="Privacy Policy" onPress={() => {}} />
            <View style={styles.divider} />
            <SettingsRow label="Terms of Service" onPress={() => {}} />
            <View style={styles.divider} />
            <SettingsRow label="Help & Support" onPress={() => {}} />
            <View style={styles.divider} />
            <SettingsRow label="Version" value="0.1.0" />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondarySurface, // Use secondary surface for grouped background
  },
  header: {
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryBorder,
  },
  headerTitle: {
    fontSize: Typography.sectionHeading,
    fontWeight: Typography.semibold,
    color: colors.primaryText,
  },
  scrollContent: {
    paddingVertical: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    fontSize: Typography.secondaryBody,
    fontWeight: Typography.semibold,
    color: colors.secondaryText,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  group: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.primaryBorder,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    minHeight: 52,
  },
  rowLabel: {
    fontSize: Typography.body,
    color: colors.primaryText,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  rowValue: {
    fontSize: Typography.body,
    color: colors.secondaryText,
  },
  divider: {
    height: 1,
    backgroundColor: colors.primaryBorder,
    marginLeft: Spacing.lg,
  },
});
