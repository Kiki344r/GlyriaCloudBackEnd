// resetPasswordEmail.ts
export default (username: string, connectLink: string) => `
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
              <h1 style="margin: 0 0 15px 0; font-size: 28px; font-weight: 700; text-align: center; color: #10b981; letter-spacing: -0.5px;">
                ✓ Mot de passe réinitialisé
              </h1>
              
              <!-- Intro text -->
              <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; text-align: center; color: #d1d5db;">
                Bonjour <strong style="color: #f9fafb;">${username}</strong>,
              </p>
              
              <p style="margin: 0 0 30px 0; font-size: 15px; line-height: 1.6; color: #d1d5db;">
                Votre mot de passe a été <strong style="color: #10b981;">réinitialisé avec succès</strong>. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
              </p>
              
              <!-- Success Info Box -->
              <table role="presentation" style="margin: 35px auto; border-collapse: collapse; width: 100%;" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 20px; background: linear-gradient(135deg, #10b98133 0%, #34d39933 100%); border-left: 4px solid #10b981; border-radius: 6px; text-align: center;">
                    <p style="margin: 0; font-size: 15px; color: #d1d5db;">
                      <strong style="color: #10b981; font-size: 18px;">✓</strong> Votre compte est sécurisé
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Security Info -->
              <p style="margin: 30px 0; padding: 15px; background-color: #1f2937; border-left: 4px solid #f59e0b; border-radius: 4px; font-size: 14px; line-height: 1.6; color: #d1d5db;">
                <strong style="color: #f9fafb;">⚠️ Important:</strong> Si vous n'avez pas demandé cette réinitialisation, contactez immédiatement notre support. Quelqu'un d'autre pourrait avoir accès à votre compte.
              </p>
              
              <!-- Action Link -->
              <p style="margin: 25px 0; text-align: center;">
                <a href="${connectLink}" style="display: inline-block; padding: 12px 30px; font-size: 15px; font-weight: 600; color: #fff; text-decoration: none; border-radius: 8px; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4); transition: all 0.3s ease;" target="_blank">
                  Se connecter à mon compte
                </a>
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