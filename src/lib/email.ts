import { Resend } from "resend";
import nodemailer from "nodemailer";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export interface SendContactEmailParams {
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

export async function sendContactNotification(params: SendContactEmailParams): Promise<{ success: boolean; error?: string }> {
  const { name, email, message, createdAt } = params;
  const toEmail = process.env.CONTACT_TO_EMAIL || "sagarsamrudh82@gmail.com";
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";
  const resendApiKey = process.env.RESEND_API_KEY;

  const escapedName = escapeHtml(name);
  const escapedEmail = escapeHtml(email);
  const escapedMessage = escapeHtml(message).replace(/\n/g, "<br/>");
  const formattedTime = createdAt.toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "medium",
  });

  const subject = `New portfolio message from ${name}`;
  const textContent = `
New message received from your portfolio website:

Name: ${name}
Email: ${email}
Received: ${formattedTime}

Message:
${message}
`.trim();

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f7f7; color: #111111; padding: 24px; }
    .card { background: #ffffff; max-width: 580px; margin: 0 auto; border: 1px solid #bdbdbd; padding: 32px; }
    .header { border-bottom: 2px solid #00A19C; padding-bottom: 16px; margin-bottom: 24px; }
    .title { font-size: 20px; font-weight: 800; color: #111111; margin: 0; text-transform: uppercase; letter-spacing: 0.05em; }
    .meta { margin-bottom: 20px; }
    .label { font-size: 11px; font-weight: 700; color: #80142B; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 4px; }
    .val { font-size: 15px; color: #111111; margin-bottom: 14px; }
    .msg-box { background: #f7f7f7; border-left: 3px solid #80142B; padding: 16px; margin-top: 12px; font-size: 15px; line-height: 1.6; }
    .footer { font-size: 12px; color: #777777; margin-top: 24px; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1 class="title">New Portfolio Contact</h1>
    </div>
    <div class="meta">
      <div class="label">Sender Name</div>
      <div class="val">${escapedName}</div>
      <div class="label">Email Address</div>
      <div class="val"><a href="mailto:${escapedEmail}" style="color: #80142B; text-decoration: none;">${escapedEmail}</a></div>
      <div class="label">Received On</div>
      <div class="val">${formattedTime}</div>
      <div class="label">Message</div>
      <div class="msg-box">${escapedMessage}</div>
    </div>
    <div class="footer">
      Sent via Samrudh S. Sagar Portfolio
    </div>
  </div>
</body>
</html>
  `.trim();

  // 1. Try Resend if API key is provided
  if (resendApiKey && resendApiKey !== "re_123456789") {
    try {
      const resend = new Resend(resendApiKey);
      const res = await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        replyTo: email,
        subject,
        text: textContent,
        html: htmlContent,
      });

      if (res.error) {
        console.error("Resend error:", res.error);
        return { success: false, error: res.error.message };
      }
      return { success: true };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Resend send failed:", errorMessage);
      // fallback to nodemailer below
    }
  }

  // 2. Fallback to Nodemailer if Gmail or SMTP configured
  const gmailUser = process.env.GMAIL_USER || process.env.SMTP_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;

  if (gmailUser && gmailPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });

      await transporter.sendMail({
        from: `"${name}" <${gmailUser}>`,
        to: toEmail,
        replyTo: email,
        subject,
        text: textContent,
        html: htmlContent,
      });
      return { success: true };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Gmail/Nodemailer send failed:", errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  // If no email credentials configured in local development, log to server console
  console.log("No email service configured (GMAIL_USER, RESEND_API_KEY, or SMTP not set). Message logged to database:");
  console.log(`From: ${name} <${email}>`);
  console.log(`Message: ${message}`);
  return { success: true };
}
