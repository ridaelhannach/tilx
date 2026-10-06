import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  useColorScheme,
  KeyboardAvoidingView,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Link2 } from 'lucide-react-native';
import { Colors, DarkColors, Spacing, Typography, BorderRadius, Shadow, type AppColors } from '@/theme';
import { getHistory, type SavedCard } from '@/database/db';

const { width } = Dimensions.get('window');
// Calculate width for 3-column grid with 2 gaps of 8px, minus screen padding of 16px on each side
const GRID_GAP = Spacing.sm;
const SCREEN_PADDING = Spacing.lg;
const ITEM_WIDTH = (width - (SCREEN_PADDING * 2) - (GRID_GAP * 2)) / 3;

export default function CreateScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? DarkColors : Colors;
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [history, setHistory] = useState<SavedCard[]>([]);

  useFocusEffect(
    useCallback(() => {
      try {
        setHistory(getHistory().slice(0, 6)); // Show max 6 recent cards
      } catch (e) {
        console.error('Failed to load history', e);
      }
    }, [])
  );

  const isValidUrl = (value: string): boolean => {
    try {
      const parsed = new URL(value.trim());
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
  const handleCreateCard = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const trimmed = url.trim();
    if (!trimmed) {
      setUrlError('Paste an article URL to start');
      return;
    }
    if (!isValidUrl(trimmed)) {
      setUrlError('Please enter a valid URL');
      return;
    }
    setUrlError(null);
    router.push({
      pathname: '/article/loading',
      params: { url: trimmed },
    });
  }, [url]);

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.brandName}>Tilx</Text>
          </View>

          {/* Hero */}
          <View style={styles.hero}>
            <Text style={styles.heroTitle}>Create a post</Text>
            <Text style={styles.heroSubtitle}>
              Turn any article into a shareable social card.
            </Text>
          </View>

          {/* Input Section */}
          <View style={styles.inputSection}>
            <View style={[styles.inputContainer, urlError ? styles.inputErrorBorder : null]}>
              <Link2 color={colors.secondaryText} size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.urlInput}
                placeholder="Paste article URL"
                placeholderTextColor={colors.mutedText}
                value={url}
                onChangeText={(text) => {
                  setUrl(text);
                  if (urlError) setUrlError(null);
                }}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                returnKeyType="go"
                onSubmitEditing={handleCreateCard}
              />
            </View>
            {urlError && <Text style={styles.errorText}>{urlError}</Text>}

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleCreateCard}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>Create Card</Text>
            </TouchableOpacity>
          </View>

          {/* Or Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Share Hint */}
          <Text style={styles.shareHintText}>
            Share an article directly from Chrome or another app.
          </Text>

          {/* Recent Section */}
          <View style={styles.recentSection}>
            <Text style={styles.recentTitle}>Recent</Text>
            
            {history.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateTitle}>No cards yet</Text>
                <Text style={styles.emptyStateBody}>
                  Your generated social cards will appear here.
                </Text>
              </View>
            ) : (
              <View style={styles.grid}>
                {history.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.gridItem}
                    activeOpacity={0.8}
                    onPress={() => router.push({
                      pathname: '/editor/[cardId]',
                      params: { cardId: item.id }
                    })}
                  >
                    {item.article.imageUrl ? (
                      <Image
                        source={{ uri: item.article.imageUrl }}
                        style={styles.gridImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.gridImagePlaceholder} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    flex: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.xxxl,
    },
    header: {
      height: 56,
      justifyContent: 'center',
    },
    brandName: {
      fontSize: Typography.sectionHeading,
      fontWeight: Typography.bold,
      color: colors.primaryText,
    },
    hero: {
      marginTop: Spacing.md,
      marginBottom: Spacing.xxl,
    },
    heroTitle: {
      fontSize: Typography.display,
      fontWeight: Typography.bold,
      color: colors.primaryText,
      marginBottom: Spacing.xs,
      letterSpacing: -0.5,
    },
    heroSubtitle: {
      fontSize: Typography.body,
      color: colors.secondaryText,
      lineHeight: Typography.body * 1.5,
    },
    inputSection: {
      marginBottom: Spacing.xl,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.secondarySurface,
      borderWidth: 1,
      borderColor: colors.primaryBorder,
      borderRadius: BorderRadius.md,
      height: 52,
      paddingHorizontal: Spacing.md,
    },
    inputErrorBorder: {
      borderColor: colors.danger,
    },
    inputIcon: {
      marginRight: Spacing.sm,
    },
    urlInput: {
      flex: 1,
      fontSize: Typography.body,
      color: colors.primaryText,
      height: '100%',
    },
    errorText: {
      fontSize: Typography.secondaryBody,
      color: colors.danger,
      marginTop: Spacing.sm,
    },
    primaryButton: {
      backgroundColor: colors.primaryAction,
      borderRadius: BorderRadius.md,
      height: 52,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: Spacing.lg,
    },
    primaryButtonText: {
      color: colors.primaryActionText,
      fontSize: Typography.body,
      fontWeight: Typography.semibold,
    },
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.primaryBorder,
    },
    dividerText: {
      marginHorizontal: Spacing.md,
      color: colors.mutedText,
      fontSize: Typography.secondaryBody,
    },
    shareHintText: {
      textAlign: 'center',
      fontSize: Typography.secondaryBody,
      color: colors.secondaryText,
      marginBottom: Spacing.xxxl,
      paddingHorizontal: Spacing.xl,
      lineHeight: Typography.secondaryBody * 1.5,
    },
    recentSection: {
      marginTop: Spacing.sm,
    },
    recentTitle: {
      fontSize: Typography.sectionHeading,
      fontWeight: Typography.semibold,
      color: colors.primaryText,
      marginBottom: Spacing.lg,
    },
    emptyState: {
      alignItems: 'flex-start',
      paddingVertical: Spacing.md,
    },
    emptyStateTitle: {
      fontSize: Typography.body,
      fontWeight: Typography.semibold,
      color: colors.primaryText,
      marginBottom: 4,
    },
    emptyStateBody: {
      fontSize: Typography.secondaryBody,
      color: colors.secondaryText,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: GRID_GAP,
    },
    gridItem: {
      width: ITEM_WIDTH,
      height: ITEM_WIDTH,
      borderRadius: BorderRadius.md,
      backgroundColor: colors.secondarySurface,
      overflow: 'hidden',
    },
    gridImage: {
      width: '100%',
      height: '100%',
    },
    gridImagePlaceholder: {
      flex: 1,
      backgroundColor: colors.strongBorder,
    },
  });
