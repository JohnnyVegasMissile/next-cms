import INSTANCE from './api'
import type { Article } from '@prisma/client'

import { FullArticle, FullArticleEdit } from '../types'

export const postArticle = (data: FullArticleEdit): Promise<Article> =>
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

export const editArticle = (id: string, data: FullArticleEdit): Promise<Article> =>
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

export const getArticles = (pageId?: string, q?: string): Promise<FullArticle[]> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'GET',
            url: `/api/articles`,
            params: { pageId, q },
        })
            .then(resolve)
            .catch(reject)
    })

export const getArticleDetails = (id: string): Promise<FullArticleEdit> =>
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
