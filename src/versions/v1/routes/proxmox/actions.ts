import { RouteConfig} from "@/versions/routesManager";
import {verifyToken} from "@/versions/v1/middleware/verifyToken";
//import {prisma} from "@/config";

import {useProxmox} from "@/versions/v1/services";
const {startVM, stopVM, rebootVM, getVM, shutdownVM} = useProxmox()

export default {
    method: "POST",
    path: "/proxmox/:node/:vmid/action",
    middlewares: [verifyToken],
    handler: async (req, res) => {
        try {

            const {action} = req.body
            if (!action) return res.status(400).json({success: false, message: "Des champs sont manquants !"})

            const {node, vmid} = req.params
            if (!node || !vmid) return res.status(400).json({success: false, message: "Des champs sont manquants !"})

            switch (action) {
                case "start": {
                    await startVM(node, parseInt(vmid) || 0)
                    break;
                }
                case "stop": {
                    await stopVM(node, parseInt(vmid) || 0)
                    break;
                }
                case "reboot": {
                    await rebootVM(node, parseInt(vmid) || 0)
                    break;
                }
                case "shutdown": {
                    await shutdownVM(node, parseInt(vmid) || 0)
                    break;
                }
                case "status": {
                    const vm = await getVM(node, parseInt(vmid) || 0)
                    return res.status(200).json({
                        success: true,
                        data: vm
                    })
                }
                default: {
                    return res.status(400).json({success: false, message: "Action invalide !"})
                }
            }

            return res.status(200).json({
                success: true
            })

        } catch (e) {
            console.log(e)
            res.status(500).json({success: false})
        }
    }
} as RouteConfig;