import express, { Request, Response, NextFunction, Router } from 'express';
const router: Router = express.Router();

/* GET home page. */
router.get('/', function(req: Request, res: Response, next: NextFunction) {
    return res.status(200).json({
        message: 'Welcome to Glyria Cloud API!',
        status: 'success'
    })
});

export default router;