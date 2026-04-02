import type {Response} from 'express';
import {prisma, redis} from "@/config";
import {useMailer} from "@/versions/v1/services/useMailer";
import welcomeMail from "@/versions/v1/template/mail/welcomeEmail";

const jwt = require("jsonwebtoken")

export function useAccount() {
    const getUserInfoCached = async (email: string) => {
        const key = `user:${email}`

        const redisUser = await redis.get(key)

        if (redisUser) return JSON.parse(redisUser)

        const userData = await prisma.users.findUnique({
            where: {
                email: email
            },
            select: {
                UUID: true,
                firstName: true,
                lastName: true,
                email: true
            }
        })

        if (!userData) return null

        await redis.set(email, JSON.stringify(userData), {expiration: {type: "EX", value: 600}})

        return userData
    }

    type GetUserInfoOptions = {
        includeGroups?: boolean;
        includePassword?: boolean;
        includeValidateEmail?: boolean;
    }

    const getUserInfo = async (email: string, {
        includeGroups = false,
        includePassword = false,
        includeValidateEmail = false,
    }: GetUserInfoOptions = {}) => {
        const userData = await prisma.users.findUnique({
            where: {
                email: email
            },
            select: {
                UUID: true,
                firstName: true,
                lastName: true,
                email: true,
                password: includePassword ? true : undefined,
                groups: includeGroups ? {
                    include: {
                        group: true
                    }
                } : undefined,
                validateEmail: includeValidateEmail ? true : undefined
            }
        })

        if (!userData) return null

        return userData
    }

    const registerUser = async (res: Response, {email, hashedPassword, lastName, firstName}: {
        email: string
        hashedPassword: string
        lastName: string
        firstName: string
    }) => {
        const user = await checkUserIfExist(email)
        if (user) {
            res.status(409).json({success: false, message: "Cette adresse mail est déjà utilisé !"})
            return false
        }

        await prisma.users.create({
            data: {
                email: email,
                password: hashedPassword,
                firstName: firstName,
                lastName: lastName
            }
        })

        const userFullName = `${firstName} ${lastName}`

        const validateEmail = await prisma.validateEmail.create({
            data: {
                userEmail: email,
                expireAt: new Date(Date.now() + 24*60*60*1000)
            }
        })

        if (!validateEmail) {
            await prisma.users.delete({where: {email: email}})
            res.status(500).json({success: false, message: "Une erreur est survenue lors de l'envoie du mail de vérification!"})
            return false
        }

        await useMailer.sendMail({
            to: `${userFullName} <${email}>`,
            from: `${process.env.SMTP_FROM} <${process.env.SMTP_FROM_EMAIL}>`,
            subject: "Bienvenue sur Glyria Cloud",
            html: welcomeMail(userFullName, `${process.env.FRONTEND_URL}/verify-email?token=${validateEmail.UUID}`)
        })

        return true
    }

    const loginUser = async (res: Response, email: string, remember: boolean) => {
        const userData = await getUserInfo(email)

        if (!userData) return null

        const JWT_Token = await jwt.sign(userData, process.env?.JWT_SECRET, {expiresIn: '3d'})

        if (remember) {
            res.cookie("token", JWT_Token, {maxAge: 3 * 24 * 60 * 60 * 1000, httpOnly: true})
        } else {
            res.cookie("token", JWT_Token, {httpOnly: true})
        }

        return userData
    }

    const logoutUser = async (res: Response) => {
        res.clearCookie("token")
        return
    }

    const checkUserIfExist = async (email: string) => {
        const userData = await prisma.users.findUnique({
            where: {
                email: email
            }
        })
        return !!userData
    }

    return {
        getUserInfoCached,
        getUserInfo,
        registerUser,
        loginUser,
        logoutUser,
        checkUserIfExist
    }
}
