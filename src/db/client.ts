// -----------------------------------------------------------
// 🗄️ FlowMind 2.0 — SQLite/Drizzle client
// Tek bir DB handle'ı (singleton) — Fast Refresh sırasında tekrar
// açılmasını engellemek için modül seviyesinde saklanır.
// -----------------------------------------------------------

import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

import * as schema from './schema';

const expoDb = openDatabaseSync('flowmind.db');

export const db = drizzle(expoDb, { schema });
