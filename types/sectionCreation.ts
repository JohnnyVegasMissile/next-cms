import type { Form, Media, SectionType } from '@prisma/client'
import { ObjectId } from '.'
import { BlockKey } from '~/blocks'

type SectionCreation = {
    tempId?: string
    id?: ObjectId
    type: SectionType
    block: BlockKey
    position: number
    content: any
    pageId?: ObjectId

    medias: Map<ObjectId, Media>
    forms: Map<ObjectId, Form>
}

export type SectionCreationCleaned = {
    tempId?: string
    id?: ObjectId
    type: SectionType
    block: BlockKey
    position: number
    content: any

    medias: number[]
    forms: number[]
}

export default SectionCreation
