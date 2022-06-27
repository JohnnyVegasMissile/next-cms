import INSTANCE from './api'
import { Prisma } from '@prisma/client'
import type { Article } from '@prisma/client'
import { FullArticleEdit } from '../types'

export const postArticle = (
    data: Prisma.ArticleCreateInput
): Promise<Article> =>
    new Promise(async (resolve, reject) => {
        INSTANCE({
            method: 'POST',
            url: `/api/articles`,
            headers: {
                'Content-Type': 'application/json',
            },
            data,
        })
            .then(resolve)
            .catch(reject)
    })

export const editArticle = (
    id: string,
    data: Prisma.ArticleCreateInput
): Promise<Article> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'PUT',
            url: `/api/articles/${id}`,
            headers: {
                'Content-Type': 'application/json',
            },
            data,
        })
            .then(resolve)
            .catch(reject)
    })

export const getArticles = (): Promise<Article[]> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'GET',
            url: `/api/articles`,
        })
            .then(resolve)
            .catch(reject)
    })

export const getArticleDetails = (
    id: number | string
): Promise<FullArticleEdit> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'GET',
            url: `/api/articles/${id}`,
        })
            .then(resolve)
            .catch(reject)
    })

export const deleteArticle = (id: string): Promise<void> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'DELETE',
            url: `/api/articles/${id}`,
        })
            .then(resolve)
            .catch(reject)
    })
