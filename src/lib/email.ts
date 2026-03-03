import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Milan Sky — Vérifiez votre email',
    html: `
      <div style="background: #0A0A0A; color: #F5F0E8; padding: 40px; font-family: 'Montserrat', sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-family: 'Georgia', serif; color: #C9A84C; font-size: 28px; margin: 0;">Milan Sky</h1>
        </div>
        <h2 style="color: #F5F0E8; font-size: 20px;">Bienvenue dans l'univers</h2>
        <p style="color: #999; line-height: 1.6;">Cliquez sur le bouton ci-dessous pour vérifier votre adresse email et activer votre compte.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${verifyUrl}" style="background: linear-gradient(135deg, #C9A84C, #E8C87A); color: #000; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
            Vérifier mon email
          </a>
        </div>
        <p style="color: #666; font-size: 12px;">Ce lien expire dans 24 heures. Si vous n'avez pas créé de compte, ignorez cet email.</p>
      </div>
    `,
  });
}

export async function sendResetPasswordEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Milan Sky — Réinitialisation mot de passe',
    html: `
      <div style="background: #0A0A0A; color: #F5F0E8; padding: 40px; font-family: 'Montserrat', sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-family: 'Georgia', serif; color: #C9A84C; font-size: 28px; margin: 0;">Milan Sky</h1>
        </div>
        <h2 style="color: #F5F0E8; font-size: 20px;">Réinitialisation du mot de passe</h2>
        <p style="color: #999; line-height: 1.6;">Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" style="background: linear-gradient(135deg, #C9A84C, #E8C87A); color: #000; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
            Réinitialiser mon mot de passe
          </a>
        </div>
        <p style="color: #666; font-size: 12px;">Ce lien expire dans 1 heure. Si vous n'avez pas demandé de réinitialisation, ignorez cet email.</p>
      </div>
    `,
  });
}

export async function sendAdminNotification(subject: string, content: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: adminEmail,
    subject: `[Milan Sky Admin] ${subject}`,
    html: `
      <div style="background: #0A0A0A; color: #F5F0E8; padding: 40px; font-family: 'Montserrat', sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #C9A84C;">Notification Admin</h1>
        <div style="color: #ccc; line-height: 1.6;">${content}</div>
      </div>
    `,
  });
}
