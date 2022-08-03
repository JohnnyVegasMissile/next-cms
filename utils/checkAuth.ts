import { IncomingHttpHeaders } from 'http'
import get from 'lodash.get'

import { prisma } from '../utils/prisma'

const checkAuth = async (headers: IncomingHttpHeaders) => {
    const sessions = await prisma.session.findMany({
        where: { token: headers.token as string, expiresAt: { gte: new Date() } },
        include: { login: { include: { user: true } } },
    })

    if (!!sessions?.length) {
        return {
            token: get(sessions, 'token', ''),
            expiresAt: get(sessions, 'expiresAt', ''),
            user: {
                ...get(sessions, '0.login.user', {}),
                role: get(sessions, '0.login.roleId', {}),
                email: get(sessions, '0.login.email', {}),
            },
        }
    }

    return false
}

export default checkAuth
