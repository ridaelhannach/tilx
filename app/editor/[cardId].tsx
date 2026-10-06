import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, useColorScheme, useWindowDimensions, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import ViewShot from 'react-native-view-shot';

import * as Sharing from 'expo-sharing';
import { Colors, DarkColors, Spacing, Typography, BorderRadius, type AppColors } from '@/theme';
import type { Article } from '@/types';
import { CleanTemplate, EditorialTemplate, BreakingTemplate } from '@/components/templates';
import { saveCardToHistory } from '@/database/db';
import { ChevronLeft, Edit2, Image as ImageIcon, SlidersHorizontal } from 'lucide-react-native';

const TEMPLATES = {
  clean: { name: 'Clean', component: CleanTemplate },
  editorial: { name: 'Editorial', component: EditorialTemplate },
  breaking: { name: 'Breaking', component: BreakingTemplate },
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
  const { width } = useWindowDimensions();

  const viewShotRef = useRef<any>(null);
  const [template, setTemplate] = useState<TemplateId>('clean');
  
  // Sheet state (none = closed)
  const [activeSheet, setActiveSheet] = useState<'edit' | 'image' | 'overlay' | 'none'>('none');

  const article: Article | null = React.useMemo(() => {
    try {
      return articleJson ? JSON.parse(articleJson) : null;
    } catch {
      return null;
    }
  }, [articleJson]);

  const handleDone = async () => {
    try {
      if (viewShotRef.current?.capture) {
        const uri = await viewShotRef.current.capture();
        if (article) {
          saveCardToHistory(article);
          router.push({
            pathname: '/share',
            params: { 
              uri, 
              title: article.title,
              source: article.source || article.domain,
              url: article.url
            }
          });
        }
      }
    } catch (e) {
      console.error('Failed to export', e);
    }
  };

  if (!article) return null;

  const ActiveTemplate = TEMPLATES[template].component;

  // Calculate the scale to fit the 1080x1080 template inside the phone screen
  // Leave 32px total horizontal padding
  const previewSize = width - (Spacing.lg * 2);
  const scale = previewSize / 1080;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <ChevronLeft color={colors.primaryText} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit</Text>
        <TouchableOpacity onPress={handleDone} style={styles.headerButtonRight}>
          <Text style={styles.headerActionText}>Done</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Card Preview */}
        <View style={styles.previewContainer}>
          <View style={[styles.previewWrapper, { width: previewSize, height: previewSize }]}>
            <View style={[styles.scaler, { transform: [{ scale }] }]}>
              <ViewShot
                ref={viewShotRef}
                options={{ format: 'png', quality: 1.0, result: 'tmpfile' }}
                style={styles.viewShotCanvas}
              >
                <ActiveTemplate article={article} />
              </ViewShot>
            </View>
          </View>
        </View>

        {/* Template Selector */}
        <View style={styles.templatesSection}>
          <Text style={styles.sectionLabel}>Template</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.templateScroll}>
            {(Object.keys(TEMPLATES) as TemplateId[]).map((tId) => {
              const isSelected = template === tId;
              return (
                <TouchableOpacity
                  key={tId}
                  style={styles.templateItem}
                  onPress={() => setTemplate(tId)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.templatePreview, isSelected && styles.templatePreviewSelected]}>
                    <View style={styles.fakeCard} />
                  </View>
                  <Text style={[styles.templateName, isSelected && styles.templateNameSelected]}>
                    {TEMPLATES[tId].name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Bottom Toolbar */}
        <View style={styles.toolbar}>
          <TouchableOpacity style={styles.toolButton} onPress={() => setActiveSheet('edit')}>
            <Edit2 color={colors.primaryText} size={22} />
            <Text style={styles.toolText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolButton} onPress={() => setActiveSheet('image')}>
            <ImageIcon color={colors.primaryText} size={22} />
            <Text style={styles.toolText}>Image</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolButton} onPress={() => setActiveSheet('overlay')}>
            <SlidersHorizontal color={colors.primaryText} size={22} />
            <Text style={styles.toolText}>Overlay</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Basic Sheets (Simulated for MVP Phase 5) */}
      {activeSheet !== 'none' && (
        <>
          <TouchableOpacity style={styles.sheetBackdrop} activeOpacity={1} onPress={() => setActiveSheet('none')} />
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>
              {activeSheet === 'edit' ? 'Edit Details' : activeSheet === 'image' ? 'Image' : 'Overlay'}
            </Text>
            <View style={styles.sheetContent}>
              <Text style={styles.sheetPlaceholder}>
                (Settings for {activeSheet} go here)
              </Text>
            </View>
          </View>
        </>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: Spacing.sm,
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
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewWrapper: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.secondarySurface,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  scaler: {
    width: 1080,
    height: 1080,
    transformOrigin: 'top left', // RN supports this on web, on mobile it transforms from center by default.
    // To fix transform scaling in RN from top-left, we position it:
    position: 'absolute',
    left: 0,
    top: 0,
    // Workaround for transform origin top-left in React Native:
    transformMatrix: undefined, // Let scale do its job, but we'll center it anyway
  },
  viewShotCanvas: {
    width: 1080,
    height: 1080,
  },
  templatesSection: {
    paddingVertical: Spacing.xl,
  },
  sectionLabel: {
    fontSize: Typography.secondaryBody,
    fontWeight: Typography.semibold,
    color: colors.secondaryText,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  templateScroll: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  templateItem: {
    alignItems: 'center',
    width: 72,
  },
  templatePreview: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
    backgroundColor: colors.secondarySurface,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: Spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  templatePreviewSelected: {
    borderColor: colors.brandGradientStart, // Use brand accent for selection ring
  },
  fakeCard: {
    width: 40,
    height: 40,
    backgroundColor: colors.primaryBorder,
    borderRadius: BorderRadius.sm,
  },
  templateName: {
    fontSize: Typography.navLabel,
    color: colors.secondaryText,
    fontWeight: Typography.medium,
  },
  templateNameSelected: {
    color: colors.primaryText,
    fontWeight: Typography.bold,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.primaryBorder,
    backgroundColor: colors.background,
  },
  toolButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.sm,
    width: 80,
  },
  toolText: {
    fontSize: Typography.navLabel,
    color: colors.primaryText,
    marginTop: 4,
    fontWeight: Typography.medium,
  },
  sheetBackdrop: {
    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.elevatedSurface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxxl,
    minHeight: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.strongBorder,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.xl,
  },
  sheetTitle: {
    fontSize: Typography.sectionHeading,
    fontWeight: Typography.semibold,
    color: colors.primaryText,
    marginBottom: Spacing.lg,
  },
  sheetContent: {
    flex: 1,
  },
  sheetPlaceholder: {
    color: colors.mutedText,
    fontSize: Typography.body,
  },
});
