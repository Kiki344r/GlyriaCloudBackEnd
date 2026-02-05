import express, {Request, Response, NextFunction, Router} from 'express';
import {verifyToken} from "@/routes/v1/middleware/verifyToken";
import {prisma} from "@/config";

const router: Router = express.Router();
const jwt = require("jsonwebtoken")

/* GET home page. */
router.delete('/', verifyToken, async function (req: Request, res: Response, next: NextFunction) {
    try {

        const {groupId} = req.body

        const groupCheck = await prisma.groups.findUnique({
            where: {
                UUID: groupId
            },
            select: {
                UUID: true
            }
        })


        if (!groupCheck) return res.status(404).json({success: false, message: "Ce groupe n'existe pas !"})

        const {email} = await jwt.verify(req.cookies.token, process.env.JWT_SECRET)

        const userGroup = await prisma.users.findUnique({
            where: {
                email: email
            },
            select: {
                groups: {
                    where: {
                        UUID: groupCheck.UUID
                    }
                }
            }
        })

        if (userGroup && userGroup.groups.length < 1) return res.status(409).json({
            success: false,
            message: "Vous ne faites pas partie de ce groupe !"
        })

        await prisma.users.update({
            where: {
                email: email
            },
            data: {
                groups: {
                    disconnect: {
                        UUID: groupCheck.UUID
                    }
                }
            }
        })

        return res.status(200).json({
            success: true, data: groupCheck.UUID
        })

    } catch (e) {
        console.log(e)
        return res.status(500).json({success: false})
    }
});

export default router;