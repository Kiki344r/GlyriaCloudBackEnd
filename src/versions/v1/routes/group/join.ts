import { RouteConfig} from "@/versions/routesManager";
import {verifyToken} from "@/versions/v1/middleware/verifyToken";
import {prisma} from "@/config";

export default {
    method: "POST",
    path: "/group/join",
    middlewares: [verifyToken],
    handler: async (req, res) => {
        try {

            const {code} = req.body

            if (!code) return res.status(400).json({success: false, message: "Des champs sont manquants !"})

            const codeCheck = await prisma.groupCode.findUnique({
                where: {
                    code: code
                },
                select: {
                    group: true,
                    groupId: true,
                    code: true
                }
            })


            if (!codeCheck) return res.status(404).json({success: false, message: "Ce code n'existe pas !"})

            const {email} = req.userData!

            const userGroup = await prisma.users.findUnique({
                where: {
                    email: email
                },
                select: {
                    groups: {
                        where: {
                            UUID: codeCheck.groupId
                        }
                    }
                }
            })

            if (userGroup && userGroup.groups.length > 0) return res.status(409).json({
                success: false,
                message: "Vous faites déjà partie de ce groupe !"
            })

            await prisma.users.update({
                where: {
                    email: email
                },
                data: {
                    groups: {
                        connect: {
                            UUID: codeCheck.groupId
                        }
                    }
                }
            })

            return res.status(200).json({
                success: true, data: codeCheck.group
            })

        } catch (e) {
            console.log(e)
            res.status(500).json({success: false})
        }
    }
} as RouteConfig;