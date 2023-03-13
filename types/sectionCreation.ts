import type { Form, Media, SectionType } from '@prisma/client'
import { ObjectId } from '.'

type SectionCreation = {
    tempId?: string
    id?: ObjectId
    type: SectionType
    block: string
    position: number
    content: any
    pageId: ObjectId

    medias: Map<ObjectId, Media>
    forms: Map<ObjectId, Form>
}

export default SectionCreation
