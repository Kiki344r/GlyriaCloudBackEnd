import express, {NextFunction, Request, Response, Router} from 'express';
import {server} from "@/app"

import { WebSocket, WebSocketServer } from 'ws';
import axios from 'axios';
import https from 'https';
import { IncomingMessage } from 'http';

const router: Router = express.Router();
const AuthRoute: Router = express.Router();
const GroupRoute: Router = express.Router();
const GroupsRoute: Router = express.Router();


const API_TOKEN = "PVEAPIToken=root@pam!glyria-cloud=d55d1528-0e9b-481a-8c55-17d8a8cf3de6"

interface ProxmoxTermproxyResponse {
    user: string;
    ticket: string;
    port: number;
    upid: string;
}

router.get('/', function(req: Request, res: Response, next: NextFunction) {
    return res.status(200).json({
        message: 'Welcome to Glyria Cloud API V1!',
        status: 'success'
    })
});

router.use("/auth", AuthRoute)
router.use("/group", GroupRoute)
router.use("/groups", GroupsRoute)

const PROXMOX_URL = 'https://192.168.1.96:8006/api2/json'

const proxmoxApi = axios.create({
    baseURL: PROXMOX_URL,
    headers: { 'Authorization': API_TOKEN },
    httpsAgent: new https.Agent({ rejectUnauthorized: false })
});

router.get('/get-vnc-ticket/:vmid', async (req: Request, res: Response) => {
    const { vmid } = req.params;
    const node = 'pve'; // Remplace par le nom de ton nœud Proxmox si besoin

    try {
        const response = await proxmoxApi.post<{ data: ProxmoxTermproxyResponse }>(
            `/nodes/${node}/qemu/${vmid}/vncproxy`, // La route pour le VNC de VM
            {
                // Pas besoin d'upgrade-proto ici, car vncproxy est implicitement pour VNC
                // 'websocket': 1 est parfois ajouté pour forcer le websocket, mais la librairie gère souvent
            }
        );

        const response2 = await proxmoxApi.get<{ data: { upid: string } }>(
            `/nodes/${node}/qemu/${vmid}/vncwebsocket`,
            {
                params: {
                    node: node,
                    port: response.data.data.port,
                    vmid: vmid,
                    vncticket: response.data.data.ticket
                }
            }
        );
        console.log(response2.data)

        res.json({
            ...response.data.data,
            proxmoxHost: new URL(PROXMOX_URL).hostname // On envoie aussi l'IP de Proxmox
        });
    } catch (error: any) {
        console.error("Erreur API Proxmox:", error.response?.data || error.message);
        res.status(500).json({ error: "Impossible de générer le ticket VNC" });
    }
});

export default router;