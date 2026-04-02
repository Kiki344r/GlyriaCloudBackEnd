import 'dotenv/config'
console.log("Loading API")
import WebSocketHandler from "@/versions/v1/websocket";
import {WebSocketServer} from "ws";
import express from "express";
import apiRouter from "./index";
import cors from "cors";
import {IncomingMessage} from "http";
import {Socket} from "net";
const cookieParser = require('cookie-parser')

const app = express();
const httpServer = require('http').createServer(app);

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
export const server = httpServer.listen(PORT, () => {
    console.log(`✅ API server running on port ${PORT}`);
});


export const web_socket_server = new WebSocketServer({noServer: true});
web_socket_server.on('connection', WebSocketHandler)
// @ts-ignore
server.on('upgrade', (request: IncomingMessage, socket: Socket, head: Buffer) => {
    // Tu peux filtrer l'URL ici si tu veux (ex: seulement si request.url commence par /terminal)
    web_socket_server.handleUpgrade(request, socket, head, (ws) => {
        web_socket_server.emit('connection', ws, request);
    });

});