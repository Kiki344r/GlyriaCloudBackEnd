// resetPasswordEmail.ts
export default (username: string, resetLink: string) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Réinitialisation de votre mot de passe</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #1f2937;
      color: #f9fafb;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #111827;
      border-radius: 10px;
      padding: 30px 20px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }
    .logo {
      display: block;
      margin: 0 auto 20px;
      width: 120px;
      height: auto;
    }
    h1 {
      font-size: 22px;
      margin-bottom: 15px;
      text-align: center;
      color: #6366f1;
    }
    p {
      font-size: 16px;
      line-height: 1.5;
      text-align: center;
      margin-bottom: 25px;
      color: #d1d5db;
    }
    .button {
      display: inline-block;
      background-color: #8b5cf6;
      color: #fff;
      text-decoration: none;
      padding: 12px 25px;
      border-radius: 6px;
      font-weight: bold;
      margin-bottom: 20px;
      transition: background-color 0.2s;
    }
    .button:hover {
      background-color: #7c3aed;
    }
    .footer {
      font-size: 12px;
      color: #9ca3af;
      text-align: center;
      margin-top: 25px;
      line-height: 1.4;
    }
    .footer a {
      color: #8b5cf6;
      text-decoration: none;
      margin: 0 5px;
    }
    @media (max-width: 480px) {
      h1 { font-size: 20px; }
      p { font-size: 14px; }
      .button { padding: 10px 20px; font-size: 14px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <img src="https://cloud.glyria.app/glyria-logo.png" alt="Glyria Cloud" class="logo" />
    <h1>Réinitialisation de votre mot de passe</h1>
    <p>Bonjour ${username},<br>
    Nous avons reçu une demande de réinitialisation de votre mot de passe pour Glyria Cloud.</p>
    <p><a href="${resetLink}" class="button">Réinitialiser mon mot de passe</a></p>
    <p>Si vous n’avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.</p>
    <div class="footer">
      Projet scolaire Glyria Cloud<br/>
      <a href="https://github.com/Kiki344r/GlyriaCloudFrontEnd">FrontEnd</a> • 
      <a href="https://github.com/Kiki344r/GlyriaCloudBackEnd">BackEnd</a>
    </div>
  </div>
</body>
</html>
`;