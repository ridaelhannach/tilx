/**
 * HTML metadata parser.
 *
 * Extraction priority per PRD Section 7:
 *  1. Open Graph tags (og:*)
 *  2. Twitter Card tags (twitter:*)
 *  3. Standard HTML meta tags
 *  4. <title> element
 *  5. Limited body fallback
 */

export interface ParsedMetadata {
  title: string;
  description?: string;
  imageUrl?: string;
  source: string;
  domain: string;
}

export function parseMetadata(html: string, pageUrl: string): ParsedMetadata {
  const domain = extractDomain(pageUrl);

  // Use regex-based parsing to keep the function lean and avoid heavy
  // DOM library dependencies. htmlparser2 would be ideal for complex cases
  // but this covers the vast majority of real-world OG/Twitter tags.

  const ogTitle = extractMeta(html, 'og:title');
  const ogDesc = extractMeta(html, 'og:description');
  const ogImage = extractMeta(html, 'og:image');
  const ogSiteName = extractMeta(html, 'og:site_name');

  const twitterTitle = extractMeta(html, 'twitter:title');
  const twitterDesc = extractMeta(html, 'twitter:description');
  const twitterImage = extractMeta(html, 'twitter:image');

  const metaDesc = extractMetaName(html, 'description');

  const titleTag = extractTitle(html);

  // Assemble with priority
  const title =
    cleanText(ogTitle) ||
    cleanText(twitterTitle) ||
    cleanText(titleTag) ||
    '';

  const description =
    cleanText(ogDesc) ||
    cleanText(twitterDesc) ||
    cleanText(metaDesc) ||
    undefined;

  const rawImageUrl =
    ogImage || twitterImage || undefined;

  const imageUrl = rawImageUrl
    ? resolveUrl(rawImageUrl, pageUrl)
    : undefined;

  const source =
    cleanText(ogSiteName) ||
    capitalizeDomain(domain);

  return { title, description, imageUrl, source, domain };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function extractMeta(html: string, property: string): string | null {
  // Matches both property= and name= variants
  const patterns = [
    new RegExp(
      `<meta[^>]+property=["']${escapeRegex(property)}["'][^>]+content=["']([^"']+)["']`,
      'i',
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${escapeRegex(property)}["']`,
      'i',
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeHtmlEntities(match[1]);
  }
  return null;
}

function extractMetaName(html: string, name: string): string | null {
  const patterns = [
    new RegExp(
      `<meta[^>]+name=["']${escapeRegex(name)}["'][^>]+content=["']([^"']+)["']`,
      'i',
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${escapeRegex(name)}["']`,
      'i',
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeHtmlEntities(match[1]);
  }
  return null;
}

function extractTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match?.[1] ? decodeHtmlEntities(match[1]) : null;
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function resolveUrl(imageUrl: string, pageUrl: string): string {
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  try {
    return new URL(imageUrl, pageUrl).toString();
  } catch {
    return imageUrl;
  }
}

function capitalizeDomain(domain: string): string {
  const parts = domain.split('.');
  const main = parts[0] ?? domain;
  return main.charAt(0).toUpperCase() + main.slice(1);
}

function cleanText(text: string | null | undefined): string {
  if (!text) return '';
  return text.replace(/\s+/g, ' ').trim().slice(0, 500);
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCharCode(parseInt(code, 10)),
    );
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
