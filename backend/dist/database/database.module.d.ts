import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
export declare const DATABASE_CONNECTION = "DATABASE_CONNECTION";
declare const db: BetterSQLite3Database<Record<string, never>> & {
    $client: Database.Database;
};
export declare class DatabaseModule {
}
export { db, schema };
export type DrizzleDB = BetterSQLite3Database;
