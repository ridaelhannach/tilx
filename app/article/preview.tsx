import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, DarkColors, Spacing, Typography, BorderRadius, type AppColors } from '@/theme';
import type { Article } from '@/types';
import { ChevronLeft, Image as ImageIcon } from 'lucide-react-native';

export default function ArticlePreviewScreen() {
  const { articleJson } = useLocalSearchParams<{ articleJson: string }>();
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? DarkColors : Colors;
  const styles = createStyles(colors);

  const parsedArticle: Article = React.useMemo(() => {
    try {
      return JSON.parse(articleJson) as Article;
    } catch {
      return { id: 'manual', url: '', title: '', description: '', imageUrl: '', source: '', domain: '' };
    }
  }, [articleJson]);

  const [article, setArticle] = useState<Article>(parsedArticle);
  const [imageError, setImageError] = useState(false);
  const hasImage = !!article.imageUrl && !imageError;

  const handleContinue = () => {
    router.push({
      pathname: '/editor/[cardId]',
      params: { cardId: 'new', articleJson: JSON.stringify(article) },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <ChevronLeft color={colors.primaryText} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New post</Text>
        <TouchableOpacity onPress={handleContinue} style={styles.headerButtonRight}>
          <Text style={styles.headerActionText}>Next</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Article Image (Hero) */}
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
              <ImageIcon color={colors.mutedText} size={48} />
            </View>
          )}
        </View>

        {/* Source metadata */}
        <View style={styles.metadataContainer}>
          <Text style={styles.sourceText}>{article.source || article.domain}</Text>
          {article.source && article.domain && (
            <Text style={styles.domainText}>{article.domain}</Text>
          )}
        </View>

        {/* Headline */}
        <Text style={styles.headlineText}>{article.title || 'No Headline Found'}</Text>

        {/* Description */}
        {!!article.description && (
          <Text style={styles.descriptionText} numberOfLines={3}>
            {article.description}
          </Text>
        )}

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Edit details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Replace image</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryBorder,
  },
  headerButton: {
    padding: Spacing.sm,
    minWidth: 64,
  },
  headerButtonRight: {
    padding: Spacing.sm,
    minWidth: 64,
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: Typography.sectionHeading,
    fontWeight: Typography.semibold,
    color: colors.primaryText,
  },
  headerActionText: {
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
    color: colors.primaryText,
  },
  scrollContent: {
    paddingBottom: Spacing.xxxl,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  articleImage: {
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius.lg,
  },
  imagePlaceholder: {
    backgroundColor: colors.secondarySurface,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metadataContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  sourceText: {
    fontSize: Typography.secondaryBody,
    fontWeight: Typography.semibold,
    color: colors.primaryText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  domainText: {
    fontSize: Typography.metadata,
    color: colors.secondaryText,
    marginTop: 2,
  },
  headlineText: {
    fontSize: Typography.screenTitle,
    fontWeight: Typography.bold,
    color: colors.primaryText,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    lineHeight: Typography.screenTitle * 1.2,
  },
  descriptionText: {
    fontSize: Typography.body,
    color: colors.secondaryText,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    lineHeight: Typography.body * 1.5,
  },
  actionsContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  actionButton: {
    backgroundColor: colors.secondarySurface,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    borderRadius: BorderRadius.md,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: Typography.body,
    fontWeight: Typography.medium,
    color: colors.primaryText,
  },
});
