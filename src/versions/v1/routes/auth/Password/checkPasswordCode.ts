import { RouteConfig} from "@/versions/routesManager";
import {prisma} from "@/config";

export default {
    method: "POST",
    path: "/auth/check-password-code",
    handler: async (req, res) => {
        try {

            const {code} = req.body

            if (!code) return res.status(400).json({success: false, message: "Des champs sont manquants !"})

            const passwordCode = await prisma.forgotPassword.findUnique({where: {UUID: code, expireAt: {gte: new Date()}}})

            if (!passwordCode) return res.status(404).json({success: false, message: "Ce code n'existe pas !"})

            return res.status(200).json({
                success: true
            })

        } catch (e) {
            console.log(e)
            res.status(500).json({success: false, message: "Une erreur est survenue !"})
        }
    }
} as RouteConfig;