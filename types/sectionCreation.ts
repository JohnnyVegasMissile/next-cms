import type { Link, Media, Menu, MenuChild, SectionType } from '@prisma/client'
import { ObjectId } from '.'
import { BlockKey } from '~/blocks'
import { FormSimple } from './formCreation'

type SectionCreation = {
    tempId?: string
    id?: ObjectId
    type: SectionType
    block: BlockKey
    position: number
    value: any
    pageId?: ObjectId

    medias: Map<ObjectId, Media>
    forms: Map<ObjectId, FormSimple>
    menus: Map<ObjectId, Menu & { childs: MenuChild[] }>
    links: Map<ObjectId, Link>
}

export type SectionCreationCleaned = {
    tempId?: string
    id?: ObjectId
    type: SectionType
    block: BlockKey
    position: number
    value: any

    medias: ObjectId[]
    forms: ObjectId[]
    menus: ObjectId[]
    links: ObjectId[]
}

export default SectionCreation
