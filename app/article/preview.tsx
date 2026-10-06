import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, DarkColors, Spacing, Typography, BorderRadius, Shadow, type AppColors } from '@/theme';
import type { Article } from '@/types';

export default function ArticlePreviewScreen() {
  const { articleJson, manual } = useLocalSearchParams<{
    articleJson: string;
    manual?: string;
  }>();
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? DarkColors : Colors;
  const styles = createStyles(colors);

  const isManual = manual === 'true';

  const parsedArticle: Article = React.useMemo(() => {
    try {
      return JSON.parse(articleJson) as Article;
    } catch {
      return {
        id: 'manual-entry',
        url: '',
        title: '',
        description: '',
        imageUrl: '',
        source: '',
        domain: '',
      };
    }
  }, [articleJson]);

  const [article, setArticle] = useState<Article>(parsedArticle);
  const [imageError, setImageError] = useState(false);

  const hasImage = !!article.imageUrl && !imageError;

  const handleContinue = () => {
    // Navigate to Card Studio (Milestone 2)
    router.push({
      pathname: '/editor/[cardId]',
      params: {
        cardId: 'new',
        articleJson: JSON.stringify(article),
      },
    });
  };

  const handleReplaceImage = () => {
    // Image picker — to be implemented in Milestone 2
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Article Image */}
        <View style={styles.imageContainer}>
          {hasImage ? (
            <Image
              source={{ uri: article.imageUrl }}
              style={styles.articleImage}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={[styles.articleImage, styles.imagePlaceholder]}>
              <Text style={styles.imagePlaceholderIcon}>📰</Text>
              <Text style={styles.imagePlaceholderText}>No image found</Text>
              <TouchableOpacity
                style={styles.addImageButton}
                onPress={handleReplaceImage}
                activeOpacity={0.8}
              >
                <Text style={styles.addImageText}>Add Image</Text>
              </TouchableOpacity>
            </View>
          )}
          {hasImage && (
            <TouchableOpacity
              style={styles.replaceImageButton}
              onPress={handleReplaceImage}
              activeOpacity={0.85}
            >
              <Text style={styles.replaceImageText}>Replace Image</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Metadata Card */}
        <View style={[styles.metaCard, Shadow.sm]}>
          {/* Source badge */}
          <View style={styles.sourceBadge}>
            <Text style={styles.sourceDomain}>{article.domain || 'Unknown source'}</Text>
          </View>

          {/* Headline */}
          <Text style={styles.sectionLabel}>Headline</Text>
          {isManual ? (
            <TextInput
              style={styles.editableField}
              value={article.title}
              onChangeText={(t) => setArticle((a) => ({ ...a, title: t }))}
              placeholder="Enter article headline"
              placeholderTextColor={colors.grey400}
              multiline
            />
          ) : (
            <Text style={styles.headline}>{article.title || 'No headline found'}</Text>
          )}

          {/* Description */}
          {(article.description || isManual) && (
            <>
              <Text style={styles.sectionLabel}>Description</Text>
              {isManual ? (
                <TextInput
                  style={styles.editableField}
                  value={article.description ?? ''}
                  onChangeText={(t) => setArticle((a) => ({ ...a, description: t }))}
                  placeholder="Enter article description (optional)"
                  placeholderTextColor={colors.grey400}
                  multiline
                />
              ) : (
                <Text style={styles.description}>{article.description}</Text>
              )}
            </>
          )}

          {/* Source */}
          <Text style={styles.sectionLabel}>Source</Text>
          {isManual ? (
            <TextInput
              style={styles.editableFieldSingle}
              value={article.source}
              onChangeText={(t) => setArticle((a) => ({ ...a, source: t }))}
              placeholder="Source name"
              placeholderTextColor={colors.grey400}
            />
          ) : (
            <Text style={styles.source}>{article.source || article.domain}</Text>
          )}

          {/* URL */}
          <Text style={styles.urlText} numberOfLines={1}>
            {article.url}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomBar, Shadow.md]}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.85}
        >
          <Text style={styles.continueText}>Continue →</Text>
        </TouchableOpacity>
      </View>
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
      paddingBottom: Spacing.xxl,
    },
    // Image
    imageContainer: {
      position: 'relative',
    },
    articleImage: {
      width: '100%',
      height: 220,
      backgroundColor: colors.grey200,
    },
    imagePlaceholder: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    imagePlaceholderIcon: { fontSize: 40, marginBottom: Spacing.sm },
    imagePlaceholderText: {
      fontSize: Typography.md,
      color: colors.grey500,
      marginBottom: Spacing.md,
    },
    addImageButton: {
      backgroundColor: colors.primary,
      borderRadius: BorderRadius.sm,
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
    },
    addImageText: {
      color: colors.white,
      fontWeight: Typography.semibold,
      fontSize: Typography.sm,
    },
    replaceImageButton: {
      position: 'absolute',
      bottom: Spacing.sm,
      right: Spacing.sm,
      backgroundColor: 'rgba(0,0,0,0.6)',
      borderRadius: BorderRadius.sm,
      paddingVertical: Spacing.xs,
      paddingHorizontal: Spacing.sm,
    },
    replaceImageText: {
      color: colors.white,
      fontSize: Typography.sm,
      fontWeight: Typography.medium,
    },
    // Meta card
    metaCard: {
      backgroundColor: colors.surface,
      marginHorizontal: Spacing.md,
      marginTop: -Spacing.md,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
    },
    sourceBadge: {
      backgroundColor: colors.primaryLight,
      alignSelf: 'flex-start',
      borderRadius: BorderRadius.full,
      paddingVertical: Spacing.xs / 2,
      paddingHorizontal: Spacing.sm,
      marginBottom: Spacing.md,
    },
    sourceDomain: {
      fontSize: Typography.xs,
      fontWeight: Typography.semibold,
      color: colors.primary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    sectionLabel: {
      fontSize: Typography.xs,
      fontWeight: Typography.semibold,
      color: colors.grey500,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: Spacing.xs,
    },
    headline: {
      fontSize: Typography.xl,
      fontWeight: Typography.bold,
      color: colors.black,
      lineHeight: Typography.xl * 1.3,
      marginBottom: Spacing.md,
    },
    description: {
      fontSize: Typography.md,
      color: colors.grey700,
      lineHeight: Typography.md * Typography.normal,
      marginBottom: Spacing.md,
    },
    source: {
      fontSize: Typography.md,
      fontWeight: Typography.medium,
      color: colors.grey800,
      marginBottom: Spacing.sm,
    },
    urlText: {
      fontSize: Typography.xs,
      color: colors.grey400,
    },
    editableField: {
      borderWidth: 1,
      borderColor: colors.grey300,
      borderRadius: BorderRadius.sm,
      padding: Spacing.sm,
      fontSize: Typography.md,
      color: colors.black,
      marginBottom: Spacing.md,
      minHeight: 60,
      textAlignVertical: 'top',
    },
    editableFieldSingle: {
      borderWidth: 1,
      borderColor: colors.grey300,
      borderRadius: BorderRadius.sm,
      padding: Spacing.sm,
      fontSize: Typography.md,
      color: colors.black,
      marginBottom: Spacing.sm,
    },
    // Bottom bar
    bottomBar: {
      flexDirection: 'row',
      gap: Spacing.sm,
      padding: Spacing.md,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.grey200,
    },
    cancelButton: {
      flex: 1,
      paddingVertical: Spacing.md,
      alignItems: 'center',
      borderRadius: BorderRadius.md,
      borderWidth: 1.5,
      borderColor: colors.grey300,
    },
    cancelText: {
      fontSize: Typography.md,
      fontWeight: Typography.medium,
      color: colors.grey700,
    },
    continueButton: {
      flex: 2,
      backgroundColor: colors.primary,
      borderRadius: BorderRadius.md,
      paddingVertical: Spacing.md,
      alignItems: 'center',
    },
    continueText: {
      color: colors.white,
      fontSize: Typography.md,
      fontWeight: Typography.bold,
    },
  });
}
