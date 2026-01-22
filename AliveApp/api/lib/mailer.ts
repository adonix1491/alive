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
    console.log('Sending verification email to:', email, 'Code:', code);
    try {
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'ALIVE 驗證碼',
            text: `您的驗證碼是：${code}，請在 10 分鐘內使用。`,
        });
    } catch (error) {
        console.error('Email send failed:', error);
        throw error;
    }
}

export async function sendEmergencyEmail(email: string, userName: string, message: string): Promise<void> {
    console.log('Sending emergency email to:', email);
    try {
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: email,
            subject: `緊急通知：${userName} 需要協助`,
            text: `緊急通知：\n\n${userName} 剛剛發出了緊急求救訊號。\n\n訊息內容：${message}\n\n請盡快確認狀況。`,
        });
    } catch (error) {
        console.error('Emergency email send failed:', error);
    }
}

export function generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
