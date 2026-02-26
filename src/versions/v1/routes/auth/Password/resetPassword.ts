import { RouteConfig} from "@/versions/routesManager";
import {prisma} from "@/config";
import {transporter} from "@/versions/v1/services/mailer";
import resetPasswordMail from "@/versions/v1/template/mail/resetPassword"
import bcrypt from "bcrypt";

export default {
    method: "POST",
    path: "/auth/reset-password",
    handler: async (req, res) => {
        try {

            const {code, password} = req.body

            if (!code || !password) return res.status(400).json({success: false, message: "Des champs sont manquants !"})

            const passwordCode = await prisma.forgotPassword.findUnique({where: {UUID: code}})
            if (!passwordCode) return res.status(404).json({success: false, message: "Ce code n'existe pas !"})

            if (passwordCode.expireAt < new Date()) {
                await prisma.forgotPassword.delete({where: {UUID: code}})
                return res.status(410).json({success: false, message: 'Le lien de rénitialisation de mot de passe a expiré !'})
            }

            if (password.length < 8) return res.status(422).json({success: false, message: "Le mot de passe est trop court !"})

            const hashedPassword = await bcrypt.hash(password, 10)

            const user = await prisma.users.update({
                where: {
                    email: passwordCode.userEmail
                },
                data: {
                    password: hashedPassword
                }
            })

            if (!user) return res.status(404).json({success: true, message: "Cet utilisateur n'existe pas !"})
            await prisma.forgotPassword.delete({where: {UUID: code}})

            // envoyer mail
            const userFullName = `${user.firstName} ${user.lastName}`

            try {
                await transporter.sendMail({
                    to: `${userFullName} <${user.email}>`,
                    from: `${process.env.SMTP_FROM} <${process.env.SMTP_FROM_EMAIL}>`,
                    subject: "Votre mot de passe a été réinitialisé",
                    html: resetPasswordMail(userFullName, `${process.env.FRONTEND_URL}/login`)
                })
            } catch (e) {}

            return res.status(200).json({
                success: true
            })

        } catch (e) {
            console.log(e)
            res.status(500).json({success: false, message: "Une erreur est survenue !"})
        }
    }
} as RouteConfig;