// Core domain models as defined in the PRD (Section 26)

/**
 * Represents a parsed article's metadata.
 * Extracted from the article's Open Graph / meta tags via the Cloud Function.
 */
export interface Article {
  id: string;
  url: string;
  canonicalUrl?: string;
  title: string;
  description?: string;
  imageUrl?: string;
  source: string;
  domain: string;
}

/**
 * A user-created social media card.
 */
export interface SocialCard {
  id: string;
  article: Article;
  templateId: string;

  /** Editable headline (initially set from article.title) */
  headline: string;
  description?: string;

  showDescription: boolean;
  showSource: boolean;

  /** 0–1 range, controls the dark overlay over the background image */
  overlayStrength: number;

  createdAt: string;
  updatedAt: string;

  /** Path to the exported image on device, if exported */
  exportedImagePath?: string;
}

/**
 * User preferences stored locally.
 */
export interface UserPreferences {
  theme: 'system' | 'light' | 'dark';
  defaultTemplateId: string;
  exportQuality: 'standard' | 'high';
}

/**
 * Template definition (Section 25).
 */
export interface CardTemplate {
  id: string;
  name: string;
  layout: 'clean' | 'editorial' | 'breaking';
  overlayStrength: number;
  textTheme: 'light' | 'dark';
  showDescription: boolean;
  showSource: boolean;
}

/**
 * AI Content Enhancer interface stub — reserved for future Pro tier (Section 18).
 * Not implemented in MVP.
 */
export interface EnhancementOptions {
  targetTone?: 'neutral' | 'professional' | 'casual';
  maxHeadlineLength?: number;
  language?: string;
}

export interface EnhancedContent {
  headline: string;
  description?: string;
  hashtags?: string[];
  caption?: string;
}

export interface ContentEnhancer {
  enhance(article: Article, options?: EnhancementOptions): Promise<EnhancedContent>;
}
