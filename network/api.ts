const axios = require('axios')

const INSTANCE = axios.create()

INSTANCE.interceptors.request.use(async (request: any) => {
    console.log('Starting Request ' + request.url, request)
    return request
})

INSTANCE.interceptors.response.use(async (response: any) => {
    console.log('Response:', response)
    return response.data
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
