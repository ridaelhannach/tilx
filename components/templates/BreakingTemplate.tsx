import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import type { Article } from '@/types';

interface TemplateProps {
  article: Article;
}

export function BreakingTemplate({ article }: TemplateProps) {
  return (
    <View style={styles.container}>
      {/* Full-bleed image */}
      {article.imageUrl ? (
        <Image source={{ uri: article.imageUrl }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.imagePlaceholder} />
      )}

      {/* Strong dark overlay everywhere */}
      <View style={styles.overlay}>
        <View style={styles.contentContainer}>
          <View style={styles.accentBadge}>
            <Text style={styles.accentBadgeText}>BREAKING</Text>
          </View>
          <Text style={styles.headline} numberOfLines={4} adjustsFontSizeToFit>
            {article.title}
          </Text>
          <Text style={styles.source}>
            {article.source.toUpperCase() || article.domain.toUpperCase()}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 1080,
    height: 1080,
    backgroundColor: '#000000',
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
    width: 1080,
    height: 1080,
  },
  imagePlaceholder: {
    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: '#1E1E1E',
  },
  overlay: {
    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 80,
    justifyContent: 'center', // Center content vertically for impact
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accentBadge: {
    backgroundColor: '#FF4D74', // SocialCard brand pink/coral
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 40,
  },
  accentBadgeText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 3,
  },
  headline: {
    color: '#FFFFFF',
    fontSize: 80,
    fontWeight: '800',
    lineHeight: 92,
    textAlign: 'center',
    marginBottom: 48,
    textTransform: 'uppercase',
  },
  source: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 2,
    textAlign: 'center',
  },
});
