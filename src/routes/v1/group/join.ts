import express, {Request, Response, NextFunction, Router} from 'express';
import {verifyToken} from "@/routes/v1/middleware/verifyToken";
import {prisma} from "@/config";

const router: Router = express.Router();
const jwt = require("jsonwebtoken")

/* GET home page. */
router.post('/', verifyToken, async function (req: Request, res: Response, next: NextFunction) {
    try {

        const {code} = req.body

        const codeCheck = await prisma.groupCode.findUnique({
            where: {
                code: code
            },
            select: {
                group: true,
                groupId: true,
                code: true
            }
        })


        if (!codeCheck) return res.status(404).json({success: false, message: "Ce code n'existe pas !"})

        const {email} = await jwt.verify(req.cookies.token, process.env.JWT_SECRET)

        const userGroup = await prisma.users.findUnique({
            where: {
                email: email
            },
            select: {
                groups: {
                    where: {
                        UUID: codeCheck.groupId
                    }
                }
            }
        })

        if (userGroup && userGroup.groups.length > 0) return res.status(409).json({
            success: false,
            message: "Vous faites déjà partie de ce groupe !"
        })

        await prisma.users.update({
            where: {
                email: email
            },
            data: {
                groups: {
                    connect: {
                        UUID: codeCheck.groupId
                    }
                }
            }
        })

        return res.status(200).json({
            success: true, data: codeCheck.group
        })

    } catch (e) {
        console.log(e)
        return res.status(500).json({success: false})
    }
});

export default router;