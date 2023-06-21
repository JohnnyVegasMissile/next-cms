import type { ContainerFieldType } from '@prisma/client'
import type { Dayjs } from 'dayjs'
import { ObjectId } from '.'

type ContainerCreation<T> = {
    name: string
    published: boolean
    slug: string[]
    metadatas: Metadata[]
    contentsMetadatas: Metadata[]
    fields: ContainerFieldCreation<T>[]
}

type Metadata = {
    id?: ObjectId
    name: string
    content: string
}

export type ContainerFieldCreation<T> = {
    id?: ObjectId
    tempId?: string
    name: string
    required: boolean
    type: ContainerFieldType
    multiple: boolean
    position: number
    metadatas: string[]

    min?: number
    max?: number

    startDate?: T
    endDate?: T
    valueMin?: number
    valueMax?: number

    defaultTextValue: string | undefined
    defaultMultipleTextValue: string[] | undefined
    defaultNumberValue: number | undefined
    defaultMultipleNumberValue: number[] | undefined
    defaultDateValue: T | undefined
    defaultMultipleDateValue: T[] | undefined
    defaultJsonValue: any | undefined
    defaultMultipleJsonValue: any[] | undefined
}

export default ContainerCreation
