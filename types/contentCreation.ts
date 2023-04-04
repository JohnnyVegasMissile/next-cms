import type { ContainerFieldType } from '@prisma/client'
import { ObjectId } from '.'

type ContentCreation<T> = {
    id?: ObjectId
    name: string
    published: boolean
    containerId: ObjectId | undefined
    slug: string
    metadatas: Metadata[]
    fields: ContentFieldCreation<T>[]
}

type Metadata = {
    id?: ObjectId
    name: string
    content: string
}

export type ContentFieldCreation<T> = {
    id?: ObjectId

    type: ContainerFieldType
    multiple: boolean

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
