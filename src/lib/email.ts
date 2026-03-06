import { Resend } from 'resend';
import nodemailer from 'nodemailer';

// ═══════════════════════════════════════════
// CONFIGURATION — Resend (prioritaire) ou Nodemailer (fallback)
// ═══════════════════════════════════════════

const resendApiKey = process.env.RESEND_API_KEY;
const smtpUser = process.env.SMTP_USER;
const smtpConfigured = smtpUser && smtpUser !== 'your-email@gmail.com';

// Résend est la méthode recommandée (gratuit, 100 emails/jour)
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Nodemailer fallback (Gmail, OVH, etc.)
const transporter = smtpConfigured
  ? nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: smtpUser,
      pass: process.env.SMTP_PASS,
    },
  })
  : null;

const FROM_EMAIL = process.env.EMAIL_FROM || 'Milan Sky <noreply@milansky.com>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// ═══════════════════════════════════════════
// ENVOI EMAIL — Auto-détecte Resend ou SMTP
// ═══════════════════════════════════════════

async function sendEmail(to: string, subject: string, html: string) {
  // 1. Essaie Resend d'abord
  if (resend) {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });
    if (error) throw new Error(`Resend error: ${error.message}`);
    console.log(`[EMAIL] Sent via Resend to ${to}`);
    return;
  }

  // 2. Fallback Nodemailer
  if (transporter) {
    await transporter.sendMail({ from: FROM_EMAIL, to, subject, html });
    console.log(`[EMAIL] Sent via SMTP to ${to}`);
    return;
  }

  // 3. Aucun service configuré
  console.warn(`[EMAIL] No email service configured. Skipping email to ${to}`);
  throw new Error('Aucun service email configuré (RESEND_API_KEY ou SMTP_USER requis)');
}

// ═══════════════════════════════════════════
// Vérification si l'envoi d'email est possible
// ═══════════════════════════════════════════
export function isEmailConfigured(): boolean {
  return !!(resend || transporter);
}

// ═══════════════════════════════════════════
// TEMPLATES
// ═══════════════════════════════════════════

const emailWrapper = (content: string) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#050505;">
  <div style="background:#050505;padding:40px 20px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;">
    <!-- Logo -->
    <div style="text-align:center;margin-bottom:40px;padding-bottom:24px;border-bottom:1px solid rgba(255,255,255,0.06);">
      <h1 style="font-family:Georgia,'Times New Roman',serif;color:#C9A84C;font-size:28px;margin:0;letter-spacing:4px;">MILAN SKY</h1>
    </div>
    
    ${content}
    
    <!-- Footer -->
    <div style="text-align:center;margin-top:48px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.06);">
      <p style="color:#333;font-size:11px;margin:0;letter-spacing:1px;">© ${new Date().getFullYear()} Milan Sky — L'accès ultime</p>
    </div>
  </div>
</body>
</html>
`;

// ═══════════════════════════════════════════
// EMAIL DE VÉRIFICATION
// ═══════════════════════════════════════════

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${APP_URL}/api/verify-email?token=${token}`;

  const html = emailWrapper(`
    <h2 style="color:#F5F0E8;font-size:22px;font-family:Georgia,serif;margin:0 0 16px;text-align:center;">
      Bienvenue dans l'univers
    </h2>
    <p style="color:#888;font-size:15px;line-height:1.7;text-align:center;margin:0 0 32px;">
      Cliquez sur le bouton ci-dessous pour vérifier votre adresse email et activer votre compte exclusif.
    </p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${verifyUrl}" style="background:linear-gradient(135deg,#C9A84C,#E8C87A);color:#000;padding:16px 40px;text-decoration:none;border-radius:10px;font-weight:700;font-size:13px;letter-spacing:2px;text-transform:uppercase;display:inline-block;">
        Vérifier mon email
      </a>
    </div>
    <p style="color:#555;font-size:12px;text-align:center;line-height:1.6;">
      Ce lien expire dans 24 heures.<br>Si tu n'as pas créé de compte, ignore cet email.
    </p>
  `);

  await sendEmail(email, 'Milan Sky — Vérifiez votre email', html);
}

// ═══════════════════════════════════════════
// EMAIL DE RÉINITIALISATION MOT DE PASSE
// ═══════════════════════════════════════════

export async function sendResetPasswordEmail(email: string, token: string) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;

  const html = emailWrapper(`
    <h2 style="color:#F5F0E8;font-size:22px;font-family:Georgia,serif;margin:0 0 16px;text-align:center;">
      Réinitialisation du mot de passe
    </h2>
    <p style="color:#888;font-size:15px;line-height:1.7;text-align:center;margin:0 0 32px;">
      Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe pour votre compte.
    </p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${resetUrl}" style="background:linear-gradient(135deg,#C9A84C,#E8C87A);color:#000;padding:16px 40px;text-decoration:none;border-radius:10px;font-weight:700;font-size:13px;letter-spacing:2px;text-transform:uppercase;display:inline-block;">
        Réinitialiser mon mot de passe
      </a>
    </div>
    <p style="color:#555;font-size:12px;text-align:center;line-height:1.6;">
      Ce lien expire dans 1 heure.<br>Si tu n'as pas demandé de réinitialisation, ignore cet email.
    </p>
  `);

  await sendEmail(email, 'Milan Sky — Réinitialisation mot de passe', html);
}

// ═══════════════════════════════════════════
// NOTIFICATION ADMIN
// ═══════════════════════════════════════════

export async function sendAdminNotification(subject: string, content: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;

  const html = emailWrapper(`
    <h2 style="color:#C9A84C;font-size:20px;font-family:Georgia,serif;margin:0 0 16px;">
      Notification Admin
    </h2>
    <div style="color:#ccc;font-size:14px;line-height:1.7;background:rgba(255,255,255,0.03);border-radius:12px;padding:20px;border:1px solid rgba(255,255,255,0.06);">
      ${content}
    </div>
  `);

  await sendEmail(adminEmail, `[Milan Sky Admin] ${subject}`, html);
}
