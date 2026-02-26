import { RouteConfig} from "@/versions/routesManager";
import {prisma} from "@/config";
import {transporter} from "@/versions/v1/services/mailer";
import forgotPasswordMail from "@/versions/v1/template/mail/forgotPassword"

export default {
    method: "POST",
    path: "/auth/forgot-password",
    handler: async (req, res) => {
        try {

            const {email} = req.body

            if (!email) return res.status(400).json({success: false, message: "Des champs sont manquants !"})

            const user = await prisma.users.findUnique({where: {email: email}})

            if (!user) return res.status(200).json({success: true})

            const passwordLink = await prisma.forgotPassword.create({
                data: {
                    userEmail: email,
                    expireAt: new Date(Date.now() + 30*60*1000)
                }
            })

            if (!passwordLink) return res.status(200).json({success: true})

            const UUID = passwordLink.UUID

            const userFullName = `${user.firstName} ${user.lastName}`

            await transporter.sendMail({
                to: `${userFullName} <${email}>`,
                from: `${process.env.SMTP_FROM} <${process.env.SMTP_FROM_EMAIL}>`,
                subject: 'Rénitialisation de mot de passe',
                html: forgotPasswordMail(`${userFullName}`, `${process.env.FRONTEND_URL}/reset-password?code=${UUID}`)
            })

            return res.status(200).json({
                success: true
            })

        } catch (e) {
            console.log(e)
            res.status(500).json({success: false, message: "Une erreur est survenue !"})
        }
    }
} as RouteConfig;