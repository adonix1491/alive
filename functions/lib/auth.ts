/**
 * JWT 認證相關功能
 */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';
const SALT_ROUNDS = 10;

/**
 * 雜湊密碼
 */
export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * 比對密碼
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
};

/**
 * 產生 JWT Token
 */
export const generateToken = (userId: number): string => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

/**
 * 驗證 JWT Token
 */
export const verifyToken = (token: string): { userId: number } | null => {
    try {
        return jwt.verify(token, JWT_SECRET) as { userId: number };
    } catch {
        return null;
    }
};
