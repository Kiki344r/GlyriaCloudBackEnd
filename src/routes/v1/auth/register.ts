import express, {Request, Response, NextFunction, Router} from 'express';
import bcrypt from 'bcrypt'
import {prisma} from "@/config";

const router: Router = express.Router();

/* GET home page. */
router.post('/', async function (req: Request, res: Response, next: NextFunction) {

    try {

        const { email, password, confirmPassword, firstName, lastName } = req.body

        if (!email || !password || !firstName || !lastName) return res.status(400).json({success: false, message: "Des champs sont manquants !"})
        if (password !== confirmPassword) return res.status(400).json({success: false, message: "Les mots de passe ne correspondent pas !"})
        if (password.length < 8) return res.status(422).json({success: false, message: "Le mot de passe est trop court !"})

        const user = await prisma.users.findUnique({where: {email: email}})

        if (user) return res.status(409).json({success: false, message: "Cette adresse mail est déjà utilisé !"})

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.users.create({
            data: {
                email: email,
                password: hashedPassword,
                firstName: firstName,
                lastName: lastName
            }
        })

        return res.status(201).json({success: true})

    } catch (e) {
        console.log(e)
        return res.status(500).json({success: false})
    }
});

export default router;