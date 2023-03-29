import type { ContainerFieldType } from '@prisma/client'
import { ObjectId } from '.'

type ContentCreation<T> = {
    name: string
    published: boolean
    slug: string
    metadatas: Metadata[]
    fields: ContentFieldCreation<T>[]
}

type Metadata = {
    id?: ObjectId
    name: string
    content: string | string[]
}

export type ContentFieldCreation<T> = {
    id?: ObjectId

    type: ContainerFieldType
    multiple: Boolean

    releatedFieldId: ObjectId

    textValue: string | undefined
    multipleTextValue: string[] | undefined
    numberValue: number | undefined
    multipleNumberValue: number[] | undefined
    dateValue: T | undefined
    multipleDateValue: T[] | undefined
    jsonValue: any | undefined
    multipleJsonValue: any[] | undefined
}

export default ContentCreation
