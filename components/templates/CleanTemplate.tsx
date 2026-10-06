import React from 'react';
import { View, Text, Image, StyleSheet, useColorScheme } from 'react-native';
import { Colors, DarkColors, Spacing, Typography, BorderRadius, type AppColors } from '@/theme';
import type { Article } from '@/types';

interface TemplateProps {
  article: Article;
}

/**
 * CleanTemplate: Minimalist, lots of whitespace, rounded borders.
 * Built to be rendered inside a 1:1 aspect ratio square.
 */
export function CleanTemplate({ article }: TemplateProps) {
  const colors = Colors; 
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.innerBox}>
        {/* Top Source Badge */}
        <View style={styles.header}>
          <Text style={styles.sourceText}>{article.source.toUpperCase()}</Text>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <Text style={styles.headline} numberOfLines={4}>
            {article.title}
          </Text>
          {article.description && (
            <Text style={styles.description} numberOfLines={3}>
              {article.description}
            </Text>
          )}
        </View>

        {/* Image Block */}
        {article.imageUrl ? (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: article.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        ) : (
          <View style={styles.placeholderContainer} />
        )}
      </View>
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F3F4F6', // light grey background
      padding: 60,
    },
    innerBox: {
      flex: 1,
      backgroundColor: colors.white,
      borderRadius: 40,
      padding: 60,
      justifyContent: 'space-between',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.1,
      shadowRadius: 40,
      elevation: 10,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 30,
    },
    sourceText: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.primary,
      letterSpacing: 2,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      paddingBottom: 40,
    },
    headline: {
      fontSize: 64,
      fontWeight: 'bold',
      color: colors.black,
      lineHeight: 76,
      marginBottom: 20,
    },
    description: {
      fontSize: 32,
      color: colors.grey600,
      lineHeight: 44,
    },
    imageContainer: {
      height: 400,
      width: '100%',
      borderRadius: 24,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    placeholderContainer: {
      height: 40,
    },
  });
}
