/**
 * Email 服務
 * 使用 Nodemailer + Gmail SMTP 發送郵�?
 */
import nodemailer from 'nodemailer';

// Gmail SMTP 配置
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

/**
 * 發�?Email 驗證�?
 */
export async function sendVerificationEmail(email: string, code: string): Promise<void> {
    const mailOptions = {
        from: `ALIVE 愛來 <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'ALIVE 愛來 - Email 驗證�?,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4CAF50;">ALIVE 愛來 - Email 驗證</h2>
                <p>您的驗證碼是�?/p>
                <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333;">
                    ${code}
                </div>
                <p style="color: #666; margin-top: 20px;">
                    此驗證碼將在 10 分鐘後失效�?br>
                    如果您沒有請求此驗證碼，請忽略此郵件�?
                </p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                <p style="color: #999; font-size: 12px;">
                    這是一封自動發送的郵件，請勿回覆�?br>
                    © 2026 ALIVE 愛來. All rights reserved.
                </p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent to:', email);
    } catch (error) {
        console.error('Failed to send email:', error);
        throw new Error('發送驗證郵件失�?);
    }
}

/**
 * 發送緊急通知郵件
 */
export async function sendEmergencyEmail(
    email: string,
    userName: string,
    message: string
): Promise<void> {
    const mailOptions = {
        from: `ALIVE 愛來 <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `⚠️ ALIVE 緊急通知 - ${userName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #ff5252; color: white; padding: 20px;">
                    <h2 style="margin: 0;">⚠️ 緊急通知</h2>
                </div>
                <div style="padding: 20px; background-color: #fff3cd;">
                    <h3>${userName} 需要您的關�?/h3>
                    <p style="font-size: 16px; line-height: 1.6;">
                        ${message}
                    </p>
                </div>
                <div style="padding: 20px; background-color: #f5f5f5;">
                    <p style="color: #666;">
                        <strong>時間�?/strong> ${new Date().toLocaleString('zh-TW')}<br>
                        <strong>來源�?/strong> ALIVE 愛來健康監測系統
                    </p>
                </div>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                <p style="color: #999; font-size: 12px; padding: 0 20px;">
                    這是一封自動發送的緊急通知郵件�?br>
                    © 2026 ALIVE 愛來. All rights reserved.
                </p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Emergency email sent to:', email);
    } catch (error) {
        console.error('Failed to send emergency email:', error);
        throw new Error('發送緊急通知郵件失敗');
    }
}

/**
 * 生成 6 位數驗證�?
 */
export function generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
