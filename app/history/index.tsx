import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius, Shadow } from '@/theme';
import { getHistory, deleteCardFromHistory, type SavedCard } from '@/database/db';

export default function HistoryScreen() {
  const router = useRouter();
  const [cards, setCards] = useState<SavedCard[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const history = getHistory();
      setCards(history);
    } catch (e) {
      console.error('Failed to load history', e);
    }
  };

  const handleOpenCard = (card: SavedCard) => {
    const safeUrl = encodeURIComponent(card.article.url);
    const articleJson = encodeURIComponent(JSON.stringify(card.article));
    router.push(`/editor/${safeUrl}?articleJson=${articleJson}`);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Card', 'Are you sure you want to remove this from your history?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive', 
        onPress: () => {
          deleteCardFromHistory(id);
          loadHistory();
        } 
      }
    ]);
  };

  const renderItem = ({ item }: { item: SavedCard }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => handleOpenCard(item)}
      onLongPress={() => handleDelete(item.id)}
    >
      <View style={styles.cardImageContainer}>
        {item.article.imageUrl ? (
          <Image source={{ uri: item.article.imageUrl }} style={styles.cardImage} resizeMode="cover" />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>{item.article.source}</Text>
          </View>
        )}
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.article.title}</Text>
        <Text style={styles.cardDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>Close</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History</Text>
        <View style={{ width: 40 }} /> {/* Spacer */}
      </View>

      {cards.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No cards generated yet.</Text>
          <Text style={styles.emptySubtext}>Cards you export will appear here.</Text>
        </View>
      ) : (
        <FlatList
          data={cards}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey200,
  },
  backText: {
    fontSize: Typography.md,
    color: Colors.grey600,
  },
  headerTitle: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.black,
  },
  listContent: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  cardImageContainer: {
    width: 80,
    height: 80,
    backgroundColor: Colors.grey100,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  placeholderText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 2,
  },
  cardContent: {
    flex: 1,
    padding: Spacing.sm,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.black,
  },
  cardDate: {
    fontSize: Typography.xs,
    color: Colors.grey500,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    fontSize: Typography.md,
    color: Colors.grey500,
    textAlign: 'center',
  },
});
