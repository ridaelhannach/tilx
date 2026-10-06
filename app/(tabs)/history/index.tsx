import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, router } from 'expo-router';
import { Colors, DarkColors, Spacing, Typography, BorderRadius, type AppColors } from '@/theme';
import { getHistory, type SavedCard } from '@/database/db';

const { width } = Dimensions.get('window');
const GRID_GAP = 2; // Very small gap for grid
const COLUMNS = 3;
const ITEM_WIDTH = (width - (GRID_GAP * (COLUMNS - 1))) / COLUMNS;

export default function HistoryScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? DarkColors : Colors;
  const styles = createStyles(colors);
  
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

  const renderItem = ({ item }: { item: SavedCard }) => (
    <TouchableOpacity
      style={styles.gridItem}
      activeOpacity={0.8}
      onPress={() => router.push({
        pathname: '/editor/[cardId]',
        params: { cardId: item.id }
      })}
    >
      {item.article.imageUrl ? (
        <Image
          source={{ uri: item.article.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholder} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>History</Text>
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Nothing here yet</Text>
          <Text style={styles.emptySubtitle}>Cards you create will appear here.</Text>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.push('/' as any)}
          >
            <Text style={styles.primaryButtonText}>Create Card</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          numColumns={COLUMNS}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryBorder,
  },
  headerTitle: {
    fontSize: Typography.sectionHeading,
    fontWeight: Typography.semibold,
    color: colors.primaryText,
  },
  listContent: {
    paddingBottom: Spacing.xxxl,
  },
  columnWrapper: {
    gap: GRID_GAP,
    marginBottom: GRID_GAP,
  },
  gridItem: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    backgroundColor: colors.secondarySurface,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    backgroundColor: colors.strongBorder,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontSize: Typography.sectionHeading,
    fontWeight: Typography.semibold,
    color: colors.primaryText,
    marginBottom: Spacing.xs,
  },
  emptySubtitle: {
    fontSize: Typography.body,
    color: colors.secondaryText,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  primaryButton: {
    backgroundColor: colors.primaryAction,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  primaryButtonText: {
    color: colors.primaryActionText,
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
  },
});
