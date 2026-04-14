import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from '@/types/express';
import { prisma } from "@/config";

export function verifyPermission(permission: string) {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const groupId = req.query?.groupId || req.body?.groupId || req.params?.groupId
            if (!groupId) return res.status(400).json({ success: false, message: "Des champs sont manquants !" })

            const userPermissions = await prisma.userGroupPermissions.findUnique({
                where: {
                    userId_groupId: {
                        userId: req.userData!.UUID,
                        groupId
                    }
                },
                select: {
                    role: {
                        select: {
                            permissions: true
                        }
                    }
                }
            })

            if (!userPermissions) return res.status(403).json({ success: false, message: "Vous n'avez pas accès à cette ressource !" })

            if (!userPermissions.role.permissions.find((p) => p.permission === permission)) return res.status(403).json({ success: false, message: "Vous n'avez pas accès à cette ressource !" })

            next()

        } catch (e: any) {
            return res.status(500).json({success: false})
        }
    }
}