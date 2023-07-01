import SectionCreation from '~/types/sectionCreation'
import ImageBlock from './ImageBlock'
import TextBlock from './TextBlock'
import FormBlock from './FormBlock'
import { Form, FormField, Media } from '@prisma/client'
import { ObjectId } from '~/types'

export type ViewBlockProps<T> = {
    content: T
    medias: Map<ObjectId, Media>
    forms: Map<ObjectId, Form & { fields: FormField[] }>
}

export type EditBlockProps = {
    position: number
}

export type BlockDetails = {
    View: ({ content }: ViewBlockProps<any>) => JSX.Element
    Edit: ({ position }: EditBlockProps) => JSX.Element
    title: string
    position: ('HEADER' | 'FOOTER' | 'SIDEBAR' | 'CONTENT')[]
    availableIn: ('LAYOUT' | 'PAGE' | 'CONTAINER' | 'TEMPLATE' | 'CONTENT' | 'ELEMENT')[]
    default?: any
    validate?: (section: any) => any
}

export type BlockKey = 'ImageBlock' | 'TextBlock' | 'FormBlock'

type BlocksSection = {
    [key in BlockKey]: BlockDetails
}

const blocks: BlocksSection = {
    ImageBlock,
    TextBlock,
    FormBlock,
}

export default blocks
