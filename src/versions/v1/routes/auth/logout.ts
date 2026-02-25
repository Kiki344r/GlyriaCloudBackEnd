import express, {Request, Response, NextFunction, Router} from 'express';

const router: Router = express.Router();

import {verifyToken} from "@/versions/v1/middleware/verifyToken";

/* GET home page. */
router.post('/', verifyToken, async function (req: Request, res: Response, next: NextFunction) {

    try {

        res.clearCookie("token")

        return res.status(200).json({success: true})

    } catch (e) {
        console.log(e)
        return res.status(500).json({success: false})
    }
});

export default router;