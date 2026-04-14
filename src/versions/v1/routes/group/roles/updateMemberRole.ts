import {RouteConfig} from "@/versions/routesManager";
import {verifyToken, verifyPermission} from "@/versions/v1/middleware";
import {prisma} from "@/config";

export default {
    method: "POST",
    path: "/group/member-role",
    middlewares: [verifyToken, verifyPermission("MANAGE_ROLES")],
    handler: async (req, res) => {
        try {
            const {email, UUID} = req.userData!
            const {groupId, userId, roleId} = req.body

            if (!email) return res.status(404).json({success: false, message: "Cet utilisateur n'existe pas !"})
            if (!groupId || !userId || !roleId) return res.status(400).json({
                success: false,
                message: "Des champs sont manquants !"
            })

            if (userId === UUID) return res.status(400).json({
                success: false,
                message: "Vous ne pouvez pas modifier votre propre rôle !"
            })

            const group = await prisma.groups.findUnique({
                where: {
                    UUID: groupId
                },
                select: {
                    UUID: true
                }
            })

            if (!group) return res.status(404).json({success: false, message: "Ce groupe n'existe pas !"})

            const member = await prisma.userGroupPermissions.update({
                where: {
                    userId_groupId: {
                        userId,
                        groupId
                    }
                },
                data: {
                    roleId: roleId
                }
            })

            if (!member) return res.status(500).json({
                success: false,
                message: "Une erreur est survenue lors de la mise à jour du rôle par défaut !"
            })

            return res.status(200).json({success: true, data: member.roleId})

        } catch (e) {
            console.log(e)
            res.status(500).json({success: false})
        }
    }
} as RouteConfig;