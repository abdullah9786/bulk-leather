/**
 * Email sending utility
 * Sends meeting confirmations and Google Meet links to customers
 */

interface EmailData {
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
 * This can be implemented with any email service
 */
export async function sendMeetingConfirmation(emailData: EmailData) {
  // Format the date nicely
  const meetingDate = new Date(emailData.date);
  const formattedDate = meetingDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const emailBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #D6A76C; color: #3A2D28; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #fff; padding: 30px; border: 1px solid #EFE7DD; border-top: none; }
    .meet-link { background: #E3F2FD; border: 2px solid #2196F3; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
    .meet-link a { color: #1976D2; font-size: 18px; font-weight: bold; text-decoration: none; }
    .details { background: #FAF8F5; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .button { display: inline-block; background: #D6A76C; color: #3A2D28; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px 0; }
    .footer { text-align: center; color: #6C5F57; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 28px;">Meeting Scheduled!</h1>
      <p style="margin: 10px 0 0 0;">BulkLeather - Premium Wholesale Leather</p>
    </div>
    
    <div class="content">
      <p>Dear ${emailData.customerName},</p>
      
      <p>Your ${emailData.meetingType} meeting has been successfully scheduled with BulkLeather.</p>
      
      <div class="details">
        <p style="margin: 5px 0;"><strong>📅 Date:</strong> ${formattedDate}</p>
        <p style="margin: 5px 0;"><strong>🕐 Time:</strong> ${emailData.timeSlot} EST</p>
        <p style="margin: 5px 0;"><strong>🏢 Company:</strong> ${emailData.company}</p>
        <p style="margin: 5px 0;"><strong>📝 Meeting Type:</strong> ${emailData.meetingType.charAt(0).toUpperCase() + emailData.meetingType.slice(1)}</p>
      </div>

      ${emailData.googleMeetLink ? `
      <div class="meet-link">
        <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold;">🎥 Join via Google Meet</p>
        <a href="${emailData.googleMeetLink}" style="word-break: break-all;">${emailData.googleMeetLink}</a>
        <p style="margin: 15px 0 0 0; font-size: 14px; color: #666;">
          <a href="${emailData.googleMeetLink}" class="button">Join Meeting</a>
        </p>
      </div>
      ` : `
      <div class="meet-link">
        <p style="margin: 0; font-size: 16px;">📞 Our team will contact you at the scheduled time</p>
      </div>
      `}

      ${emailData.message ? `
      <p><strong>Your Message:</strong></p>
      <div style="background: #FAF8F5; padding: 15px; border-radius: 8px; border-left: 4px solid #D6A76C;">
        ${emailData.message}
      </div>
      ` : ''}

      <p style="margin-top: 30px;">We look forward to speaking with you!</p>
      
      <p>If you need to reschedule or have any questions, please contact us at:</p>
      <p>📧 Email: sales@bulkleather.com<br>
      📞 Phone: +1 (234) 567-890</p>
      
      <div class="footer">
        <p>BulkLeather - Premium Wholesale Leather Goods</p>
        <p>123 Leather District, Industrial Area, Manufacturing Hub, IN 456789</p>
        <p>© ${new Date().getFullYear()} BulkLeather. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  // Log email details for now
  console.log('📧 Email would be sent to:', emailData.to);
  console.log('📧 Email subject: Meeting Scheduled - BulkLeather');
  
  // TODO: Implement actual email sending
  // Options:
  // 1. Use Resend API (modern, easy)
  // 2. Use SendGrid API
  // 3. Use SMTP with nodemailer (if you add it back)
  // 4. Use your email service's API
  
  // For now, return the email data for logging
  return {
    success: true,
    to: emailData.to,
    subject: `Meeting Scheduled - ${meetingDetails.meetingType.charAt(0).toUpperCase() + meetingDetails.meetingType.slice(1)} Meeting`,
    body: emailBody,
  };
}

/**
 * Get email template data for manual sending
 */
export function getMeetingEmailTemplate(emailData: EmailData): string {
  const meetingDate = new Date(emailData.date);
  const formattedDate = meetingDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
Hi ${emailData.customerName},

Your ${emailData.meetingType} meeting has been scheduled with BulkLeather!

📅 Date: ${formattedDate}
🕐 Time: ${emailData.timeSlot} EST
🏢 Company: ${emailData.company}

${emailData.googleMeetLink ? `
🎥 Join via Google Meet:
${emailData.googleMeetLink}

Click the link above at the scheduled time to join the meeting.
` : `
📞 Our team will contact you at the scheduled time.
`}

${emailData.message ? `
Your message:
${emailData.message}
` : ''}

Looking forward to speaking with you!

Best regards,
BulkLeather Sales Team
sales@bulkleather.com
+1 (234) 567-890
  `.trim();
}

