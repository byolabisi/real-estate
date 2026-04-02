import { Resend } from "resend";
import { logEmail } from "@/lib/supabase/db";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  userId?: string;
  listingId?: string;
  emailType: "welcome" | "listing_update" | "contact_agent" | "rating_received" | "review_received" | "maintenance_notice";
}

export async function sendEmail({
  to,
  subject,
  html,
  userId,
  listingId,
  emailType,
}: EmailOptions) {
  try {
    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "noreply@nigerian-realestate.com",
      to,
      subject,
      html,
    });

    // Log the email
    await logEmail(to, subject, emailType, userId, listingId);

    return response;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

// Welcome email template
export function getWelcomeEmailTemplate(userName: string, userType: string): string {
  const actionText =
    userType === "agent" || userType === "landlord"
      ? "Start Listing Your Property"
      : "Browse Available Listings";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 30px; background: #f9f9f9; }
        .footer { background: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
        h2 { color: #667eea; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Nigerian Real Estate Platform 🏠</h1>
        </div>
        <div class="content">
          <h2>Hello ${userName},</h2>
          <p>Thank you for joining our community! We&apos;re excited to have you on board.</p>
          <p>As a ${userType}, you now have access to:</p>
          <ul>
            <li>Complete listing database with verified properties</li>
            <li>Direct communication with agents and landlords</li>
            <li>Transparent tenant reviews and ratings</li>
            <li>Maintenance notices and updates</li>
          </ul>
          <p>
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" class="button">${actionText}</a>
          </p>
          <p>If you have any questions, our support team is here to help.</p>
          <p>Best regards,<br>The Nigerian Real Estate Platform Team</p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Listing update email
export function getListingEmailTemplate(
  recipientName: string,
  listingTitle: string,
  listingUrl: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #667eea; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 30px; background: #f9f9f9; }
        .footer { background: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Listing Available! 🏡</h1>
        </div>
        <div class="content">
          <p>Hi ${recipientName},</p>
          <p>A new property matching your preferences has been listed:</p>
          <h3>${listingTitle}</h3>
          <p>
            <a href="${listingUrl}" class="button">View Listing</a>
          </p>
          <p>Don&apos;t miss out! Check it out today.</p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Agent contact email
export function getAgentContactEmailTemplate(
  agentName: string,
  requesterName: string,
  message: string,
  requesterEmail: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #667eea; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 30px; background: #f9f9f9; }
        .footer { background: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
        .message-box { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Inquiry 📩</h1>
        </div>
        <div class="content">
          <p>Hi ${agentName},</p>
          <p>${requesterName} is interested in your property and has sent you a message:</p>
          <div class="message-box">
            <p>${message}</p>
          </div>
          <p><strong>Contact:</strong> ${requesterEmail}</p>
          <p>Please respond promptly to maintain a good rating.</p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Maintenance notice email
export function getMaintenanceEmailTemplate(
  recipientName: string,
  listingTitle: string,
  maintenanceType: string,
  startDate: string,
  expectedEndDate?: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f59e0b; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 30px; background: #f9f9f9; }
        .footer { background: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
        .alert { background: #fef3c7; padding: 15px; border-radius: 4px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Maintenance Notice ⚠️</h1>
        </div>
        <div class="content">
          <p>Hi ${recipientName},</p>
          <p>Please note that maintenance work will be conducted on:</p>
          <div class="alert">
            <p><strong>${listingTitle}</strong></p>
            <p><strong>Type:</strong> ${maintenanceType}</p>
            <p><strong>Start Date:</strong> ${startDate}</p>
            ${expectedEndDate ? `<p><strong>Expected End Date:</strong> ${expectedEndDate}</p>` : ""}
          </div>
          <p>Thank you for your understanding and cooperation.</p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
