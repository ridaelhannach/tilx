import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, type AppColors } from '@/theme';
import type { Article } from '@/types';

interface TemplateProps {
  article: Article;
}

/**
 * EditorialTemplate: Newspaper style, serif-inspired layout, compact lines.
 */
export function EditorialTemplate({ article }: TemplateProps) {
  const colors = Colors;
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.divider} />
        <Text style={styles.sourceText}>{article.source}</Text>
        <View style={styles.divider} />
      </View>

      <View style={styles.mainLayout}>
        {/* Top/Left Text */}
        <View style={styles.leftCol}>
          <Text style={styles.headline} numberOfLines={4}>
            {article.title}
          </Text>
          {article.description && (
            <Text style={styles.description} numberOfLines={4}>
              {article.description}
            </Text>
          )}
        </View>

        {/* Right Image */}
        {article.imageUrl && (
          <View style={styles.rightCol}>
            <Image
              source={{ uri: article.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}
      </View>
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f4efe6', // Warm newspaper cream tint
      padding: 60,
      borderWidth: 16,
      borderColor: colors.black,
    },
    header: {
      alignItems: 'center',
      marginBottom: 60,
    },
    sourceText: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.black,
      textTransform: 'uppercase',
      letterSpacing: 8,
      marginVertical: 20,
      textAlign: 'center',
    },
    divider: {
      height: 4,
      backgroundColor: colors.black,
      width: '100%',
    },
    mainLayout: {
      flex: 1,
      flexDirection: 'row',
      gap: 40,
    },
    leftCol: {
      flex: 1,
      justifyContent: 'center',
    },
    rightCol: {
      width: '45%',
      height: '100%',
    },
    headline: {
      fontSize: 60,
      fontWeight: '800',
      color: colors.black,
      lineHeight: 70,
      marginBottom: 30,
    },
    description: {
      fontSize: 32,
      color: '#444',
      lineHeight: 46,
      fontStyle: 'italic',
    },
    image: {
      width: '100%',
      height: '100%',
      borderWidth: 4,
      borderColor: colors.black,
    },
  });
}
