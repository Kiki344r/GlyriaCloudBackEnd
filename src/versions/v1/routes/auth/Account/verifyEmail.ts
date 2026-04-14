import { RouteConfig} from "@/versions/routesManager";
import {prisma} from "@/config";
import {useMailer} from "@/versions/v1/services";
import accountVerifiedMail from "@/versions/v1/template/mail/accountVerified"

const jwt = require("jsonwebtoken")

export default {
    method: "POST",
    path: "/auth/verify-email",
    handler: async (req, res) => {
        try {

            const {token} = req.body
            if (!token) return res.status(400).json({success: false, message: "Des champs sont manquants !"})

            const validateEmail = await prisma.emailValidation.findUnique({
                where: {UUID: token},
                include: {
                    user: {
                        include: {
                            groups: true
                        }
                    }
                }
            })
            if (!validateEmail) return res.status(404).json({success: false, message: "Ce lien n'est plus valide !"})

            await prisma.emailValidation.delete({where: {UUID: token}})

            if (validateEmail.expireAt < new Date()) return res.status(410).json({success: false, message: 'Le lien de vérification de l\'email a expiré !'})

            try {
                const userFullName = `${validateEmail.user.firstName} ${validateEmail.user.lastName}`
                await useMailer.sendMail({
                    to: `${userFullName} <${validateEmail.user.email}>`,
                    from: `${process.env.SMTP_FROM} <${process.env.SMTP_FROM_EMAIL}>`,
                    subject: "Votre adresse mail a été vérifiée",
                    html: accountVerifiedMail(userFullName, `${process.env.FRONTEND_URL}/dashboard`)
                })
            } catch (e) {}

            const UserInformation = validateEmail.user

            const userData = {
                firstName: UserInformation.firstName,
                lastName: UserInformation.lastName,
                email: UserInformation.email,
                groups: UserInformation.groups,
                UUID: UserInformation.UUID
            }

            const JWT_Token = await jwt.sign(userData, process.env?.JWT_SECRET, {expiresIn: '3d'})

            res.cookie("token", JWT_Token, {httpOnly: true})

            return res.status(200).json({
                success: true,
                data: userData
            })

        } catch (e) {
            console.log(e)
            res.status(500).json({success: false, message: "Une erreur est survenue !"})
        }
    }
} as RouteConfig;