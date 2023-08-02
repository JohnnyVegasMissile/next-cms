import { ObjectId } from '~/types'
import INSTANCE from './api'
import { Metric } from '@prisma/client'

export const sendMetrics = (data: { name: string; value: number; url: string }): Promise<any> =>
    INSTANCE({
        method: 'POST',
        url: `/api/metrics`,
        headers: { 'Content-Type': 'application/json' },
        data,
    })

export const getPageMetrics = (id: ObjectId, params?: Object): Promise<Metric[]> =>
    INSTANCE({
        method: 'GET',
        url: `/api/pages/${id}/metrics`,
        headers: { 'Content-Type': 'application/json' },
        params,
    })
