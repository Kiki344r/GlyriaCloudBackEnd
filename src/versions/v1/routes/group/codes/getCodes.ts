import {RouteConfig} from "@/versions/routesManager";
import {verifyToken, verifyPermission} from "@/versions/v1/middleware";
import {prisma} from "@/config";

export default {
    method: "GET",
    path: "/group/codes",
    middlewares: [verifyToken, verifyPermission("MANAGE_CODES")],
    handler: async (req, res) => {
        try {

            const {email} = req.userData!
            const groupId = req.query.groupId as string | undefined

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

            const codes = await prisma.groupCode.findMany({
                where: {
                    groupId
                },
                select: {
                    UUID: true,
                    code: true,
                    createdAt: true
                }
            })

            if (!codes) return res.status(500).json({
                success: false,
                message: "Aucun code !"
            })

            return res.status(200).json({success: true, data: codes})

        } catch (e) {
            console.log(e)
            res.status(500).json({success: false})
        }
    }
} as RouteConfig;