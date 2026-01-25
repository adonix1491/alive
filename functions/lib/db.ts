/**
 * 資料庫連線設定
 */
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from '../schema/schema';

// @ts-ignore - Vercel Postgres type mismatch workaround
export const db = drizzle(sql, { schema });
