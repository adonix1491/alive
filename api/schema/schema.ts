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
    phoneNumber: text('phone_number'),
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
    checkedAt: timestamp('checked_at').defaultNow().notNull(),
    latitude: text('latitude'),
    longitude: text('longitude'),
    note: text('note'),
});

/**
 * 緊急聯絡人表
 */
export const emergencyContacts = pgTable('emergency_contacts', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    name: text('name').notNull(),
    phoneNumber: text('phone_number').notNull(),
    email: text('email'),
    relationship: text('relationship'),
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
    notificationEmail: text('notification_email'),
    emailVerificationCode: text('email_verification_code'),
    emailVerificationExpiresAt: timestamp('email_verification_expires_at'),
    emailVerificationSentAt: timestamp('email_verification_sent_at'),
    lineEnabled: boolean('line_enabled').default(false).notNull(),
    lineUserId: text('line_user_id'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * 訊息模板表
 */
export const messageTemplates = pgTable('message_templates', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    type: text('type').notNull(), // 'custom' | 'default'
    title: text('title'),
    content: text('content').notNull(),
    isDefault: boolean('is_default').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
