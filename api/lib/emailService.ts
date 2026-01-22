/**
 * Email Service
 * Uses Nodemailer + Gmail SMTP
 */
import nodemailer from 'nodemailer';

// Gmail SMTP Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

/**
 * Send Verification Email
 */
export async function sendVerificationEmail(email: string, code: string): Promise<void> {
    const mailOptions = {
        from: `ALIVE App <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'ALIVE - Email Verification',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4CAF50;">ALIVE - Email Verification</h2>
                <p>Your verification code is:</p>
                <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333;">
                    ${code}
                </div>
                <p style="color: #666; margin-top: 20px;">
                    This code will expire in 10 minutes.<br>
                    If you did not request this, please ignore this email.
                </p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                <p style="color: #999; font-size: 12px;">
                    This is an automated message, please do not reply.<br>
                    © 2026 ALIVE. All rights reserved.
                </p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent to:', email);
    } catch (error) {
        console.error('Failed to send email:', error);
        throw new Error('Failed to send verification email');
    }
}

/**
 * Send Emergency Notification Email
 */
export async function sendEmergencyEmail(
    email: string,
    userName: string,
    message: string
): Promise<void> {
    const mailOptions = {
        from: `ALIVE App <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `⚠️ ALIVE Emergency - ${userName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #ff5252; color: white; padding: 20px;">
                    <h2 style="margin: 0;">⚠️ Emergency Notification</h2>
                </div>
                <div style="padding: 20px; background-color: #fff3cd;">
                    <h3>${userName} needs your attention</h3>
                    <p style="font-size: 16px; line-height: 1.6;">
                        ${message}
                    </p>
                </div>
                <div style="padding: 20px; background-color: #f5f5f5;">
                    <p style="color: #666;">
                        <strong>Time:</strong> ${new Date().toLocaleString()}<br>
                        <strong>Source:</strong> ALIVE Health Monitor
                    </p>
                </div>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                <p style="color: #999; font-size: 12px; padding: 0 20px;">
                    This is an automated emergency notification.<br>
                    © 2026 ALIVE. All rights reserved.
                </p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Emergency email sent to:', email);
    } catch (error) {
        console.error('Failed to send emergency email:', error);
        throw new Error('Failed to send emergency email');
    }
}

/**
 * Generate 6-digit verification code
 */
export function generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
