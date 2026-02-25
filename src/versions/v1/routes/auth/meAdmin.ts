import { RouteConfig} from "@/versions/routesManager";
import {verifyToken} from "@/versions/v1/middleware/verifyToken";

export default {
    method: "GET",
    path: "/auth/me",
    middlewares: [verifyToken],
    handler: async (req, res) => {
        try {

            const {UUID} = req.userData!

            const admins = process.env.ADMINS || ""

            if (admins.includes(`?${UUID}?`)) return res.status(200).json({})
            else return res.status(403).json({success: false, message: "Vous n'êtes pas administrateur !"})

        } catch (e) {
            console.log(e)
            res.status(500).json({success: false})
        }
    }
} as RouteConfig;