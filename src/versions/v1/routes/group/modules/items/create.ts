import { RouteConfig} from "@/versions/routesManager";
import {verifyToken} from "@/versions/v1/middleware/verifyToken";
import {prisma} from "@/config";
import {verifyPermission} from "@/versions/v1/middleware";

export default {
    method: "POST",
    path: "/group/:groupId/modules/:moduleId/items",
    middlewares: [verifyToken, verifyPermission("MANAGE_MODULES")],
    handler: async (req, res) => {
        try {

            const {groupId, moduleId} = req.params

            const {title, itemType, order, content} = req.body

            console.log(req.body, req.params)

            if (!groupId || !moduleId || !title || !itemType || typeof order !== 'number' || typeof content !== 'string') return res.status(400).json({
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

            const module = await prisma.groupModuleItem.create({
                data: {
                    moduleId: moduleId,
                    title,
                    type: itemType,
                    order,
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