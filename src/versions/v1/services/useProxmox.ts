import type { Response } from 'express';

const PROXMOX_HOST = process.env.PROXMOX_HOST!;
const PROXMOX_TOKEN = process.env.PROXMOX_TOKEN!;

export function useProxmox() {

    const api = async (path: string, options: RequestInit = {}) => {
        console.log(PROXMOX_TOKEN)
        const res = await fetch(`${PROXMOX_HOST}/api2/json${path}`, {
            ...options,
            headers: {
                'Authorization': `PVEAPIToken=${PROXMOX_TOKEN}`,
                ...options.headers,
            },
        });

        if (!res.ok) throw new Error(`Proxmox API error: ${res.status} ${res.statusText}`);

        const json = await res.json();
        return json.data;
    };

    // Lister les nodes
    const getNodes = async () => {
        return await api('/nodes');
    };

    // Lister les VMs d'un node
    const getVMs = async (node: string) => {
        return await api(`/nodes/${node}/qemu`);
    };

    // Infos d'une VM
    const getVM = async (node: string, vmid: number) => {
        return await api(`/nodes/${node}/qemu/${vmid}/status/current`);
    };

    // Démarrer une VM
    const startVM = async (node: string, vmid: number) => {
        return await api(`/nodes/${node}/qemu/${vmid}/status/start`, {
            method: 'POST',
        });
    };

    // Arrêter une VM
    const stopVM = async (node: string, vmid: number) => {
        return await api(`/nodes/${node}/qemu/${vmid}/status/stop`, {
            method: 'POST',
        });
    };

    // Shutdown propre
    const shutdownVM = async (node: string, vmid: number) => {
        return await api(`/nodes/${node}/qemu/${vmid}/status/shutdown`, {
            method: 'POST',
        });
    };

    // Obtenir un ticket VNC pour la console
    const getVNCProxy = async (node: string, vmid: number) => {
        return await api(`/nodes/${node}/qemu/${vmid}/vncproxy`, {
            method: 'POST',
        });
    };

    const getVNCWebsocketURL = async (node: string, vmid: number) => {
        const proxy = await getVNCProxy(node, vmid);
        // proxy = { ticket, port, cert, upid }
        const params = new URLSearchParams({
            port: proxy.port,
            vncticket: proxy.ticket,
        });

        const wsHost = PROXMOX_HOST.replace('https://', 'wss://').replace('http://', 'ws://');
        const url = `${wsHost}/api2/json/nodes/${node}/qemu/${vmid}/vncwebsocket?${params}`;

        return { url, ticket: proxy.ticket };
    };

    // Stats d'un node (CPU, RAM...)
    const getNodeStatus = async (node: string) => {
        return await api(`/nodes/${node}/status`);
    };

    return {
        getNodes,
        getVMs,
        getVM,
        startVM,
        stopVM,
        shutdownVM,
        getVNCProxy,
        getVNCWebsocketURL,
        getNodeStatus,
    };
}