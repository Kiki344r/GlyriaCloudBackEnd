import {WebSocket, WebSocketServer} from "ws";
import { Client } from 'ssh2';

console.log("Loading API")

import express from "express";
import apiRouter from "./index";
import cors from "cors";
import net from 'net'

const cookieParser = require('cookie-parser')

const app = express();

const allowedOrigins = [
    "http://localhost:3000",       // dev
    "http://localhost:3001",
    "http://localhost:3100",
    "https://cloud.glyria.app"      // prod
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log(`CORS blocked origin: ${origin}`);
            callback(null, false);
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(cookieParser())

app.use("/", apiRouter);

const PORT = process.env.PORT || 3100;
export const server = app.listen(PORT, () => {
    console.log(`✅ API server running on port ${PORT}`);
});

const API_TOKEN = "PVEAPIToken=root@pam!glyria-cloud=d55d1528-0e9b-481a-8c55-17d8a8cf3de6"

const SSH_CONFIG = {
    host: '192.168.1.125',
    port: 22,
    username: 'root', // À remplacer
    privateKey: require('fs').readFileSync('./src/id_ed25519')
};

interface ResizeMessage {
    type: 'resize';
    cols: number;
    rows: number;
}

const web_socket_server = new WebSocketServer({ noServer: true });
//@ts-ignore
const web_socket_handler = (ws: WebSocket) => {
    console.log('Nouvelle connexion WebSocket établie');

    const ssh = new Client();
    let stream: any = null;

    ssh.on('ready', () => {
        console.log('Connexion SSH établie avec 192.168.1.125');

        ssh.shell({
            term: 'xterm-color',
            cols: 80,
            rows: 24
        }, (err, sshStream) => {
            if (err) {
                console.error('Erreur lors de la création du shell SSH:', err);
                ws.close();
                return;
            }

            stream = sshStream;

            // Envoyer les données SSH au client WebSocket
            sshStream.on('data', (data: Buffer) => {
                try {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(data.toString('utf-8'));
                    }
                } catch (ex) {
                    console.error('Erreur lors de l\'envoi des données:', ex);
                }
            });

            sshStream.on('close', () => {
                console.log('Stream SSH fermé');
                ws.close();
            });

            sshStream.stderr.on('data', (data: Buffer) => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(data.toString('utf-8'));
                }
            });
        });
    });

    ssh.on('error', (err: Error) => {
        console.error('Erreur SSH:', err);
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(`\r\nErreur de connexion SSH: ${err.message}\r\n`);
            ws.close();
        }
    });

    ssh.on('close', () => {
        console.log('Connexion SSH fermée');
        ws.close();
    });

    // Recevoir les données du client WebSocket et les envoyer via SSH
    // @ts-ignore
    ws.on('message', (msg: WebSocket.Data) => {
        try {
            const message = msg.toString();

            // Essayer de parser en JSON pour détecter les messages de redimensionnement
            try {
                const data: ResizeMessage = JSON.parse(message);
                if (data.type === 'resize' && stream) {
                    stream.setWindow(data.rows, data.cols, 0, 0);
                    return;
                }
            } catch {
                // Si ce n'est pas du JSON, c'est une commande normale
            }

            if (stream) {
                stream.write(message);
            }
        } catch (ex) {
            console.error('Erreur lors du traitement du message:', ex);
        }
    });

    // Nettoyer quand la connexion WebSocket se ferme
    ws.on('close', () => {
        console.log('Connexion WebSocket fermée');
        if (stream) {
            stream.end();
        }
        ssh.end();
    });

    ws.on('error', (error: Error) => {
        console.error('Erreur WebSocket:', error);
        if (stream) {
            stream.end();
        }
        ssh.end();
    });

    // Établir la connexion SSH
    ssh.connect(SSH_CONFIG);
}

web_socket_server.on('connection', web_socket_handler)

server.on('upgrade', (request, socket, head) => {
    // Tu peux filtrer l'URL ici si tu veux (ex: seulement si request.url commence par /terminal)
    web_socket_server.handleUpgrade(request, socket, head, (ws) => {
        web_socket_server.emit('connection', ws, request);
    });
});