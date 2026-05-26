import { RouteConfig} from "@/versions/routesManager";
import {verifyToken} from "@/versions/v1/middleware/verifyToken";
import {prisma} from "@/config";
import {verifyPermission} from "@/versions/v1/middleware";

export default {
    method: "DELETE",
    path: "/group/:groupId/modules/:moduleId",
    middlewares: [verifyToken, verifyPermission("MANAGE_MODULES")],
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

            const module = await prisma.groupModule.delete({
                where: {
                    UUID: moduleId
                }
            })

            return res.status(200).json({
                success: true, data: moduleId
            })

        } catch (e) {
            console.log(e)
            res.status(500).json({success: false})
        }
    }
} as RouteConfig;