import CryptoJS from 'crypto-js'
import { PrismaClient } from '@prisma/client'
import type { Login, Session, User } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

export function makeId(length: number) {
    var result = ''
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    var charactersLength = characters.length
    for (var i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        )
    }
    return result
}

export const isEmail = (e_mail: string) => {
    if (typeof e_mail !== 'string') {
        return false
    }
    const emailRegex =
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    return emailRegex.test(e_mail)
}

export const initSession = async (loginId: number) => {
    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + 2)

    const token: string = generateToken(
        `${loginId}.${expiresAt.getMilliseconds()}`
    )
    const session = await prisma.session.create({
        data: {
            token,
            loginId,
            expiresAt,
        },
    })

    return session
}

export const generateToken = (message: string) =>
    CryptoJS.SHA3(message, { outputLength: 512 }).toString()
