import ImageBlock from './ImageBlock'
import TextBlock from './TextBlock'
import FormBlock from './FormBlock'
import { Form, FormField, Link, Media, Menu, SectionType } from '@prisma/client'
import { ObjectId } from '~/types'

export type ViewBlockProps<T> = {
    value: T
    medias: Map<ObjectId, Media>
    links: Map<ObjectId, Link>
    menus: Map<ObjectId, Menu>
    forms: Map<
        ObjectId,
        Form & {
            fields: (FormField & {
                container: {
                    id: ObjectId
                    name: string
                    contents: { id: ObjectId; name: string }[]
                } | null
            })[]
        }
    >
}

export type EditBlockProps = {
    position: number
}

export type BlockDetails = {
    View: ({ value }: ViewBlockProps<any>) => JSX.Element
    Edit: {
        ({ position }: EditBlockProps): JSX.Element
        Panel?: ({ position }: EditBlockProps) => JSX.Element
    }
    title: string
    // position: ('HEADER' | 'FOOTER' | 'SIDEBAR' | 'CONTENT')[]
    availableIn: SectionType[]
    default?: any
    validate?: (section: any) => any
}

// ADD HERE
export type BlockKey = 'ImageBlock' | 'TextBlock' | 'FormBlock'

type BlocksSection = {
    [key in BlockKey]: BlockDetails
}

// ADD HERE
const blocks: BlocksSection = {
    ImageBlock,
    TextBlock,
    FormBlock,
}

export default blocks
