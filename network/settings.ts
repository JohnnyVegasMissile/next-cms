import INSTANCE from './api'
import { Prisma } from '@prisma/client'
import type { Setting } from '@prisma/client'
import { PageTypes } from '../types'

export const getSettings = (type?: PageTypes): Promise<Setting[]> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'GET',
            url: `/api/settings`,
            headers: {
                'Content-Type': 'application/json',
            },
            params: { type },
        })
            .then(resolve)
            .catch(reject)
    })

export const editSetting = (name: string, value: string): Promise<Setting> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'PUT',
            url: `/api/settings`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: { name, value },
        })
            .then(resolve)
            .catch(reject)
    })
