import INSTANCE from './api'
import type { Form } from '@prisma/client'

import { FullFormEdit } from '../types'

export const postForm = (data: FullFormEdit): Promise<Form> =>
    new Promise(async (resolve, reject) => {
        INSTANCE({
            method: 'POST',
            url: `/api/forms`,
            headers: {
                'Content-Type': 'application/json',
            },
            data,
        })
            .then(resolve)
            .catch(reject)
    })

export const editForm = (id: string, data: FullFormEdit): Promise<Form> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'PUT',
            url: `/api/forms/${id}`,
            headers: {
                'Content-Type': 'application/json',
            },
            data,
        })
            .then(resolve)
            .catch(reject)
    })

export const getForms = (q?: string): Promise<Form[]> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'GET',
            url: `/api/forms`,
            params: { q },
        })
            .then(resolve)
            .catch(reject)
    })

export const getFormDetails = (id: string): Promise<FullFormEdit> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'GET',
            url: `/api/forms/${id}`,
        })
            .then(resolve)
            .catch(reject)
    })

export const deleteForm = (id: string): Promise<void> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'DELETE',
            url: `/api/forms/${id}`,
        })
            .then(resolve)
            .catch(reject)
    })
