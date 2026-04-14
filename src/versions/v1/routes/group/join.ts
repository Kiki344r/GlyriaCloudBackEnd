import { RouteConfig} from "@/versions/routesManager";
import {verifyToken} from "@/versions/v1/middleware/verifyToken";
import {prisma} from "@/config";

import {useGroups} from "@/versions/v1/services";
const {checkGroupCode} = useGroups()

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
                    code
                },
                select: {
                    group: true,
                    groupId: true,
                    code: true
                }
            })

            if (!codeCheck || !codeCheck) return res.status(404).json({success: false, message: "Ce code n'existe pas !"})

            const {email, UUID: userId} = req.userData!

            const userGroup = await prisma.users.findUnique({
                where: {
                    email: email
                },
                select: {
                    groups: {
                        where: {
                            groupId: codeCheck.groupId
                        }
                    }
                }
            })

            if (userGroup && userGroup.groups.length > 0) return res.status(409).json({
                success: false,
                message: "Vous faites déjà partie de ce groupe !"
            })

            if (!codeCheck.group.defaultRoleId) {
                return res.status(409).json({
                    success: false,
                    message: "Le groupe ne possède pas de rôle par défaut, veuillez contacter l'administrateur du groupe !"
                })
            }

            await prisma.userGroupPermissions.create({
                data: {
                    userId: userId,
                    groupId: codeCheck.groupId,
                    roleId: codeCheck.group.defaultRoleId
                }
            })

            await prisma.groupCode.delete({
                where: {
                    code: codeCheck.code
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