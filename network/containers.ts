import INSTANCE from './api'
import { Container, Prisma } from '@prisma/client'

export const postContainer = (data: Prisma.ContainerCreateInput | any): Promise<Container> =>
    new Promise(async (resolve, reject) => {
        INSTANCE({
            method: 'POST',
            url: `/api/containers`,
            headers: {
                'Content-Type': 'application/json',
            },
            data,
        })
            .then(resolve)
            .catch(reject)
    })

export const editContainer = (id: string, data: Prisma.ContainerCreateInput | any): Promise<Container> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'PUT',
            url: `/api/containers/${id}`,
            headers: {
                'Content-Type': 'application/json',
            },
            data,
        })
            .then(resolve)
            .catch(reject)
    })

export const getContainers = (q?: string): Promise<Container[]> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'GET',
            url: `/api/containers`,
            headers: {
                'Content-Type': 'application/json',
            },
            params: { q },
        })
            .then(resolve)
            .catch(reject)
    })

export const deleteContainer = (id: string): Promise<void> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'DELETE',
            url: `/api/containers/${id}`,
        })
            .then(resolve)
            .catch(reject)
    })

export const getContainerDetails = (id: string): Promise<any> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'GET',
            url: `/api/containers/${id}`,
        })
            .then(resolve)
            .catch(reject)
    })
