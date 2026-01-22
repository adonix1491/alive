/**
 * 資料庫 Schema 定義 (Drizzle ORM)
 */
import { pgTable, serial, text, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core';

/**
 * 使用者表
 */
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    name: text('name').notNull(),
    phone: text('phone'),
    lineId: text('line_id'),
    avatarUrl: text('avatar_url'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * 簽到記錄表
 */
export const checkIns = pgTable('check_ins', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    timestamp: timestamp('timestamp').defaultNow().notNull(),
    status: text('status').notNull(), // 'completed', 'missed', 'pending'
    location: jsonb('location'), // { latitude, longitude }
});

/**
 * 緊急聯絡人表
 */
export const emergencyContacts = pgTable('emergency_contacts', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    name: text('name').notNull(),
    phone: text('phone').notNull(),
    email: text('email'),
    lineId: text('line_id'),
    relationship: text('relationship'),
    priority: integer('priority').notNull(),
    isEnabled: boolean('is_enabled').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * 通知設定表
 */
export const notificationSettings = pgTable('notification_settings', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
    emailEnabled: boolean('email_enabled').default(false).notNull(),
    emailAddress: text('email_address'),
    emailVerified: boolean('email_verified').default(false).notNull(),
    lineEnabled: boolean('line_enabled').default(false).notNull(),
    lineUserId: text('line_user_id'),
    lineVerified: boolean('line_verified').default(false).notNull(),
    pushEnabled: boolean('push_enabled').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * LINE 綁定記錄表
 */
export const lineBindings = pgTable('line_bindings', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    lineUserId: text('line_user_id').notNull().unique(),
    bindingCode: text('binding_code').notNull().unique(),
    verified: boolean('verified').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    verifiedAt: timestamp('verified_at'),
});

/**
 * 訊息模板表
 */
export const messageTemplates = pgTable('message_templates', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    type: text('type').notNull(), // 'custom', 'check_in', 'emergency'
    title: text('title'),
    content: text('content').notNull(),
    isDefault: boolean('is_default').default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
