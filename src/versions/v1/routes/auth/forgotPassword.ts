import express, {Request, Response, NextFunction, Router} from 'express';
import {verifyToken} from "@/versions/v1/middleware/verifyToken";

const router: Router = express.Router();

const jwt = require("jsonwebtoken")


/* GET home page. */
router.get('/', verifyToken, async function (req: Request, res: Response, next: NextFunction) {

    try {

        const Token = req.cookies.token

        const JWT = await jwt.verify(Token, process.env.JWT_SECRET)

        return res.status(200).json({
            success: true
        })

    } catch (e) {
        console.log(e)
        return res.status(500).json({success: false, message: "Une erreur est survenue !"})
    }
});

export default router;