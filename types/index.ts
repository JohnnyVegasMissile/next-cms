import type {
    User,
    Login,
    Page,
    Metadata,
    Section,
    Article,
    Element,
    Role,
    FormField,
} from '@prisma/client'
import { Prisma } from '@prisma/client'

export type UserRoleTypes = 'super-admin' | 'admin' | 'user'
export type PageTypes = 'home' | 'error' | 'list' | 'page'

export interface ContextUser {
    name: string
    email?: string
    role: string
    expiresAt: Date
    // type: 'super-admin' | 'admin' | 'user'
}

export type FullUser = User & {
    login: Login & {
        role: Role
    }
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

interface ArticleCreateInput extends Omit<Prisma.ArticleCreateInput, 'page'> {}

export type FullArticleEdit = ArticleCreateInput & {
    coverId?: string
    pageId?: string
    sections?: FullSection[] | null
    // page?: string | undefined
}

export interface FormFieldCreateInput extends Omit<Prisma.FormFieldCreateInput, 'form'> {}

export type FullFormEdit = Prisma.FormCreateInput & {
    fields?: FormFieldCreateInput[] | null
}

// export type FormFieldEdit = Prisma.FormCreateInput & {
//     fields?: FormField[] | null
// }

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
    accesses?: string[] | null
    headerId?: string | undefined
    footerId?: string | undefined

    slugEdit?: (string | undefined)[]
}

export type AuthResponse = {
    token: string
    expiresAt: Date
    user: User & {
        role: string
        email: string
    }
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
