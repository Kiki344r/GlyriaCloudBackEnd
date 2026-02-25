import { RouteConfig} from "@/versions/routesManager";

const jwt = require("jsonwebtoken")

export default {
    method: "POST",
    path: "/auth/forgot-password",
    handler: async (req, res) => {
        try {

            const Token = req.cookies.token

            const JWT = await jwt.verify(Token, process.env.JWT_SECRET)

            return res.status(200).json({
                success: true
            })

        } catch (e) {
            console.log(e)
            res.status(500).json({success: false, message: "Une erreur est survenue !"})
        }
    }
} as RouteConfig;