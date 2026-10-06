import type { Article } from '@/types';

/**
 * The base URL for the Firebase Cloud Function.
 *
 * During development, set EXPO_PUBLIC_API_URL in your .env.local file.
 * In production (EAS Build), set this in your eas.json environment config.
 *
 * Example: https://us-central1-tilx-xxxxx.cloudfunctions.net
 */
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

/** Request/response timeout in milliseconds */
const REQUEST_TIMEOUT_MS = 15_000;

export class ArticleMetadataError extends Error {
  constructor(
    message: string,
    public readonly code: 'INVALID_URL' | 'FETCH_FAILED' | 'PARSE_FAILED' | 'TIMEOUT' | 'NETWORK',
  ) {
    super(message);
    this.name = 'ArticleMetadataError';
  }
}

/**
 * Fetches article metadata from the Firebase Cloud Function.
 *
 * POST /article/metadata
 * Body: { url: string }
 * Response: ArticleMetadataResponse
 */
export async function fetchArticleMetadata(url: string): Promise<Article> {
  if (!API_BASE_URL) {
    throw new ArticleMetadataError(
      'API URL is not configured. Set EXPO_PUBLIC_API_URL in your environment.',
      'FETCH_FAILED',
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}/article/metadata`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ url }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({})) as Record<string, unknown>;
      const message =
        typeof errorBody['message'] === 'string'
          ? errorBody['message']
          : `Request failed with status ${response.status}`;
      throw new ArticleMetadataError(message, 'FETCH_FAILED');
    }

    const data = await response.json() as ArticleMetadataResponse;
    return normalizeArticle(url, data);
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err instanceof ArticleMetadataError) throw err;

    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        throw new ArticleMetadataError(
          'The request took too long. Please check your connection and try again.',
          'TIMEOUT',
        );
      }
      if (err.message.includes('Network request failed') || err.message.includes('fetch')) {
        throw new ArticleMetadataError(
          'No internet connection. Please check your network and try again.',
          'NETWORK',
        );
      }
    }

    throw new ArticleMetadataError(
      'Something went wrong while reading the article. Please try again.',
      'FETCH_FAILED',
    );
  }
}

// ---------------------------------------------------------------------------
// Internal types & normalization
// ---------------------------------------------------------------------------

interface ArticleMetadataResponse {
  url: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  source?: string;
  domain?: string;
}

function normalizeArticle(originalUrl: string, data: ArticleMetadataResponse): Article {
  const domain = data.domain ?? extractDomain(data.url ?? originalUrl);
  return {
    id: generateId(),
    url: originalUrl,
    canonicalUrl: data.url !== originalUrl ? data.url : undefined,
    title: data.title?.trim() ?? '',
    description: data.description?.trim() ?? undefined,
    imageUrl: data.imageUrl?.trim() || undefined,
    source: data.source?.trim() ?? domain,
    domain,
  };
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
