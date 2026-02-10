/**
 * ===========================================
 * Email Service
 * ===========================================
 * 
 * Handles sending emails for password reset, verification, etc.
 * Uses Nodemailer with Gmail SMTP.
 */

const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  // Check if email credentials are configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('⚠️ Email credentials not configured. Emails will not be sent.');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 10000, // 10s to establish connection
    greetingTimeout: 10000,   // 10s for SMTP greeting
    socketTimeout: 15000,     // 15s for socket inactivity
    pool: false,              // Don't pool connections on free-tier hosts
  });
};

/**
 * Send password reset email
 * @param {string} to - Recipient email address
 * @param {string} resetUrl - Password reset URL with token
 * @param {string} userName - User's first name for personalization
 */
/**
 * Send email verification email
 * @param {string} to - Recipient email address
 * @param {string} verificationUrl - Email verification URL with token
 * @param {string} userName - User's first name for personalization
 */
const sendVerificationEmail = async (to, verificationUrl, userName = 'User') => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('📧 Verification email would be sent to:', to);
    console.log('🔗 Verification URL:', verificationUrl);
    return { success: false, message: 'Email service not configured' };
  }

  const mailOptions = {
    from: `"HireReady" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Verify Your Email - HireReady',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 40px 0;">
              <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 40px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">🎉 Welcome to HireReady!</h1>
                    <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">AI-Powered Interview Preparation</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 16px; color: #18181b; font-size: 24px; font-weight: 600;">Verify Your Email</h2>
                    <p style="margin: 0 0 24px; color: #52525b; font-size: 16px; line-height: 1.6;">
                      Hi ${userName},
                    </p>
                    <p style="margin: 0 0 24px; color: #52525b; font-size: 16px; line-height: 1.6;">
                      Thank you for joining HireReady! Please verify your email address to unlock all features and start your interview preparation journey.
                    </p>
                    
                    <!-- Button -->
                    <table role="presentation" style="margin: 32px 0;">
                      <tr>
                        <td style="border-radius: 8px; background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
                          <a href="${verificationUrl}" target="_blank" style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">
                            Verify Email Address
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 0 0 16px; color: #52525b; font-size: 14px; line-height: 1.6;">
                      This link will expire in <strong>24 hours</strong> for security reasons.
                    </p>
                    
                    <p style="margin: 0 0 16px; color: #52525b; font-size: 14px; line-height: 1.6;">
                      If you didn't create an account with HireReady, you can safely ignore this email.
                    </p>
                    
                    <!-- Divider -->
                    <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 32px 0;">
                    
                    <p style="margin: 0; color: #71717a; font-size: 13px; line-height: 1.6;">
                      If the button doesn't work, copy and paste this link into your browser:
                    </p>
                    <p style="margin: 8px 0 0; word-break: break-all;">
                      <a href="${verificationUrl}" style="color: #10b981; font-size: 13px;">${verificationUrl}</a>
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f9fafb; padding: 24px 40px; text-align: center;">
                    <p style="margin: 0; color: #71717a; font-size: 13px;">
                      © ${new Date().getFullYear()} HireReady. All rights reserved.
                    </p>
                    <p style="margin: 8px 0 0; color: #a1a1aa; font-size: 12px;">
                      This is an automated email. Please do not reply.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    text: `
      Hi ${userName},

      Thank you for joining HireReady! Please verify your email address to unlock all features.

      Click the link below to verify your email:
      ${verificationUrl}

      This link will expire in 24 hours for security reasons.

      If you didn't create an account with HireReady, you can safely ignore this email.

      Best regards,
      The HireReady Team
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent to:', to);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('❌ Error sending verification email:', error.message);
    return { success: false, message: error.message };
  }
};

/**
 * Send welcome email after verification
 * @param {string} to - Recipient email address  
 * @param {string} userName - User's first name for personalization
 */
