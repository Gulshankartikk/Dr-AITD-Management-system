const nodemailer = require('nodemailer');
const config = require('../config/environment');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    if (!config.EMAIL.USER || !config.EMAIL.PASS) {
      console.warn('Email configuration not found. Email service disabled.');
      return;
    }

    this.transporter = nodemailer.createTransporter({
      service: config.EMAIL.SERVICE,
      auth: {
        user: config.EMAIL.USER,
        pass: config.EMAIL.PASS
      }
    });
  }

  async sendEmail(to, subject, text, html = null) {
    if (!this.transporter) {
      throw new Error('Email service not configured');
    }

    const mailOptions = {
      from: config.EMAIL.FROM,
      to,
      subject,
      text,
      html: html || text
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(userEmail, userName, userType, password) {
    const subject = `Welcome to College ERP - ${userType} Account Created`;
    const text = `
      Dear ${userName},

      Welcome to College ERP Management System!

      Your ${userType} account has been created successfully.

      Login Credentials:
      Email/Username: ${userEmail}
      Password: ${password}

      Please login and change your password immediately for security.

      Best regards,
      College ERP Team
    `;

    return await this.sendEmail(userEmail, subject, text);
  }

  async sendPasswordResetEmail(userEmail, resetToken) {
    const subject = 'Password Reset Request - College ERP';
    const text = `
      Dear User,

      You have requested a password reset for your College ERP account.

      Reset Token: ${resetToken}

      Please use this token to reset your password within 1 hour.

      If you didn't request this reset, please ignore this email.

      Best regards,
      College ERP Team
    `;

    return await this.sendEmail(userEmail, subject, text);
  }

  async sendNotificationEmail(userEmail, title, message) {
    const subject = `Notification - ${title}`;
    return await this.sendEmail(userEmail, subject, message);
  }
}

module.exports = new EmailService();