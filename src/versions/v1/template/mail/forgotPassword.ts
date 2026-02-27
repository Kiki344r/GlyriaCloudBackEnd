// resetPasswordEmail.ts
export default (username: string, resetLink: string) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Réinitialisation de votre mot de passe - Glyria Cloud</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; background: linear-gradient(135deg, #1f2937 0%, #111827 100%); color: #f9fafb;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background: linear-gradient(135deg, #1f2937 0%, #111827 100%);" cellpadding="0" cellspacing="0">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #111827; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);" cellpadding="0" cellspacing="0">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 30px 20px; text-align: center;">
              <img src="https://cloud.glyria.app/glyria-logo.png" alt="Glyria Cloud" style="max-width: 120px; height: auto; display: block; margin: 0 auto; border-radius: 100%;" />
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <!-- Title -->
              <h1 style="margin: 0 0 15px 0; font-size: 28px; font-weight: 700; text-align: center; color: #6366f1; letter-spacing: -0.5px;">
                Réinitialisation de mot de passe
              </h1>
              
              <!-- Intro text -->
              <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; text-align: center; color: #d1d5db;">
                Bonjour <strong style="color: #f9fafb;">${username}</strong>,
              </p>
              
              <p style="margin: 0 0 30px 0; font-size: 15px; line-height: 1.6; color: #d1d5db;">
                Nous avons reçu une demande de réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" style="margin: 35px auto; border-collapse: collapse;" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius: 8px; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);">
                    <a href="${resetLink}" style="display: block; padding: 14px 40px; font-size: 16px; font-weight: 600; color: #fff; text-decoration: none; border-radius: 8px; transition: all 0.3s ease;" target="_blank">
                      Réinitialiser mon mot de passe
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Security Info -->
              <p style="margin: 30px 0; padding: 15px; background-color: #1f2937; border-left: 4px solid #6366f1; border-radius: 4px; font-size: 14px; line-height: 1.6; color: #d1d5db;">
                <strong style="color: #f9fafb;">⚠️ Lien temporaire:</strong> Ce lien expirera dans 30 minutes. Ne le partagez avec personne.
              </p>
              
              <!-- Alternative Link -->
              <p style="margin: 25px 0; font-size: 13px; text-align: center; color: #9ca3af;">
                Ou copiez ce lien dans votre navigateur:<br/>
                <span style="word-break: break-all; color: #6366f1; font-family: 'Courier New', monospace;">${resetLink}</span>
              </p>
              
              <!-- Not requested -->
              <p style="margin: 30px 0 0 0; padding: 15px; background-color: rgba(100, 116, 139, 0.3); border-radius: 6px; font-size: 14px; line-height: 1.6; text-align: center; color: #cbd5e1;">
                Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité. Votre compte restera protégé.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 25px 30px; background-color: #0f172a; border-top: 1px solid #1e293b; text-align: center;">
              <p style="margin: 0 0 12px 0; font-size: 13px; color: #94a3b8;">
                <strong style="color: #cbd5e1;">Glyria Cloud</strong> • Projet scolaire
              </p>
              <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #64748b;">
                <a href="https://github.com/Kiki344r/GlyriaCloudFrontEnd" style="color: #8b5cf6; text-decoration: none; margin: 0 8px;">FrontEnd</a>
                <span style="color: #475569;">•</span>
                <a href="https://github.com/Kiki344r/GlyriaCloudBackEnd" style="color: #8b5cf6; text-decoration: none; margin: 0 8px;">BackEnd</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;