// accountVerified.ts
export default (username: string, dashboardUrl: string) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Compte vérifié - Glyria Cloud</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; background: linear-gradient(135deg, #1f2937 0%, #111827 100%); color: #f9fafb;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background: linear-gradient(135deg, #1f2937 0%, #111827 100%);" cellpadding="0" cellspacing="0">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #111827; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);" cellpadding="0" cellspacing="0">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px 20px; text-align: center;">
              <div style="font-size: 48px; margin-bottom: 15px;">✓</div>
              <img src="https://cloud.glyria.app/glyria-logo.png" alt="Glyria Cloud" style="max-width: 120px; height: auto; display: block; margin: 0 auto; border-radius: 100%;" />
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <!-- Title -->
              <h1 style="margin: 0 0 15px 0; font-size: 28px; font-weight: 700; text-align: center; color: #10b981; letter-spacing: -0.5px;">
                Compte vérifié avec succès !
              </h1>
              
              <!-- Intro text -->
              <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; text-align: center; color: #d1d5db;">
                Bonjour <strong style="color: #f9fafb;">${username}</strong>,
              </p>
              
              <p style="margin: 0 0 30px 0; font-size: 15px; line-height: 1.6; color: #d1d5db;">
                Félicitations ! Votre adresse e-mail a été <strong style="color: #10b981;">vérifiée avec succès</strong>. Votre compte Glyria Cloud est maintenant <strong style="color: #f9fafb;">actif et prêt à l'emploi</strong>.
              </p>
              
              <!-- Success Message -->
              <div style="margin: 30px 0; padding: 20px; background-color: rgba(16, 185, 129, 0.1); border-left: 4px solid #10b981; border-radius: 8px;">
                <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #d1d5db;">
                  Vous pouvez dès à présent accéder à toutes les fonctionnalités de Glyria Cloud et commencer votre formation Linux avec votre formateur et vos camarades.
                </p>
              </div>
              
              <!-- CTA Button -->
              <table role="presentation" style="margin: 35px auto; border-collapse: collapse;" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius: 8px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);">
                    <a href="${dashboardUrl}" style="display: block; padding: 14px 40px; font-size: 16px; font-weight: 600; color: #fff; text-decoration: none; border-radius: 8px; transition: all 0.3s ease;" target="_blank">
                      → Accéder au tableau de bord
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Quick Start Guide -->
              <div style="margin: 30px 0; padding: 20px; background-color: #1f2937; border-radius: 8px;">
                <h2 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600; color: #f9fafb; text-align: center;">
                  🚀 Commencer avec Glyria Cloud
                </h2>
                <ol style="margin: 0; padding: 0 0 0 20px; font-size: 14px; line-height: 1.8; color: #d1d5db;">
                  <li style="margin-bottom: 10px;"><strong style="color: #f9fafb;">Connectez-vous</strong> à votre compte avec vos identifiants</li>
                  <li style="margin-bottom: 10px;"><strong style="color: #f9fafb;">Rejoignez un groupe</strong> avec le code fourni par votre formateur</li>
                  <li style="margin-bottom: 10px;"><strong style="color: #f9fafb;">Accédez à Linux</strong> via SSH directement dans votre navigateur</li>
                  <li style="margin-bottom: 10px;"><strong style="color: #f9fafb;">Suivez les cours</strong> et les travaux pratiques proposés</li>
                  <li><strong style="color: #f9fafb;">Passez les examens</strong> et suivez votre progression</li>
                </ol>
              </div>
              
              <!-- Security Info -->
              <p style="margin: 25px 0; padding: 15px; background-color: rgba(99, 102, 241, 0.1); border-left: 4px solid #6366f1; border-radius: 4px; font-size: 14px; line-height: 1.6; color: #d1d5db;">
                <strong style="color: #f9fafb;">🔒 Sécurité:</strong> Gardez votre mot de passe secret et ne le partagez jamais. Glyria Cloud utilise le chiffrement pour protéger vos données.
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
                <a href="https://github.com/Kiki344r/GlyriaCloudFrontEnd" style="color: #10b981; text-decoration: none; margin: 0 8px;">FrontEnd</a>
                <span style="color: #475569;">•</span>
                <a href="https://github.com/Kiki344r/GlyriaCloudBackEnd" style="color: #10b981; text-decoration: none; margin: 0 8px;">BackEnd</a>
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

