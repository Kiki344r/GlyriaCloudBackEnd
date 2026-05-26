import { RouteConfig} from "@/versions/routesManager";
import {verifyToken} from "@/versions/v1/middleware/verifyToken";
import {prisma} from "@/config";
import {verifyPermission} from "@/versions/v1/middleware";

export default {
    method: "GET",
    path: "/group/:groupId/vms",
    middlewares: [verifyToken, verifyPermission("VMS")],
    handler: async (req, res) => {
        try {

            const {groupId} = req.params
            const {UUID} = req.userData!

            if (!groupId) return res.status(400).json({
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

            const vms = await prisma.groupVm.findMany({
                where: {
                    groupId: groupId,
                    userId: UUID
                }
            })

            if (!vms) return res.status(404).json({success: false, message: "Vous n'avez pas de VM !"})

            return res.status(200).json({
                success: true, data: vms
            })

        } catch (e) {
            console.log(e)
            res.status(500).json({success: false})
        }
    }
} as RouteConfig;