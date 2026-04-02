import {web_socket_server} from "@/app"
import {IncomingMessage} from "http"
import WebSocket from "ws"
import {URL} from "url"

export default async function WebSocketHandler(clientWs: WebSocket, request: IncomingMessage) {

    try {
        const url = new URL(request.url || "", "http://localhost")
        const proxmoxUrl = url.searchParams.get("url")
        if (!proxmoxUrl) {
            clientWs.close(1008, "Missing ?url param")
            return
        }

        // 👉 connexion vers Proxmox
        const proxmoxWs = new WebSocket(proxmoxUrl, {
            perMessageDeflate: false,
            headers: {
                "Authorization": `PVEAPIToken=${process.env.PROXMOX_TOKEN}`,
                "Origin": "https://pve.glyria.app"
            }
        })

        proxmoxWs.on("message", (data, isBinary) => {
            if (clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(data, { binary: isBinary })
            }
        })

        clientWs.on("message", (data, isBinary) => {
            if (proxmoxWs.readyState === WebSocket.OPEN) {
                proxmoxWs.send(data, { binary: isBinary })
            }
        })

        // ❌ gestion fermeture
        proxmoxWs.on("close", () => {
            clientWs.close()
        })

        clientWs.on("close", () => {
            proxmoxWs.close()
        })

        // ❌ gestion erreurs
        proxmoxWs.on("error", (err) => {
            console.error("Proxmox WS error:", err)
            clientWs.close()
        })

        clientWs.on("error", (err) => {
            console.error("Client WS error:", err)
            proxmoxWs.close()
        })

    } catch (err) {
        console.error("WS init error:", err)
        clientWs.close(1011, "Internal error")
    }
}