import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, useColorScheme, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';
import { Colors, DarkColors, Spacing, Typography, BorderRadius, type AppColors } from '@/theme';
import { ChevronLeft, Download, Link2, Share as ShareIcon } from 'lucide-react-native';

export default function ShareScreen() {
  const { uri, title, source, url } = useLocalSearchParams<{ uri: string, title?: string, source?: string, url?: string }>();
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? DarkColors : Colors;
  const styles = createStyles(colors);
  const { width } = useWindowDimensions();

  const handleShare = async () => {
    if (uri && await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, { mimeType: 'image/png' });
    }
  };

  const handleCopyLink = async () => {
    if (url) {
      await Clipboard.setStringAsync(url);
      alert('Link copied to clipboard!'); // Real app might use a Toast
    }
  };

  const handleSave = async () => {
    // History is already saved, maybe just show a toast
    alert('Saved to device history');
  };

  const previewSize = width - (Spacing.lg * 2);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <ChevronLeft color={colors.primaryText} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Share</Text>
        <View style={styles.headerButtonRight} />
      </View>

      <View style={styles.content}>
        {/* Card Preview */}
        <View style={styles.previewContainer}>
          <View style={[styles.previewWrapper, { width: previewSize, height: previewSize }]}>
            {uri ? (
              <Image source={{ uri }} style={styles.previewImage} resizeMode="contain" />
            ) : null}
          </View>
        </View>

        {/* Metadata */}
        <View style={styles.metadataContainer}>
          <Text style={styles.articleTitle} numberOfLines={2}>{title || 'Untitled'}</Text>
          <Text style={styles.sourceText}>Source: {source || 'Unknown'}</Text>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleSave}>
            <Download color={colors.primaryText} size={20} />
            <Text style={styles.secondaryButtonText}>Save to device</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleCopyLink}>
            <Link2 color={colors.primaryText} size={20} />
            <Text style={styles.secondaryButtonText}>Copy article link</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryButton} onPress={handleShare}>
            <ShareIcon color={colors.primaryActionText} size={20} />
            <Text style={styles.primaryButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: Spacing.sm,
  },
  headerButton: {
    padding: Spacing.sm,
    minWidth: 64,
  },
  headerButtonRight: {
    padding: Spacing.sm,
    minWidth: 64,
  },
  headerTitle: {
    fontSize: Typography.sectionHeading,
    fontWeight: Typography.semibold,
    color: colors.primaryText,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  previewContainer: {
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  previewWrapper: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.secondarySurface,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  metadataContainer: {
    marginBottom: Spacing.xxxl,
  },
  articleTitle: {
    fontSize: Typography.sectionHeading,
    fontWeight: Typography.semibold,
    color: colors.primaryText,
    marginBottom: Spacing.xs,
  },
  sourceText: {
    fontSize: Typography.secondaryBody,
    color: colors.secondaryText,
  },
  actionsContainer: {
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    height: 52,
    borderRadius: BorderRadius.md,
    backgroundColor: colors.secondarySurface,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  secondaryButtonText: {
    fontSize: Typography.body,
    fontWeight: Typography.medium,
    color: colors.primaryText,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    height: 52,
    borderRadius: BorderRadius.md,
    backgroundColor: colors.primaryAction,
    marginTop: Spacing.sm,
  },
  primaryButtonText: {
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
    color: colors.primaryActionText,
  },
});
