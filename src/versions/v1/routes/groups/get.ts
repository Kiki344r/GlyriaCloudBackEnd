import {RouteConfig} from "@/versions/routesManager";
import {verifyToken} from "@/versions/v1/middleware/verifyToken";
import {prisma} from "@/config";

export default {
    method: "GET",
    path: "/groups/get",
    middlewares: [verifyToken],
    handler: async (req, res) => {
        try {

            const {email} = req.userData!
            const groupId = req.query?.groupId as string | undefined

            if (!email) return res.status(404).json({success: false, message: "Cet utilisateur n'existe pas !"})
            console.log(email, groupId)
            const user = await prisma.users.findUnique({
                where: {
                    email: email
                },
                select: {
                    groups: {
                        where: groupId ? { groupId } : undefined,
                        select: {
                            permissions: groupId ? true : undefined,
                            group: {
                                include: {
                                    owner: {
                                        select: {
                                            UUID: true,
                                            firstName: true,
                                            lastName: true
                                        }
                                    },
                                    members: groupId ? {
                                        select: {
                                            user: {
                                                select: {
                                                    UUID: true,
                                                    firstName: true,
                                                    lastName: true
                                                }
                                            },
                                            role: true
                                        }
                                    } : undefined
                                }
                            }
                        }
                    }
                }
            })

            if (!user) return res.status(404).json({ success: false, message: "Cet utilisateur n'existe pas !" })

            if (groupId) {
                if (!user.groups[0]) return res.status(404).json({ success: false, message: "Groupe introuvable ou accès refusé !" })
                return res.status(200).json({ success: true, data: user.groups[0] })
            }

            return res.status(200).json({ success: true, data: user.groups.map(g => g.group) })

        } catch (e) {
            console.log(e)
            res.status(500).json({success: false})
        }
    }
} as RouteConfig;