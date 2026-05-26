import { RouteConfig} from "@/versions/routesManager";
import {verifyToken} from "@/versions/v1/middleware/verifyToken";
import {prisma} from "@/config";
import {verifyPermission} from "@/versions/v1/middleware";

export default {
    method: "POST",
    path: "/group/:groupId/modules/:moduleId/items/:itemId",
    middlewares: [verifyToken, verifyPermission("MANAGE_MODULES")],
    handler: async (req, res) => {
        try {

            const {groupId, moduleId, itemId} = req.params

            const {title, itemType, content} = req.body

            if (!groupId || !moduleId || !title || !itemType || typeof content !== 'string') return res.status(400).json({
                success: false,
                message: "Des champs sont manquants !"
            })

            const groupCheck = await prisma.groups.findUnique({
                where: {
                    UUID: groupId
                },
                select: {
                    UUID: true
                }
            })

            if (!groupCheck) return res.status(404).json({success: false, message: "Ce groupe n'existe pas !"})

            const module = await prisma.groupModuleItem.update({
                where: {
                    UUID: itemId,
                    moduleId: moduleId
                },
                data: {
                    title,
                    type: itemType,
                    content,
                }
            })

            if (!module) return res.status(500).json({
                success: false,
                message: "Une erreur est survenue"
            })

            return res.status(200).json({
                success: true, data: module
            })

        } catch (e) {
            console.log(e)
            res.status(500).json({success: false})
        }
    }
} as RouteConfig;