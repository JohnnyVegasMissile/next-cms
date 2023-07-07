import { LinkValue } from '~/components/LinkSelect'
import { ObjectId } from '.'
import { Media, PageType } from '@prisma/client'

type PageCreation = {
    name: string
    published: boolean
    slug: string[]
    type: PageType
    metadatas: CreationMetadata[]
}

type CreationMetadata = {
    id?: ObjectId
    types: string[]
    values: (string | number | boolean | LinkValue | Media)[]
}

export default PageCreation
