import INSTANCE from './api'
import { Form, Message, PageType } from '@prisma/client'
import { ObjectId } from '~/types'
import FormCreation from '~/types/formCreation'

type FormResponse = Form & {
    _count: {
        fields: number
    }
}

export const getForms = (
    page: number,
    q: string,
    sort: `${string},${'asc' | 'desc'}` | undefined,
    others: { type: PageType | undefined }
): Promise<{
    results: FormResponse[]
    count: number
}> =>
    INSTANCE({
        method: 'GET',
        url: `/api/forms`,
        headers: {
            'Content-Type': 'application/json',
        },
        params: { page, q, sort, ...others },
    })

export const getFormsSimple = (
    q: string | undefined,
    showFull?: boolean
): Promise<{ id: ObjectId; name: string; fields: any[] }[]> =>
    INSTANCE({
        method: 'GET',
        url: '/api/forms/simple',
        // headers: {
        //     'Content-Type': 'application/json',
        // },
        params: { q, showFull },
    })

export const postForm = (data: FormCreation): Promise<FormResponse> =>
    INSTANCE({
        method: 'POST',
        url: `/api/forms`,
        headers: {
            'Content-Type': 'application/json',
        },
        data,
    })

export const sendMessage = (formId: ObjectId, data: any): Promise<Message> =>
    INSTANCE({
        method: 'POST',
        url: `/api/forms/${formId}/messages`,
        headers: {
            'Content-Type': 'application/json',
        },
        data,
    })

export const updateForm = (id: ObjectId, data: FormCreation): Promise<FormResponse> =>
    INSTANCE({
        method: 'PUT',
        url: `/api/forms/${id}`,
        headers: {
            'Content-Type': 'application/json',
        },
        data,
    })
