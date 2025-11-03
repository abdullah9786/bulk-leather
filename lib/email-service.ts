/**
 * Email Service using SMTP (Nodemailer)
 * Works with Gmail, Outlook, or any SMTP server
 */

import nodemailer from 'nodemailer';

// Create SMTP transporter with better error handling
function createTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  try {
    const port = parseInt(process.env.SMTP_PORT || '587');
    
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Allow self-signed certificates
        minVersion: 'TLSv1.2'
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });
  } catch (error) {
    console.error('Error creating SMTP transporter:', error);
    return null;
  }
}

const transporter = createTransporter();

interface MeetingEmailData {
  to: string;
  customerName: string;
  meetingType: string;
  company: string;
  date: string;
  timeSlot: string;
  googleMeetLink?: string;
  message?: string;
}

/**
 * Send meeting confirmation email to customer
 */
export async function sendMeetingConfirmationEmail(emailData: MeetingEmailData) {
  if (!transporter) {
    console.log('⚠️ SMTP not configured (check SMTP_HOST, SMTP_USER, SMTP_PASS in .env.local)');
    console.log('📧 Email details prepared:');
    console.log('To:', emailData.to);
    console.log('Subject: Meeting Scheduled - BulkLeather');
    console.log('Meet Link:', emailData.googleMeetLink);
    return { success: false, message: 'SMTP not configured' };
  }

  const meetingDate = new Date(emailData.date);
  const formattedDate = meetingDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #FAF8F5;">
  <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #D6A76C, #C89654); padding: 40px 30px; text-align: center;">
      <h1 style="margin: 0; color: #3A2D28; font-size: 28px; font-weight: bold;">
        Meeting Scheduled!
      </h1>
      <p style="margin: 10px 0 0 0; color: #3A2D28; font-size: 14px;">
        BulkLeather - Premium Wholesale Leather
      </p>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px;">
      <p style="margin: 0 0 20px 0; color: #3A2D28; font-size: 16px;">
        Dear <strong>${emailData.customerName}</strong>,
      </p>

      <p style="margin: 0 0 25px 0; color: #6C5F57; line-height: 1.6;">
        Your ${emailData.meetingType} meeting has been successfully scheduled with our team. We're excited to discuss your wholesale leather needs!
      </p>

      <!-- Meeting Details -->
      <div style="background: #FAF8F5; border-left: 4px solid #D6A76C; padding: 20px; margin: 25px 0; border-radius: 4px;">
        <p style="margin: 0 0 10px 0; color: #3A2D28; font-weight: bold; font-size: 16px;">
          📅 Meeting Details
        </p>
        <p style="margin: 8px 0; color: #6C5F57;">
          <strong>Date:</strong> ${formattedDate}
        </p>
        <p style="margin: 8px 0; color: #6C5F57;">
          <strong>Time:</strong> ${emailData.timeSlot} EST
        </p>
        <p style="margin: 8px 0; color: #6C5F57;">
          <strong>Company:</strong> ${emailData.company}
        </p>
        <p style="margin: 8px 0; color: #6C5F57;">
          <strong>Type:</strong> ${emailData.meetingType.charAt(0).toUpperCase() + emailData.meetingType.slice(1)} Meeting
        </p>
      </div>

      ${emailData.googleMeetLink ? `
      <!-- Google Meet Link -->
      <div style="background: #E3F2FD; border: 2px solid #2196F3; padding: 25px; margin: 25px 0; border-radius: 8px; text-align: center;">
        <p style="margin: 0 0 15px 0; color: #1565C0; font-weight: bold; font-size: 18px;">
          🎥 Join via Google Meet
        </p>
        <a href="${emailData.googleMeetLink}" style="display: inline-block; background: #2196F3; color: white; padding: 15px 40px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; margin: 10px 0;">
          Join Meeting
        </a>
        <p style="margin: 15px 0 0 0; color: #1976D2; font-size: 14px; word-break: break-all;">
          ${emailData.googleMeetLink}
        </p>
      </div>
      ` : `
      <div style="background: #FFF3E0; border: 2px solid #FF9800; padding: 20px; margin: 25px 0; border-radius: 8px; text-align: center;">
        <p style="margin: 0; color: #E65100; font-weight: bold;">
          📞 Our team will contact you at the scheduled time
        </p>
      </div>
      `}

      ${emailData.message ? `
      <div style="margin: 25px 0;">
        <p style="margin: 0 0 10px 0; color: #3A2D28; font-weight: bold;">Your Message:</p>
        <div style="background: #FAF8F5; padding: 15px; border-radius: 4px; color: #6C5F57; font-style: italic;">
          "${emailData.message}"
        </div>
      </div>
      ` : ''}

      <p style="margin: 30px 0 15px 0; color: #6C5F57; line-height: 1.6;">
        We look forward to speaking with you! If you need to reschedule or have any questions before the meeting, please don't hesitate to contact us.
      </p>

      <!-- Contact Info -->
      <div style="background: #EFE7DD; padding: 20px; margin: 25px 0; border-radius: 8px;">
        <p style="margin: 0 0 10px 0; color: #3A2D28; font-weight: bold;">Contact Us:</p>
        <p style="margin: 5px 0; color: #6C5F57; font-size: 14px;">
          📧 Email: sales@bulkleather.com
        </p>
        <p style="margin: 5px 0; color: #6C5F57; font-size: 14px;">
          📞 Phone: +1 (234) 567-890
        </p>
        <p style="margin: 5px 0; color: #6C5F57; font-size: 14px;">
          🌐 Website: www.bulkleather.com
        </p>
      </div>

      <p style="margin: 30px 0 0 0; color: #6C5F57; font-size: 14px;">
        Best regards,<br>
        <strong style="color: #3A2D28;">BulkLeather Sales Team</strong>
      </p>
    </div>

    <!-- Footer -->
    <div style="background: #3A2D28; padding: 20px 30px; text-align: center; color: #D6A76C;">
      <p style="margin: 0 0 5px 0; font-size: 12px;">
        BulkLeather - Premium Wholesale Leather Goods
      </p>
      <p style="margin: 0; font-size: 11px; color: #C9B8A6;">
        123 Leather District, Industrial Area, Manufacturing Hub, IN 456789
      </p>
      <p style="margin: 10px 0 0 0; font-size: 11px; color: #C9B8A6;">
        © ${new Date().getFullYear()} BulkLeather. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `;

  // Plain text version (better deliverability)
  const textContent = `
Meeting Scheduled!

Dear ${emailData.customerName},

Your ${emailData.meetingType} meeting has been successfully scheduled with BulkLeather.

Meeting Details:
Date: ${formattedDate}
Time: ${emailData.timeSlot} EST
Company: ${emailData.company}
Type: ${emailData.meetingType.charAt(0).toUpperCase() + emailData.meetingType.slice(1)} Meeting

${emailData.googleMeetLink ? `
Google Meet Link:
${emailData.googleMeetLink}

Click the link above to join the meeting at the scheduled time.
` : `
Our team will contact you at the scheduled time.
`}

${emailData.message ? `
Your Message:
${emailData.message}
` : ''}

We look forward to speaking with you!

Contact Us:
Email: sales@bulkleather.com
Phone: +1 (234) 567-890
Website: www.bulkleather.com

Best regards,
BulkLeather Sales Team

---
BulkLeather - Premium Wholesale Leather Goods
123 Leather District, Industrial Area, Manufacturing Hub, IN 456789
  `.trim();

  try {
    // Verify SMTP connection first
    await transporter.verify();
    console.log('✅ SMTP connection verified');

    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: emailData.to,
      subject: `Meeting Scheduled - ${emailData.meetingType.charAt(0).toUpperCase() + emailData.meetingType.slice(1)} Meeting`,
      text: textContent,
      html: htmlContent,
      replyTo: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
    });

    console.log('✅ Email sent successfully via SMTP');
    console.log('Message ID:', result.messageId);
    console.log('To:', emailData.to);

    return { success: true, messageId: result.messageId };
  } catch (error: any) {
    console.error('❌ Failed to send email via SMTP');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    // Log specific error types
    if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKET') {
      console.error('⚠️ Connection timeout - Check:');
      console.error('  1. SMTP_HOST is correct');
      console.error('  2. SMTP_PORT is not blocked by firewall');
      console.error('  3. Internet connection is working');
      console.error('  4. Try SMTP_PORT=465 instead of 587');
    } else if (error.code === 'EAUTH') {
      console.error('⚠️ Authentication failed - Check:');
      console.error('  1. SMTP_USER is correct email');
      console.error('  2. SMTP_PASS is app password (not regular password)');
      console.error('  3. 2-Step Verification is enabled on Gmail');
    }
    
    return { success: false, error: error.message };
  }
}

/**
 * Send email to admin about new meeting
 */
export async function sendAdminMeetingNotification(emailData: MeetingEmailData) {
  if (!transporter) {
    console.log('⚠️ SMTP not configured');
    return { success: false };
  }

  const meetingDate = new Date(emailData.date);
  const formattedDate = meetingDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #D6A76C;">🔔 New Meeting Scheduled</h2>
      <div style="background: #FAF8F5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Customer:</strong> ${emailData.customerName}</p>
        <p><strong>Email:</strong> <a href="mailto:${emailData.to}">${emailData.to}</a></p>
        <p><strong>Company:</strong> ${emailData.company}</p>
        <p><strong>Type:</strong> ${emailData.meetingType}</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Time:</strong> ${emailData.timeSlot} EST</p>
        ${emailData.googleMeetLink ? `<p><strong>Google Meet:</strong> <a href="${emailData.googleMeetLink}" style="color: #2196F3;">${emailData.googleMeetLink}</a></p>` : ''}
        ${emailData.message ? `<p><strong>Customer Message:</strong><br><em>${emailData.message}</em></p>` : ''}
      </div>
      <p>Check the admin dashboard for full details: <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/meetings">View Meeting</a></p>
    </div>
  `;

  const textContent = `
New Meeting Scheduled

Customer: ${emailData.customerName}
Email: ${emailData.to}
Company: ${emailData.company}
Type: ${emailData.meetingType}
Date: ${formattedDate}
Time: ${emailData.timeSlot} EST
${emailData.googleMeetLink ? `Google Meet: ${emailData.googleMeetLink}` : ''}
${emailData.message ? `\nCustomer Message:\n${emailData.message}` : ''}

Check admin dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/admin/meetings
  `.trim();

  try {
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      subject: `🔔 New Meeting - ${emailData.company}`,
      text: textContent,
      html: htmlContent,
      replyTo: emailData.to,
    });

    console.log('✅ Admin notification sent via SMTP');
    console.log('Message ID:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error: any) {
    console.error('❌ Failed to send admin notification:', error.message);
    return { success: false, error: error.message };
  }
}

