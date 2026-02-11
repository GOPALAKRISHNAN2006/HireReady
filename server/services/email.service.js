/**
 * ===========================================
 * Email Service
 * ===========================================
 * 
 * Handles sending emails for password reset, verification, etc.
 * Uses Resend HTTP API (works on Render free tier where SMTP is blocked).
 */

const { Resend } = require('resend');

// Sender address - use verified domain or Resend's onboarding address
const FROM_EMAIL = process.env.EMAIL_FROM || 'HireReady <onboarding@resend.dev>';

/**
 * Get Resend client instance
 */
const getResendClient = () => {
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY not configured. Emails will not be sent.');
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
};

/**
 * Generic send email helper
 */
const sendEmail = async ({ to, subject, html, text }) => {
  const resend = getResendClient();
  
  if (!resend) {
    console.log('📧 Email would be sent to:', to, '| Subject:', subject);
    return { success: false, message: 'Email service not configured' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html,
      text,
    });

    if (error) {
      console.error('❌ Resend API error:', error.message);
      return { success: false, message: error.message };
    }

    console.log('✅ Email sent to:', to, '| ID:', data.id);
    return { success: true, message: 'Email sent successfully', id: data.id };
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    return { success: false, message: error.message };
  }
};

/**
 * Send email verification email
 */
