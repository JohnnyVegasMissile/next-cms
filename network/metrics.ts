import { ObjectId } from '~/types'
import INSTANCE from './api'

export const sendMetrics = (data: { name: string; value: number; url: string }): Promise<any> =>
    INSTANCE({
        method: 'POST',
        url: `/api/metrics`,
        headers: { 'Content-Type': 'application/json' },
        data,
    })

export const getPageMetrics = (id: ObjectId): Promise<any> =>
    INSTANCE({
        method: 'GET',
        url: `/api/pages/${id}/metrics`,
        headers: { 'Content-Type': 'application/json' },
    })
