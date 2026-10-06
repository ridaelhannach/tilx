import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, useColorScheme, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import ViewShot from 'react-native-view-shot';

import * as Sharing from 'expo-sharing';
import { Colors, DarkColors, Spacing, Typography, BorderRadius, Shadow, type AppColors } from '@/theme';
import type { Article } from '@/types';
import { CleanTemplate, EditorialTemplate, BreakingTemplate } from '@/components/templates';
import { saveCardToHistory } from '@/database/db';

const TEMPLATES = {
  clean: CleanTemplate,
  editorial: EditorialTemplate,
  breaking: BreakingTemplate,
};

type TemplateId = keyof typeof TEMPLATES;

export default function CardEditorScreen() {
  const { cardId, articleJson } = useLocalSearchParams<{
    cardId: string;
    articleJson?: string;
  }>();

  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? DarkColors : Colors;
  const styles = createStyles(colors);

  const viewShotRef = useRef<any>(null);

  const [template, setTemplate] = React.useState<TemplateId>('clean');

  const article: Article | null = React.useMemo(() => {
    try {
      return articleJson ? JSON.parse(articleJson) : null;
    } catch {
      return null;
    }
  }, [articleJson]);

  const handleExport = async () => {
    try {
      if (viewShotRef.current?.capture) {
        const uri = await viewShotRef.current.capture();
        
        // Save to SQLite History
        if (article) {
          saveCardToHistory(article);
        }

        // Share via native share sheet
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, {
            mimeType: 'image/png',
            dialogTitle: 'Share your SocialCard',
          });
        }
      }
    } catch (err) {
      console.error('Export failed', err);
      alert('Failed to export the card.');
    }
  };

  if (!article) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>No article data found.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const ActiveTemplate = TEMPLATES[template];

  const { width } = useWindowDimensions();
  const canvasDisplaySize = width - Spacing.md * 2;
  const scale = canvasDisplaySize / 1080;

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      {/* Top Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Card Studio</Text>
        <TouchableOpacity onPress={handleExport}>
          <Text style={styles.exportText}>Export</Text>
        </TouchableOpacity>
      </View>

      {/* Canvas Area */}
      <View style={styles.canvasContainer}>
        <View
          style={{
            width: canvasDisplaySize,
            height: canvasDisplaySize,
            overflow: 'hidden',
            backgroundColor: colors.white,
            ...Shadow.md,
            borderRadius: BorderRadius.md,
          }}
        >
          <View
            style={{
              width: 1080,
              height: 1080,
              transform: [
                { translateX: -((1080 - canvasDisplaySize) / 2) },
                { translateY: -((1080 - canvasDisplaySize) / 2) },
                { scale },
              ],
            }}
          >
            <ViewShot
              ref={viewShotRef}
              options={{ format: 'png', quality: 1, width: 1080, height: 1080 }}
              style={styles.canvas}
            >
              <ActiveTemplate article={article} />
            </ViewShot>
          </View>
        </View>
      </View>

      {/* Editor Controls */}
      <View style={styles.controls}>
        <Text style={styles.controlsTitle}>Select Template</Text>
        <View style={styles.templatePicker}>
          {(Object.keys(TEMPLATES) as TemplateId[]).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.templateButton, template === t && styles.templateButtonActive]}
              onPress={() => setTemplate(t)}
            >
              <Text
                style={[
                  styles.templateButtonText,
                  template === t && styles.templateButtonTextActive,
                ]}
              >
                {t.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.grey200,
    },
    cancelText: {
      fontSize: Typography.md,
      color: colors.grey600,
    },
    headerTitle: {
      fontSize: Typography.md,
      fontWeight: Typography.bold,
      color: colors.black,
    },
    exportText: {
      fontSize: Typography.md,
      fontWeight: Typography.bold,
      color: colors.primary,
    },
    canvasContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.grey100,
      padding: Spacing.md,
    },
    canvasWrapper: {
      width: '100%',
      aspectRatio: 1,
      backgroundColor: colors.white,
      ...Shadow.md,
    },
    canvas: {
      flex: 1,
      // React Native ViewShot captures the view as it renders on screen.
      // We scale it naturally here, and ViewShot will use the actual pixel dimensions
      // we specify in the options (if supported) or we might need to handle scaling.
      // For now, we design the template responsive to a 1:1 square.
    },
    controls: {
      height: 200,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.grey200,
      padding: Spacing.md,
      alignItems: 'center',
    },
    controlsTitle: {
      color: colors.grey500,
      fontSize: Typography.sm,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      marginBottom: Spacing.md,
    },
    templatePicker: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
      justifyContent: 'center',
    },
    templateButton: {
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: colors.grey300,
      backgroundColor: colors.surface,
    },
    templateButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    templateButtonText: {
      color: colors.grey700,
      fontWeight: '600',
    },
    templateButtonTextActive: {
      color: colors.white,
    },
    errorText: {
      fontSize: Typography.md,
      color: colors.error,
      textAlign: 'center',
      marginTop: Spacing.xxl,
    },
    backButton: {
      marginTop: Spacing.lg,
      alignSelf: 'center',
      padding: Spacing.md,
      backgroundColor: colors.primary,
      borderRadius: BorderRadius.md,
    },
    backButtonText: {
      color: colors.white,
      fontWeight: Typography.bold,
    },
  });
}
