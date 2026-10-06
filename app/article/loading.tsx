import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, DarkColors, Spacing, Typography, BorderRadius, type AppColors } from '@/theme';
import { fetchArticleMetadata } from '@/services/api/articleMetadata';
import type { Article } from '@/types';

const STEPS: string[] = ['Reading article', 'Finding image', 'Preparing card'];

export default function ArticleLoadingScreen() {
  const { url } = useLocalSearchParams<{ url: string }>();
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? DarkColors : Colors;
  const styles = createStyles(colors);

  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(!url ? 'No URL provided.' : null);
  const [spinValue] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    );
    anim.start();
    return () => anim.stop();
  }, [spinValue]);

  useEffect(() => {
    if (!url) return;

    let cancelled = false;

    const load = async () => {
      try {
        // Step 0: Reading article
        setCurrentStep(0);
        const article: Article = await fetchArticleMetadata(url);

        if (cancelled) return;

        // Step 1: Finding image
        setCurrentStep(1);
        await new Promise((r) => setTimeout(r, 400));

        if (cancelled) return;

        // Step 2: Preparing card
        setCurrentStep(2);
        await new Promise((r) => setTimeout(r, 300));

        if (cancelled) return;

        router.replace({
          pathname: '/article/preview',
          params: { articleJson: JSON.stringify(article) },
        });
      } catch (err: unknown) {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : 'Something went wrong. Please try again.';
        setError(message);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [url]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Couldn't read this article</Text>
          <Text style={styles.errorBody}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => router.back()}
            activeOpacity={0.85}
          >
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.manualButton}
            onPress={() =>
              router.replace({
                pathname: '/article/preview',
                params: {
                  articleJson: JSON.stringify({
                    id: Date.now().toString(),
                    url: url ?? '',
                    title: '',
                    description: '',
                    imageUrl: '',
                    source: '',
                    domain: url ? new URL(url).hostname : '',
                  }),
                  manual: 'true',
                },
              })
            }
            activeOpacity={0.85}
          >
            <Text style={styles.manualText}>Edit article manually</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.Text style={[styles.spinner, { transform: [{ rotate: spin }] }]}>
          ◐
        </Animated.Text>
        <Text style={styles.loadingTitle}>Creating your card…</Text>
        <View style={styles.stepsContainer}>
          {STEPS.map((step, i) => (
            <View key={step} style={styles.stepRow}>
              <Text style={[styles.stepDot, i <= currentStep && styles.stepDotActive]}>
                {i < currentStep ? '✓' : i === currentStep ? '•' : '○'}
              </Text>
              <Text
                style={[
                  styles.stepLabel,
                  i < currentStep && styles.stepLabelDone,
                  i === currentStep && styles.stepLabelActive,
                ]}
              >
                {step}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
      justifyContent: 'center',
    },
    content: {
      alignItems: 'center',
      paddingHorizontal: Spacing.xl,
    },
    spinner: {
      fontSize: 56,
      color: colors.primary,
      marginBottom: Spacing.lg,
    },
    loadingTitle: {
      fontSize: Typography.xl,
      fontWeight: Typography.bold,
      color: colors.black,
      marginBottom: Spacing.xl,
    },
    stepsContainer: {
      width: '100%',
      maxWidth: 260,
    },
    stepRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    stepDot: {
      fontSize: Typography.md,
      width: 24,
      color: colors.grey400,
    },
    stepDotActive: {
      color: colors.primary,
    },
    stepLabel: {
      fontSize: Typography.md,
      color: colors.grey400,
    },
    stepLabelDone: {
      color: colors.success,
    },
    stepLabelActive: {
      color: colors.black,
      fontWeight: Typography.semibold,
    },
    // Error
    errorContainer: {
      alignItems: 'center',
      paddingHorizontal: Spacing.xl,
    },
    errorIcon: { fontSize: 48, marginBottom: Spacing.md },
    errorTitle: {
      fontSize: Typography.xl,
      fontWeight: Typography.bold,
      color: colors.black,
      marginBottom: Spacing.sm,
      textAlign: 'center',
    },
    errorBody: {
      fontSize: Typography.md,
      color: colors.grey600,
      textAlign: 'center',
      lineHeight: Typography.md * 1.5,
      marginBottom: Spacing.xl,
    },
    retryButton: {
      backgroundColor: colors.primary,
      borderRadius: BorderRadius.md,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.xl,
      marginBottom: Spacing.sm,
      width: '100%',
      alignItems: 'center',
    },
    retryText: {
      color: colors.white,
      fontSize: Typography.md,
      fontWeight: Typography.bold,
    },
    manualButton: {
      paddingVertical: Spacing.sm,
      alignItems: 'center',
    },
    manualText: {
      color: colors.primary,
      fontSize: Typography.md,
    },
  });
}
