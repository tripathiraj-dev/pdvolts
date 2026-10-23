import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions): Promise<boolean> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || "PdVolts Industrial <no-reply@pdvolts.com>";

  if (!host) {
    // Development console fallback - gracefully logs email content
    console.log("=========================================");
    console.log(`[EMAIL DISPATCH - DEV SIMULATOR]`);
    console.log(`To: ${to}`);
    console.log(`From: ${from}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body (truncated): ${text || html.slice(0, 200)}...`);
    console.log("=========================================");
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: user ? { user, pass } : undefined,
    });

    await transporter.sendMail({
      from,
      to,
      subject,
      text: text || html.replace(/<[^>]*>?/gm, ""),
      html,
    });
    return true;
  } catch (error) {
    console.error("Failed to send email via SMTP:", error);
    return false;
  }
}

// ----------------------------------------------------
// Modern Branded HTML Email Templates
// ----------------------------------------------------

function emailWrapper(title: string, content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; }
    .header { background-color: #0f2b48; padding: 24px 32px; color: #ffffff; text-align: left; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; }
    .header p { margin: 4px 0 0 0; font-size: 13px; color: #94a3b8; }
    .body { padding: 32px; }
    .footer { background: #f1f5f9; padding: 20px 32px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
    .button { display: inline-block; background-color: #026fc5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 16px; }
    .badge { display: inline-block; padding: 4px 10px; background: #e0effe; color: #03589f; border-radius: 9999px; font-size: 12px; font-weight: 600; margin-bottom: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>PdVolts Industrial</h1>
      <p>Precision Wire & Plastic Manufacturing</p>
    </div>
    <div class="body">
      <div class="badge">${title}</div>
      ${content}
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} PdVolts Precision Polymers & Cables Ltd. All rights reserved.<br>
      4500 Industrial Parkway, Sector 9, Houston, TX 75001, USA
    </div>
  </div>
</body>
</html>
  `;
}

export async function sendWelcomeEmail(to: string, name: string) {
  const html = emailWrapper(
    "Welcome to PdVolts",
    `
    <h2>Hello ${name},</h2>
    <p>Welcome to the <strong>PdVolts Industrial Portal</strong>. Your corporate customer account has been successfully created.</p>
    <p>You can now browse our comprehensive wire and polymer catalog, request instant quotations, track industrial order inquiries, and download technical datasheets.</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard" class="button">Access Your Portal</a>
    `
  );
  return sendEmail({ to, subject: "Welcome to PdVolts Industrial Portal", html });
}

export async function sendPasswordResetEmail(to: string, resetToken: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;
  const html = emailWrapper(
    "Password Reset Request",
    `
    <h2>Password Reset Instructions</h2>
    <p>We received a request to reset the password for your PdVolts account.</p>
    <p>Click the button below to set a new password. This link will expire in 1 hour.</p>
    <a href="${resetUrl}" class="button">Reset Password</a>
    <p style="margin-top: 24px; font-size: 13px; color: #64748b;">If you did not request this, please ignore this email.</p>
    `
  );
  return sendEmail({ to, subject: "Reset Your PdVolts Password", html });
}

export async function sendQuoteConfirmationEmail(
  to: string,
  name: string,
  quoteId: string,
  quantity: string,
  requirements?: string
) {
  const html = emailWrapper(
    "Quotation Request Received",
    `
    <h2>Thank you, ${name}</h2>
    <p>We have successfully received your Request for Quotation (RFQ Ref: <strong>#${quoteId.slice(-6).toUpperCase()}</strong>).</p>
    <p><strong>Requested Volume:</strong> ${quantity}</p>
    ${requirements ? `<p><strong>Technical Notes:</strong> ${requirements}</p>` : ""}
    <p>Our engineering and sales estimators are reviewing your specifications and will respond with a formal commercial quote within 24 business hours.</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/quotes" class="button">Track Your Quote</a>
    `
  );
  return sendEmail({ to, subject: `Quotation Request Received [#${quoteId.slice(-6).toUpperCase()}]`, html });
}

export async function sendContactEnquiryReceiptEmail(to: string, name: string, subject: string) {
  const html = emailWrapper(
    "Inquiry Received",
    `
    <h2>Dear ${name},</h2>
    <p>Thank you for contacting PdVolts Industrial regarding: <strong>${subject}</strong>.</p>
    <p>Our client services team has received your communication and assigned a technical representative to address your inquiry.</p>
    <p>We typically review and reply to all technical inquiries within 12-24 business hours.</p>
    `
  );
  return sendEmail({ to, subject: `Inquiry Received: ${subject} - PDVolts`, html });
}

export async function sendAdminEnquiryNotificationEmail(enquiry: {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  subject: string;
  message: string;
  id?: string;
  createdAt?: Date;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER || "admin@pdvolts.com";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const time = enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleString("en-IN") : new Date().toLocaleString("en-IN");

  const html = emailWrapper(
    "New Customer Enquiry Alert",
    `
    <h2 style="color: #0f2b48; margin-top: 0;">⚡ New Customer Enquiry Received</h2>
    <p>A new inquiry was submitted on the <strong>PDVolts Industrial Portal</strong>.</p>
    
    <div style="background: #f8fafc; border-left: 4px solid #026fc5; padding: 16px 20px; border-radius: 6px; margin: 20px 0;">
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 6px 0; color: #64748b; width: 140px; font-weight: 600;">Client Name:</td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: bold;">${enquiry.name}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Client Email:</td>
          <td style="padding: 6px 0; color: #026fc5;"><a href="mailto:${enquiry.email}">${enquiry.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Contact Phone:</td>
          <td style="padding: 6px 0; color: #0f172a;">${enquiry.phone || "Not provided"}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Company / Firm:</td>
          <td style="padding: 6px 0; color: #0f172a;">${enquiry.company || "Not provided"}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Subject:</td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${enquiry.subject}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Received At:</td>
          <td style="padding: 6px 0; color: #64748b;">${time}</td>
        </tr>
      </table>
    </div>

    <h3 style="color: #1e293b; font-size: 15px; margin-bottom: 8px;">Enquiry Message:</h3>
    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; font-size: 14px; color: #334155; line-height: 1.6; white-space: pre-wrap;">${enquiry.message}</div>

    <div style="margin-top: 24px; text-align: left;">
      <a href="${appUrl}/admin/enquiries" class="button" style="background-color: #026fc5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">Open in Admin Panel</a>
      <a href="mailto:${enquiry.email}?subject=Re: ${encodeURIComponent(enquiry.subject)}" style="display: inline-block; margin-left: 12px; padding: 12px 20px; color: #026fc5; background: #e0effe; border-radius: 6px; text-decoration: none; font-weight: 600;">Reply Directly</a>
    </div>
    `
  );

  return sendEmail({
    to: adminEmail,
    subject: `[PDVolts New Enquiry] ${enquiry.subject} - from ${enquiry.name}`,
    html,
  });
}

export async function sendAdminQuoteNotificationEmail(quote: {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  country?: string | null;
  productName?: string | null;
  quantity: string;
  requirements?: string | null;
  message?: string | null;
  createdAt?: Date;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER || "admin@pdvolts.com";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const time = quote.createdAt ? new Date(quote.createdAt).toLocaleString("en-IN") : new Date().toLocaleString("en-IN");

  const html = emailWrapper(
    "New Quotation Request (RFQ)",
    `
    <h2 style="color: #0f2b48; margin-top: 0;">⚡ New RFQ Request: #${quote.id.slice(-6).toUpperCase()}</h2>
    <p>A new industrial quotation request has been placed by <strong>${quote.company}</strong>.</p>
    
    <div style="background: #f8fafc; border-left: 4px solid #f59e0b; padding: 16px 20px; border-radius: 6px; margin: 20px 0;">
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 6px 0; color: #64748b; width: 140px; font-weight: 600;">Contact Person:</td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: bold;">${quote.name}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Company / Firm:</td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${quote.company}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Email:</td>
          <td style="padding: 6px 0; color: #026fc5;"><a href="mailto:${quote.email}">${quote.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Phone:</td>
          <td style="padding: 6px 0; color: #0f172a;">${quote.phone}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Product / Item:</td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${quote.productName || "General Custom Specification"}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Volume / Quantity:</td>
          <td style="padding: 6px 0; color: #b45309; font-weight: bold;">${quote.quantity}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Country / Region:</td>
          <td style="padding: 6px 0; color: #0f172a;">${quote.country || "Not specified"}</td>
        </tr>
      </table>
    </div>

    ${
      quote.requirements
        ? `
    <h3 style="color: #1e293b; font-size: 15px; margin-bottom: 8px;">Technical Requirements / Notes:</h3>
    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px; font-size: 14px; color: #334155; line-height: 1.6; white-space: pre-wrap;">${quote.requirements}</div>
    `
        : ""
    }

    ${
      quote.message
        ? `
    <h3 style="color: #1e293b; font-size: 15px; margin-top: 14px; margin-bottom: 8px;">Additional Remarks:</h3>
    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px; font-size: 14px; color: #334155; line-height: 1.6; white-space: pre-wrap;">${quote.message}</div>
    `
        : ""
    }

    <div style="margin-top: 24px; text-align: left;">
      <a href="${appUrl}/admin/quotes" class="button" style="background-color: #026fc5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">Open in Admin Panel</a>
      <a href="mailto:${quote.email}?subject=Quote Request #${quote.id.slice(-6).toUpperCase()} - PDVolts" style="display: inline-block; margin-left: 12px; padding: 12px 20px; color: #026fc5; background: #e0effe; border-radius: 6px; text-decoration: none; font-weight: 600;">Reply to Client</a>
    </div>
    `
  );

  return sendEmail({
    to: adminEmail,
    subject: `[PDVolts RFQ] New Quote Request #${quote.id.slice(-6).toUpperCase()} from ${quote.company}`,
    html,
  });
}
