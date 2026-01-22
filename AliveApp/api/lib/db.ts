/**
 * 資料庫連線設定
 */
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from '../schema/models';

export const db = drizzle(sql, { schema });
