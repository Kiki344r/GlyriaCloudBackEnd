import express, {NextFunction, Request, Response} from 'express';
import path from 'path';
import { registerRoutes } from '@/versions/routesManager';
import statusRoutes from '@/versions/statusRoutes';

const router = express.Router();

router.use('/status', statusRoutes);

// Enregistrement automatique des routes v1
const v1Router = express.Router();
const v1RoutesPath = path.join(__dirname, 'versions', 'v1', 'routes');
registerRoutes(v1Router, v1RoutesPath);
router.use('/v1', v1Router);
v1Router.get('/', function(req: Request, res: Response, next: NextFunction) {
    return res.status(200).json({
        message: 'Welcome to Glyria Cloud API V1!',
        status: 'success'
    })
});

export default router;
