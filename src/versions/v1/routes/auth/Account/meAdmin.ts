import { RouteConfig} from "@/versions/routesManager";
import {verifyToken} from "@/versions/v1/middleware/verifyToken";

export default {
    method: "GET",
    path: "/auth/me/admin",
    middlewares: [verifyToken],
    handler: async (req, res) => {
        try {

            const {UUID} = req.userData!

            if (!UUID) return res.status(404).json({success: false, message: "Cet utilisateur n'existe pas !"})

            const admins = process.env.ADMINS || ""

            if (admins.includes(`?${UUID}?`)) return res.status(200).json({})
            else return res.status(403).json({success: false, message: "Vous n'êtes pas administrateur !"})

        } catch (e) {
            console.log(e)
            res.status(500).json({success: false})
        }
    }
} as RouteConfig;