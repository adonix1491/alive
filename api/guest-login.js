// Debugging: Commented out dependencies to verify deployment
// const { sql } = require('@vercel/postgres');
// const { drizzle } = require('drizzle-orm/vercel-postgres');
const { pgTable, serial, text, timestamp, integer, boolean } = require('drizzle-orm/pg-core');
const { eq } = require('drizzle-orm');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

// Setup DB
// const db = drizzle(sql);

// Inline Schema
const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    phoneNumber: text('phone_number'),
    lineId: text('line_id'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

const notificationSettings = pgTable('notification_settings', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id),
    emailEnabled: boolean('email_enabled').default(false),
    lineEnabled: boolean('line_enabled').default(false),
    notificationEmail: text('notification_email'),
    // ... other fields omitted if not used in login
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Auth Utils
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function hashPassword(password) {
    // return await bcrypt.hash(password, SALT_ROUNDS);
    return "mock_hashed_password";
}

function generateToken(userId) {
    // return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });
    return "mock_jwt_token";
}

// Enable CORS helper
const allowCors = (fn) => async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    return await fn(req, res);
};

async function handler(req, res) {
    // Return mock response to confirm file is reachable
    return res.status(200).json({
        token: "mock-token-debug",
        user: { id: 999, name: "Debug User", email: "debug@alive.app" },
        debug: "Core logic disabled for dependency check"
    });
}

// Export raw handler for Express usage
module.exports = handler;
