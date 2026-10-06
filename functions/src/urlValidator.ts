/**
 * URL validation with SSRF protection.
 *
 * Blocks:
 *  - Non-HTTP/HTTPS schemes
 *  - Loopback addresses (127.x.x.x, ::1)
 *  - Private network ranges (10.x, 172.16-31.x, 192.168.x)
 *  - Link-local (169.254.x)
 *  - Localhost hostnames
 *  - File / FTP / other dangerous schemes
 *  - Extremely long URLs
 */

const MAX_URL_LENGTH = 2048;

/** Private / reserved IPv4 ranges */
const PRIVATE_IP_PATTERNS = [
  /^127\./,                        // loopback
  /^10\./,                         // class A private
  /^172\.(1[6-9]|2\d|3[01])\./,   // class B private
  /^192\.168\./,                    // class C private
  /^169\.254\./,                    // link-local
  /^0\./,                          // invalid
  /^::1$/,                         // IPv6 loopback
  /^fc00:/i,                       // IPv6 unique-local
  /^fd[0-9a-f]{2}:/i,              // IPv6 unique-local
];

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  'local',
  'internal',
  'intranet',
  'broadcasthost',
]);

export interface UrlValidationResult {
  valid: true;
  url: string;
}

export interface UrlValidationFailure {
  valid: false;
  reason: string;
}

export function validateUrl(
  raw: string,
): UrlValidationResult | UrlValidationFailure {
  if (raw.length > MAX_URL_LENGTH) {
    return { valid: false, reason: 'The URL is too long.' };
  }

  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return { valid: false, reason: 'The URL is not valid.' };
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return {
      valid: false,
      reason: 'Only http and https URLs are supported.',
    };
  }

  const hostname = parsed.hostname.toLowerCase();

  if (BLOCKED_HOSTNAMES.has(hostname) || hostname.endsWith('.local')) {
    return { valid: false, reason: 'This URL is not accessible.' };
  }

  for (const pattern of PRIVATE_IP_PATTERNS) {
    if (pattern.test(hostname)) {
      return { valid: false, reason: 'This URL is not accessible.' };
    }
  }

  // Normalise: remove fragment, ensure the URL is clean
  parsed.hash = '';
  return { valid: true, url: parsed.toString() };
}
