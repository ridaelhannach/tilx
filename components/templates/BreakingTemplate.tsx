import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, type AppColors } from '@/theme';
import type { Article } from '@/types';

interface TemplateProps {
  article: Article;
}

/**
 * BreakingTemplate: Bold, high contrast, big headlines.
 */
export function BreakingTemplate({ article }: TemplateProps) {
  const colors = Colors;
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {article.imageUrl && (
        <Image
          source={{ uri: article.imageUrl }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
      )}
      
      {/* Dark overlay for contrast */}
      <View style={styles.overlay} />

      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>BREAKING</Text>
        </View>

        <Text style={styles.sourceText}>{article.source}</Text>

        <Text style={styles.headline} numberOfLines={5}>
          {article.title}
        </Text>
      </View>
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.black,
    },
    overlay: {
      ...StyleSheet.absoluteFill,
      backgroundColor: 'rgba(0,0,0,0.6)', // darker overlay for better contrast
    },
    content: {
      flex: 1,
      justifyContent: 'flex-end',
      padding: 60,
    },
    badge: {
      backgroundColor: '#E53935', // Red for breaking news
      alignSelf: 'flex-start',
      paddingVertical: 12,
      paddingHorizontal: 24,
      marginBottom: 30,
    },
    badgeText: {
      color: colors.white,
      fontWeight: '900',
      fontSize: 28,
      letterSpacing: 4,
    },
    sourceText: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#E5E7EB',
      marginBottom: 20,
      textTransform: 'uppercase',
      letterSpacing: 2,
    },
    headline: {
      fontSize: 72,
      fontWeight: '900',
      color: colors.white,
      lineHeight: 84,
    },
  });
}
