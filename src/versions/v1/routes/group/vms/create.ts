import { RouteConfig} from "@/versions/routesManager";
import {verifyToken} from "@/versions/v1/middleware/verifyToken";
import {prisma} from "@/config";
import {verifyPermission} from "@/versions/v1/middleware";
import {useProxmox} from "@/versions/v1/services/"

export default {
    method: "POST",
    path: "/group/:groupId/vms",
    middlewares: [verifyToken, verifyPermission("VMS")],
    handler: async (req, res) => {
        try {

            const {groupId} = req.params
            const {UUID, firstName, lastName} = req.userData!

            const {name, vmType} = req.body

            if (!groupId || !name || !vmType) return res.status(400).json({
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

            switch (vmType) {
                case "LYCEE": {
                    const nodes = await prisma.pVENodes.findMany({
                        include: {
                            _count: { select: { vms: true } }
                        }
                    })

                    const availableNode = nodes.find(node => node._count.vms < node.maxVMs)
                    if (!availableNode) {
                        return res.status(400).json({
                            success: false,
                            message: "Aucun noeud ProxMox n'est disponible pour créer une nouvelle VM ! Veuillez contacter un administrateur."
                        })
                    }
                    const {createVM} = useProxmox()

                    const generatedPassword = Math.random().toString(36).slice(-8)

                    const VM = await createVM(availableNode.name, availableNode.templateId, {
                        name: `${firstName}-${lastName}`,
                        username: "root",
                        password: generatedPassword
                    })

                    await prisma.groupVm.create({
                        data: {
                            name: name,
                            type: 'LYCEE',

                            nodeId: availableNode.UUID,
                            vmid: VM.vmid,
                            os: "Debian 12 Server",

                            groupId: groupId,
                            userId: UUID,
                        }
                    })

                    break
                }
            }

            return res.status(200).json({
                success: true, data: "Vm créer"
            })

        } catch (e) {
            console.log(e)
            res.status(500).json({success: false})
        }
    }
} as RouteConfig;