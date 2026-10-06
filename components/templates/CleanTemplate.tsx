import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Typography } from '@/theme';
import type { Article } from '@/types';

interface TemplateProps {
  article: Article;
}

export function CleanTemplate({ article }: TemplateProps) {
  return (
    <View style={styles.container}>
      {/* Full-bleed image */}
      {article.imageUrl ? (
        <Image source={{ uri: article.imageUrl }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.imagePlaceholder} />
      )}

      {/* Dark gradient overlay at the bottom */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.85)']}
        locations={[0.2, 1]}
        style={styles.gradient}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.headline} numberOfLines={4} adjustsFontSizeToFit>
            {article.title}
          </Text>
          <Text style={styles.source}>
            {article.source.toUpperCase() || article.domain.toUpperCase()}
          </Text>
        </View>
      </LinearGradient>
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
  gradient: {
    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
    justifyContent: 'flex-end',
    padding: 80,
  },
  contentContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  headline: {
    color: '#FFFFFF',
    fontSize: 72,
    fontWeight: '700',
    lineHeight: 84,
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  source: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 28,
    fontWeight: '600',
    letterSpacing: 2,
  },
});
