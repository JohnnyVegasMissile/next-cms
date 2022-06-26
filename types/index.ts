import type {
    User,
    Login,
    Page,
    Metadata,
    Section,
    Article,
} from '@prisma/client'
import { Prisma } from '@prisma/client'

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

export type FullPage = Page & {
    metadatas: Metadata[] | null
    sections: Section[] | null
    article?: Article
}

export type FullPageEdit = Prisma.PageCreateInput & {
    metadatas: Metadata[] | null
    sections: Section[] | null
    article?: Article
}
