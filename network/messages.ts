import INSTANCE from './api'
import type { Message } from '@prisma/client'
import { FullMessage } from '@types'

export const getMessages = (formId?: string): Promise<FullMessage[]> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'GET',
            url: `/api/messages`,
            params: { formId },
        })
            .then(resolve)
            .catch(reject)
    })

export const sendMessage = (formId: string, content: {}): Promise<Message> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'POST',
            url: `/api/messages`,
            data: { formId, content: JSON.stringify(content) },
        })
            .then(resolve)
            .catch(reject)
    })

export const readMessage = (id: string): Promise<Message> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'PUT',
            url: `/api/messages/${id}`,
        })
            .then(resolve)
            .catch(reject)
    })
