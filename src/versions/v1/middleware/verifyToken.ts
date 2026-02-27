import { Request, Response, NextFunction } from "express";

const jwt = require("jsonwebtoken")

export async function verifyToken(req: Request, res: Response, next: NextFunction) {
    
    const authorization = req.headers.authorization

    if (authorization) {
        const authSplit= authorization.split(" ")
        const authType = authSplit[0]
        const token = authSplit[1]
        if (authType !== "Bearer") return res.status(401).json({ success: false, message: "Vous n'êtes pas connecté !"})
        req.cookies.token = token
    } else if (!req.cookies?.token) return res.status(401).json({ success: false, message: "Vous n'êtes pas connecté !"})
    const { token } = req.cookies

    try {

        const JWT = await jwt.verify(token, process.env.JWT_SECRET, function (err: any, decoded: any) {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    console.log("⚠️ Token expiré à :", err.expiredAt);
                    jwt.decode(token, process.env.JWT_SECRET)
                    res.status(401).json({ success: false, message: "Votre session a expiré !"})
                    return false
                } else {
                    console.log("❓ Autre erreur JWT :", err);
                    res.status(500).json({success: false, message: "Une erreur est survenue !"})
                    return false
                }
            } else return decoded
        })

        if (JWT === false) return

        if (JWT) {
            req.userData = JWT
            next()
        } else {
            return res.status(401).json({ success: false, message: "Vous n'êtes pas connecté !"})
        }

    } catch (e: any) {
        return res.status(500).json({success: false})
    }
}