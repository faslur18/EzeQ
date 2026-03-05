import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import { env } from '../config/env';

const sqlite = new Database(env.sqliteDbPath);
export const db = drizzle(sqlite, { schema });
