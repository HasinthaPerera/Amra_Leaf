import nodemailer from 'nodemailer';

/**
 * Creates a Nodemailer transporter using SMTP credentials from environment variables.
 * Supports Gmail (smtp.gmail.com:587 with App Password) or any SMTP provider.
 */
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false, // TLS upgrade via STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

/**
 * Sends a welcome email to a newly registered employee with their login credentials.
 * This function is non-blocking — failures are logged but do not throw.
 */
export async function sendWelcomeEmail(
  toEmail: string,
  employeeName: string,
  employeeId: string
): Promise<void> {
  // If no email config is set, skip silently (dev mode without SMTP)
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('[Email] EMAIL_USER or EMAIL_PASS not set — skipping welcome email.');
    return;
  }

  const transporter = createTransporter();
  const fromAddress = process.env.EMAIL_FROM || `"Amra Leaf Security" <${process.env.EMAIL_USER}>`;
  const loginUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/login`
    : 'http://localhost:3000/login';

  const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Amra Leaf</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%);padding:36px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:2px;text-transform:uppercase;">🌿 AMRA LEAF</h1>
              <p style="margin:6px 0 0;color:#94a3b8;font-size:12px;letter-spacing:1px;text-transform:uppercase;">Cybersecurity Policy & Awareness System</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 8px;font-size:14px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Welcome aboard,</p>
              <h2 style="margin:0 0 24px;font-size:24px;color:#0f172a;font-weight:800;">${employeeName}</h2>

              <p style="margin:0 0 20px;font-size:14px;color:#475569;line-height:1.7;">
                Your employee account has been created on the <strong>Amra Leaf Cybersecurity Policy & Awareness Management System</strong>.
                Please use the account details below to log in and complete your mandatory security training.
              </p>

              <!-- Credentials Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin:0 0 24px;">
                <tr>
                  <td style="padding:24px 28px;">
                    <p style="margin:0 0 4px;font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Your Account Details</p>
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;">
                          <span style="font-size:12px;color:#64748b;font-weight:600;">Employee ID</span>
                        </td>
                        <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;text-align:right;">
                          <span style="font-size:13px;color:#0f172a;font-weight:800;font-family:monospace;">${employeeId}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;">
                          <span style="font-size:12px;color:#64748b;font-weight:600;">Email Address</span>
                        </td>
                        <td style="padding:8px 0;text-align:right;">
                          <span style="font-size:13px;color:#0f172a;font-weight:700;">${toEmail}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Warning -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;margin:0 0 24px;">
                <tr>
                  <td style="padding:14px 20px;">
                    <p style="margin:0;font-size:12px;color:#92400e;font-weight:700;">⚠️ Important: Please obtain your initial password directly from your system administrator.</p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${loginUrl}"
                      style="display:inline-block;background:linear-gradient(135deg,#0f172a,#1e3a5f);color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:14px 36px;border-radius:8px;">
                      LOG IN TO THE SYSTEM →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#94a3b8;">This is an automated message from the Amra Leaf Security System. Please do not reply to this email.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const textBody = `
Welcome to Amra Leaf Cybersecurity System, ${employeeName}!

Your account has been created. Here are your account details:

  Employee ID:   ${employeeId}
  Email Address: ${toEmail}

Login URL: ${loginUrl}

IMPORTANT: Please obtain your initial password directly from your system administrator.

This is an automated message. Do not reply to this email.
  `.trim();

  try {
    await transporter.sendMail({
      from: fromAddress,
      to: toEmail,
      subject: `Welcome to Amra Leaf — Account Created`,
      text: textBody,
      html: htmlBody,
    });
    console.log(`[Email] Welcome email sent to ${toEmail}`);
  } catch (error) {
    console.error(`[Email] Failed to send welcome email to ${toEmail}:`, error);
    // Non-blocking: do not re-throw; account creation should still succeed
  }
}
