import { LayoutProps } from '../types'

const axios = require('axios')

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

export default INSTANCE

export const initPages = (): Promise<void> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'GET',
            url: `/api/init`,
        })
            .then(resolve)
            .catch(reject)
    })

export const revalidateAll = (): Promise<string[]> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'POST',
            url: `/api/revalidate/all`,
        })
            .then(resolve)
            .catch(reject)
    })

export const postLayout = (data: LayoutProps): Promise<LayoutProps> =>
    new Promise(async (resolve, reject) => {
        INSTANCE({
            method: 'POST',
            url: `/api/layout`,
            headers: {
                'Content-Type': 'application/json',
            },
            data,
        })
            .then(resolve)
            .catch(reject)
    })

export const getLayout = (): Promise<LayoutProps> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'GET',
            url: `/api/layout`,
        })
            .then(resolve)
            .catch(reject)
    })
