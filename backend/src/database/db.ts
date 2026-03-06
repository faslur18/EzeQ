import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import { env } from '../config/env';

const sqlite = new Database(env.sqliteDbPath);

const ensureSalonImageColumns = () => {
  const tableInfo = sqlite.prepare("PRAGMA table_info('salons')").all() as Array<{ name: string }>;
  const columnNames = new Set(tableInfo.map((column) => column.name));

  if (!columnNames.has('description')) {
    sqlite.exec('ALTER TABLE salons ADD COLUMN description TEXT');
  }

  if (!columnNames.has('contact_phone')) {
    sqlite.exec('ALTER TABLE salons ADD COLUMN contact_phone TEXT');
  }

  if (!columnNames.has('contact_email')) {
    sqlite.exec('ALTER TABLE salons ADD COLUMN contact_email TEXT');
  }

  if (!columnNames.has('profile_image')) {
    sqlite.exec('ALTER TABLE salons ADD COLUMN profile_image TEXT');
  }

  if (!columnNames.has('cover_image')) {
    sqlite.exec('ALTER TABLE salons ADD COLUMN cover_image TEXT');
  }
};

ensureSalonImageColumns();

export const db = drizzle(sqlite, { schema });
