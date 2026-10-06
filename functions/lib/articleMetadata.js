"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.articleMetadata = void 0;
const https_1 = require("firebase-functions/v2/https");
const metadataParser_1 = require("./metadataParser");
const urlValidator_1 = require("./urlValidator");
/** Maximum size of the fetched HTML response (512 KB) */
const MAX_RESPONSE_BYTES = 512 * 1024;
/** HTTP request timeout in milliseconds */
const FETCH_TIMEOUT_MS = 10000;
/**
 * POST /article/metadata
 *
 * Accepts a URL, fetches the page, parses Open Graph / Twitter Card / HTML
 * metadata, and returns a normalized article metadata object.
 *
 * Security:
 *  - URL is validated and sanitised before any network request.
 *  - Only http and https are accepted.
 *  - Private/loopback addresses are blocked (SSRF prevention).
 *  - Response size is capped.
 *  - Timeout enforced on the outbound request.
 */
exports.articleMetadata = (0, https_1.onRequest)({
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB',
    cors: true,
}, async (req, res) => {
    // Only accept POST
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed. Use POST.' });
        return;
    }
    const body = req.body;
    const rawUrl = body?.url;
    if (typeof rawUrl !== 'string' || !rawUrl.trim()) {
        res.status(400).json({ error: 'Missing required field: url' });
        return;
    }
    // Validate & sanitise URL
    const validation = (0, urlValidator_1.validateUrl)(rawUrl.trim());
    if (!validation.valid) {
        res.status(400).json({ error: validation.reason });
        return;
    }
    const targetUrl = validation.url;
    try {
        const html = await fetchHtml(targetUrl);
        const meta = (0, metadataParser_1.parseMetadata)(html, targetUrl);
        const response = {
            url: targetUrl,
            title: meta.title,
            description: meta.description,
            imageUrl: meta.imageUrl,
            source: meta.source,
            domain: meta.domain,
        };
        res.status(200).json(response);
    }
    catch (err) {
        console.error('[articleMetadata] fetch error:', err);
        if (err instanceof FetchError) {
            res.status(502).json({ error: err.message });
            return;
        }
        res.status(500).json({
            error: 'Unable to read the article. Please try again or enter details manually.',
        });
    }
});
// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------
class FetchError extends Error {
    constructor(message) {
        super(message);
        this.name = 'FetchError';
    }
}
async function fetchHtml(url) {
    // We use the global fetch available in Node 18+
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    let response;
    try {
        response = await fetch(url, {
            signal: controller.signal,
            redirect: 'follow',
            headers: {
                'User-Agent': 'Tilx/1.0 (+https://tilx.app; article-metadata-bot)',
                Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
            },
        });
    }
    catch (err) {
        clearTimeout(timer);
        if (err instanceof Error && err.name === 'AbortError') {
            throw new FetchError('The article page took too long to respond.');
        }
        throw new FetchError('Could not reach the article page. Please check the URL.');
    }
    finally {
        clearTimeout(timer);
    }
    if (!response.ok) {
        throw new FetchError(`The article page returned an error (${response.status}). It may be unavailable.`);
    }
    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml')) {
        throw new FetchError('This URL does not point to an article page.');
    }
    // Cap response size to prevent memory abuse
    const reader = response.body?.getReader();
    if (!reader) {
        throw new FetchError('Could not read the article page.');
    }
    const chunks = [];
    let totalBytes = 0;
    const decoder = new TextDecoder();
    while (true) {
        const { done, value } = await reader.read();
        if (done)
            break;
        totalBytes += value.byteLength;
        if (totalBytes > MAX_RESPONSE_BYTES) {
            await reader.cancel();
            // We still have a large chunk of HTML — parse what we have
            break;
        }
        chunks.push(value);
    }
    return chunks.map((c) => decoder.decode(c, { stream: true })).join('') +
        decoder.decode();
}
//# sourceMappingURL=articleMetadata.js.map