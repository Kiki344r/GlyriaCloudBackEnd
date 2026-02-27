import { RouteConfig} from "@/versions/routesManager";
import {prisma} from "@/config";
import bcrypt from "bcrypt"

const jwt = require("jsonwebtoken")

export default {
    method: 'POST',
    path: '/auth/login',
    handler: async (req, res, next)=> {
        try {

            if (req?.cookies?.token) return res.status(409).json({success: false, message: "Vous êtes déjà connecter !"})

            const {email, password, remember} = req.body

            if (!email || !password) return res.status(400).json({success: false, message: "Des champs sont manquants !"})

            const UserInformation = await prisma.users.findUnique({where: {email: email}, include: {groups: true}})
            if (!UserInformation) return res.status(401).json({
                success: false,
                message: "Email ou mot de passe incorrect !"
            })

            const passwordMatch = await bcrypt.compare(password, UserInformation.password)
            if (!passwordMatch) return res.status(401).json({success: false, message: "Email ou mot de passe incorrect !"})

            const userData = {
                firstName: UserInformation.firstName,
                lastName: UserInformation.lastName,
                email: UserInformation.email,
                groups: UserInformation.groups,
                UUID: UserInformation.UUID
            }

            const JWT_Token = await jwt.sign(userData, process.env?.JWT_SECRET, {expiresIn: '3d'})

            if (remember) {
                res.cookie("token", JWT_Token, {maxAge: 3 * 24 * 60 * 60 * 1000, httpOnly: true})
            } else {
                res.cookie("token", JWT_Token, {httpOnly: true})
            }

            return res.status(200).json({
                success: true,
                data: userData
            })

        } catch (e) {
            console.log(e)
            res.status(500).json({success: false})
        }
    }
} as RouteConfig;