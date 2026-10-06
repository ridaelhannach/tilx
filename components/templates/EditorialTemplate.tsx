import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import type { Article } from '@/types';

interface TemplateProps {
  article: Article;
}

export function EditorialTemplate({ article }: TemplateProps) {
  return (
    <View style={styles.container}>
      {/* Top Image (60%) */}
      <View style={styles.imageSection}>
        {article.imageUrl ? (
          <Image source={{ uri: article.imageUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
      </View>

      {/* Bottom Content (40%) */}
      <View style={styles.contentSection}>
        <Text style={styles.source}>
          {article.source.toUpperCase() || article.domain.toUpperCase()}
        </Text>
        <Text style={styles.headline} numberOfLines={3} adjustsFontSizeToFit>
          {article.title}
        </Text>
        {article.description && (
          <Text style={styles.description} numberOfLines={3}>
            {article.description}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 1080,
    height: 1080,
    backgroundColor: '#FAFAFA',
    overflow: 'hidden',
  },
  imageSection: {
    height: '55%',
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E7E7E7',
  },
  contentSection: {
    height: '45%',
    width: '100%',
    paddingHorizontal: 80,
    paddingTop: 60,
    paddingBottom: 60,
    justifyContent: 'flex-start',
  },
  source: {
    color: '#D92D20', // Subtle editorial accent red
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 32,
  },
  headline: {
    color: '#111111',
    fontSize: 64,
    fontWeight: '700',
    lineHeight: 76,
    marginBottom: 32,
  },
  description: {
    color: '#737373',
    fontSize: 32,
    fontWeight: '400',
    lineHeight: 46,
  },
});
