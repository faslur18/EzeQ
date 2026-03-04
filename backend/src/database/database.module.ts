import { Global, Module } from '@nestjs/common';
import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import * as path from 'path';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

// Use the same dev.db from the root project
const dbPath = path.resolve(__dirname, '..', '..', '..', 'dev.db');
const sqlite = new Database(dbPath);
const db = drizzle(sqlite);

@Global()
@Module({
    providers: [
        {
            provide: DATABASE_CONNECTION,
            useValue: db,
        },
    ],
    exports: [DATABASE_CONNECTION],
})
export class DatabaseModule { }

export { db, schema };
export type DrizzleDB = BetterSQLite3Database;
