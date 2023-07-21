import { LinkValue } from '~/components/LinkSelect'
import { ObjectId } from '.'
import { CodeLanguage, Media, PageType } from '@prisma/client'

type PageCreation = {
    name: string
    published: boolean
    slug: string[]
    type: PageType
    // metadatas: CreationMetadata[]
    metadatas: {
        [key in CodeLanguage | 'ALL']?: CreationMetadata[]
    }
}

export type CreationMetadata = {
    id?: ObjectId
    types: string[]
    values: (string | number | boolean | LinkValue | Media)[]
    language?: CodeLanguage | undefined
}

export default PageCreation
