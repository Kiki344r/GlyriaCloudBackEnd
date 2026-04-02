import express, {NextFunction, Request, Response, Router} from 'express';

import { WebSocket, WebSocketServer } from 'ws';
import axios from 'axios';
import https from 'https';
import { IncomingMessage } from 'http';

const router: Router = express.Router();
const AuthRoute: Router = express.Router();
const GroupRoute: Router = express.Router();
const GroupsRoute: Router = express.Router();

router.get('/', function(req: Request, res: Response, next: NextFunction) {
    return res.status(200).json({
        message: 'Welcome to Glyria Cloud API V1!',
        status: 'success'
    })
});

router.use("/auth", AuthRoute)
router.use("/group", GroupRoute)
router.use("/groups", GroupsRoute)

export default router;