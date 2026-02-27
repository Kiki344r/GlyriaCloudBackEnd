import { RouteConfig} from "@/versions/routesManager";
import {verifyToken} from "@/versions/v1/middleware/verifyToken";
import {prisma} from "@/config";

export default {
    method: "GET",
    path: "/groups/get",
    middlewares: [verifyToken],
    handler: async (req, res) => {
        try {

            const {email} = req.userData!

            if (!email) return res.status(404).json({success: false, message: "Cet utilisateur n'existe pas !"})

            const user = await prisma.users.findUnique({
                where: {
                    email: email
                },
                select: {
                    groups: {
                        include: {
                            owner: {
                                select: {
                                    firstName: true,
                                    lastName: true
                                }
                            }
                        }
                    }
                }
            })

            if (!user) return res.status(404).json({success: false, message: "Cet utilisateur n'existe pas !"})

            return res.status(200).json({success: true, data: user.groups})

        } catch (e) {
            console.log(e)
            res.status(500).json({success: false})
        }
    }
} as RouteConfig;