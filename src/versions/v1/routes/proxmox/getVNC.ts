import { RouteConfig} from "@/versions/routesManager";
import {verifyToken} from "@/versions/v1/middleware/verifyToken";
//import {prisma} from "@/config";

import {useProxmox} from "@/versions/v1/services";
const {getVNCWebsocketURL} = useProxmox()

export default {
    method: "GET",
    path: "/proxmox/:node/:vmid/vnc",
    middlewares: [verifyToken],
    handler: async (req, res) => {
        try {

            const {node, vmid} = req.params;
            if (!node || !vmid) return res.status(400).json({success: false, message: "Des champs sont manquants !"})

            const {url, ticket } = await getVNCWebsocketURL(node, parseInt(vmid))

            res.cookie('PVEAuthCookie', ticket, {
                sameSite: 'none',
                secure: true,
                path: '/'
            })

            return res.status(200).json({
                success: true,
                data: {
                    url: url,
                    ticket: ticket
                }
            })

        } catch (e) {
            console.log(e)
            res.status(500).json({success: false})
        }
    }
} as RouteConfig;