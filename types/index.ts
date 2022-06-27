import type {
    User,
    Login,
    Page,
    Metadata,
    Section,
    Article,
} from '@prisma/client'
import { Prisma } from '@prisma/client'

export type UserRoleTypes = 'super-admin' | 'admin' | 'user'
export type PageTypes = 'home' | 'error' | 'article' | 'page'
export interface ContextUser {
    name: string
    email?: string
    type: string
    // type: 'super-admin' | 'admin' | 'user'
}

export type FullUser = User & {
    login: Login | null
}

export type FullArticle = Article & {
    page: Page
}

export type FullArticleEdit = Prisma.ArticleCreateInput & {
    pageId: number | undefined
}

export type FullPage = Page & {
    metadatas?: Metadata[] | null
    sections?: Section[] | null
    articles?: Article[] | null
}

export type FullPageEdit = Prisma.PageCreateInput & {
    metadatas?: Metadata[] | null
    sections?: Section[] | null
    articles?: Article[] | null
}
