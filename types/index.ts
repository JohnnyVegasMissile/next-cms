import type {
    User,
    Login,
    // Page,
    Metadata,
    Section,
    // Article,
    Element,
    Role,
    FormField,
    Form,
    Message,
    Media,
    ContainerField,
    Container,
    Content,
    Slug,
    ContentField,
    Access,
} from '@prisma/client'
import { Prisma } from '@prisma/client'

export type UserRoleTypes = 'super-admin' | 'admin' | 'user'
export type PageTypes = 'home' | 'error' | 'list' | 'page' | 'signin'

export interface ContextUser {
    email: string
    id: string
    name: string
    role: string
    updatedAt: Date
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

// export type FullArticle = Article & {
//     coverId?: string
//     cover?: Media
//     page: Page
//     sections?: FullSection[] | null
// }

// interface ArticleCreateInput extends Omit<Prisma.ArticleCreateInput, 'page'> {}

// export type FullArticleEdit = ArticleCreateInput & {
//     coverId?: string
//     pageId?: string
//     sections?: FullSection[] | null
//     // page?: string | undefined
// }

export interface FormFieldCreateInput extends Omit<Prisma.FormFieldCreateInput, 'form'> {}

export type FullFormEdit = Prisma.FormCreateInput & {
    fields?: FormFieldCreateInput[] | null
}

// export type FormFieldEdit = Prisma.FormCreateInput & {
//     fields?: FormField[] | null
// }

// export type FullPage = Page & {
//     metadatas?: Metadata[] | null
//     sections?: FullSection[] | null
//     articles?: FullArticle[] | null
//     header?: Element | null
//     footer?: Element | null
// }

export type FullSection = Section & {
    element: Element | null
    form: FullForm | null
}

export type FullSectionEdit = Prisma.SectionCreateInput & {
    elementId?: string
    formId?: string
}

export type FullMessage = Message & {
    form: FullForm | null
}

export type FullForm = Form & {
    fields: FormField[] | null
}

// export type FullPageEdit = Prisma.PageCreateInput & {
//     metadatas?: Metadata[] | null
//     sections?: FullSection[] | null
//     accesses?: string[] | null
//     headerId?: string | undefined
//     footerId?: string | undefined

//     slugEdit?: (string | undefined)[]
// }

export type FullContainerEdit = Prisma.ContainerCreateInput & {
    fields?: ContainerField[] | null
    metadatas?: Metadata[] | null
    contentMetadatas?: Metadata[] | null
    sections?: FullSection[] | null
    contentSections?: FullSection[] | null
    slug?: Slug | null

    accesses?: string[] | null

    slugEdit?: (string | undefined)[]
}

export type FullContent = Content & {
    container: Container | null
    fields?: ContentField | null
}

export type FullContentField = ContentField & {
    media: Media | null
}

export type AuthResponse = {
    token: string
    expiresAt: Date
    // user: User & {
    //     role: string
    //     email: string
    // }
}

export type Theme = {
    background: string
    primary: string
    secondary: string
}

export type PageProps = {
    id: string
    appName: string
    layout: LayoutProps
    theme: Theme
    type: 'container' | 'content'
    title: string
    accesses: Access[]
    metadatas: Metadata[]
    fields: (ContentField & {
        media: Media | null
    })[]
    sections: (Section & {
        form: Form | null
    })[]
    contents?: (Content & {
        slug: Slug[] | null
        fields: (ContentField & {
            media: Media | null
        })[]
    })[]
}

export type LayoutProps = {
    header: (Section & {
        form: Form | null
    })[]
    topBody: (Section & {
        form: Form | null
    })[]
    bottomBody: (Section & {
        form: Form | null
    })[]
    footer: (Section & {
        form: Form | null
    })[]
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
