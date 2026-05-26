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

    // Reboot une VM
    const rebootVM = async (node: string, vmid: number) => {
        return await api(`/nodes/${node}/qemu/${vmid}/status/reboot`, {
            method: 'POST',
        });
    }

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

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

    const waitForTask = async (node: string, upid: string, maxRetries = 120) => {
        for (let i = 0; i < maxRetries; i++) {
            const task = await api(`/nodes/${node}/tasks/${encodeURIComponent(upid)}/status`)

            if (task.status === 'stopped') {
                if (task.exitstatus === 'OK') return
                throw new Error(`Task Proxmox échouée: ${task.exitstatus}`)
            }

            await sleep(2000)
        }

        throw new Error(`Timeout task Proxmox: ${upid}`)
    }

    const waitForIP = async (
        node: string,
        vmid: number,
        maxRetries = 40
    ): Promise<string> => {
        for (let i = 0; i < maxRetries; i++) {
            try {
                const agent = await api(`/nodes/${node}/qemu/${vmid}/agent/network-get-interfaces`)
                const interfaces = agent?.result ?? []

                for (const iface of interfaces) {
                    if (iface.name === 'lo') continue

                    const ipv4 = iface['ip-addresses']?.find(
                        (ip: any) => ip['ip-address-type'] === 'ipv4'
                    )

                    if (ipv4?.['ip-address']) {
                        return ipv4['ip-address']
                    }
                }
            } catch {
                // QEMU guest agent pas encore prêt
            }

            await sleep(3000)
        }

        throw new Error(`Impossible de récupérer l'IP de la VM ${vmid}`)
    }

    const createVM = async (
        node: string,
        templateId: number,
        options: {
            name: string
            username: string
            password: string
        }
    ) => {
        // 1. Trouver un VMID disponible
        const nextId = await api(`/cluster/nextid`)
        const vmid = parseInt(nextId)

        // 2. Cloner le template
        const cloneUpid = await api(`/nodes/${node}/qemu/${templateId}/clone`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                newid: vmid,
                name: options.name,
                full: 1,
            }),
        })

        // 3. Attendre la vraie fin du clone
        await waitForTask(node, cloneUpid)
        console.log(options.password)
        // 4. Configurer Cloud-Init
        await api(`/nodes/${node}/qemu/${vmid}/config`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ciuser: options.username,
                cipassword: options.password,
                ipconfig0: 'ip=dhcp',
            }),
        })

        // 6. Démarrer la VM
        const startUpid = await api(`/nodes/${node}/qemu/${vmid}/status/start`, {
            method: 'POST',
        })

        await waitForTask(node, startUpid)

        // 7. Attendre l'IP via QEMU Guest Agent
        const ip = await waitForIP(node, vmid)

        return {
            vmid,
            name: options.name,
            ip,
        }
    }

    return {
        getNodes,
        getVMs,
        getVM,
        startVM,
        stopVM,
        rebootVM,
        shutdownVM,
        getVNCProxy,
        getVNCWebsocketURL,
        getNodeStatus,

        createVM
    };
}