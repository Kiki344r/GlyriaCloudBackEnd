import type { Request } from 'express';
import { UserData } from './index';

declare global {
    namespace Express {
        interface Request {
            userData?: UserData;
        }
    }
}
export interface AuthenticatedRequest extends Request {
        userData?: UserData;
}
export {};
