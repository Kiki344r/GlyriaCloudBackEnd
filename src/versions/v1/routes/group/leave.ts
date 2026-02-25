import { RouteConfig} from "@/versions/routesManager";
import {verifyToken} from "@/versions/v1/middleware/verifyToken";
import {prisma} from "@/config";

export default {
    method: "DELETE",
    path: "/group/leave",
    middlewares: [verifyToken],
    handler: async (req, res) => {
        try {

            const {groupId} = req.body

            const groupCheck = await prisma.groups.findUnique({
                where: {
                    UUID: groupId
                },
                select: {
                    UUID: true
                }
            })


            if (!groupCheck) return res.status(404).json({success: false, message: "Ce groupe n'existe pas !"})

            const {email} = req.userData!

            const userGroup = await prisma.users.findUnique({
                where: {
                    email: email
                },
                select: {
                    groups: {
                        where: {
                            UUID: groupCheck.UUID
                        }
                    }
                }
            })

            if (userGroup && userGroup.groups.length < 1) return res.status(409).json({
                success: false,
                message: "Vous ne faites pas partie de ce groupe !"
            })

            await prisma.users.update({
                where: {
                    email: email
                },
                data: {
                    groups: {
                        disconnect: {
                            UUID: groupCheck.UUID
                        }
                    }
                }
            })

            return res.status(200).json({
                success: true, data: groupCheck.UUID
            })

        } catch (e) {
            console.log(e)
            res.status(500).json({success: false})
        }
    }
} as RouteConfig;