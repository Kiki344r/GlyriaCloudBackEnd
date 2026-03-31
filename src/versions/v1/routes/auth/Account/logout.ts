import { RouteConfig} from "@/versions/routesManager";
import {verifyToken} from "@/versions/v1/middleware/verifyToken";

import {useAccount} from "@/versions/v1/services"
const {logoutUser} = useAccount()

export default {
    method: "POST",
    path: "/auth/logout",
    middlewares: [verifyToken],
    handler: async (req, res) => {
        try {

            await logoutUser(res)

            return res.status(200).json({success: true})

        } catch (e) {
            console.log(e)
            res.status(500).json({success: false})
        }
    }
} as RouteConfig;