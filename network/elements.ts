import INSTANCE from './api'
import { Prisma } from '@prisma/client'
import type { Element } from '@prisma/client'
// import { PageTypes } from '../types'

export const postElement = (data: Prisma.ElementCreateInput): Promise<Element> =>
    new Promise(async (resolve, reject) => {
        INSTANCE({
            method: 'POST',
            url: `/api/elements`,
            headers: {
                'Content-Type': 'application/json',
            },
            data,
        })
            .then(resolve)
            .catch(reject)
    })

export const editElement = (id: string, data: Prisma.ElementCreateInput): Promise<Element> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'PUT',
            url: `/api/elements/${id}`,
            headers: {
                'Content-Type': 'application/json',
            },
            data,
        })
            .then(resolve)
            .catch(reject)
    })

export const getElements = (type?: string, q?: string): Promise<Element[]> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'GET',
            url: `/api/elements`,
            // headers: {
            //     'Content-Type': 'application/json',
            // },
            params: { type, q },
        })
            .then(resolve)
            .catch(reject)
    })

export const deleteElement = (id: string): Promise<void> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'DELETE',
            url: `/api/elements/${id}`,
        })
            .then(resolve)
            .catch(reject)
    })

export const getElementDetails = (id: string): Promise<Element> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'GET',
            url: `/api/elements/${id}`,
        })
            .then(resolve)
            .catch(reject)
    })
