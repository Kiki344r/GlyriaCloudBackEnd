import { RouteConfig} from "@/versions/routesManager";
import {verifyToken} from "@/versions/v1/middleware/verifyToken";
import {prisma} from "@/config";
import {verifyPermission} from "@/versions/v1/middleware";

export default {
    method: "GET",
    path: "/group/:groupId/modules/:moduleId/items",
    middlewares: [verifyToken, verifyPermission("MODULES")],
    handler: async (req, res) => {
        try {

            const {groupId, moduleId} = req.params

            if (!groupId || !moduleId) return res.status(400).json({
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

            const modules = await prisma.groupModule.findUnique({
                where: {
                    UUID: moduleId,
                    groupId: groupId
                },
                select: {
                    items: {
                        orderBy: {
                            order: "asc"
                        }
                    }
                }
            })

            if (!modules) return res.status(404).json({success: false, message: "Ce groupe n'a pas de modules !"})

            return res.status(200).json({
                success: true, data: modules.items
            })

        } catch (e) {
            console.log(e)
            res.status(500).json({success: false})
        }
    }
} as RouteConfig;