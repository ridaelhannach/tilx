import * as SQLite from 'expo-sqlite';
import type { Article } from '@/types';

// Synchronous db opening (new in expo-sqlite API)
const db = SQLite.openDatabaseSync('socialcard.db');

export interface SavedCard {
  id: string;
  article: Article;
  createdAt: number;
}

export function initDb() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS history (
      id TEXT PRIMARY KEY NOT NULL,
      url TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      imageUrl TEXT,
      source TEXT NOT NULL,
      domain TEXT NOT NULL,
      createdAt INTEGER NOT NULL
    );
  `);
}

export function saveCardToHistory(article: Article) {
  // Generate a unique ID based on the URL and current time to allow saving the same URL multiple times,
  // or we can just use the URL as a primary key to overwrite it.
  // The PRD says "save generated cards". We'll use URL as ID for simplicity, or generate a random one.
  // Let's use a combination so we don't duplicate the exact same card url if they make it twice?
  // Actually, replacing by URL makes history cleaner.
  const statement = db.prepareSync(
    'INSERT OR REPLACE INTO history (id, url, title, description, imageUrl, source, domain, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );
  
  const id = article.url; // Use URL as unique identifier
  const createdAt = Date.now();
  
  statement.executeSync([
    id,
    article.url,
    article.title,
    article.description || null,
    article.imageUrl || null,
    article.source,
    article.domain,
    createdAt
  ]);
}

export function getHistory(): SavedCard[] {
  const rows = db.getAllSync<{
    id: string;
    url: string;
    title: string;
    description: string | null;
    imageUrl: string | null;
    source: string;
    domain: string;
    createdAt: number;
  }>('SELECT * FROM history ORDER BY createdAt DESC');

  return rows.map(row => ({
    id: row.id,
    createdAt: row.createdAt,
    article: {
      id: row.url,
      url: row.url,
      title: row.title,
      description: row.description || undefined,
      imageUrl: row.imageUrl || undefined,
      source: row.source,
      domain: row.domain,
    }
  }));
}

export function deleteCardFromHistory(id: string) {
  db.runSync('DELETE FROM history WHERE id = ?', [id]);
}

export function clearHistory() {
  db.runSync('DELETE FROM history');
}
