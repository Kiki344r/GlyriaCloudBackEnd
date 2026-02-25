import express, {Request, Response, NextFunction, Router} from 'express';
import {verifyToken} from "@/versions/v1/middleware/verifyToken";
import {prisma} from "@/config";

const router: Router = express.Router();
const jwt = require("jsonwebtoken")

router.get('/', verifyToken, async function (req: Request, res: Response, next: NextFunction) {
    try {
        const { email } = await jwt.verify(req.cookies.token, process.env.JWT_SECRET)

        const user = await prisma.users.findUnique({
            where: {
                email: email
            },
            select: {
                groups: {
                    include: {
                        owner: {
                            select: {
                                firstName: true,
                                lastName: true
                            }
                        }
                    }
                }
            }
        })

        if (!user) return res.status(404).json({success: false, message: "Cet utilisateur n'existe pas !"})

        return res.status(200).json({success: true, data: user.groups})

    } catch (e) {
        console.log(e)
        return res.status(500).json({success: false})
    }
})

export default router;