const sendVerificationEmail = async (to, verificationUrl, userName = 'User') => {
  return sendEmail({
    to,
    subject: 'Verify Your Email - HireReady',
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 40px 0;">
            <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <tr><td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 40px; text-align: center;">
                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">🎉 Welcome to HireReady!</h1>
                <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">AI-Powered Interview Preparation</p>
              </td></tr>
              <tr><td style="padding: 40px;">
                <h2 style="margin: 0 0 16px; color: #18181b; font-size: 24px; font-weight: 600;">Verify Your Email</h2>
                <p style="margin: 0 0 24px; color: #52525b; font-size: 16px; line-height: 1.6;">Hi ${userName},</p>
                <p style="margin: 0 0 24px; color: #52525b; font-size: 16px; line-height: 1.6;">
                  Thank you for joining HireReady! Please verify your email address to unlock all features.
                </p>
                <table role="presentation" style="margin: 32px 0;">
                  <tr><td style="border-radius: 8px; background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
                    <a href="${verificationUrl}" target="_blank" style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">Verify Email Address</a>
                  </td></tr>
                </table>
                <p style="margin: 0 0 16px; color: #52525b; font-size: 14px;">This link will expire in <strong>24 hours</strong>.</p>
                <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 32px 0;">
                <p style="margin: 0; color: #71717a; font-size: 13px;">If the button doesn't work, copy and paste this link:</p>
                <p style="margin: 8px 0 0; word-break: break-all;"><a href="${verificationUrl}" style="color: #10b981; font-size: 13px;">${verificationUrl}</a></p>
              </td></tr>
              <tr><td style="background-color: #f9fafb; padding: 24px 40px; text-align: center;">
                <p style="margin: 0; color: #71717a; font-size: 13px;">© ${new Date().getFullYear()} HireReady. All rights reserved.</p>
              </td></tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `,
    text: `Hi ${userName},\n\nVerify your email: ${verificationUrl}\n\nThis link expires in 24 hours.\n\nThe HireReady Team`,
  });
};

/**
 * Send welcome email after verification
 */
const sendWelcomeEmail = async (to, userName = 'User') => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  return sendEmail({
    to,
    subject: 'Welcome to HireReady - Start Your Interview Journey! 🚀',
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 40px 0;">
            <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <tr><td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px; text-align: center;">
                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Welcome to HireReady! 🎉</h1>
              </td></tr>
              <tr><td style="padding: 40px;">
                <p style="margin: 0 0 24px; color: #52525b; font-size: 16px;">Hi ${userName},</p>
                <p style="margin: 0 0 24px; color: #52525b; font-size: 16px;">Your account is now fully activated! Here's what you can do:</p>
                <ul style="color: #52525b; font-size: 16px; line-height: 2;">
                  <li>🎯 Take AI-powered mock interviews</li>
                  <li>📝 Practice aptitude tests</li>
                  <li>💬 Improve communication skills</li>
                  <li>📊 Track your progress with analytics</li>
                  <li>🏆 Complete daily challenges</li>
                </ul>
                <table role="presentation" style="margin: 32px 0;">
                  <tr><td style="border-radius: 8px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);">
                    <a href="${frontendUrl}/dashboard" target="_blank" style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">Go to Dashboard</a>
                  </td></tr>
                </table>
              </td></tr>
              <tr><td style="background-color: #f9fafb; padding: 24px 40px; text-align: center;">
                <p style="margin: 0; color: #71717a; font-size: 13px;">© ${new Date().getFullYear()} HireReady. All rights reserved.</p>
              </td></tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `,
    text: `Hi ${userName},\n\nYour account is activated! Start at ${frontendUrl}/dashboard\n\nThe HireReady Team`,
  });
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (to, resetUrl, userName = 'User') => {
  return sendEmail({
    to,
    subject: 'Reset Your Password - HireReady',
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 40px 0;">
            <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <tr><td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px; text-align: center;">
                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">HireReady</h1>
                <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">AI-Powered Interview Preparation</p>
              </td></tr>
              <tr><td style="padding: 40px;">
                <h2 style="margin: 0 0 16px; color: #18181b; font-size: 24px; font-weight: 600;">Reset Your Password</h2>
                <p style="margin: 0 0 24px; color: #52525b; font-size: 16px;">Hi ${userName},</p>
                <p style="margin: 0 0 24px; color: #52525b; font-size: 16px;">We received a request to reset your password. Click the button below:</p>
                <table role="presentation" style="margin: 32px 0;">
                  <tr><td style="border-radius: 8px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);">
                    <a href="${resetUrl}" target="_blank" style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">Reset Password</a>
                  </td></tr>
                </table>
                <p style="margin: 0 0 16px; color: #52525b; font-size: 14px;">This link will expire in <strong>1 hour</strong>.</p>
                <p style="margin: 0 0 16px; color: #52525b; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 32px 0;">
                <p style="margin: 0; color: #71717a; font-size: 13px;">If the button doesn't work, copy and paste this link:</p>
                <p style="margin: 8px 0 0; word-break: break-all;"><a href="${resetUrl}" style="color: #6366f1; font-size: 13px;">${resetUrl}</a></p>
              </td></tr>
              <tr><td style="background-color: #f9fafb; padding: 24px 40px; text-align: center;">
                <p style="margin: 0; color: #71717a; font-size: 13px;">© ${new Date().getFullYear()} HireReady. All rights reserved.</p>
              </td></tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `,
    text: `Hi ${userName},\n\nReset your password: ${resetUrl}\n\nThis link expires in 1 hour.\n\nThe HireReady Team`,
  });
};

/**
 * Send password changed confirmation email
 */
const sendPasswordChangedEmail = async (to, userName = 'User') => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  return sendEmail({
    to,
    subject: 'Password Changed Successfully - HireReady',
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 40px 0;">
            <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <tr><td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px; text-align: center;">
                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">🔒 Password Changed</h1>
              </td></tr>
              <tr><td style="padding: 40px;">
                <p style="color: #52525b; font-size: 16px;">Hi ${userName},</p>
                <p style="color: #52525b; font-size: 16px;">Your password was successfully changed on <strong>${new Date().toLocaleString()}</strong>.</p>
                <p style="color: #52525b; font-size: 16px;">If you did not make this change, reset your password immediately.</p>
                <table role="presentation" style="margin: 32px 0;">
                  <tr><td style="border-radius: 8px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);">
                    <a href="${frontendUrl}/forgot-password" target="_blank" style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">Reset Password</a>
                  </td></tr>
                </table>
              </td></tr>
              <tr><td style="background-color: #f9fafb; padding: 24px 40px; text-align: center;">
                <p style="margin: 0; color: #71717a; font-size: 13px;">© ${new Date().getFullYear()} HireReady. All rights reserved.</p>
              </td></tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `,
    text: `Hi ${userName},\n\nYour password was changed on ${new Date().toLocaleString()}.\n\nIf you didn't do this, reset your password immediately.\n\nThe HireReady Team`,
  });
};

/**
 * Send interview result notification email
 */
const sendInterviewResultEmail = async (to, userName = 'User', result = {}) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const scoreColor = result.score >= 80 ? '#10b981' : result.score >= 60 ? '#f59e0b' : '#ef4444';
  const scoreLabel = result.score >= 80 ? 'Excellent!' : result.score >= 60 ? 'Good Job!' : 'Keep Practicing!';

  return sendEmail({
    to,
    subject: `Interview Result: ${result.score}% - ${scoreLabel} | HireReady`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 40px 0;">
            <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <tr><td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px; text-align: center;">
                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">📊 Interview Results</h1>
              </td></tr>
              <tr><td style="padding: 40px;">
                <p style="color: #52525b; font-size: 16px;">Hi ${userName},</p>
                <p style="color: #52525b; font-size: 16px;">Your interview session is complete:</p>
                <div style="text-align: center; margin: 32px 0; padding: 24px; background-color: #f9fafb; border-radius: 12px;">
                  <p style="font-size: 48px; font-weight: 700; color: ${scoreColor}; margin: 0;">${result.score || 0}%</p>
                  <p style="font-size: 18px; color: ${scoreColor}; margin: 8px 0 0; font-weight: 600;">${scoreLabel}</p>
                </div>
                <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
                  <tr><td style="padding: 8px 0; color: #71717a;">Category</td><td style="padding: 8px 0; color: #18181b; text-align: right; font-weight: 600;">${(result.category || 'General').replace('-', ' ')}</td></tr>
                  <tr><td style="padding: 8px 0; color: #71717a; border-top: 1px solid #e4e4e7;">Difficulty</td><td style="padding: 8px 0; color: #18181b; text-align: right; font-weight: 600; border-top: 1px solid #e4e4e7; text-transform: capitalize;">${result.difficulty || 'N/A'}</td></tr>
                  <tr><td style="padding: 8px 0; color: #71717a; border-top: 1px solid #e4e4e7;">Duration</td><td style="padding: 8px 0; color: #18181b; text-align: right; font-weight: 600; border-top: 1px solid #e4e4e7;">${result.duration || 0} mins</td></tr>
                </table>
                <table role="presentation" style="margin: 32px 0;">
                  <tr><td style="border-radius: 8px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);">
                    <a href="${frontendUrl}/history" target="_blank" style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">View Full Results</a>
                  </td></tr>
                </table>
              </td></tr>
              <tr><td style="background-color: #f9fafb; padding: 24px 40px; text-align: center;">
                <p style="margin: 0; color: #71717a; font-size: 13px;">© ${new Date().getFullYear()} HireReady. All rights reserved.</p>
              </td></tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `,
    text: `Hi ${userName},\n\nScore: ${result.score || 0}%\nCategory: ${result.category || 'General'}\n\nThe HireReady Team`,
  });
};

/**
 * Send interview reminder email
 */
const sendInterviewReminderEmail = async (to, userName = 'User', reminder = {}) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  return sendEmail({
    to,
    subject: 'Interview Practice Reminder - HireReady ⏰',
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 40px 0;">
            <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <tr><td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px; text-align: center;">
                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">⏰ Practice Reminder</h1>
              </td></tr>
              <tr><td style="padding: 40px;">
                <p style="color: #52525b; font-size: 16px;">Hi ${userName},</p>
                <p style="color: #52525b; font-size: 16px;">This is a friendly reminder about your interview practice session.</p>
                ${reminder.scheduledTime ? `<p style="color: #52525b; font-size: 16px;"><strong>Scheduled:</strong> ${new Date(reminder.scheduledTime).toLocaleString()}</p>` : ''}
                ${reminder.category ? `<p style="color: #52525b; font-size: 16px;"><strong>Category:</strong> ${reminder.category}</p>` : ''}
                <p style="color: #52525b; font-size: 16px;">Consistent practice is key to acing your interviews!</p>
                <table role="presentation" style="margin: 32px 0;">
                  <tr><td style="border-radius: 8px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);">
                    <a href="${frontendUrl}/interview/setup" target="_blank" style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">Start Practice Now</a>
                  </td></tr>
                </table>
              </td></tr>
              <tr><td style="background-color: #f9fafb; padding: 24px 40px; text-align: center;">
                <p style="margin: 0; color: #71717a; font-size: 13px;">© ${new Date().getFullYear()} HireReady. All rights reserved.</p>
              </td></tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `,
    text: `Hi ${userName},\n\nReminder: Time to practice!\n\nThe HireReady Team`,
  });
};

module.exports = {
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordChangedEmail,
  sendInterviewResultEmail,
  sendInterviewReminderEmail,
};
