import type {Response} from 'express';
import {prisma, redis} from "@/config";

const jwt = require("jsonwebtoken")

export function useGroups() {

    const checkGroupCode = async (code: string) => {
        const codeCheck = await prisma.groupCode.findUnique({
            where: {
                code: code
            },
            select: {
                group: true,
                groupId: true,
                code: true
            }
        })
        return !!codeCheck
    }

    const joinGroup = async (email: string) => {


        return
    }

    return {
        checkGroupCode,
        joinGroup
    }
}
