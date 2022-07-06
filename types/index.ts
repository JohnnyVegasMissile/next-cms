import type {
    User,
    Login,
    Page,
    Metadata,
    Section,
    Article,
    Element,
} from '@prisma/client'
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

export type FullArticle = Article & {
    page: Page
}

export type FullArticleEdit = Prisma.ArticleCreateInput & {
    pageId: string | undefined
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
    // articles?: Article[] | null
}