const sendWelcomeEmail = async (to, userName = 'User') => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('📧 Welcome email would be sent to:', to);
    return { success: false, message: 'Email service not configured' };
  }

  const mailOptions = {
    from: `"HireReady" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Welcome to HireReady - Start Your Interview Journey! 🚀',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to HireReady</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 40px 0;">
              <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px 40px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Welcome to HireReady! 🎉</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px;">
                    <p style="margin: 0 0 24px; color: #52525b; font-size: 16px; line-height: 1.6;">
                      Hi ${userName},
                    </p>
                    <p style="margin: 0 0 24px; color: #52525b; font-size: 16px; line-height: 1.6;">
                      Your email has been verified and your account is now fully activated! Here's what you can do:
                    </p>
                    <ul style="color: #52525b; font-size: 16px; line-height: 2;">
                      <li>🎯 Take AI-powered mock interviews</li>
                      <li>📝 Practice aptitude tests</li>
                      <li>💬 Improve communication skills</li>
                      <li>📊 Track your progress with analytics</li>
                      <li>🏆 Complete daily challenges</li>
                    </ul>
                    <table role="presentation" style="margin: 32px 0;">
                      <tr>
                        <td style="border-radius: 8px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);">
                          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" target="_blank" style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">
                            Go to Dashboard
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #f9fafb; padding: 24px 40px; text-align: center;">
                    <p style="margin: 0; color: #71717a; font-size: 13px;">
                      © ${new Date().getFullYear()} HireReady. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent to:', to);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error.message);
    return { success: false, message: error.message };
  }
};

const sendPasswordResetEmail = async (to, resetUrl, userName = 'User') => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('📧 Password reset email would be sent to:', to);
    console.log('🔗 Reset URL:', resetUrl);
    return { success: false, message: 'Email service not configured' };
  }

  const mailOptions = {
    from: `"HireReady" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Reset Your Password - HireReady',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 40px 0;">
              <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px 40px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">HireReady</h1>
                    <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">AI-Powered Interview Preparation</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 16px; color: #18181b; font-size: 24px; font-weight: 600;">Reset Your Password</h2>
                    <p style="margin: 0 0 24px; color: #52525b; font-size: 16px; line-height: 1.6;">
                      Hi ${userName},
                    </p>
                    <p style="margin: 0 0 24px; color: #52525b; font-size: 16px; line-height: 1.6;">
                      We received a request to reset your password. Click the button below to create a new password:
                    </p>
                    
                    <!-- Button -->
                    <table role="presentation" style="margin: 32px 0;">
                      <tr>
                        <td style="border-radius: 8px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);">
                          <a href="${resetUrl}" target="_blank" style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">
                            Reset Password
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 0 0 16px; color: #52525b; font-size: 14px; line-height: 1.6;">
                      This link will expire in <strong>1 hour</strong> for security reasons.
                    </p>
                    
                    <p style="margin: 0 0 16px; color: #52525b; font-size: 14px; line-height: 1.6;">
                      If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                    </p>
                    
                    <!-- Divider -->
                    <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 32px 0;">
                    
                    <p style="margin: 0; color: #71717a; font-size: 13px; line-height: 1.6;">
                      If the button doesn't work, copy and paste this link into your browser:
                    </p>
                    <p style="margin: 8px 0 0; word-break: break-all;">
                      <a href="${resetUrl}" style="color: #6366f1; font-size: 13px;">${resetUrl}</a>
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f9fafb; padding: 24px 40px; text-align: center;">
                    <p style="margin: 0; color: #71717a; font-size: 13px;">
                      © ${new Date().getFullYear()} HireReady. All rights reserved.
                    </p>
                    <p style="margin: 8px 0 0; color: #a1a1aa; font-size: 12px;">
                      This is an automated email. Please do not reply.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    text: `
      Hi ${userName},

      We received a request to reset your password for your HireReady account.

      Click the link below to reset your password:
      ${resetUrl}

      This link will expire in 1 hour for security reasons.

      If you didn't request a password reset, you can safely ignore this email.

      Best regards,
      The HireReady Team
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent to:', to);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('❌ Error sending password reset email:', error.message);
    return { success: false, message: error.message };
  }
};

/**
 * Send password changed confirmation email
 * @param {string} to - Recipient email address
 * @param {string} userName - User's first name for personalization
 */
const sendPasswordChangedEmail = async (to, userName = 'User') => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('📧 Password changed email would be sent to:', to);
    return { success: false, message: 'Email service not configured' };
  }

  const mailOptions = {
    from: `"HireReady" <${process.env.SMTP_USER}>`,
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
                <p style="color: #52525b; font-size: 16px; line-height: 1.6;">Hi ${userName},</p>
                <p style="color: #52525b; font-size: 16px; line-height: 1.6;">Your password was successfully changed on <strong>${new Date().toLocaleString()}</strong>.</p>
                <p style="color: #52525b; font-size: 16px; line-height: 1.6;">If you did not make this change, please reset your password immediately and contact our support team.</p>
                <table role="presentation" style="margin: 32px 0;">
                  <tr><td style="border-radius: 8px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/forgot-password" target="_blank" style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">Reset Password</a>
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
    text: `Hi ${userName},\n\nYour password was successfully changed on ${new Date().toLocaleString()}.\n\nIf you did not make this change, please reset your password immediately.\n\nBest regards,\nThe HireReady Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Password changed email sent to:', to);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('❌ Error sending password changed email:', error.message);
    return { success: false, message: error.message };
  }
};

