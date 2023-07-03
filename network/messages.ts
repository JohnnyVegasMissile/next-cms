import { ObjectId } from '~/types'
import INSTANCE from './api'
import { Form, FormField, Message, MessageField, User } from '@prisma/client'

export const getMessage = (
    messageId: ObjectId
): Promise<Message & { form: Form & { fields: FormField[] }; fields: MessageField[]; readBy: User }> =>
    INSTANCE({
        method: 'GET',
        url: `/api/messages/${messageId}`,
        headers: {
            'Content-Type': 'application/json',
        },
    })

export const getUnreadMessages = (): Promise<{ count: number }> =>
    INSTANCE({
        method: 'GET',
        url: `/api/messages/unread`,
        headers: {
            'Content-Type': 'application/json',
        },
    })

export const markMessage = (messageId: ObjectId, marked: boolean): Promise<{ marked: boolean }> =>
    INSTANCE({
        method: 'PUT',
        url: `/api/messages/${messageId}`,
        headers: {
            'Content-Type': 'application/json',
        },
        data: { marked },
    })

export const getMessages = (
    page: number,
    q: string,
    sort: `${string},${'asc' | 'desc'}` | undefined,
    others: { formId: ObjectId }
): Promise<{
    results: any[]
    count: number
}> =>
    INSTANCE({
        method: 'GET',
        url: `/api/messages`,
        headers: {
            'Content-Type': 'application/json',
        },
        params: { page, q, sort, ...others },
    })

export const postMessage = (
    formId: ObjectId,
    data: { [key in string]: string | number | string[] }
): Promise<{ success: boolean }> =>
    INSTANCE({
        method: 'POST',
        url: `/api/forms/${formId}/messages`,
        headers: {
            'Content-Type': 'application/json',
        },
        data,
    })
