import type { Link, Media, Menu, SectionType } from '@prisma/client'
import { ObjectId } from '.'
import { BlockKey } from '~/blocks'
import { FormSimple } from './formCreation'

type SectionCreation = {
    tempId?: string
    id?: ObjectId
    type: SectionType
    block: BlockKey
    position: number
    content: any
    pageId?: ObjectId

    medias: Map<ObjectId, Media>
    forms: Map<ObjectId, FormSimple>
    menus: Map<ObjectId, Menu>
    links: Map<ObjectId, Link>
}

export type SectionCreationCleaned = {
    tempId?: string
    id?: ObjectId
    type: SectionType
    block: BlockKey
    position: number
    content: any

    medias: ObjectId[]
    forms: ObjectId[]
}

export default SectionCreation
