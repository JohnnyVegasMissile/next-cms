import type { User, Login, Page, Metadata, Section, Article, Element } from '@prisma/client'
import { Prisma } from '@prisma/client'

export type UserRoleTypes = 'super-admin' | 'admin' | 'user'
export type PageTypes = 'home' | 'error' | 'list' | 'page'

export interface ContextUser {
    name: string
    email?: string
    type: string
    // type: 'super-admin' | 'admin' | 'user'
}

export type FullUser = User & {
    login: Login | null
}

export type UserCreation = Prisma.UserCreateInput & {
    email?: string
    type?: string
    password?: string
}

export type FullArticle = Article & {
    coverId?: string
    page: Page
    sections?: FullSection[] | null
}

export type FullArticleEdit = Prisma.ArticleCreateInput & {
    coverId?: string
    pageId?: string
    sections?: FullSection[] | null
}

export type FullPage = Page & {
    metadatas?: Metadata[] | null
    sections?: FullSection[] | null
    articles?: Article[] | null
    header?: Element | null
    footer?: Element | null
}

export type FullSection = Section & {
    element: Element | null
}

export type FullPageEdit = Prisma.PageCreateInput & {
    metadatas?: Metadata[] | null
    sections?: FullSection[] | null
    headerId?: string | undefined
    footerId?: string | undefined
}

// export type AuthResponse = {
//     title: string,
//     // detail: 'Successfully validated login credentials',
//     // token: session.token,
//     // expiresAt: session.expiresAt,
//     // // type: login.type,
//     // user: { ...login.user, type: login.type },
// }

// title: 'Login Successful',
// detail: 'Successfully validated login credentials',
// token: session.token,
// expiresAt: session.expiresAt,
// user: { ...login.user, type: login.type },
