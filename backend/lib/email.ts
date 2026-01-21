/**
 * Email 服務（使用 Nodemailer + Gmail SMTP）
 */
import nodemailer from 'nodemailer';

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

/**
 * 建立 Gmail SMTP transporter
 */
const createTransporter = () => {
    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
        console.error('Gmail SMTP credentials not configured');
        return null;
    }

    return nodemailer.createTransporter({
        service: 'gmail',
        auth: {
            user: GMAIL_USER,
            pass: GMAIL_APP_PASSWORD,
        },
    });
};

/**
 * 發送驗證郵件
 */
export const sendVerificationEmail = async (
    email: string,
    verificationLink: string
): Promise<boolean> => {
    const transporter = createTransporter();
    if (!transporter) return false;

    try {
        await transporter.sendMail({
            from: `"ALIVE 愛來" <${GMAIL_USER}>`,
            to: email,
            subject: '驗證您的電子郵件',
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>歡迎使用 ALIVE 愛來！</h2>
          <p>請點擊下方按鈕驗證您的電子郵件地址：</p>
          <a href="${verificationLink}" 
             style="display: inline-block; background-color: #4CAF50; color: white; 
                    padding: 12px 24px; text-decoration: none; border-radius: 4px; 
                    margin: 16px 0;">
            驗證電子郵件
          </a>
          <p style="color: #666; font-size: 14px;">
            如果您沒有註冊 ALIVE 帳號，請忽略此郵件。
          </p>
        </div>
      `,
        });
        return true;
    } catch (error) {
        console.error('Failed to send verification email:', error);
        return false;
    }
};

/**
 * 發送緊急通知郵件
 */
export const sendEmergencyEmail = async (
    email: string,
    userName: string,
    daysInactive: number
): Promise<boolean> => {
    const transporter = createTransporter();
    if (!transporter) return false;

    try {
        await transporter.sendMail({
            from: `"ALIVE 愛來" <${GMAIL_USER}>`,
            to: email,
            subject: `緊急通知：${userName} 已連續 ${daysInactive} 天未簽到`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f44336;">緊急通知</h2>
          <p><strong>${userName}</strong> 已經連續 <strong>${daysInactive} 天</strong>沒有活動記錄。</p>
          <p>請盡快聯繫確認其安全狀況。</p>
          <p style="color: #666; font-size: 14px; margin-top: 24px;">
            此郵件由 ALIVE 愛來系統自動發送。
          </p>
        </div>
      `,
        });
        return true;
    } catch (error) {
        console.error('Failed to send emergency email:', error);
        return false;
    }
};
