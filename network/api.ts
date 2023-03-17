import { Setting } from '@prisma/client'
import axios from 'axios'

const INSTANCE = axios.create()

INSTANCE.interceptors.request.use(async (request: any) => {
    if (!request.url.includes('/auth/')) {
        request.headers.token = await localStorage.getItem('token')
    }

    console.log('Starting Request ' + request.url, request)

    return request
})

INSTANCE.interceptors.response.use(async (response: any) => {
    console.log('Response:', response)
    return response?.data
})

export const getSidebar = (): Promise<Setting[]> =>
    INSTANCE({
        method: 'GET',
        url: `/api/sidebar`,
        headers: {
            'Content-Type': 'application/json',
        },
    })

export default INSTANCE
