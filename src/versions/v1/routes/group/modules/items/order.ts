import { RouteConfig} from "@/versions/routesManager";
import {verifyToken} from "@/versions/v1/middleware/verifyToken";
import {prisma} from "@/config";
import {verifyPermission} from "@/versions/v1/middleware";

export default {
    method: "POST",
    path: "/group/:groupId/modules/:moduleId/items/order",
    middlewares: [verifyToken, verifyPermission("MANAGE_MODULES")],
    handler: async (req, res) => {
        try {

            const {groupId, moduleId} = req.params

            interface orderType {
                UUID: string
                order: number
            }
            const order = req.body?.order as orderType[]

            if (!groupId || !moduleId || !order) return res.status(400).json({
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

            if (!Array.isArray(order) || order.some(item => !item.UUID || typeof item.order !== "number")) {
                return res.status(400).json({
                    success: false,
                    message: "Le format de l'ordre n'est pas correct !"
                })
            }

            console.log(order)

            await prisma.$transaction(async (prisma) => {
                for (const item of order) {
                    await prisma.groupModuleItem.update({
                        where: {
                            UUID: item.UUID
                        },
                        data: {
                            order: item.order
                        }
                    })
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