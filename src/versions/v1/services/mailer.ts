import nodemailer from "nodemailer"

const port = parseInt(process.env.SMTP_PORT || "587", 10);

// Vérification des variables d'environnement requises
if (!process.env.SMTP_HOST) {
    console.error("❌ SMTP_HOST n'est pas défini dans les variables d'environnement");
}
if (!process.env.SMTP_USERNAME) {
    console.error("❌ SMTP_USERNAME n'est pas défini dans les variables d'environnement");
}
if (!process.env.SMTP_PASSWORD) {
    console.error("❌ SMTP_PASSWORD n'est pas défini dans les variables d'environnement");
}

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: port,
    // Port 587 utilise STARTTLS (secure: false), port 465 utilise SSL/TLS direct (secure: true)
    secure: port === 465,
    requireTLS: true, // Force l'utilisation de TLS
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
    },
    tls: {
        // Ne pas échouer sur les certificats invalides (utile en dev)
        rejectUnauthorized: process.env.NODE_ENV === "production"
    }
})

export { transporter }
