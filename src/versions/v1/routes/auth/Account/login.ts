import { RouteConfig} from "@/versions/routesManager";
import {prisma} from "@/config";
import bcrypt from "bcrypt"

import {useAccount} from "@/versions/v1/services";
const {getUserInfoCached, loginUser, getUserInfo} = useAccount()

export default {
    method: 'POST',
    path: '/auth/login',
    handler: async (req, res, next)=> {
        try {

            if (req?.cookies?.token) return res.status(409).json({success: false, message: "Vous êtes déjà connecter !"})

            const {email, password, remember} = req.body

            if (!email || !password) return res.status(400).json({success: false, message: "Des champs sont manquants !"})

            const UserInformation = await getUserInfo(email, {includePassword: true, includeValidateEmail: true})

            if (!UserInformation) return res.status(401).json({
                success: false,
                message: "Email ou mot de passe incorrect !"
            })

            const passwordMatch = await bcrypt.compare(password, UserInformation.password)
            if (!passwordMatch) return res.status(401).json({success: false, message: "Email ou mot de passe incorrect !"})

            if (UserInformation.emailValidations.length > 0) return res.status(401).json({
                success: false,
                message: "Veuillez valider votre adresse mail !"
            })

            const userData = await loginUser(res, email, remember)

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