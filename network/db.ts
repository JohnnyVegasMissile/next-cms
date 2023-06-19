import INSTANCE from './api'
import dayjs from 'dayjs'

export const exportDB = (): Promise<any> =>
    INSTANCE({
        method: 'POST',
        maxBodyLength: Infinity,
        url: '/api/db/export',
        responseType: 'blob',
    }).then((file: any) => {
        const url = window.URL.createObjectURL(new Blob([file]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `db-export-${dayjs().format('DD/MM/YYYY-hh:mm')}.json`)
        document.body.appendChild(link)
        link.click()
    })

export const importDB = (file: any): Promise<any> => {
    const data = new FormData()
    data.append('file', file)

    return INSTANCE({
        method: 'POST',
        url: '/api/db/import',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        data,
    })
}
