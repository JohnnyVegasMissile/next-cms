import INSTANCE from './api'
import type { Message } from '@prisma/client'

export const getMessages = (formId?: string): Promise<Message[]> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'GET',
            url: `/api/messages`,
            params: { formId },
        })
            .then(resolve)
            .catch(reject)
    })
