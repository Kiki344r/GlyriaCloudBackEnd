import {RouteConfig} from "@/versions/routesManager";
import {verifyToken, verifyPermission} from "@/versions/v1/middleware";
import {prisma} from "@/config";

export default {
    method: "POST",
    path: "/group/role",
    middlewares: [verifyToken, verifyPermission("MANAGE_ROLES")],
    handler: async (req, res) => {
        try {

            const {email} = req.userData!
            const {groupId, name, permissions} = req.body

            if (!email) return res.status(404).json({success: false, message: "Cet utilisateur n'existe pas !"})
            if (!groupId || !name || !permissions) return res.status(400).json({success: false, message: "Des champs sont manquants !"})

            const group = await prisma.groups.findUnique({
                where: {
                    UUID: groupId
                },
                select: {
                    UUID: true
                }
            })

            if (!group) return res.status(404).json({ success: false, message: "Ce groupe n'existe pas !" })

            const role = await prisma.groupRoles.create({
                data: {
                    groupId,
                    name,
                    permissions: {
                        create: permissions.map((p: string) => ({
                            permission: p
                        }))
                    }
                }
            })

            if (!role) return res.status(500).json({ success: false, message: "Une erreur est survenue lors de la création du rôle !" })

            return res.status(200).json({ success: true, data: role.UUID })

        } catch (e) {
            console.log(e)
            res.status(500).json({success: false})
        }
    }
} as RouteConfig;