/**
 * Send interview result notification email
 * @param {string} to - Recipient email address
 * @param {string} userName - User's first name
 * @param {Object} result - Interview result data { score, category, difficulty, duration }
 */
const sendInterviewResultEmail = async (to, userName = 'User', result = {}) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('📧 Interview result email would be sent to:', to);
    return { success: false, message: 'Email service not configured' };
  }

  const scoreColor = result.score >= 80 ? '#10b981' : result.score >= 60 ? '#f59e0b' : '#ef4444';
  const scoreLabel = result.score >= 80 ? 'Excellent!' : result.score >= 60 ? 'Good Job!' : 'Keep Practicing!';

  const mailOptions = {
    from: `"HireReady" <${process.env.SMTP_USER}>`,
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
                <p style="color: #52525b; font-size: 16px; line-height: 1.6;">Hi ${userName},</p>
                <p style="color: #52525b; font-size: 16px; line-height: 1.6;">Your interview session has been completed. Here are your results:</p>
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
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/history" target="_blank" style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">View Full Results</a>
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
    text: `Hi ${userName},\n\nYour interview session has been completed!\n\nScore: ${result.score || 0}%\nCategory: ${result.category || 'General'}\nDifficulty: ${result.difficulty || 'N/A'}\nDuration: ${result.duration || 0} mins\n\nBest regards,\nThe HireReady Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Interview result email sent to:', to);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('❌ Error sending interview result email:', error.message);
    return { success: false, message: error.message };
  }
};

/**
 * Send interview reminder email
 * @param {string} to - Recipient email address
 * @param {string} userName - User's first name
 * @param {Object} reminder - Reminder data { scheduledTime, category }
 */
const sendInterviewReminderEmail = async (to, userName = 'User', reminder = {}) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('📧 Interview reminder email would be sent to:', to);
    return { success: false, message: 'Email service not configured' };
  }

  const mailOptions = {
    from: `"HireReady" <${process.env.SMTP_USER}>`,
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
                <p style="color: #52525b; font-size: 16px; line-height: 1.6;">Hi ${userName},</p>
                <p style="color: #52525b; font-size: 16px; line-height: 1.6;">This is a friendly reminder about your interview practice session.</p>
                ${reminder.scheduledTime ? `<p style="color: #52525b; font-size: 16px;"><strong>Scheduled:</strong> ${new Date(reminder.scheduledTime).toLocaleString()}</p>` : ''}
                ${reminder.category ? `<p style="color: #52525b; font-size: 16px;"><strong>Category:</strong> ${reminder.category}</p>` : ''}
                <p style="color: #52525b; font-size: 16px; line-height: 1.6;">Consistent practice is key to acing your interviews!</p>
                <table role="presentation" style="margin: 32px 0;">
                  <tr><td style="border-radius: 8px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/interview/setup" target="_blank" style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">Start Practice Now</a>
                  </td></tr>
                </table>
              </td></tr>
              <tr><td style="background-color: #f9fafb; padding: 24px 40px; text-align: center;">
                <p style="margin: 0; color: #71717a; font-size: 13px;">© ${new Date().getFullYear()} HireReady. All rights reserved.</p>
                <p style="margin: 8px 0 0; color: #a1a1aa; font-size: 12px;">Turn off reminders in your notification settings.</p>
              </td></tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `,
    text: `Hi ${userName},\n\nThis is a friendly reminder about your interview practice session.\n\nConsistent practice is key!\n\nBest regards,\nThe HireReady Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Interview reminder email sent to:', to);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('❌ Error sending interview reminder email:', error.message);
    return { success: false, message: error.message };
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordChangedEmail,
  sendInterviewResultEmail,
  sendInterviewReminderEmail,
};
