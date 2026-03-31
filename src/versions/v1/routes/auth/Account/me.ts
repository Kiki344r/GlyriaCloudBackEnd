import { RouteConfig} from "@/versions/routesManager";
import {verifyToken} from "@/versions/v1/middleware/verifyToken";

import {useAccount} from "@/versions/v1/services";
const {getUserInfoCached} = useAccount()

export default {
    method: "GET",
    path: "/auth/me",
    middlewares: [verifyToken],
    handler: async (req, res) => {
        try {

            const {email} = req.userData!

            const userData = await getUserInfoCached(email)

            return res.status(200).json({
                success: true,
                data: userData
            })

        } catch (e) {
            console.log(e)
            res.status(500).json({success: false, message: "Une erreur est survenue !"})
        }
    }
} as RouteConfig;