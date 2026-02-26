import { RouteConfig} from "@/versions/routesManager";
import {verifyToken} from "@/versions/v1/middleware/verifyToken";

export default {
    method: "GET",
    path: "/auth/me",
    middlewares: [verifyToken],
    handler: async (req, res) => {
        try {

            return res.status(200).json({
                success: true,
                data: req.userData ? req.userData : {}
            })

        } catch (e) {
            console.log(e)
            res.status(500).json({success: false, message: "Une erreur est survenue !"})
        }
    }
} as RouteConfig;