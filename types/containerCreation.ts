import type { ContainerFieldType } from '@prisma/client'
import { ObjectId, Options } from '.'
import { Dayjs } from 'dayjs'

type ContainerCreation = {
    name: string
    published: boolean
    slug: string[]
    metadatas: Metadata[]
    contentsMetadatas: Metadata[]
    fields: ContainerFieldCreation[]
}

type Metadata = {
    name: 'description' | 'keywords' | 'author' | 'viewport'
    content: string | string[]
}

export type ContainerFieldCreation = {
    id?: ObjectId
    tempId?: string
    name: string
    required: boolean
    type: ContainerFieldType
    multiple: boolean
    position: number

    min?: number
    max?: number
    containerId?: ObjectId

    startDate?: Dayjs
    endDate?: Dayjs
    valueMin?: number
    valueMax?: number

    defaultTextValue: string | undefined
    defaultMultipleTextValue: string[] | undefined
    defaultNumberValue: number | undefined
    defaultMultipleNumberValue: number[] | undefined
    defaultDateValue: Dayjs | undefined
    defaultMultipleDateValue: Dayjs[] | undefined
    defaultJSON: any | undefined
    defaultMultipleJSON: any[] | undefined

    options: Options<string>
    metadatas: string[]
}

export default ContainerCreation
