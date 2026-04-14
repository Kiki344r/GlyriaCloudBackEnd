import {RouteConfig} from "@/versions/routesManager";
import {verifyToken, verifyPermission} from "@/versions/v1/middleware";
import {prisma} from "@/config";
import {generateCode} from "@/versions/v1/utils";

export default {
    method: "POST",
    path: "/group/code",
    middlewares: [verifyToken, verifyPermission("MANAGE_CODES")],
    handler: async (req, res) => {
        try {

            const {email} = req.userData!
            const {groupId} = req.body

            if (!email) return res.status(404).json({success: false, message: "Cet utilisateur n'existe pas !"})
            if (!groupId) return res.status(400).json({
                success: false,
                message: "Des champs sont manquants !"
            })

            const group = await prisma.groups.findUnique({
                where: {
                    UUID: groupId
                },
                select: {
                    UUID: true
                }
            })

            if (!group) return res.status(404).json({success: false, message: "Ce groupe n'existe pas !"})

            const generatedCode = generateCode()

            console.log(generatedCode)

            const code = await prisma.groupCode.create({
                data: {
                    groupId,
                    code: generatedCode
                }
            })

            if (!code) return res.status(500).json({
                success: false,
                message: "Une erreur est survenue lors de la création du code !"
            })

            return res.status(200).json({success: true, data: code})

        } catch (e) {
            console.log(e)
            res.status(500).json({success: false})
        }
    }
} as RouteConfig;