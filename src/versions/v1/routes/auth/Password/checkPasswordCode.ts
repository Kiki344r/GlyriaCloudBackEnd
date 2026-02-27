import { RouteConfig} from "@/versions/routesManager";
import {prisma} from "@/config";
import {transporter} from "@/versions/v1/services/mailer";
import forgotPasswordMail from "@/versions/v1/template/mail/forgotPassword"

export default {
    method: "POST",
    path: "/auth/check-password-code",
    handler: async (req, res) => {
        try {

            const {code} = req.body

            if (!code) return res.status(400).json({success: false, message: "Des champs sont manquants !"})

            const passwordCode = await prisma.forgotPassword.findUnique({where: {UUID: code}})

            if (!passwordCode) return res.status(404).json({success: false, message: "Ce code n'existe pas !"})

            if (passwordCode.expireAt < new Date()) {
                await prisma.forgotPassword.delete({where: {UUID: code}})
                return res.status(410).json({success: false, message: 'Le lien de rénitialisation de mot de passe a expiré !'})
            }

            return res.status(200).json({
                success: true
            })

        } catch (e) {
            console.log(e)
            res.status(500).json({success: false, message: "Une erreur est survenue !"})
        }
    }
} as RouteConfig;