import { RouteConfig} from "@/versions/routesManager";
import {verifyToken} from "@/versions/v1/middleware/verifyToken";
import {prisma} from "@/config";
import {verifyPermission} from "@/versions/v1/middleware";

export default {
    method: "DELETE",
    path: "/group/kick",
    middlewares: [verifyToken, verifyPermission("MANAGE_MEMBERS")],
    handler: async (req, res) => {
        try {

            const {groupId, userId} = req.body

            if (!groupId || !userId) return res.status(400).json({success: false, message: "Des champs sont manquants !"})

            const reqUserId = req.userData!.UUID

            if (reqUserId === userId) {
                return res.status(400).json({
                    success: false,
                    message: "Vous ne pouvez pas vous expulser de votre propre groupe !"
                })
            }

            const groupCheck = await prisma.groups.findUnique({
                where: {
                    UUID: groupId
                },
                select: {
                    UUID: true
                }
            })

            if (!groupCheck) return res.status(404).json({success: false, message: "Ce groupe n'existe pas !"})

            const userGroup = await prisma.users.findUnique({
                where: {
                    UUID: userId
                },
                select: {
                    groups: {
                        where: {
                            groupId: groupId
                        }
                    }
                }
            })

            if (userGroup && userGroup.groups.length < 1) return res.status(409).json({
                success: false,
                message: "L'utilisateur ne fais pas partie de ce groupe !"
            })

            await prisma.userGroupPermissions.delete({
                where: {
                    userId_groupId: {
                        userId: userId,
                        groupId: groupId
                    }
                }
            })

            return res.status(200).json({
                success: true, data: userId
            })

        } catch (e) {
            console.log(e)
            res.status(500).json({success: false})
        }
    }
} as RouteConfig;