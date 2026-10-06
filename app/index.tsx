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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Colors, DarkColors, Spacing, Typography, BorderRadius, Shadow, type AppColors } from '@/theme';
import { getHistory, type SavedCard } from '@/database/db';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? DarkColors : Colors;
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);
  
  const [history, setHistory] = useState<SavedCard[]>([]);

  useFocusEffect(
    useCallback(() => {
      try {
        setHistory(getHistory());
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
    }
  };

  const handleCreateCard = useCallback(() => {
    const trimmed = url.trim();
    if (!trimmed) {
      setUrlError('Please paste an article URL to get started.');
      return;
    }
    if (!isValidUrl(trimmed)) {
      setUrlError('Please enter a valid article URL (starting with http or https).');
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
          {/* Hero */}
          <View style={styles.hero}>
            <Text style={styles.appName}>Tilx</Text>
            <Text style={styles.tagline}>Turn articles into social cards.</Text>
            <Text style={styles.subtitle}>
              Paste any article URL and get a polished, shareable card in seconds.
            </Text>
          </View>

          {/* URL Input Card */}
          <View style={[styles.inputCard, Shadow.md]}>
            <Text style={styles.inputLabel}>Article URL</Text>
            <TextInput
              style={[styles.urlInput, urlError ? styles.urlInputError : null]}
              placeholder="https://example.com/article"
              placeholderTextColor={colors.grey400}
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
              accessibilityLabel="Article URL input"
              accessibilityHint="Paste the URL of the article you want to turn into a card"
            />
            {urlError ? (
              <Text style={styles.errorText}>{urlError}</Text>
            ) : null}

            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateCard}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Create Card"
            >
              <Text style={styles.createButtonText}>Create Card</Text>
            </TouchableOpacity>
          </View>

          {/* Share hint */}
          <View style={styles.shareHintCard}>
            <Text style={styles.shareHintTitle}>💡 Share directly from your browser</Text>
            <Text style={styles.shareHintBody}>
              Open an article in Chrome or any browser, tap{' '}
              <Text style={styles.shareHintBold}>Share</Text>, then choose{' '}
              <Text style={styles.shareHintBold}>Tilx</Text> to jump straight to the
              card creator — no copy-pasting needed.
            </Text>
          </View>

          {/* Recent Cards */}
          <View style={styles.recentSection}>
            <View style={styles.recentHeader}>
              <Text style={styles.recentTitle}>Recent Cards</Text>
              {history.length > 0 && (
                <TouchableOpacity onPress={() => router.push('/history')}>
                  <Text style={styles.viewAllText}>Manage</Text>
                </TouchableOpacity>
              )}
            </View>

            {history.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🗂️</Text>
                <Text style={styles.emptyTitle}>No cards yet</Text>
                <Text style={styles.emptyBody}>
                  Paste an article URL above to create your first social card.
                </Text>
              </View>
            ) : (
              <View style={styles.historyList}>
                {history.slice(0, 3).map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.historyCard}
                    onPress={() => {
                      const safeUrl = encodeURIComponent(item.article.url);
                      const articleJson = encodeURIComponent(JSON.stringify(item.article));
                      router.push(`/editor/${safeUrl}?articleJson=${articleJson}`);
                    }}
                  >
                    <View style={styles.historyCardImageContainer}>
                      {item.article.imageUrl ? (
                        <Image source={{ uri: item.article.imageUrl }} style={styles.historyCardImage} resizeMode="cover" />
                      ) : (
                        <View style={styles.historyPlaceholderImage}><Text style={styles.historyPlaceholderText}>{item.article.source}</Text></View>
                      )}
                    </View>
                    <View style={styles.historyCardContent}>
                      <Text style={styles.historyCardTitle} numberOfLines={2}>{item.article.title}</Text>
                      <Text style={styles.historyCardDate}>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
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

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    flex: { flex: 1 },
    container: {
      flex: 1,
      backgroundColor: colors.grey50,
    },
    scrollContent: {
      padding: Spacing.md,
      paddingBottom: Spacing.xxl,
    },
    // Hero
    hero: {
      paddingTop: Spacing.xl,
      paddingBottom: Spacing.xl,
      alignItems: 'center',
    },
    appName: {
      fontSize: Typography.xxxl,
      fontWeight: Typography.extrabold,
      color: colors.primary,
      letterSpacing: -1,
    },
    tagline: {
      fontSize: Typography.xl,
      fontWeight: Typography.bold,
      color: colors.black,
      marginTop: Spacing.xs,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: Typography.md,
      color: colors.grey600,
      marginTop: Spacing.sm,
      textAlign: 'center',
      lineHeight: Typography.md * Typography.normal,
    },
    // Input card
    inputCard: {
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      marginBottom: Spacing.md,
    },
    inputLabel: {
      fontSize: Typography.sm,
      fontWeight: Typography.semibold,
      color: colors.grey700,
      marginBottom: Spacing.xs,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    urlInput: {
      borderWidth: 1.5,
      borderColor: colors.grey300,
      borderRadius: BorderRadius.md,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm + 2,
      fontSize: Typography.md,
      color: colors.black,
      backgroundColor: colors.grey50,
    },
    urlInputError: {
      borderColor: colors.error,
    },
    errorText: {
      fontSize: Typography.sm,
      color: colors.error,
      marginTop: Spacing.xs,
    },
    createButton: {
      backgroundColor: colors.primary,
      borderRadius: BorderRadius.md,
      paddingVertical: Spacing.md,
      alignItems: 'center',
      marginTop: Spacing.md,
    },
    createButtonText: {
      color: colors.white,
      fontSize: Typography.lg,
      fontWeight: Typography.bold,
    },
    // Share hint
    shareHintCard: {
      backgroundColor: colors.primaryLight,
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      marginBottom: Spacing.lg,
    },
    shareHintTitle: {
      fontSize: Typography.md,
      fontWeight: Typography.semibold,
      color: colors.primaryDark,
      marginBottom: Spacing.xs,
    },
    shareHintBody: {
      fontSize: Typography.sm,
      color: colors.primaryDark,
      lineHeight: Typography.sm * Typography.relaxed,
    },
    shareHintBold: {
      fontWeight: Typography.bold,
    },
    // Recent section
    recentSection: {
      marginTop: Spacing.sm,
    },
    recentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: Spacing.md,
    },
    recentTitle: {
      fontSize: Typography.lg,
      fontWeight: Typography.bold,
      color: colors.black,
    },
    viewAllText: {
      fontSize: Typography.md,
      color: colors.primary,
      fontWeight: Typography.bold,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: Spacing.xxl,
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.lg,
    },
    emptyIcon: {
      fontSize: 40,
      marginBottom: Spacing.sm,
    },
    emptyTitle: {
      fontSize: Typography.lg,
      fontWeight: Typography.semibold,
      color: colors.grey700,
      marginBottom: Spacing.xs,
    },
    emptyBody: {
      fontSize: Typography.sm,
      color: colors.grey500,
      textAlign: 'center',
      paddingHorizontal: Spacing.lg,
      lineHeight: Typography.sm * Typography.relaxed,
    },
    historyList: {
      gap: Spacing.sm,
    },
    historyCard: {
      flexDirection: 'row',
      backgroundColor: colors.white,
      borderRadius: BorderRadius.md,
      overflow: 'hidden',
      ...Shadow.sm,
    },
    historyCardImageContainer: {
      width: 60,
      height: 60,
      backgroundColor: colors.grey200,
    },
    historyCardImage: {
      width: '100%',
      height: '100%',
    },
    historyPlaceholderImage: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.primary,
    },
    historyPlaceholderText: {
      color: colors.white,
      fontSize: 8,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    historyCardContent: {
      flex: 1,
      padding: Spacing.sm,
      justifyContent: 'center',
    },
    historyCardTitle: {
      fontSize: Typography.sm,
      fontWeight: Typography.bold,
      color: colors.black,
      marginBottom: 2,
    },
    historyCardDate: {
      fontSize: Typography.xs,
      color: colors.grey500,
    },
  });
}
