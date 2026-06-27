export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const BRAND_RED = "#CA0013";
const BRAND_DARK = "#1D1D1D";
const BRAND_CREAM = "#EEEBE3";

function emailLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Alvion</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f2ed;font-family:Inter,Arial,sans-serif;color:${BRAND_DARK};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f2ed;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e8e4dc;">
          <tr>
            <td style="background-color:${BRAND_DARK};padding:28px 32px;">
              <p style="margin:0;font-size:22px;font-weight:600;color:${BRAND_CREAM};letter-spacing:-0.02em;">
                Alvion<span style="color:${BRAND_RED};">.</span>
              </p>
              <p style="margin:8px 0 0;font-size:13px;color:rgba(238,235,227,0.7);">Marketing that cuts through the noise</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid #ece8e0;">
              <p style="margin:0;font-size:12px;line-height:1.6;color:#6b6b6b;">
                Alvion &middot; New Delhi, India<br />
                <a href="mailto:office@alvion.in" style="color:${BRAND_RED};text-decoration:none;">office@alvion.in</a>
                &middot;
                <a href="https://alvion.in" style="color:${BRAND_RED};text-decoration:none;">alvion.in</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildTeamNotificationEmail(params: {
  name: string;
  email: string;
  message: string;
}): { subject: string; text: string; html: string } {
  const { name, email, message } = params;
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

  const subject = `New contact from ${name}`;

  const text = [
    "New contact form submission",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const html = emailLayout(`
    <h1 style="margin:0 0 8px;font-size:20px;font-weight:600;color:${BRAND_DARK};">New contact form submission</h1>
    <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#5c5c5c;">Someone reached out through the website contact form.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;line-height:1.7;">
      <tr>
        <td style="padding:8px 0;color:#888;width:88px;vertical-align:top;">Name</td>
        <td style="padding:8px 0;color:${BRAND_DARK};font-weight:500;">${safeName}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#888;vertical-align:top;">Email</td>
        <td style="padding:8px 0;">
          <a href="mailto:${safeEmail}" style="color:${BRAND_RED};text-decoration:none;">${safeEmail}</a>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#888;vertical-align:top;">Message</td>
        <td style="padding:8px 0;color:${BRAND_DARK};">${safeMessage}</td>
      </tr>
    </table>
  `);

  return { subject, text, html };
}

export function buildCustomerAutoReplyEmail(params: {
  name: string;
  message: string;
}): { subject: string; text: string; html: string } {
  const { name, message } = params;
  const firstName = name.trim().split(/\s+/)[0] || name;
  const safeFirstName = escapeHtml(firstName);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

  const subject = "We received your message — Alvion";

  const text = [
    `Hi ${firstName},`,
    "",
    "Thank you for reaching out to Alvion. We have received your message and our team will review it shortly.",
    "",
    "Your message:",
    message,
    "",
    "We typically respond within 1–2 business days. If your enquiry is urgent, feel free to call us at +91 89499 21676.",
    "",
    "Warm regards,",
    "The Alvion Team",
    "office@alvion.in",
    "https://alvion.in",
  ].join("\n");

  const html = emailLayout(`
    <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:${BRAND_DARK};">
      Hi ${safeFirstName},
    </p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#444;">
      Thank you for reaching out to <strong>Alvion</strong>. We have received your message and our team will review it shortly.
    </p>
    <div style="margin:24px 0;padding:16px 18px;background-color:#f8f6f2;border-left:4px solid ${BRAND_RED};border-radius:0 8px 8px 0;">
      <p style="margin:0 0 6px;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#888;">Your message</p>
      <p style="margin:0;font-size:14px;line-height:1.7;color:${BRAND_DARK};">${safeMessage}</p>
    </div>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#444;">
      We typically respond within <strong>1–2 business days</strong>. If your enquiry is urgent, you can reach us at
      <a href="tel:+918949921676" style="color:${BRAND_RED};text-decoration:none;">+91 89499 21676</a>.
    </p>
    <p style="margin:24px 0 0;font-size:15px;line-height:1.7;color:${BRAND_DARK};">
      Warm regards,<br />
      <strong>The Alvion Team</strong>
    </p>
  `);

  return { subject, text, html };
}
