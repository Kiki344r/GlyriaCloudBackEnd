import express, {Request, Response, NextFunction, Router} from 'express';
import {verifyToken} from "@/routes/v1/middleware/verifyToken";

const router: Router = express.Router();

const jwt = require("jsonwebtoken")


/* GET home page. */
router.get('/', verifyToken, async function (req: Request, res: Response, next: NextFunction) {

    try {

        const Token = req.cookies.token

        const JWT = await jwt.verify(Token, process.env.JWT_SECRET)

        return res.status(200).json({
            success: true,
            data: {
                firstName: JWT.firstName,
                lastName: JWT.lastName,
                email: JWT.email,
                groups: JWT.groups,
                UUID: JWT.UUID
            }
        })

    } catch (e) {
        console.log(e)
        return res.status(500).json({success: false, message: "Une erreur est survenue !"})
    }
});

router.get('/admin', verifyToken, async function (req: Request, res: Response, next: NextFunction) {

    try {

        const Token = req.cookies.token

        const JWT = await jwt.verify(Token, process.env.JWT_SECRET)

        const admins = process.env.ADMINS || ""

        if (admins.includes(`?${JWT.userId}?`)) return res.status(200).json({})
        else return res.status(403).json({success: false, message: "Unauthorized"})

    } catch (e) {
        console.log(e)
        return res.status(500).json({success: false})
    }
});

export default router;