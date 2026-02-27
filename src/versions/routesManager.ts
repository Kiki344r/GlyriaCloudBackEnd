import { Router, Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { AuthenticatedRequest } from '@/types/express';

export interface RouteConfig {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    path: string;
    handler: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void | Promise<void>;
    middlewares?: Array<(req: Request, res: Response, next: NextFunction) => void>;
}

export function registerRoutes(router: Router, routesDir: string) {
    const loadRoutes = (dir: string) => {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                loadRoutes(fullPath);
            } else if (file.endsWith('.ts') || file.endsWith('.js')) {
                if (file === 'routesManager.ts' || file === 'routesManager.js') continue;

                try {
                    const routeModule = require(fullPath);
                    const routeConfig: RouteConfig = routeModule.default || routeModule;

                    if (routeConfig.method && routeConfig.path && routeConfig.handler) {
                        const method = routeConfig.method.toLowerCase() as 'get' | 'post' | 'put' | 'delete' | 'patch';
                        const handlers = routeConfig.middlewares
                            ? [...routeConfig.middlewares, routeConfig.handler]
                            : [routeConfig.handler];

                        router[method](routeConfig.path, ...handlers);
                        console.log(`✓ Route enregistrée: ${routeConfig.method} ${routeConfig.path}`);
                    }
                } catch (error) {
                    console.error(`Erreur lors du chargement de ${fullPath}:`, error);
                }
            }
        }
    };

    loadRoutes(routesDir);
}
