/**
 * Email Service (Simplified)
 */
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export async function sendVerificationEmail(email: string, code: string): Promise<void> {
    console.log('Mock sending verification email', email, code);
}

export async function sendEmergencyEmail(email: string, userName: string, message: string): Promise<void> {
    console.log('Mock sending emergency email', email);
}

export function generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
