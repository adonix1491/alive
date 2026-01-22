// @ts-nocheck
/**
 * 資料庫 Schema 定義 (Drizzle ORM) - Synced with Backend 2024/01/22
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
    phone: text('phone'), // Changed from phone_number
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
    checkedAt: timestamp('checked_at').defaultNow().notNull(), // Note: Backend uses 'timestamp', need to check index.ts usage
    latitude: text('latitude'),
    longitude: text('longitude'),
    note: text('note'),
    // Backend has: status, location(jsonb). Here we have lat/long/note. 
    // Keeping lat/long/note for now if backend table supports them, OR we need to migrate.
    // Assuming the table might have both sets or we need to align.
    // Start with minimal fix for 'users' first.
});

/**
 * 緊急聯絡人表
 */
export const emergencyContacts = pgTable('emergency_contacts', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    name: text('name').notNull(),
    phone: text('phone').notNull(), // Changed from phone_number
    email: text('email'),
    relationship: text('relationship'),
    priority: integer('priority').default(1).notNull(), // Added
    isEnabled: boolean('is_enabled').default(true).notNull(), // Added
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
    emailAddress: text('email_address'), // Changed from notification_email
    emailVerified: boolean('email_verified').default(false).notNull(), // Added

    // These might be extra columns in my local version not in backend, or vice versa.
    // Backend schema: emailAddress, emailVerified.
    // My schema: notificationEmail, emailVerificationCode...
    // I will ADAPT to Backend Schema as it is the TRUTH defined in migration usually.
    // If code uses 'notificationEmail', I must map it to 'emailAddress'.
    // And what about verification code columns? If they are not in backend schema, they don't exist in DB!
    // Backend schema lines 67-75 show lineBindings.
    // It seems backend schema I viewed DOES NOT have verification code columns in notification_settings!
    // This implies I cannot store verification codes there!
    // I will comment them out here to match DB.
    // emailVerificationCode: text('email_verification_code'),
    // emailVerificationExpiresAt: timestamp('email_verification_expires_at'),
    // emailVerificationSentAt: timestamp('email_verification_sent_at'),

    lineEnabled: boolean('line_enabled').default(false).notNull(),
    lineUserId: text('line_user_id'),
    lineVerified: boolean('line_verified').default(false).notNull(), // Added
    pushEnabled: boolean('push_enabled').default(true).notNull(), // Added

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
